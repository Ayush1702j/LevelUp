const Challenge = require('../models/Challenge');
const Progress = require('../models/Progress');
const User = require('../models/User');
const { updateUserStreak, getTodayDateString } = require('../utils/streakHelper');
const { getLevelDetails, checkAndAwardAchievements } = require('../utils/gamification');

// @desc    Get all challenges with optional filters & completion status
// @route   GET /api/challenges
// @access  Private
const getAllChallenges = async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = new RegExp(`^${category}$`, 'i');
    }

    if (difficulty && difficulty !== 'All') {
      filter.difficulty = new RegExp(`^${difficulty}$`, 'i');
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const challenges = await Challenge.find(filter).sort({ createdAt: -1 });

    // Fetch user completions to mark challenges completed
    const userCompletions = await Progress.find({
      userId: req.user._id,
      challengeId: { $ne: null }
    }).select('challengeId date');

    const completionMap = new Set(userCompletions.map(c => c.challengeId.toString()));
    const today = getTodayDateString();
    const todayCompletions = new Set(
      userCompletions.filter(c => c.date === today).map(c => c.challengeId.toString())
    );

    const challengesWithStatus = challenges.map(ch => {
      const chObj = ch.toObject();
      return {
        ...chObj,
        isCompleted: completionMap.has(ch._id.toString()),
        isCompletedToday: todayCompletions.has(ch._id.toString())
      };
    });

    res.json({
      success: true,
      count: challengesWithStatus.length,
      challenges: challengesWithStatus
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get today's curated challenges for the dashboard
// @route   GET /api/challenges/today
// @access  Private
const getTodayChallenges = async (req, res) => {
  try {
    const today = getTodayDateString();
    const todayProgress = await Progress.find({
      userId: req.user._id,
      date: today
    });

    const completedCategories = new Set(todayProgress.map(p => p.category));

    // Fetch 1 sample challenge for each key category
    const categories = ['Speaking', 'Vocabulary', 'Grammar', 'Productivity'];
    const curated = [];

    for (const cat of categories) {
      const challenge = await Challenge.findOne({ category: cat });
      if (challenge) {
        curated.push({
          ...challenge.toObject(),
          isCompletedToday: completedCategories.has(cat)
        });
      }
    }

    res.json({
      success: true,
      date: today,
      completedCount: todayProgress.length,
      challenges: curated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single challenge by ID
// @route   GET /api/challenges/:id
// @access  Private
const getChallengeById = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    const today = getTodayDateString();
    const completedToday = await Progress.exists({
      userId: req.user._id,
      challengeId: challenge._id,
      date: today
    });

    res.json({
      success: true,
      challenge: {
        ...challenge.toObject(),
        isCompletedToday: Boolean(completedToday)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Complete a challenge, award XP, update streak, check achievements
// @route   POST /api/challenges/:id/complete
// @access  Private
const completeChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    const today = getTodayDateString();
    const alreadyCompletedToday = await Progress.findOne({
      userId: req.user._id,
      challengeId: challenge._id,
      date: today
    });

    if (alreadyCompletedToday) {
      return res.status(400).json({
        success: false,
        message: 'You have already completed this challenge today! Come back tomorrow for more XP.'
      });
    }

    // Create progress record
    const pointsToAward = challenge.points || 20;
    const progress = await Progress.create({
      userId: req.user._id,
      challengeId: challenge._id,
      category: challenge.category,
      title: challenge.title,
      pointsEarned: pointsToAward,
      date: today
    });

    // Update user stats
    const user = await User.findById(req.user._id);
    user.totalPoints = (user.totalPoints || 0) + pointsToAward;
    user.level = getLevelDetails(user.totalPoints).level;
    const streakIncreased = updateUserStreak(user);
    await user.save();

    // Check achievements
    const newlyUnlockedAchievements = await checkAndAwardAchievements(user._id);

    const levelInfo = getLevelDetails(user.totalPoints);

    res.json({
      success: true,
      message: `Challenge completed! +${pointsToAward} XP earned.`,
      pointsEarned: pointsToAward,
      streakIncreased,
      currentStreak: user.currentStreak,
      user: {
        ...user.toObject(),
        levelInfo
      },
      newlyUnlockedAchievements,
      progress
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllChallenges,
  getTodayChallenges,
  getChallengeById,
  completeChallenge
};
