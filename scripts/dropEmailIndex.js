require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hrms';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(error => console.error('MongoDB connection failed:', error.message));

const dropEmailIndex = async () => {
    try {
        const db = mongoose.connection.db;
        const collection = db.collection('candidates');
        
        // Get all indexes
        const indexes = await collection.indexes();
        console.log('Current indexes:', indexes.map(idx => ({ name: idx.name, key: idx.key })));
        
        // Try to drop the email index if it exists
        try {
            await collection.dropIndex({ 'personalDetails.email': 1 });
            console.log('Email index dropped successfully');
        } catch (error) {
            if (error.code === 27) {
                console.log('Email index does not exist');
            } else {
                console.error('Error dropping email index:', error.message);
            }
        }
        
        // Check indexes after dropping
        const indexesAfter = await collection.indexes();
        console.log('Indexes after dropping:', indexesAfter.map(idx => ({ name: idx.name, key: idx.key })));
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

// Wait for connection to be established
mongoose.connection.once('open', () => {
    dropEmailIndex();
});
