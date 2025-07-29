const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const ApiFeatures = require('../utils/apiFeatures');
const httpStatusText = require('../utils/httpStatusText');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../config/jwtToken');
const comparePassword = require('../utils/comparePassword');
const validateMongodbId = require('../utils/validateMongodbId');

// Register User Done
// localhost:3000/api/auth/register Post
const registerUser = (User) =>
  catchAsync(async (req, res, next) => {
    const { name, email, password, passwordConfirm, phone, role } = req.body;
    if (!name || !email || !password || !passwordConfirm || !phone || !role) {
      return next(
        new AppError(
          'Please provide all required fields',
          400,
          httpStatusText.BAD_REQUEST
        )
      );
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(
        new AppError('User already exists', 400, httpStatusText.BAD_REQUEST)
      );
    }
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
      passwordConfirm: hashPassword,
      phone,
      role,
    });
    if (!newUser) {
      return next(
        new AppError('User not created', 400, httpStatusText.BAD_REQUEST)
      );
    }
    res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        token: generateToken(newUser._id),
      },
    });
  });

// Login User Done
// localhost:3000/api/auth/login Post
const loginUser = (User) =>
  catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(
        new AppError(
          'Please provide all required fields',
          400,
          httpStatusText.BAD_REQUEST
        )
      );
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(
        new AppError('User not found', 400, httpStatusText.BAD_REQUEST)
      );
    }
    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      return next(
        new AppError('Incorrect password', 400, httpStatusText.BAD_REQUEST)
      );
    }
    res.status(200).json({
      status: 'success',
      message: 'User logged in successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  });

// Logout User Done
// localhost:3000/api/auth/logout Get
const logoutUser = (User) =>
  catchAsync(async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      return next(
        new AppError('User not logged in', 400, httpStatusText.BAD_REQUEST)
      );
    }
    const refreshToken = cookie.jwt;
    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.clearCookie('jwt', { httpOnly: true, secure: true });
      return res.status(200).json({
        status: 'success',
        message: 'User logged out successfully',
      });
    }
    await User.findOneAndUpdate(
      { refreshToken },
      {
        refreshToken: '',
      }
    );
    res.clearCookie('jwt', { httpOnly: true, secure: true });
    res.status(200).json({
      status: 'success',
      message: 'User logged out successfully',
    });
  });

// handle refresh token Done
// localhost:3000/api/auth/refresh-token Get
const handleRefreshToken = (User) =>
  catchAsync(async (req, res, next) => {
    const cookie = req.cookies;
    if (!cookie?.jwt) {
      return next(
        new AppError('User not logged in', 400, httpStatusText.BAD_REQUEST)
      );
    }
    const refreshToken = cookie.jwt;
    const user = await User.findOne({ refreshToken });
    if (!user) {
      return next(
        new AppError('User not found', 400, httpStatusText.BAD_REQUEST)
      );
    }
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err || user.id !== decoded.id) {
        return next(
          new AppError(
            'There is something wrong with refresh token',
            400,
            httpStatusText.BAD_REQUEST
          )
        );
      }
      const accessToken = generateToken(user._id);
      res.json({ accessToken });
    });
  });

// update password Done
// localhost:3000/api/auth/update-password Post
const updatePassword = (User) =>
  catchAsync(async (req, res, next) => {
    const { _id } = req.user;
    const { oldPassword, newPassword, newPasswordConfirm } = req.body;
    validateMongodbId(_id);
    const user = await User.findById(_id);
    if (!user) {
      return next(
        new AppError('User not found', 400, httpStatusText.BAD_REQUEST)
      );
    }
    const isPasswordCorrect = await comparePassword(oldPassword, user.password);
    if (!isPasswordCorrect) {
      return next(
        new AppError('Incorrect password', 400, httpStatusText.BAD_REQUEST)
      );
    }
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    await User.findByIdAndUpdate(_id, {
      password: hashPassword,
      passwordConfirm: hashPassword,
    });
    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully',
    });
  });

// get user profile Done
// localhost:3000/api/auth/me Get
const getUserProfile = (User) =>
  catchAsync(async (req, res, next) => {
    const { _id } = req.user;
    validateMongodbId(_id);
    const user = await User.findById(_id);
    if (!user) {
      return next(
        new AppError('User not found', 400, httpStatusText.BAD_REQUEST)
      );
    }
    res.status(200).json({
      status: 'success',
      message: 'User profile fetched successfully',
      data: user,
    });
  });

// update user profile Done
// localhost:3000/api/auth/me Put
const updateUserProfile = (User) =>
  catchAsync(async (req, res, next) => {
    const { _id } = req.user;
    validateMongodbId(_id);
    const user = await User.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return next(
        new AppError('User not found', 400, httpStatusText.BAD_REQUEST)
      );
    }
    res.status(200).json({
      status: 'success',
      message: 'User profile updated successfully',
      data: user,
    });
  });

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  handleRefreshToken,
  updatePassword,
  getUserProfile,
  updateUserProfile,
};
