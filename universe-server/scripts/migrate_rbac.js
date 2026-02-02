const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/user');

// Load env vars from config folder matches index.js
dotenv.config({ path: path.join(__dirname, '../config/.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Migration');
    } catch (err) {
        console.error('Connection Error:', err);
        process.exit(1);
    }
};

const migrateRoles = async () => {
    await connectDB();

    try {
        const users = await User.find({});
        console.log(`Found ${users.length} users to process...`);

        let updatedCount = 0;

        for (const user of users) {
            let needsSave = false;
            let newRoles = new Set(user.roles || []);

            // 1. Ensure 'student' is always present (Base Role)
            if (!newRoles.has('student')) {
                newRoles.add('student');
                needsSave = true;
            }

            // 2. Sync legacy 'role' field
            // If main role is 'admin', add to roles
            if (user.role === 'admin') {
                newRoles.add('admin');
                needsSave = true;
            }
            // If main role is 'organizer', add to roles
            if (user.role === 'organizer') {
                newRoles.add('organizer');
                needsSave = true;
            }

            // 3. Sync 'is_organizer_approved' flag (Source of Truth for Organizer access)
            if (user.is_organizer_approved === true) {
                newRoles.add('organizer');
                needsSave = true;
            }

            // 4. Update the array if changed
            if (needsSave) {
                user.roles = Array.from(newRoles);
                await user.save();
                console.log(`Updated user: ${user.email} -> Roles: [${user.roles.join(', ')}]`);
                updatedCount++;
            }
        }

        console.log(`\nMigration Complete! Updated ${updatedCount} users.`);
        process.exit(0);

    } catch (error) {
        console.error('Migration Failed:', error);
        process.exit(1);
    }
};

migrateRoles();
