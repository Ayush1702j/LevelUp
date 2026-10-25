const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
      default: null
    },
    category: {
      type: String,
      required: true,
      enum: ['Speaking', 'Vocabulary', 'Grammar', 'Productivity', 'Mindset', 'Habits', 'Thought']
    },
    title: {
      type: String,
      default: ''
    },
    pointsEarned: {
      type: Number,
      required: true,
      default: 0
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
      index: true
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Progress', progressSchema);
