import mongoose from 'mongoose';
import User from '../models/userModel.js';
import { connectDB } from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const checkUserStatus = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB...');

    const userEmail = 'motazyasser84@gmail.com';
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      console.log('❌ User not found!');
      return;
    }

    console.log('📋 User Status:');
    console.log(`Username: ${user.userName}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
    console.log(`Is Verified: ${user.isVerified}`);
    console.log(`OTP: ${user.otp}`);
    console.log(`OTP Expiry: ${user.otpExpiry}`);
    console.log(`Created At: ${user.createdAt}`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

checkUserStatus();
