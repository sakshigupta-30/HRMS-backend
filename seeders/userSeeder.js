require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hrms';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(error => console.error('MongoDB connection failed:', error.message));

const seedUsers = async () => {
    try {
        // Clear existing users
        await User.deleteMany({});
        
        // Create default admin user
        const defaultUser = new User({
            name: 'Admin User',
            email: 'admin@gmail.com',
            password: 'admin123',
            role: 'admin'
        });
        
        await defaultUser.save();
        console.log('Default admin user created successfully');
        console.log('Email: admin@gmail.com');
        console.log('Password: admin123');
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
};

seedUsers();
