// import User from '../../models/userModel.js';
import catchAsync from '../../middleware/catchAsync.js';
import AppError from '../../utils/appError.js';
// import ApiFeatures from '../../utils/apiFeatures.js';
import httpStatusText from '../../utils/httpStatusText.js';
import jwt from 'jsonwebtoken';
// import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../config/jwtToken.js';
import comparePassword from '../../utils/comparePassword.js';
import validateMongodbId from '../../utils/validateMongodbId.js';
import { sendOTPEmail, sendWelcomeEmail } from '../../utils/emailService.js';

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register User with OTP verification
const registerUser = (User) =>
  catchAsync(async (req, res, next) => {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return next(
        new AppError(
          'Please provide all required fields',
          400,
          httpStatusText.BAD_REQUEST
        )
      );
    }

    // Check if email domain is allowed
    const allowedDomains = [
      'gmail.com',
      'yahoo.com',
      'hotmail.com',
      'outlook.com',
      'live.com',
      'icloud.com',
      'me.com',
      'mac.com',
    ];
    const emailDomain = email.split('@')[1];
    if (!allowedDomains.includes(emailDomain)) {
      return next(
        new AppError(
          'Email domain is not allowed. Please use Gmail, Yahoo, Hotmail, or Outlook',
          400,
          httpStatusText.BAD_REQUEST
        )
      );
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(
        new AppError(
          'Email already exists. Please use a different email or try to login.',
          401,
          httpStatusText.BAD_REQUEST
        )
      );
    }

    const userNameExists = await User.findOne({ userName });
    if (userNameExists) {
      return next(
        new AppError(
          'Username already exists please choose another',
          402,
          httpStatusText.BAD_REQUEST
        )
      );
    }

    // Generate OTP and expiry
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create user with OTP data
    const newUser = await User.create({
      userName,
      email,
      password: hashPassword,
      otp: otp,
      otpExpiry: otpExpiry,
      isVerified: false,
    });

    if (!newUser) {
      return next(
        new AppError('User not created', 400, httpStatusText.BAD_REQUEST)
      );
    }

    // Send OTP email
    try {
      await sendOTPEmail(email, otp);
    } catch (error) {
      // If email fails, delete user and return error
      await User.findByIdAndDelete(newUser._id);
      return next(
        new AppError(
          'Failed to send verification email. Please check your email address.',
          500,
          httpStatusText.INTERNAL_SERVER_ERROR
        )
      );
    }

    res.status(201).json({
      status: 'success',
      message:
        'User created successfully. Please check your email for verification code.',
      data: {
        _id: newUser._id,
        name: newUser.userName,
        email: newUser.email,
        requiresVerification: true,
      },
    });
  });

// Verify OTP
const verifyOTP = (User) =>
  catchAsync(async (req, res, next) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return next(
        new AppError(
          'Please provide email and OTP',
          400,
          httpStatusText.BAD_REQUEST
        )
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(
        new AppError('User not found', 404, httpStatusText.NOT_FOUND)
      );
    }

    if (user.isVerified) {
      return next(
        new AppError(
          'User is already verified',
          400,
          httpStatusText.BAD_REQUEST
        )
      );
    }

    // Check if OTP is expired
    if (new Date() > user.otpExpiry) {
      return next(
        new AppError(
          'OTP has expired. Please request a new one.',
          400,
          httpStatusText.BAD_REQUEST
        )
      );
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      return next(new AppError('Invalid OTP', 400, httpStatusText.BAD_REQUEST));
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.userName);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }

    const token = generateToken(user._id);

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully. Welcome to TravelWorld!',
      data: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        phone: user.phone || null,
        role: user.role,
        token: token,
      },
    });
  });

// Resend OTP
const resendOTP = (User) =>
  catchAsync(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
      return next(
        new AppError('Please provide email', 400, httpStatusText.BAD_REQUEST)
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(
        new AppError('User not found', 404, httpStatusText.NOT_FOUND)
      );
    }

    if (user.isVerified) {
      return next(
        new AppError(
          'User is already verified',
          400,
          httpStatusText.BAD_REQUEST
        )
      );
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP email
    try {
      await sendOTPEmail(email, otp);
    } catch (error) {
      return next(
        new AppError(
          'Failed to send verification email',
          500,
          httpStatusText.INTERNAL_SERVER_ERROR
        )
      );
    }

    res.status(200).json({
      status: 'success',
      message: 'OTP sent successfully. Please check your email.',
    });
  });

// Login User with verification check
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

    // Check email domain
    const allowedDomains = [
      'gmail.com',
      'yahoo.com',
      'hotmail.com',
      'outlook.com',
      'live.com',
      'icloud.com',
      'me.com',
      'mac.com',
    ];
    const emailDomain = email.split('@')[1];
    if (!allowedDomains.includes(emailDomain)) {
      return next(
        new AppError(
          'Email domain is not allowed. Please use Gmail, Yahoo, Hotmail, or Outlook',
          400,
          httpStatusText.BAD_REQUEST
        )
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(
        new AppError(
          'Email not found. Please register first.',
          404,
          httpStatusText.NOT_FOUND
        )
      );
    }

    // Check if user is verified
    if (!user.isVerified) {
      return next(
        new AppError(
          'Please verify your email first. You will be redirected to verification page.',
          403,
          httpStatusText.FORBIDDEN
        )
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return next(
        new AppError('Incorrect password', 400, httpStatusText.BAD_REQUEST)
      );
    }

    const token = generateToken(user._id, user.role, user.email, user.userName);
    res
      .cookie('accessToken', token, {
        httpOnly: true,
        secure: false, // set to true in production
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })
      .status(200)
      .json({
        status: 'success',
        message: 'User logged in successfully',
        data: {
          _id: user._id,
          userName: user.userName,
          email: user.email,
          phone: user.phone || null,
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
  verifyOTP,
  resendOTP,
};
