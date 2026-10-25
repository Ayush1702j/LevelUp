const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Challenge title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Challenge description is required']
    },
    category: {
      type: String,
      required: true,
      enum: ['Speaking', 'Vocabulary', 'Grammar', 'Productivity', 'Mindset', 'Habits']
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium'
    },
    points: {
      type: Number,
      required: true,
      default: 20
    },
    promptDetails: {
      type: String,
      default: ''
    },
    estimatedTime: {
      type: String,
      default: '3-5 mins'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Challenge', challengeSchema);
