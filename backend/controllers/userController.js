const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { generateToken } = require('../config/jwtToken');
const validateMongoDbId = require('../utils/validateMongodbId');
const { generateRefreshToken } = require('../config/refreshtoken');
const sendEmail = require('./emailController');
const crypto = require('crypto');
const cloudinaryUploadImg = require('../utils/cloudinary');
const fs = require('fs');
const { send } = require('process');

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password || !phone) {
    throw new Error('Please fill all the fields');
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error('User already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
  });
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error('Please fill all the fields');
  }
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.jwt) throw new Error('No refresh token in cookies');
  const refreshToken = cookie.jwt;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error('No refresh token in db or not matched');
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id)
      throw new Error('There is something wrong with refresh token');
    const accessToken = generateToken(user._id);
    res.json({ accessToken });
  });
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.jwt) throw new Error('No refresh token in cookies');
  const refreshToken = cookie.jwt;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie('jwt', { httpOnly: true, secure: true });
    return res.sendStatus(204);
  }
  await User.findOneAndUpdate(
    { refreshToken },
    {
      refreshToken: '',
    }
  );
  res.clearCookie('jwt', { httpOnly: true, secure: true });
  res.sendStatus(204);
});

const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbId(_id);
  const user = await User.findById(_id);
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
  }
  const updatedUser = await user.save();
  res.json(updatedUser);
});

module.exports = {
  registerUser,
  loginUser,
  handleRefreshToken,
  logout,
  updatePassword,
};

// const handleRefreshToken = asyncHandler(async (req, res) => {
//   const cookie = req.cookies;
//   if (!cookie?.jwt) throw new Error('No refresh token in cookies');
//   const refreshToken = cookie.jwt;
//   const user = await User.findOne({ refreshToken });
//   if (!user) throw new Error('No refresh token in db or not matched');
//   jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
//     if (err || user.id !== decoded.id)
//       throw new Error('There is something wrong with refresh token');
//     const accessToken = generateToken(user._id);
//     res.json({ accessToken });
//   });
// });
