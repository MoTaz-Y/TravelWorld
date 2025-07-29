const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const ApiFeatures = require('../utils/apiFeatures');
const httpStatusText = require('../utils/httpStatusText');

// get all users done
//localhost:3000/api/users?limit=2&sort=-name&fields=name,email GET
getAll = (User) =>
  catchAsync(async (req, res, next) => {
    const features = new ApiFeatures(User.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const users = await features.query;
    if (!users) {
      return next(
        new AppError('No users found', 404, httpStatusText.NOT_FOUND)
      );
    }
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  });

// get user by id done
//localhost:3000/api/users/5c88fa8f3e87471c159a0e96 GET
getOne = (User) =>
  catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new AppError('No user found', 404, httpStatusText.NOT_FOUND));
    }
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  });

// create user done
//localhost:3000/api/users POST
createOne = (User) =>
  catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  });

// update user done
//localhost:3000/api/users/5c88fa8f3e87471c159a0e96 PATCH
updateOne = (User) =>
  catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return next(new AppError('No user found', 404, httpStatusText.NOT_FOUND));
    }
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  });

// delete user done
//localhost:3000/api/users/5c88fa8f3e87471c159a0e96 DELETE
deleteOne = (User) =>
  catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return next(new AppError('No user found', 404, httpStatusText.NOT_FOUND));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

module.exports = {
  getAll: getAll(User),
  getOne: getOne(User),
  createOne: createOne(User),
  updateOne: updateOne(User),
  deleteOne: deleteOne(User),
};
