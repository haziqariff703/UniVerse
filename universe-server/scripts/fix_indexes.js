const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../config/.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('Failed to connect:', err);
        process.exit(1);
    }
};

const fixIndexes = async () => {
    await connectDB();

    try {
        const collection = mongoose.connection.collection('users');
        
        // Check existing indexes
        const indexes = await collection.indexes();
        console.log('Current Indexes:', indexes.map(i => i.name));

        const indexName = 'student_id_1';
        const indexExists = indexes.find(i => i.name === indexName);

        if (indexExists) {
            console.log(`Dropping index: ${indexName}...`);
            await collection.dropIndex(indexName);
            console.log('Index dropped successfully.');
        } else {
            console.log(`Index ${indexName} not found.`);
        }

        console.log('Please restart the server to let Mongoose recreate the index with sparse: true option.');

    } catch (error) {
        console.error('Error fixing indexes:', error);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

fixIndexes();
