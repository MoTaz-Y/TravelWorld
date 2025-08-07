import User from '../../models/userModel.js';
import catchAsync from '../../middleware/catchAsync.js';
import AppError from '../../utils/appError.js';
import ApiFeatures from '../../utils/apiFeatures.js';
import httpStatusText from '../../utils/httpStatusText.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../config/jwtToken.js';
import comparePassword from '../../utils/comparePassword.js';
import validateMongodbId from '../../utils/validateMongodbId.js';

// Register User Done
// localhost:3000/api/auth/register Post
const registerUser = (User) =>
  catchAsync(async (req, res, next) => {
    const { name, email, password, passwordConfirm, phone, photo } = req.body;
    if (!name || !email || !password || !passwordConfirm || !phone || !photo) {
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
        photo: newUser.photo,
        token: generateToken(newUser._id),
      },
    });
  });

// Login User Done
// localhost:3000/api/users/login Post
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
    const token = generateToken(user._id);

    res
      .cookie('accessToken', token, {
        httpOnly: true,
        secure: true,
        expires: process.env.JWT_COOKIE_EXPIRE,
      })
      .status(200)
      .json({
        status: 'success',
        message: 'User logged in successfully',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          token: token,
        },
      });
  });

// Logout User Done
// localhost:3000/api/users/logout Get
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
// localhost:3000/api/users/refresh-token Get
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
// localhost:3000/api/users/update-password Post
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
// localhost:3000/api/users/me Get
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
// localhost:3000/api/users/me Put
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

// forget password Done
// localhost:3000/api/users/forgot-password Post
const forgotPassword = (User) =>
  catchAsync(async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
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
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    res.status(200).json({
      status: 'success',
      message: 'Reset token sent to email',
      data: resetToken,
    });
  });

export default {
  registerUser,
  loginUser,
  logoutUser,
  handleRefreshToken,
  updatePassword,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
};
