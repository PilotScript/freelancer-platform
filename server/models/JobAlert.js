const mongoose = require('mongoose');

// Create a job alert schema
const JobAlertSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  categories: {
    type: [String],
    required: [true, 'Please add at least one category']
  },
  skills: {
    type: [String]
  },
  minBudget: {
    type: Number
  },
  maxBudget: {
    type: Number
  },
  jobType: {
    type: String,
    enum: ['hourly', 'fixed', 'all'],
    default: 'all'
  },
  location: {
    type: String
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'immediate'],
    default: 'daily'
  },
  active: {
    type: Boolean,
    default: true
  },
  lastSent: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
JobAlertSchema.index({ user: 1, active: 1 });
JobAlertSchema.index({ categories: 1 });
JobAlertSchema.index({ skills: 1 });

module.exports = mongoose.model('JobAlert', JobAlertSchema);
