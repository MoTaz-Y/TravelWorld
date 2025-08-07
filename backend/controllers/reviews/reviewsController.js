import Review from '../../models/reviewsModel.js';
import Tour from '../../models/tourModel.js';
import factory from './handlerFactory.js';

export const setTourUserIds = (req, res, next) => {
  //Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

export const getAllReviews = factory.getAll(Review);
export const getReview = factory.getOne(Review);
export const createReview = factory.createOne(Review, Tour);
export const updateReview = factory.updateOne(Review);
export const deleteReview = factory.deleteOne(Review);
