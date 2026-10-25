const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    requirementType: {
      type: String,
      required: true,
      enum: ['streak', 'xp', 'speaking', 'vocabulary', 'grammar', 'tasks', 'habits', 'totalActivities']
    },
    requirementThreshold: {
      type: Number,
      required: true
    },
    icon: {
      type: String,
      default: 'award'
    },
    xpReward: {
      type: Number,
      default: 50
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Achievement', achievementSchema);
