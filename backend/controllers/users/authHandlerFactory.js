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
      console.log('✅ OTP email sent to:', email);
    } catch (error) {
      console.log('❌ Failed to send OTP email:', error.message);

      // In development mode, don't fail the registration
      if (
        process.env.SKIP_EMAIL_VERIFICATION === 'true' ||
        process.env.NODE_ENV === 'development'
      ) {
        console.log(
          '⚠️  Development mode: Continuing registration despite email failure'
        );
      } else {
        // If not in development mode, fail the registration
        await User.findByIdAndDelete(newUser._id);
        return next(
          new AppError(
            'Failed to send verification email. Please check your email address or try again later.',
            500,
            httpStatusText.INTERNAL_SERVER_ERROR
          )
        );
      }
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
    console.log('📧 Verifying OTP for:', email);
    console.log('🔢 OTP entered:', otp);

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
    console.log('👤 User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('❌ User not found');
      return next(
        new AppError('User not found', 404, httpStatusText.NOT_FOUND)
      );
    }

    // Debug user state
    console.log('🔍 User verification status:', {
      isVerified: user.isVerified,
      hasOTP: !!user.otp,
      otpExpiry: user.otpExpiry,
      currentTime: new Date(),
      otpExpired: user.otpExpiry ? new Date() > user.otpExpiry : true,
    });

    // Check if user is already verified
    if (user.isVerified) {
      console.log('✅ User is already verified');
      return next(
        new AppError(
          'User is already verified',
          400,
          httpStatusText.BAD_REQUEST
        )
      );
    }

    // Check if user has OTP data
    if (!user.otp || !user.otpExpiry) {
      console.log('❌ User has no OTP data');

      // In development mode, auto-verify if SKIP_EMAIL_VERIFICATION is true
      if (process.env.SKIP_EMAIL_VERIFICATION === 'true') {
        console.log('🔧 Development mode: Auto-verifying user');
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;

        try {
          const savedUser = await user.save({ validateBeforeSave: false });
          console.log(
            '✅ User verification status after save:',
            savedUser.isVerified
          );

          if (!savedUser.isVerified) {
            throw new Error('Failed to verify user');
          }

          const token = generateToken(
            savedUser._id,
            savedUser.role,
            savedUser.email,
            savedUser.userName
          );

          return res.status(200).json({
            status: 'success',
            message:
              'Auto-verified in development mode. Welcome to TravelWorld!',
            data: {
              _id: savedUser._id,
              userName: savedUser.userName,
              email: savedUser.email,
              phone: savedUser.phone || null,
              role: savedUser.role,
              token: token,
              isVerified: savedUser.isVerified,
            },
          });
        } catch (error) {
          console.error('❌ Error during user verification:', error);
          return next(
            new AppError(
              'Failed to verify user',
              500,
              httpStatusText.INTERNAL_SERVER_ERROR
            )
          );
        }
      }

      return next(
        new AppError(
          'No verification code found. Please register again.',
          400,
          httpStatusText.BAD_REQUEST
        )
      );
    }

    // Check if OTP is expired
    const now = new Date();
    const otpExpiry = new Date(user.otpExpiry);

    console.log('⏰ OTP Expiry check:', {
      currentTime: now,
      otpExpiry: otpExpiry,
      isExpired: now > otpExpiry,
    });

    if (now > otpExpiry) {
      console.log('⏰ OTP has expired');
      return next(
        new AppError(
          'OTP has expired. Please request a new one.',
          400,
          httpStatusText.BAD_REQUEST
        )
      );
    }

    // Check if OTP matches
    console.log('🔍 OTP Comparison:', {
      storedOTP: user.otp,
      enteredOTP: otp,
      match: user.otp === otp,
    });

    if (user.otp !== otp) {
      console.log('❌ OTP does not match');
      return next(new AppError('Invalid OTP', 400, httpStatusText.BAD_REQUEST));
    }

    console.log('✅ OTP verified successfully');

    // Mark user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    console.log('✅ User verified successfully', user);
    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.userName);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }

    const token = generateToken(user._id, user.role, user.email, user.userName);

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
    console.log('📧 Resending OTP for:', email);

    if (!email) {
      return next(
        new AppError('Please provide email', 400, httpStatusText.BAD_REQUEST)
      );
    }

    const user = await User.findOne({ email });
    console.log('👤 User found:', user ? 'Yes' : 'No');

    if (!user) {
      return next(
        new AppError('User not found', 404, httpStatusText.NOT_FOUND)
      );
    }

    if (user.isVerified) {
      console.log('✅ User is already verified');
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

    console.log('🔢 New OTP generated:', otp);
    console.log('⏰ New OTP expiry:', otpExpiry);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP email
    try {
      await sendOTPEmail(email, otp);
      console.log('✅ OTP email sent successfully');
    } catch (error) {
      console.error('❌ Failed to send OTP email:', error);

      // In development mode, don't fail
      if (process.env.SKIP_EMAIL_VERIFICATION === 'true') {
        console.log('⚠️  Development mode: Ignoring email error');
      } else {
        return next(
          new AppError(
            'Failed to send verification email',
            500,
            httpStatusText.INTERNAL_SERVER_ERROR
          )
        );
      }
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
    console.log('req.params', req.body);
    const { id } = req.params;
    console.log('user', id);
    // validateMongodbId(id);
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    console.log('user010100000000000000000000', user);
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
