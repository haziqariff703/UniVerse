const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const User = require('../models/user');
require('dotenv').config({ path: path.join(__dirname, '../config/.env') });

const seedAdmin = async () => {
  try {
    // Connect to DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to Database: ${mongoose.connection.name}`);
    console.log(`Host: ${mongoose.connection.host}`);

    // Check existing users
    const allUsers = await User.find({}, 'email role');
    console.log('Current users in DB:', allUsers.map(u => `${u.email} (${u.role})`));

    // Check for existing admin
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin account already exists:', existingAdmin.email);
    } else {
        // Create Admin
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const adminUser = new User({
        student_id: 'ADMIN001',
        name: 'System Admin',
        email: 'admin@universe.com',
        password: hashedPassword,
        role: 'admin',
        preferences: ['System Management']
        });

        await adminUser.save();
        console.log('Admin account created successfully!');
        console.log('Email: admin@universe.com');
        console.log('Password: admin123');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
