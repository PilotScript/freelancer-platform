const mongoose = require('mongoose');

// Create a subscription schema
const SubscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: String,
    enum: ['basic', 'premium', 'enterprise'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'canceled', 'expired'],
    default: 'active'
  },
  features: {
    enhancedProfile: {
      type: Boolean,
      default: false
    },
    priorityListing: {
      type: Boolean,
      default: false
    },
    exclusiveJobs: {
      type: Boolean,
      default: false
    },
    reducedFees: {
      type: Boolean,
      default: false
    }
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  renewalDate: {
    type: Date
  },
  autoRenew: {
    type: Boolean,
    default: true
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'bank_transfer'],
    required: true
  },
  paymentId: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
