import mongoose from 'mongoose';
import User from '../models/userModel.js';
import { connectDB } from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const verifyUser = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB...');

    const userEmail = 'motazyasser84@gmail.com';
    const user = await User.findOneAndUpdate(
      { email: userEmail },
      {
        isVerified: true,
        otp: null,
        otpExpiry: null,
      },
      { new: true }
    );

    if (!user) {
      console.log('❌ User not found!');
      return;
    }

    console.log('✅ User verified successfully!');
    console.log(`Username: ${user.userName}`);
    console.log(`Email: ${user.email}`);
    console.log(`Is Verified: ${user.isVerified}`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

verifyUser();
