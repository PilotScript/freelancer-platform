const mongoose = require('mongoose');

// Create a review schema
const ReviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  reviewee: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: mongoose.Schema.ObjectId,
    ref: 'Job'
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating between 1 and 5'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Please add a review comment'],
    maxlength: [500, 'Comment cannot be more than 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent user from submitting more than one review per job
ReviewSchema.index({ reviewer: 1, job: 1 }, { unique: true });

// Static method to get average rating
ReviewSchema.statics.getAverageRating = async function(userId) {
  const obj = await this.aggregate([
    {
      $match: { reviewee: userId }
    },
    {
      $group: {
        _id: '$reviewee',
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  try {
    if (obj[0]) {
      await this.model('User').findByIdAndUpdate(userId, {
        rating: obj[0].averageRating.toFixed(1)
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
ReviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.reviewee);
});

// Call getAverageRating after remove
ReviewSchema.post('remove', function() {
  this.constructor.getAverageRating(this.reviewee);
});

module.exports = mongoose.model('Review', ReviewSchema);
