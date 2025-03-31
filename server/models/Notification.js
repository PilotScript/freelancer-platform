const mongoose = require('mongoose');

// Create a notification schema
const NotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: [
      'new_message',
      'new_proposal',
      'proposal_accepted',
      'proposal_rejected',
      'job_completed',
      'payment_received',
      'payment_released',
      'new_review',
      'system'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  relatedId: {
    type: mongoose.Schema.ObjectId,
    refPath: 'onModel'
  },
  onModel: {
    type: String,
    enum: ['Job', 'Proposal', 'Message', 'Payment', 'Review', 'User']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
NotificationSchema.index({ recipient: 1, read: 1 });
NotificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);
