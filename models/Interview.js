const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  interviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scheduledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Interview Details
  title: {
    type: String,
    required: [true, 'Interview title is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['phone', 'video', 'in-person', 'technical', 'hr'],
    required: true
  },
  round: {
    type: Number,
    required: true,
    min: 1
  },
  
  // Scheduling
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required']
  },
  duration: {
    type: Number, // in minutes
    required: true,
    default: 60
  },
  location: {
    type: String,
    trim: true
  },
  meetingLink: {
    type: String,
    trim: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'no-show', 'rescheduled'],
    default: 'scheduled'
  },
  
  // Results
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: String,
    strengths: [String],
    weaknesses: [String],
    recommendation: {
      type: String,
      enum: ['strongly-recommend', 'recommend', 'neutral', 'not-recommend', 'strongly-not-recommend']
    }
  },
  
  // Notes
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Interview', interviewSchema);