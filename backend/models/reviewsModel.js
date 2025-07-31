const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Review must have a rating'],
  },
  text: {
    type: String,
    required: [true, 'Review must have a text'],
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Review must belong to a tour'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
