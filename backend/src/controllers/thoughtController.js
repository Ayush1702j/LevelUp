const Thought = require('../models/Thought');
const Progress = require('../models/Progress');
const User = require('../models/User');
const { getTodayDateString, updateUserStreak } = require('../utils/streakHelper');
const { getLevelDetails, checkAndAwardAchievements } = require('../utils/gamification');

// Curated daily questions pool
const DAILY_QUESTIONS = [
  "What is one thing you want to improve today?",
  "What did you learn yesterday that will help you today?",
  "What habit do you want to build this month and why?",
  "What are you proud of achieving recently?",
  "What would you do if you were not afraid of failure?",
  "What is one mistake that taught you something valuable?",
  "How can you express your ideas more clearly in communication?",
  "What is one small win you can create in the next 24 hours?",
  "Who inspired you recently and what quality did they show?",
  "What distraction will you eliminate today to stay productive?",
  "What is a word or phrase you learned this week and how can you use it?",
  "If you could give one piece of advice to yourself 1 year ago, what would it be?",
  "What does consistency mean to you in your daily routine?",
  "How do you handle nervous moments when speaking to a group?",
  "What is your highest priority goal for this week?"
];

// Helper to pick a consistent question for the day
const getQuestionForDate = (dateStr) => {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % DAILY_QUESTIONS.length;
  return DAILY_QUESTIONS[index];
};

// @desc    Get today's thought question & user answer if already submitted
// @route   GET /api/thoughts/today
// @access  Private
const getTodayThought = async (req, res) => {
  try {
    const today = getTodayDateString();
    const question = getQuestionForDate(today);

    const userThought = await Thought.findOne({
      userId: req.user._id,
      date: today
    });

    res.json({
      success: true,
      date: today,
      question,
      thought: userThought,
      isAnswered: Boolean(userThought)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit answer to today's thought question
// @route   POST /api/thoughts
// @access  Private
const submitThought = async (req, res) => {
  try {
    const { answer, question } = req.body;

    if (!answer || !answer.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a response' });
    }

    const today = getTodayDateString();
    let existingThought = await Thought.findOne({
      userId: req.user._id,
      date: today
    });

    let pointsAwarded = 0;
    let newlyUnlockedAchievements = [];
    let updatedUser = null;

    if (existingThought) {
      // Update existing reflection
      existingThought.answer = answer.trim();
      if (question) existingThought.question = question;
      await existingThought.save();
    } else {
      // New reflection for today
      existingThought = await Thought.create({
        userId: req.user._id,
        question: question || getQuestionForDate(today),
        answer: answer.trim(),
        date: today
      });

      pointsAwarded = 10;
      await Progress.create({
        userId: req.user._id,
        category: 'Thought',
        title: 'Daily Reflection: Thought of the Day',
        pointsEarned: pointsAwarded,
        date: today
      });

      const user = await User.findById(req.user._id);
      user.totalPoints = (user.totalPoints || 0) + pointsAwarded;
      user.level = getLevelDetails(user.totalPoints).level;
      updateUserStreak(user);
      await user.save();

      newlyUnlockedAchievements = await checkAndAwardAchievements(user._id);
      updatedUser = {
        ...user.toObject(),
        levelInfo: getLevelDetails(user.totalPoints)
      };
    }

    res.json({
      success: true,
      message: pointsAwarded > 0 ? `Reflection saved! +${pointsAwarded} XP` : 'Reflection updated',
      thought: existingThought,
      pointsAwarded,
      newlyUnlockedAchievements,
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's previous thought reflections
// @route   GET /api/thoughts/history
// @access  Private
const getThoughtHistory = async (req, res) => {
  try {
    const thoughts = await Thought.find({ userId: req.user._id }).sort({ date: -1 }).limit(30);

    res.json({
      success: true,
      count: thoughts.length,
      thoughts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTodayThought,
  submitThought,
  getThoughtHistory
};
