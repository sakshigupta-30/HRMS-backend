const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  isEmployee: { type: Boolean, default: false },
  empId: { type: String, unique: true, sparse: true },
  
  code: { type: String, unique: true, sparse: true }, // Added code field

  client: {
    name: { type: String, default: 'Raymoon' }, // ✅ updated default
    location: { type: String, default: '' }
  },

  // Personal Details
  personalDetails: {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, lowercase: true },
    phone: { type: String , unique:true},
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed'] },
    nationality: { type: String },
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
    designation: { type: String, required: true, enum: ['Picker&Packar', 'SG', 'HK'], trim: true },
    expectedSalary: { type: Number },
    currentSalary: { type: Number },
    availableFrom: { type: Date },
    employmentType: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'] },
    skills: [{ type: String }],
    resume: { type: String },
    agency: { type: String },

    // Added detailed salary nested object
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
    degree: { type: String },
    institution: { type: String },
    fieldOfStudy: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    grade: { type: String },
    isCompleted: { type: Boolean, default: false }
  }],

  // Experience Details
  experience: [{
    company: { type: String },
    position: { type: String },
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
