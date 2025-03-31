const mongoose = require('mongoose');

// Create a skill verification schema
const SkillVerificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  skill: {
    type: String,
    required: [true, 'Please add a skill name'],
    trim: true
  },
  certificateTitle: {
    type: String,
    required: [true, 'Please add a certificate title'],
    trim: true
  },
  issuer: {
    type: String,
    required: [true, 'Please add an issuer'],
    trim: true
  },
  issueDate: {
    type: Date,
    required: [true, 'Please add an issue date']
  },
  expiryDate: {
    type: Date
  },
  certificateUrl: {
    type: String
  },
  certificateFile: {
    filename: String,
    originalName: String,
    mimetype: String,
    path: String
  },
  verified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  verificationDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SkillVerification', SkillVerificationSchema);
