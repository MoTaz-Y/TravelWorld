import mongoose from 'mongoose';
import validator from 'validator';
import userRoles from '../utils/userRoles.js';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email'],
  },
  phone: {
    type: Number,
    required: true,
  },
  work: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
  },
  role: {
    type: String,
    enum: [userRoles.ADMIN, userRoles.USER, userRoles.MANAGER, userRoles.GUIDE],
    default: userRoles.USER,
  },
  avatar: {
    type: String,
    default: '../public/images/avatar.jpg',
  },
});
// const userSchema = new mongoose.Schema(
//   {
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },

//     photo: {
//       type: String,
//     },

//     role: {
//       type: String,
//       default: "user",
//     },
//   },
//   { timestamps: true }
// );

export default mongoose.model('User', userSchema);
