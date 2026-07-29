const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const User = require('../models/user');
require('dotenv').config({ path: path.join(__dirname, '../config/.env') });

const seedUsers = async () => {
  try {
    // Connect to DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to Database: ${mongoose.connection.name}`);
    console.log(`Host: ${mongoose.connection.host}`);

    const usersToSeed = [
      {
        student_id: 'ADMIN00001',
        name: 'System Admin',
        email: 'admin@universe.com',
        password: 'admin123',
        role: 'admin',
        preferences: ['System Management']
      },
      {
        student_id: 'ORG0000001',
        name: 'Event Organizer',
        email: 'organizer@universe.com',
        password: 'organizer123',
        role: 'organizer',
        preferences: ['Event Management']
      },
      {
        student_id: 'STU0000001',
        name: 'Demo Student',
        email: 'student@universe.com',
        password: 'student123',
        role: 'student',
        preferences: ['Academic', 'Sports']
      }
    ];

    console.log('\n--- Seeding Process Started ---');
    for (const userData of usersToSeed) {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`[SKIPPED] ${userData.role} account already exists: ${existingUser.email}`);
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        
        const newUser = new User({
          ...userData,
          password: hashedPassword
        });

        await newUser.save();
        console.log(`[SUCCESS] Created ${userData.role} account: ${userData.email} (Password: ${userData.password})`);
      }
    }
    
    // Check existing users
    const allUsers = await User.find({}, 'email role');
    console.log('\n--- Current users in DB ---');
    allUsers.forEach(u => console.log(`- ${u.email} (${u.role})`));

    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
