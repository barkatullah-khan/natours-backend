const mongoose = require('mongoose');
const slugify=require('slugify')
const validator=require('validator')
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have name'],
      unique: true,
      trim: true,
      maxlength:[40 ,'A tour name name have euqal or less then 40 characters'],
      minlength:[10 ,'A tour name name have euqal or greater then 10 characters']
      // validate:[validator.isAlpha,'Tour name must contain only characters']
    },
    slug:String,
    duration: {
      type: Number,
      required:[true,'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group Size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum:{
        values:['easy','meduim','difficult'],
        message:'Difficulty is either :easy:meduim:difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min:[1,'Rating must be above 1.0'],
      max:[5,'Rating must be below 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },

    priceDiscount: {
    type: Number,
    validate: {
      validator: function(val) {
        //this only points to current docs on new document creation
        return val < this.price;
      },
      message: 'Discount price ({VALUE}) should be below the regular price'
    }
  },

    summary: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour:{
      type:Boolean,
      default:false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

tourSchema.pre('save',function(next){
 
  this.slug=slugify(this.name,{lower:true})
  next()
})

// tourSchema.pre('save',function(next){
//   console.log('will save document...');
//   next()
// })

// tourSchema.post('save',function(doc,next){
//   console.log(doc)
//   next()
// }
// )
// ✅ Virtual Property (DO NOT put it in the model)
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
//queery middleware 
tourSchema.pre(/^find/,function(next){
  this.start=Date.now()
  this.find({secretTour:{$ne:true}})
  next()
}

)
tourSchema.post(/^find/,function(docs,next){
  console.log(`Query tooke ${Date.now()-this.start} milliseconds!`)
 
  next()
})
//aggregation middleware
tourSchema.pre('aggregate',function(next){
  this.pipeline().unshift({$match:{secretTour:{$ne:true}}})
 console.log(this.pipeline())
  next()
})
// ✅ Export Model Properly
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
