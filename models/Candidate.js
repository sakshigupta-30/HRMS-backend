const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    // Personal Details
    personalDetails: {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        email: { type: String, required: true, lowercase: true },
        phone: { type: String, required: true },
        dateOfBirth: { type: Date, required: true },
        gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
        maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed'] },
        nationality: { type: String, required: true },
        profileImage: { type: String } // URL to profile image
    },
    
    // Address Information
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        zipCode: { type: String, required: true }
    },
    
    // Professional Details
    professionalDetails: {
        currentJobTitle: { type: String, required: true },
        department: { type: String, required: true },
        expectedSalary: { type: Number, required: true },
        currentSalary: { type: Number },
        availableFrom: { type: Date, required: true },
        employmentType: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'], required: true },
        skills: [{ type: String }],
        resume: { type: String } // URL to resume file
    },
    
    // Education Details
    education: [{
        degree: { type: String, required: true },
        institution: { type: String, required: true },
        fieldOfStudy: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        grade: { type: String },
        isCompleted: { type: Boolean, default: false }
    }],
    
    // Experience Details
    experience: [{
        company: { type: String, required: true },
        position: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        isCurrentJob: { type: Boolean, default: false },
        description: { type: String },
        achievements: [{ type: String }]
    }],
    
    // Application Status
    status: {
        type: String,
        enum: ['Applied', 'Screening', 'Interview', 'Selected', 'Rejected', 'On Hold'],
        default: 'Applied'
    },
    
    // Interview Details
    interviews: [{
        date: { type: Date, required: true },
        time: { type: String, required: true },
        type: { type: String, enum: ['Phone', 'Video', 'In-person'], required: true },
        interviewer: { type: String, required: true },
        status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' },
        feedback: { type: String },
        rating: { type: Number, min: 1, max: 5 }
    }],
    
    // Additional Information
    notes: { type: String },
    tags: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
    // Tracking
    applicationDate: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now }
    
}, {
    timestamps: true
});

// Update lastUpdated on save
candidateSchema.pre('save', function(next) {
    this.lastUpdated = Date.now();
    next();
});

// Create indexes for better performance
candidateSchema.index({ 'personalDetails.email': 1 });
candidateSchema.index({ status: 1 });
candidateSchema.index({ 'professionalDetails.department': 1 });
candidateSchema.index({ applicationDate: -1 });

module.exports = mongoose.model('Candidate', candidateSchema);
