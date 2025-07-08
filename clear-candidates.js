const mongoose = require('mongoose');
require('./models/Candidate'); // Import the Candidate model

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hrms';

console.log('🔍 Connecting to MongoDB...');

mongoose.connect(MONGO_URI)
.then(async () => {
    console.log('✅ Connected to MongoDB');
    
    const Candidate = mongoose.model('Candidate');
    
    // Check current count
    const currentCount = await Candidate.countDocuments();
    console.log(`📊 Current candidates in database: ${currentCount}`);
    
    if (currentCount === 0) {
        console.log('✅ No candidates found - database is already clean!');
        mongoose.connection.close();
        return;
    }
    
    // Show existing candidates before deletion
    console.log('\n📋 Existing candidates:');
    const existingCandidates = await Candidate.find({}).select('personalDetails.firstName personalDetails.lastName personalDetails.email status');
    existingCandidates.forEach((candidate, index) => {
        console.log(`${index + 1}. ${candidate.personalDetails?.firstName || 'Unknown'} ${candidate.personalDetails?.lastName || ''} - ${candidate.personalDetails?.email || 'No email'} (${candidate.status || 'No status'})`);
    });
    
    console.log('\n🧹 Removing all candidates...');
    
    try {
        const result = await Candidate.deleteMany({});
        console.log(`✅ Successfully removed ${result.deletedCount} candidates`);
        
        const finalCount = await Candidate.countDocuments();
        console.log(`📊 Candidates remaining: ${finalCount}`);
        
        if (finalCount === 0) {
            console.log('🎉 Candidate table is now completely empty!');
        }
        
    } catch (error) {
        console.error('❌ Error removing candidates:', error.message);
    }
    
    mongoose.connection.close();
    console.log('\n✅ Database connection closed');
})
.catch(error => {
    console.error('❌ MongoDB connection failed:', error.message);
});
