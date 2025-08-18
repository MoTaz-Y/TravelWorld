import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Review must have a rating'],
  },
  review: {
    type: String,
    required: [true, 'Review must have a text'],
  },
  tourId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Review must belong to a tour'],
  },
  userName: {
    type: String,
    // ref: 'User',
    required: [true, 'Review must belong to a user'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
