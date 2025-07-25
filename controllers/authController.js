const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');
const semdEmail = require('./../utils/email');
// const bcrypt = require('bcryptjs');
const sendEmail = require('./../utils/email');
const { stat } = require('fs');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  //cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // cannot be accessed or modified by browser JS
  };

  // Send cookie only on HTTPS
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  // Send token in cookie
  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

//signup controller
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('please provide email and password!', 400));
  }
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password!', 401));
  }
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  //   1)Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('you are not logged in! please log in to get access', 401)
    );
  }
  //2)varification token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3)Check if user still exists

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exist.', 401)
    );
  }

  //   4)Check if user change password after the token was issued
  //   freshUser.changedPasswordAfter(decoded.iat);
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password!plz login again.', 401)
    );
  }
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1)Get user based on Posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with this email', 404));
  }
  //2)Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3)Send it to the user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/ api / v1/users/resetPassword/${resetToken}`;
  const message = `forgot your password? Submit a PATCH with your new password and passwordConfgirm to:${resetURL}.\nIf you didn't forget your password,please ignore the email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token valid for 10 minutes',
      message,
    });
    res.status(200).json({
      status: 'success',
      messsage: 'Token sent to eamil!',
    });
  } catch (err) {
    console.log('EMAIL ERROR:', err);
    user.createPasswordResetToken = undefined;
    user.passResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('Ther was an error sending the email.Try agian later:'),
      500
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }, // still valid
  });

  // 2) If token has not expired, and user exists, set new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  // Remove the token and its expiration
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined; // ✅ fixed typo from "passResetExpires"

  // 3) Update passwordChangedAt (inside userModel pre-save middleware)
  await user.save();

  // 4) Log the user in and send new JWT
  // createSendToken(user, 200, res);
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 200, res);
});
