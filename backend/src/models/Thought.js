const mongoose = require('mongoose');

const thoughtSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    question: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Thought', thoughtSchema);
