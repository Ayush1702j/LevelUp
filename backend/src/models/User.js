const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    totalPoints: {
      type: Number,
      default: 0
    },
    level: {
      type: String,
      default: 'Beginner',
      enum: ['Beginner', 'Explorer', 'Consistent', 'Achiever', 'LevelUp Master']
    },
    currentStreak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    lastActivityDate: {
      type: String, // format YYYY-MM-DD
      default: null
    },
    avatar: {
      type: String,
      default: 'sparkles'
    },
    bio: {
      type: String,
      default: 'Excited to LevelUp every day!'
    },
    notificationSettings: {
      dailyReminder: { type: Boolean, default: true },
      streakAlert: { type: Boolean, default: true },
      achievementAlert: { type: Boolean, default: true }
    },
    themePreference: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
