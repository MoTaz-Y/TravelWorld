import mongoose from 'mongoose';
import User from '../models/userModel.js';
import { connectDB } from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const updateUserVerification = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to MongoDB...');

    // Find the user by email
    const userEmail = 'motazyasser84@gmail.com';
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      console.log('❌ User not found!');
      process.exit(1);
    }

    console.log('📋 Current user status:');
    console.log(`Username: ${user.userName}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
    console.log(`isVerified: ${user.isVerified}`);

    // Update user verification status
    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      {
        isVerified: true,
        otp: undefined,
        otpExpiry: undefined,
      },
      { new: true, runValidators: false }
    );

    console.log('\n✅ User verification updated successfully!');
    console.log('📋 Updated user status:');
    console.log(`Username: ${updatedUser.userName}`);
    console.log(`Email: ${updatedUser.email}`);
    console.log(`Role: ${updatedUser.role}`);
    console.log(`isVerified: ${updatedUser.isVerified}`);

    console.log('\n🎉 Now you can login directly without OTP verification!');
    console.log('📧 Email:', userEmail);
    console.log('🔑 Password: (use the password you set during registration)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating user verification:', error);
    process.exit(1);
  }
};

updateUserVerification();
