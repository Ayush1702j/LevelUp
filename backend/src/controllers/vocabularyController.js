const Vocabulary = require('../models/Vocabulary');
const Progress = require('../models/Progress');
const User = require('../models/User');
const { getTodayDateString, updateUserStreak } = require('../utils/streakHelper');
const { getLevelDetails, checkAndAwardAchievements } = require('../utils/gamification');

// @desc    Get all vocabulary words with pagination and filters
// @route   GET /api/vocabulary
// @access  Private
const getAllWords = async (req, res) => {
  try {
    const { difficulty, search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (difficulty && difficulty !== 'All') {
      filter.difficulty = difficulty;
    }

    if (search) {
      filter.$or = [
        { word: { $regex: search, $options: 'i' } },
        { meaning: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Vocabulary.countDocuments(filter);
    const words = await Vocabulary.find(filter).skip(skip).limit(parseInt(limit)).sort({ word: 1 });

    res.json({
      success: true,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      words
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get random word of the day / flashcard
// @route   GET /api/vocabulary/random
// @access  Private
const getRandomWord = async (req, res) => {
  try {
    const count = await Vocabulary.countDocuments();
    if (count === 0) {
      return res.status(404).json({ success: false, message: 'No vocabulary words found. Please run seed script.' });
    }

    const random = Math.floor(Math.random() * count);
    const word = await Vocabulary.findOne().skip(random);

    res.json({
      success: true,
      word
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit answer for a vocabulary quiz
// @route   POST /api/vocabulary/:id/answer
// @access  Private
const submitQuizAnswer = async (req, res) => {
  try {
    const { selectedAnswer } = req.body;
    const word = await Vocabulary.findById(req.params.id);

    if (!word) {
      return res.status(404).json({ success: false, message: 'Vocabulary word not found' });
    }

    const isCorrect = selectedAnswer === word.correctAnswer;
    let pointsAwarded = 0;
    let streakIncreased = false;
    let newlyUnlockedAchievements = [];
    let updatedUser = null;

    if (isCorrect) {
      pointsAwarded = 10;
      const today = getTodayDateString();

      await Progress.create({
        userId: req.user._id,
        category: 'Vocabulary',
        title: `Learned Word: ${word.word}`,
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
      correctAnswer: word.correctAnswer,
      meaning: word.meaning,
      example: word.example,
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
  getAllWords,
  getRandomWord,
  submitQuizAnswer
};
