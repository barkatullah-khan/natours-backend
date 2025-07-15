const AppError = require('./../utils/appError');

const handleValidationErrorDB=err=>{
  const errors=Object.values(err.errors).map(el=>el.message)
  const message=`invalid input data .${errors.join('.')}`;
  return new AppError(message,400)
}

const handleDuplicateFieldsDB=err=>{
  const value=err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message=`Duplicate field value:${value} plz use another value!`;
  console.log(value)
 return new AppError(message, 400);
}
// Handle invalid MongoDB ObjectId
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;

  return new AppError(message, 400);
};

// For development: show full error
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

// For production: show friendly messages
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.error('ERROR 💥', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.create(err);


    // 🛠️ FIXED: Correct spelling
    if (error.name === 'CastError') error = handleCastErrorDB(error);
if (error.code === 11000) error = handleDuplicateFieldsDB(error);
if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  }
};
