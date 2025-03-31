const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true
  },
  attachments: [String],
  read: {
    type: Boolean,
    default: false
  },
  job: {
    type: mongoose.Schema.ObjectId,
    ref: 'Job'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create compound index for conversation queries
MessageSchema.index({ sender: 1, recipient: 1 });
MessageSchema.index({ recipient: 1, read: 1 });

module.exports = mongoose.model('Message', MessageSchema);
