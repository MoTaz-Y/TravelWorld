import Tour from '../../models/tourModel.js';
import catchAsync from '../../middleware/catchAsync.js';
import AppError from '../../utils/appError.js';
import factory from './handlerFactory.js';

// exports.aliasTopTours = (req, res, next) => {
//   req.query.limit = '5';
//   req.query.sort = '-ratingsAverage,price';
//   req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
//   next();
// };

const getAllTours = factory.getAll(Tour);
const getTour = factory.getOne(Tour, { path: 'reviews' });
const tourSearch = factory.getSearch(Tour);
const tourFeatured = factory.getFeatured(Tour);
const tourCount = factory.getTourCount(Tour);
const createTour = factory.createOne(Tour);
const updateTour = factory.updateOne(Tour);
const deleteTour = factory.deleteOne(Tour);

const tourController = {
  getAllTours,
  getTour,
  tourSearch,
  tourFeatured,
  tourCount,
  createTour,
  updateTour,
  deleteTour,
};

export default tourController;
// exports.getTourStats = catchAsync(async (req, res, next) => {
//   const stats = await Tour.aggregate([
//     {
//       $match: { ratingsAverage: { $gte: 4.5 } },
//     },
//     {
//       $group: {
//         _id: { $toUpper: '$difficulty' },
//         numTours: { $sum: 1 },
//         numRatings: { $sum: '$ratingsQuantity' },
//         avgRating: { $avg: '$ratingsAverage' },
//         avgPrice: { $avg: '$price' },
//         minPrice: { $min: '$price' },
//         maxPrice: { $max: '$price' },
//       },
//     },
//     {
//       $sort: { avgPrice: 1 },
//     },
//   ]);

//   res.status(200).json({
//     status: 'success',
//     data: {
//       stats,
//     },
//   });
// });

// exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
//   const year = req.params.year * 1;
//   const plan = await Tour.aggregate([
//     {
//       $unwind: '$startDates',
//     },
//     {
//       $match: {
//         startDates: {
//           $gte: new Date(`${year}-01-01`),
//           $lte: new Date(`${year}-12-31`),
//         },
//       },
//     },
//     {
//       $group: {
//         _id: { $month: '$startDates' },
//         numTourStarts: { $sum: 1 },
//         tours: { $push: '$name' },
//       },
//     },
//     {
//       $addFields: { month: '$_id' },
//     },
//     {
//       $project: {
//         _id: 0,
//       },
//     },
//     {
//       $sort: { numTourStarts: -1 },
//     },
//     {
//       $limit: 12,
//     },
//   ]);

//   res.status(200).json({
//     status: 'success',
//     data: {
//       plan,
//     },
//   });
// });

// exports.getToursWithin = catchAsync(async (req, res, next) => {
//   const { distance, latlng, unit } = req.params;
//   const [lat, lng] = latlng.split(',');

//   const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

//   if (!lat || !lng) {
//     next(
//       new AppError(
//         'Please provide latitude and longitude in the format lat,lng.',
//         400
//       )
//     );
//   }

//   const tours = await Tour.find({
//     startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
//   });

//   res.status(200).json({
//     status: 'success',
//     results: tours.length,
//     data: {
//       data: tours,
//     },
//   });
// });

// exports.getDistances = catchAsync(async (req, res, next) => {
//   const { latlng, unit } = req.params;
//   const [lat, lng] = latlng.split(',');

//   const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

//   if (!lat || !lng) {
//     next(
//       new AppError(
//         'Please provide latitude and longitude in the format lat,lng.',
//         400
//       )
//     );
//   }

//   const distances = await Tour.aggregate([
//     {
//       $geoNear: {
//         near: {
//           type: 'Point',
//           coordinates: [lng * 1, lat * 1],
//         },
//         distanceField: 'distance',
//         distanceMultiplier: multiplier,
//       },
//     },
//     {
//       $project: {
//         distance: 1,
//         name: 1,
//       },
//     },
//   ]);

//   res.status(200).json({
//     status: 'success',
//     data: {
//       data: distances,
//     },
//   });
// });

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price',
//     });
//   }
//   next();
// };

// exports.checkId = (req, res, next) => {
//   if (!req.params.id) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing id',
//     });
//   }
//   next();
// };
