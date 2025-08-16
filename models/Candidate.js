const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  isEmployee: { type: Boolean, default: false },
  empId: { type: String, unique: true, sparse: true },
  code: { type: String, unique: true, sparse: true },

  client: {
    name: { type: String, default: 'Raymoon' },
    location: { type: String, default: '' }
  },

  // Personal Details
  personalDetails: {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, lowercase: true },
    phone: { type: String, index: true, unique: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    nationality: { type: String },
    uanNumber: { type: String }, // Added
    officialEmail: { type: String }, // Added
    aadhaarNumber: { type: String, unique: true, sparse: true }, // Added
    panNumber: { type: String }, // Added
    profileImage: { type: String }
  },

  // Address Information
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    zipCode: { type: String }
  },

  // Professional Details
  professionalDetails: {
    designation: { type: String, trim: true }, // Removed required/enum for flexibility
    department: { type: String }, // Added
    experience: { type: String }, // Added
    location: { type: String }, // Added
    sourceOfHire: { type: String }, // Added
    title: { type: String }, // Added
    skillSet: { type: String }, // Added
    currentSalary: { type: String }, // Changed to String for flexibility
    highestQualification: { type: String }, // Added
    additionalInformation: { type: String }, // Added
    tentativeJoiningDate: { type: Date }, // Added
    agency: { type: String },
    dateOfJoining: { type: Date }, // Added

    // Salary Details (nested)
    salary: {
      basic: { type: Number, default: 0 },
      hra: { type: Number, default: 0 },
      retention: { type: Number, default: 0 },
      otherAllowances: { type: Number, default: 0 },
      actualSalary: { type: Number, default: 0 },
    },
  },

  // Education Details
  education: [{
    schoolName: { type: String }, // Added
    degree: { type: String },
    fieldOfStudy: { type: String },
    dateOfCompletion: { type: Date }, // Added
    additionalNotes: { type: String }, // Added
    institution: { type: String }, // For backward compatibility
    startDate: { type: Date },
    endDate: { type: Date },
    grade: { type: String },
    isCompleted: { type: Boolean, default: false }
  }],

  // Experience Details
  experience: [{
    occupation: { type: String }, // Added
    company: { type: String },
    summary: { type: String }, // Added
    duration: { type: String }, // Added
    currentlyWorkHere: { type: Boolean, default: false }, // Added
    position: { type: String }, // For backward compatibility
    startDate: { type: Date },
    endDate: { type: Date },
    isCurrentJob: { type: Boolean, default: false },
    description: { type: String },
    achievements: [{ type: String }]
  }],

  // Application Status
  status: {
    type: String,
    enum: ['Draft', 'Applied', 'Screening', 'Interview', 'Selected', 'Rejected', 'On Hold'],
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

// Indexes
candidateSchema.index({ status: 1 });
candidateSchema.index({ applicationDate: -1 });
candidateSchema.index({ isEmployee: 1 });

module.exports = mongoose.model('Candidate', candidateSchema);