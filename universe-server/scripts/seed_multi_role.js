const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config/.env') });

const User = require('../models/user');

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/UniVerse";

const seedUser = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB ✅');

        const email = 'multirole@test.com';
        const password = 'Password123!';
        
        // Remove existing user if any
        await User.deleteMany({ email });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const testUser = new User({
            name: 'Dual Role User',
            email: email,
            password: hashedPassword,
            role: 'organizer', // Primary role
            roles: ['student', 'organizer'], // Multi-roles
            student_id: '2021123456',
            is_organizer_approved: true
        });

        await testUser.save();
        console.log('-----------------------------------');
        console.log('Seed Successful! 🚀');
        console.log('Email: multirole@test.com');
        console.log('Password: Password123!');
        console.log('Roles: student, organizer');
        console.log('-----------------------------------');

        process.exit(0);
    } catch (error) {
        console.error('Seeding failed! ❌', error);
        process.exit(1);
    }
};

seedUser();
