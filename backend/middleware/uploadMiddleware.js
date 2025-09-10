import { upload, cloudinaryUploadImg } from '../utils/cloudinary.js';
import catchAsync from './catchAsync.js';
import AppError from '../utils/appError.js';

export const uploadTourImages = upload.fields([
  { name: 'images', maxCount: 10 },
]);

export const uploadSingleImage = upload.single('image');

export const processTourImages = catchAsync(async (req, res, next) => {
  if (!req.files || !req.files.images || req.files.images.length === 0) {
    return next(new AppError('Please upload at least one image', 400));
  }

  try {
    const uploadPromises = req.files.images.map(async (file) => {
      const result = await cloudinaryUploadImg(file.buffer);
      return {
        url: result.secure_url,
        public_id: result.public_id,
      };
    });

    const photos = await Promise.all(uploadPromises);
    req.body.photos = photos;
    next();
  } catch (error) {
    return next(new AppError('Error uploading images to Cloudinary', 500));
  }
});

export const processSingleImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload an image', 400));
  }

  try {
    const result = await cloudinaryUploadImg(req.file.buffer);
    req.body.photo = result.secure_url;
    req.body.photo_public_id = result.public_id;
    next();
  } catch (error) {
    return next(new AppError('Error uploading image to Cloudinary', 500));
  }
});
