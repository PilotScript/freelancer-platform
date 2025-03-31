const mongoose = require('mongoose');

const ProposalSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.ObjectId,
    ref: 'Job',
    required: true
  },
  freelancer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  coverLetter: {
    type: String,
    required: [true, 'Please add a cover letter'],
    maxlength: [5000, 'Cover letter cannot be more than 5000 characters']
  },
  proposedAmount: {
    type: Number,
    required: [true, 'Please add a proposed amount']
  },
  estimatedDuration: {
    type: String,
    required: [true, 'Please add an estimated duration']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  attachments: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent freelancer from submitting multiple proposals for the same job
ProposalSchema.index({ job: 1, freelancer: 1 }, { unique: true });

module.exports = mongoose.model('Proposal', ProposalSchema);
