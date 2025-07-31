const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

// delete one booking done
// localhost:3000/api/bookings/5c88fa8f3e87471c159a0e96 DELETE
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No documents found with that ID', 400));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

// update one booking done
// localhost:3000/api/bookings/5c88fa8f3e87471c159a0e96 PUT
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('No documents found with that ID', 400));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

// create one booking done
// localhost:3000/api/bookings/tours/5c88fa8f3e87471c159a0e96 POST
exports.createOne = (Model, tourModel) =>
  catchAsync(async (req, res, next) => {
    const tourId = req.params.tourId;
    const tour = await tourModel.findById(tourId);
    if (!tour) {
      return next(new AppError('No tour found with that ID', 400));
    }

    const doc = await Model.create(req.body);
    await tour.bookings.push(doc);
    await tour.save();

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

// get all bookings done
// localhost:3000/api/bookings/tours/5c88fa8f3e87471c159a0e96 GET
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });

// get one booking done
// localhost:3000/api/bookings/5c88fa8f3e87471c159a0e96 GET
exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      return next(new AppError('No documents found with that ID', 400));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
