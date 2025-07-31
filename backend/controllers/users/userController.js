const User = require('../../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const catchAsync = require('../../middleware/catchAsync');
const { generateToken } = require('../../config/jwtToken');
const validateMongoDbId = require('../../utils/validateMongodbId');
const factory = require('./userHandlerFactory');
const authFactory = require('./authHandlerFactory');
// const { generateRefreshToken } = require('../config/refreshtoken');
// const sendEmail = require('./emailController');
// const crypto = require('crypto');
// const cloudinaryUploadImg = require('../utils/cloudinary');
// const fs = require('fs');
// const { send } = require('process');

const getAllUsers = factory.getAll(User);
const getSingleUser = factory.getOne(User);
const createUser = factory.createOne(User);
const updateUser = factory.updateOne(User);
const deleteUser = factory.deleteOne(User);
const registerUser = authFactory.registerUser(User);
const loginUser = authFactory.loginUser(User);
const logoutUser = authFactory.logoutUser(User);
const updatePassword = authFactory.updatePassword(User);
const handleRefreshToken = authFactory.handleRefreshToken(User);
const getUserProfile = authFactory.getUserProfile(User);
const updateUserProfile = authFactory.updateUserProfile(User);
const refreshToken = authFactory.handleRefreshToken(User);
const forgotPassword = authFactory.forgotPassword(User);

module.exports = {
  registerUser,
  loginUser,
  handleRefreshToken,
  logoutUser,
  updatePassword,
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  getUserProfile,
  updateUserProfile,
  refreshToken,
  forgotPassword,
};
