const mongoose = require('mongoose');

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hrms';

console.log('🔍 Connecting to MongoDB...');

mongoose.connect(MONGO_URI)
.then(async () => {
    console.log('✅ Connected to MongoDB');
    console.log('📊 Checking HRMS database...\n');
    
    // List all databases
    const admin = mongoose.connection.db.admin();
    const dbList = await admin.listDatabases();
    
    console.log('📚 Available Databases:');
    dbList.databases.forEach(db => {
        console.log(`   - ${db.name}`);
    });
    
    // Check if hrms database exists
    const hrmsExists = dbList.databases.some(db => db.name === 'hrms');
    
    if (!hrmsExists) {
        console.log('\n❌ HRMS database does not exist yet!');
        console.log('💡 This is normal - it will be created when you first save candidate data.');
        console.log('\n📋 To create data:');
        console.log('   1. Start your frontend application');
        console.log('   2. Add a candidate through the form');
        console.log('   3. The database and collection will be created automatically');
    } else {
        console.log('\n✅ HRMS database exists!');
        
        // List collections in hrms database
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\n📁 Collections in HRMS database:');
        collections.forEach(collection => {
            console.log(`   - ${collection.name}`);
        });
        
        // Check candidates collection
        if (collections.some(c => c.name === 'candidates')) {
            const candidatesCount = await mongoose.connection.db.collection('candidates').countDocuments();
            console.log(`\n👥 Total Candidates: ${candidatesCount}`);
            
            if (candidatesCount > 0) {
                console.log('\n📋 Sample Candidate Data:');
                const candidates = await mongoose.connection.db.collection('candidates').find({}).limit(3).toArray();
                
                candidates.forEach((candidate, index) => {
                    console.log(`\n${index + 1}. ${candidate.personalDetails?.firstName || 'Unknown'} ${candidate.personalDetails?.lastName || ''}`);
                    console.log(`   Email: ${candidate.personalDetails?.email || 'N/A'}`);
                    console.log(`   Status: ${candidate.status || 'N/A'}`);
                    console.log(`   Department: ${candidate.professionalDetails?.department || 'N/A'}`);
                    console.log(`   Added: ${candidate.createdAt || candidate.applicationDate || 'N/A'}`);
                });
            }
        } else {
            console.log('\n📝 No candidates collection found yet - add some candidates first!');
        }
    }
    
    mongoose.connection.close();
    console.log('\n✅ Database connection closed');
})
.catch(error => {
    console.error('❌ MongoDB connection failed:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
        console.log('\n💡 Make sure MongoDB service is running!');
        console.log('   - Check if MongoDB service is started in Windows Services');
        console.log('   - Or start it manually if needed');
    }
});
