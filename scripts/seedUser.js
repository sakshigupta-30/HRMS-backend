require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hrms');
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingUser = await User.findOne({ email: 'admin@gmail.com' });
    
    if (existingUser) {
      console.log('Admin user already exists');
      return;
    }

    // Create default admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: 'admin123',
      role: 'admin'
    });

    await adminUser.save();
    console.log('✅ Default admin user created successfully!');
    console.log('Email: admin@gmail.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('❌ Error seeding user:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedUser();
