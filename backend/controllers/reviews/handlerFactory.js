const catchAsync = require('../../middleware/catchAsync');
const AppError = require('../../utils/appError');
const APIFeatures = require('../../utils/apiFeatures');

// get all reviews
// localhost:3000/api/reviews/tours/5c88fa8f3e87471c159a0e96 GET
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const tourId = req.params.tourId;
    if (!tourId) {
      return next(new AppError('Please provide a tour ID', 400));
    }
    let filter = {};
    filter = { tour: tourId };
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const reviews = await features.query;
    res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: {
        data: reviews,
      },
    });
  });
// get one revie
// localhost:3000/api/reviews/5c88fa8f3e87471c159a0e96 GET
exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const review = await Model.findById(req.params.id);
    if (!review) {
      return next(new AppError('No review found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: review,
      },
    });
  });
// create review
// localhost:3000/api/reviews/tours/5c88fa8f3e87471c159a0e96 POST
exports.createOne = (Model, Tour) =>
  catchAsync(async (req, res, next) => {
    const tourId = req.params.tourId;
    if (!tourId) {
      return next(new AppError('Please provide a tour ID', 400));
    }
    const newReview = await new Model({
      ...req.body,
    });
    if (!newReview) {
      return next(new AppError('Failed to create review', 500));
    }
    const savedReview = await newReview.save();
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return next(new AppError('Failed to find tour', 500));
    }
    tour.reviews.push(savedReview._id);
    await tour.save();
    res.status(201).json({
      status: 'success',
      data: {
        data: savedReview,
      },
    });
  });

// update review
// localhost:3000/api/reviews/5c88fa8f3e87471c159a0e96 PUT
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const review = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!review) {
      return next(new AppError('No review found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: review,
      },
    });
  });
// delete review
// localhost:3000/api/reviews/5c88fa8f3e87471c159a0e96 DELETE
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const review = await Model.findByIdAndDelete(req.params.id);
    if (!review) {
      return next(new AppError('No review found with that ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
