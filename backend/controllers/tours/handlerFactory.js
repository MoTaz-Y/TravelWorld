const catchAsync = require('../../middleware/catchAsync');
const AppError = require('../../utils/appError');
const httpStatusText = require('../../utils/httpStatusText');
const APIFeatures = require('../../utils/apiFeatures');
const { parse } = require('zod');

// get all tours done
//localhost:3000/api/tours?limit=10&sort=-price&fields=name,price GET
const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // const query = req.query;
    // const limit = query.limit ? (query.limit < 1 ? 1 : query.limit) : 10;
    // const page = query.page ? (query.page < 1 ? 1 : query.page) : 1;
    // const skip = (page - 1) * limit;
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await Model.find().limit(limit).skip(skip);
    const doc = await features.query;
    // const query = Model.find();
    // const doc = await query;
    if (!doc) {
      return next(
        new AppError.create('No Tours found', 401, httpStatusText.NOT_FOUND)
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
// get one tour done
//localhost:3000/api/tours/5c88fa8f3e87471c159a0e96 GET
const getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id).populate('reviews');
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
// get tour by search
// localhost:3000/api/tours/search?city=paris&distance=100&maxGroupSize=5 GET
const getSearch = (Model) =>
  catchAsync(async (req, res, next) => {
    const city = new RegExp(req.params.city, 'i');
    const distance = parseInt(req.params.distance);
    const maxGroupSize = parseInt(req.params.maxGroupSize);
    const doc = await Model.find({
      $and: [
        { startLocation: { $regex: city } },
        { distance: { $gte: distance } },
        { maxGroupSize: { $gte: maxGroupSize } },
      ],
    }).populate('reviews');
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
// get featured tours done
//localhost:3000/api/tours/featured GET
const getFeatured = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.find({ featured: true })
      .populate('reviews')
      .limit(8);
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

// get tour count done
//localhost:3000/api/tours/count GET
const getTourCount = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.estimatedDocumentCount();
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
//localhost:3000/api/tours POST
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
// update tour done
//localhost:3000/api/tours/5c88fa8f3e87471c159a0e96 PATCH
const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(
        new AppError.create(
          'No documents found with that ID',
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
// delete tour done
//localhost:3000/api/tours/5c88fa8f3e87471c159a0e96 DELETE
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
  getSearch,
  getFeatured,
  getTourCount,
  createOne,
  updateOne,
  deleteOne,
};
