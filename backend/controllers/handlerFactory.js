const catchAsync = require('../middleware/catchAsync');
const AppError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');

//
const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const query = req.query;
    const limit = query.limit ? query.limit : 10;
    const page = query.page ? query.page : 1;
    const skip = (page - 1) * limit;
    const doc = await Model.find().limit(limit).skip(skip);
    // const query = Model.find();
    // const doc = await query;
    if (!doc) {
      return next(
        new AppError.create('No documents found', 401, httpStatusText.NOT_FOUND)
      );
    }
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
//
const getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      return next(
        new AppError.create('No documents found', 401, httpStatusText.NOT_FOUND)
      );
    }
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: {
        data: doc,
      },
    });
  });
// create new tour done
const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // const doc = await Model.create(req.body);
    const newTour = new Model(req.body);
    if (!newTour) {
      return next(
        new AppError.create(
          'No documents created',
          400,
          httpStatusText.BAD_REQUEST
        )
      );
    }
    const doc = await newTour.save();
    res.status(201).json({
      status: httpStatusText.SUCCESS,
      data: {
        data: doc,
      },
    });
  });
//
const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(
        new AppError.create(
          'No documents updated',
          400,
          httpStatusText.BAD_REQUEST
        )
      );
    }
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: {
        data: doc,
      },
    });
  });
//
const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(
        new AppError.create(
          'No documents found with that ID',
          400,
          httpStatusText.BAD_REQUEST
        )
      );
    }
    res.status(204).json({
      status: httpStatusText.SUCCESS,
      data: null,
    });
  });

module.exports = {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
};
