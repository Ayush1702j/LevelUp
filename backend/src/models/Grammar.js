const mongoose = require('mongoose');

const grammarSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true
    },
    options: {
      type: [String],
      required: true,
      validate: [val => val.length >= 2, 'Grammar challenge must have at least 2 options']
    },
    correctAnswer: {
      type: String,
      required: true
    },
    explanation: {
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
      default: 'Grammar'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Grammar', grammarSchema);
