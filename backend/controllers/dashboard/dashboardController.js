import Tour from '../../models/tourModel.js';
import catchAsync from '../../middleware/catchAsync.js';
import AppError from '../../utils/appError.js';

const getDashboard = catchAsync(async (req, res, next) => {
  const tours = await Tour.find().sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

const createTour = catchAsync(async (req, res, next) => {
  const {
    title,
    city,
    address,
    distance,
    desc,
    price,
    maxGroupSize,
    featured,
  } = req.body;

  if (!req.body.photos || req.body.photos.length === 0) {
    return next(new AppError('Tour must have at least one image', 400));
  }

  const newTour = await Tour.create({
    title,
    city,
    address,
    distance: Number(distance),
    photos: req.body.photos,
    desc,
    price: Number(price),
    maxGroupSize: Number(maxGroupSize),
    featured: featured === 'true',
  });

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

// New function for seeding tours without image processing
const seedTour = catchAsync(async (req, res, next) => {
  const {
    title,
    city,
    address,
    distance,
    desc,
    price,
    maxGroupSize,
    featured,
    photos,
  } = req.body;

  // Validate required fields
  if (
    !title ||
    !city ||
    !address ||
    !desc ||
    !price ||
    !maxGroupSize ||
    !photos
  ) {
    return next(new AppError('Missing required fields', 400));
  }

  if (!Array.isArray(photos) || photos.length === 0) {
    return next(new AppError('Tour must have at least one photo', 400));
  }

  const newTour = await Tour.create({
    title,
    city,
    address,
    distance: Number(distance),
    photos: photos,
    desc,
    price: Number(price),
    maxGroupSize: Number(maxGroupSize),
    featured: featured || false,
  });

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

const dashboardController = {
  getDashboard,
  createTour,
  seedTour,
};

export default dashboardController;
