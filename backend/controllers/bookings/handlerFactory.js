import catchAsync from '../../middleware/catchAsync.js';
import AppError from '../../utils/appError.js';
import APIFeatures from '../../utils/apiFeatures.js';

// delete one booking done
// localhost:3000/api/bookings/5c88fa8f3e87471c159a0e96 DELETE
const deleteOne = (Model) =>
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
const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    console.log('doc', doc);
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
const createOne = (Model, tourModel, UserModel) =>
  catchAsync(async (req, res, next) => {
    const tourId = req.params.tourId;
    const tour = await tourModel.findById(tourId);
    if (!tour) {
      return next(new AppError('No tour found with that ID', 400));
    }
    const bookingObj = { ...req.body, tourId: tourId };
    const doc = await Model.create(bookingObj);
    // await tour.bookings.push(doc);
    tour.bookings = tour.bookings || []; // لو undefined يخليه array فاضي
    tour.bookings.push(doc._id); // خزن الـ id مش الـ object
    await tour.save();
    await tour.save();
    const user = await UserModel.findByIdAndUpdate(
      req.body.userId,
      { $push: { bookings: doc._id } },
      { new: true, upsert: true }
    );
    if (!user) {
      return next(new AppError('No user found with that ID', 400));
    }
    // console.log('user', user);
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

// get all bookings done
// localhost:3000/api/bookings/tours/5c88fa8f3e87471c159a0e96 GET
const getAll = (Model) =>
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
const getOne = (Model) =>
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

const factory = {
  deleteOne,
  updateOne,
  createOne,
  getAll,
  getOne,
};

export default factory;
