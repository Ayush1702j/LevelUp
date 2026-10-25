const mongoose = require('mongoose');

const vocabularySchema = new mongoose.Schema(
  {
    word: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    pronunciation: {
      type: String,
      default: ''
    },
    meaning: {
      type: String,
      required: true
    },
    example: {
      type: String,
      required: true
    },
    options: {
      type: [String],
      required: true,
      validate: [val => val.length === 4, 'Vocabulary quiz must have exactly 4 options']
    },
    correctAnswer: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium'
    },
    category: {
      type: String,
      default: 'General'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Vocabulary', vocabularySchema);
