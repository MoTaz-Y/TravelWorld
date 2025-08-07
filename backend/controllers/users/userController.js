import User from '../../models/userModel.js';
import factory from './userHandlerFactory.js';
import authFactory from './authHandlerFactory.js';

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

export default {
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
