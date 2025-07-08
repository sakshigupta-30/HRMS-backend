const mongoose = require('mongoose');
require('./models/Candidate'); // Import the Candidate model

const MONGO_URI = 'mongodb://localhost:27017/hrms';

const sampleCandidates = [
    {
        personalDetails: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '1234567890',
            gender: 'Male',
            nationality: 'Indian',
            dateOfBirth: new Date('1995-05-15')
        },
        address: {
            street: '123 Main Street, Sector 15',
            city: 'Delhi',
            state: 'Delhi',
            country: 'India',
            zipCode: '110001'
        },
        professionalDetails: {
            currentJobTitle: 'Software Developer',
            department: 'IT',
            expectedSalary: 800000,
            currentSalary: 700000,
            employmentType: 'Full-time',
            skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
            availableFrom: new Date('2025-02-01')
        },
        education: [{
            degree: 'B.Tech Computer Science',
            institution: 'Delhi University',
            fieldOfStudy: 'Computer Science',
            endDate: new Date('2018-06-15'),
            isCompleted: true,
            grade: 'First Class'
        }],
        experience: [{
            company: 'Tech Corp Pvt Ltd',
            position: 'Junior Developer',
            startDate: new Date('2018-07-01'),
            endDate: new Date('2024-12-31'),
            isCurrentJob: false,
            description: 'Worked on web applications using React and Node.js'
        }],
        status: 'Applied'
    },
    {
        personalDetails: {
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            phone: '9876543210',
            gender: 'Female',
            nationality: 'Indian',
            dateOfBirth: new Date('1993-08-22')
        },
        address: {
            street: '456 Oak Avenue, Bandra West',
            city: 'Mumbai',
            state: 'Maharashtra',
            country: 'India',
            zipCode: '400050'
        },
        professionalDetails: {
            currentJobTitle: 'UI/UX Designer',
            department: 'Design',
            expectedSalary: 600000,
            currentSalary: 500000,
            employmentType: 'Full-time',
            skills: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator'],
            availableFrom: new Date('2025-01-15')
        },
        education: [{
            degree: 'B.Des Fashion Design',
            institution: 'NIFT Mumbai',
            fieldOfStudy: 'Fashion Design',
            endDate: new Date('2016-05-20'),
            isCompleted: true,
            grade: 'Distinction'
        }],
        experience: [{
            company: 'Creative Design Studio',
            position: 'Senior Designer',
            startDate: new Date('2016-06-01'),
            endDate: null,
            isCurrentJob: true,
            description: 'Creating user interfaces and user experiences for mobile and web applications'
        }],
        status: 'Interview'
    },
    {
        personalDetails: {
            firstName: 'Raj',
            lastName: 'Patel',
            email: 'raj.patel@example.com',
            phone: '7890123456',
            gender: 'Male',
            nationality: 'Indian',
            dateOfBirth: new Date('1990-12-10')
        },
        address: {
            street: '789 Gandhi Road, Whitefield',
            city: 'Bangalore',
            state: 'Karnataka',
            country: 'India',
            zipCode: '560066'
        },
        professionalDetails: {
            currentJobTitle: 'Data Scientist',
            department: 'Analytics',
            expectedSalary: 1200000,
            currentSalary: 1000000,
            employmentType: 'Full-time',
            skills: ['Python', 'Machine Learning', 'SQL', 'Tableau'],
            availableFrom: new Date('2025-03-01')
        },
        education: [{
            degree: 'M.Tech Data Science',
            institution: 'IIT Bangalore',
            fieldOfStudy: 'Data Science',
            endDate: new Date('2014-06-30'),
            isCompleted: true,
            grade: 'CGPA 8.9'
        }],
        experience: [{
            company: 'Analytics Solutions Inc',
            position: 'Senior Data Scientist',
            startDate: new Date('2019-08-01'),
            endDate: new Date('2024-12-31'),
            isCurrentJob: false,
            description: 'Developed machine learning models for business analytics and insights'
        }],
        status: 'Selected'
    }
];

console.log('🔍 Connecting to MongoDB...');

mongoose.connect(MONGO_URI)
.then(async () => {
    console.log('✅ Connected to MongoDB');
    
    const Candidate = mongoose.model('Candidate');
    
    console.log('📊 Adding sample candidates...');
    
    try {
        // Clear existing candidates (optional)
        // await Candidate.deleteMany({});
        // console.log('🧹 Cleared existing candidates');
        
        await Candidate.insertMany(sampleCandidates);
        console.log('✅ Sample candidates added successfully!');
        
        const count = await Candidate.countDocuments();
        console.log(`👥 Total candidates in database: ${count}`);
        
        console.log('\n📋 Added candidates:');
        sampleCandidates.forEach((candidate, index) => {
            console.log(`${index + 1}. ${candidate.personalDetails.firstName} ${candidate.personalDetails.lastName} - ${candidate.professionalDetails.currentJobTitle} (${candidate.status})`);
        });
        
    } catch (error) {
        console.error('❌ Error adding candidates:', error.message);
    }
    
    mongoose.connection.close();
    console.log('\n✅ Database connection closed');
})
.catch(error => {
    console.error('❌ MongoDB connection failed:', error.message);
});
