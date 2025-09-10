import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import { connectDB } from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const createUsers = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to MongoDB...');

    // Clear existing users (optional - remove in production)
    await User.deleteMany({});
    console.log('Cleared existing users...');

    // Hash passwords
    const salt = await bcrypt.genSalt(12);
    const hashedPasswords = {
      admin: await bcrypt.hash('admin123', salt),
      manager: await bcrypt.hash('manager123', salt),
      user: await bcrypt.hash('user123', salt),
    };

    // Create users
    const users = [
      {
        userName: 'admin_user',
        email: 'admin@travelworld.com',
        password: hashedPasswords.admin,
        role: 'admin',
        isVerified: true,
        phone: '01000000000',
        work: 'System Administrator',
      },
      {
        userName: 'manager_user',
        email: 'manager@travelworld.com',
        password: hashedPasswords.manager,
        role: 'manager',
        isVerified: true,
        phone: '01111111111',
        work: 'Tour Manager',
      },
      {
        userName: 'regular_user',
        email: 'user@travelworld.com',
        password: hashedPasswords.user,
        role: 'user',
        isVerified: true,
        phone: '01222222222',
        work: 'Software Developer',
      },
      {
        userName: 'guide_user',
        email: 'guide@travelworld.com',
        password: hashedPasswords.user,
        role: 'guide',
        isVerified: true,
        phone: '01333333333',
        work: 'Tour Guide',
      },
    ];

    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log('Users created successfully!');

    // Display created users
    console.log('\n=== Created Users ===');
    createdUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.userName} (${user.role})`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: ${user.role}123`);
      console.log(`   Role: ${user.role}`);
      console.log('');
    });

    console.log('🎉 All users created successfully!');
    console.log('\n=== Login Credentials ===');
    console.log('Admin: admin@travelworld.com / admin123');
    console.log('Manager: manager@travelworld.com / manager123');
    console.log('User: user@travelworld.com / user123');
    console.log('Guide: guide@travelworld.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('Error creating users:', error);
    process.exit(1);
  }
};

createUsers();
