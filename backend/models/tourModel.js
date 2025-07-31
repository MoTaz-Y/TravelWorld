const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const tourSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    maxGroupSize: {
      type: Number,
      required: true,
    },

    reviews: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Review',
      },
    ],

    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Tour', tourSchema);
// const tourSchema = new Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   image: {
//     type: String,
//     required: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
//   duration: {
//     type: Number,
//     required: true,
//   },
//   maxGroupSize: {
//     type: Number,
//     required: true,
//   },
//   difficulty: {
//     type: String,
//     required: true,
//   },
//   ratingsAverage: {
//     type: Number,
//     default: 4.5,
//     min: 1,
//     max: 5,
//     set: (val) => Math.round(val * 10) / 10,
//   },
//   ratingsQuantity: {
//     type: Number,
//     default: 0,
//   },
// });
