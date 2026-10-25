const Grammar = require('../models/Grammar');
const Progress = require('../models/Progress');
const User = require('../models/User');
const { getTodayDateString, updateUserStreak } = require('../utils/streakHelper');
const { getLevelDetails, checkAndAwardAchievements } = require('../utils/gamification');

// @desc    Get grammar questions
// @route   GET /api/grammar
// @access  Private
const getAllQuestions = async (req, res) => {
  try {
    const { difficulty, category, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (difficulty && difficulty !== 'All') {
      filter.difficulty = difficulty;
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Grammar.countDocuments(filter);
    const questions = await Grammar.find(filter).skip(skip).limit(parseInt(limit));

    res.json({
      success: true,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      questions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit answer to a grammar question
// @route   POST /api/grammar/:id/answer
// @access  Private
const submitGrammarAnswer = async (req, res) => {
  try {
    const { selectedAnswer } = req.body;
    const item = await Grammar.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Grammar question not found' });
    }

    const isCorrect = selectedAnswer === item.correctAnswer;
    let pointsAwarded = 0;
    let streakIncreased = false;
    let newlyUnlockedAchievements = [];
    let updatedUser = null;

    if (isCorrect) {
      pointsAwarded = 10;
      const today = getTodayDateString();

      await Progress.create({
        userId: req.user._id,
        category: 'Grammar',
        title: `Grammar Challenge: ${item.category || 'Practice'}`,
        pointsEarned: pointsAwarded,
        date: today
      });

      const user = await User.findById(req.user._id);
      user.totalPoints = (user.totalPoints || 0) + pointsAwarded;
      user.level = getLevelDetails(user.totalPoints).level;
      streakIncreased = updateUserStreak(user);
      await user.save();

      newlyUnlockedAchievements = await checkAndAwardAchievements(user._id);
      updatedUser = {
        ...user.toObject(),
        levelInfo: getLevelDetails(user.totalPoints)
      };
    }

    res.json({
      success: true,
      isCorrect,
      correctAnswer: item.correctAnswer,
      explanation: item.explanation,
      pointsAwarded,
      streakIncreased,
      newlyUnlockedAchievements,
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllQuestions,
  submitGrammarAnswer
};
