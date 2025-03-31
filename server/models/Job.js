const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'Programming',
      'Design',
      'Writing',
      'Marketing',
      'Admin',
      'Customer Service',
      'Sales',
      'Other'
    ]
  },
  skills: {
    type: [String],
    required: [true, 'Please add at least one skill']
  },
  budget: {
    type: Number,
    required: [true, 'Please add a budget']
  },
  paymentType: {
    type: String,
    required: [true, 'Please specify payment type'],
    enum: ['hourly', 'fixed', 'milestone']
  },
  duration: {
    type: String,
    enum: ['short', 'medium', 'long']
  },
  experience: {
    type: String,
    enum: ['entry', 'intermediate', 'expert']
  },
  location: {
    type: String,
    default: 'Remote'
  },
  deadline: {
    type: Date
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed', 'cancelled'],
    default: 'open'
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  freelancer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  proposals: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Proposal'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for search
JobSchema.index({ title: 'text', description: 'text', skills: 'text' });

module.exports = mongoose.model('Job', JobSchema);
