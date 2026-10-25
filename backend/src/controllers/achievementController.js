const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');

// @desc    Get all achievements with user's unlock status
// @route   GET /api/achievements
// @access  Private
const getAllAchievements = async (req, res) => {
  try {
    const allAchievements = await Achievement.find().sort({ requirementThreshold: 1 });
    const userAchievements = await UserAchievement.find({ userId: req.user._id });

    const unlockedMap = new Map();
    userAchievements.forEach(ua => {
      unlockedMap.set(ua.achievementId.toString(), ua.unlockedAt);
    });

    const achievements = allAchievements.map(ach => {
      const isUnlocked = unlockedMap.has(ach._id.toString());
      return {
        ...ach.toObject(),
        isUnlocked,
        unlockedAt: isUnlocked ? unlockedMap.get(ach._id.toString()) : null
      };
    });

    res.json({
      success: true,
      totalCount: achievements.length,
      unlockedCount: userAchievements.length,
      achievements
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's unlocked achievements
// @route   GET /api/achievements/user
// @access  Private
const getUserAchievements = async (req, res) => {
  try {
    const userAchievements = await UserAchievement.find({ userId: req.user._id })
      .populate('achievementId')
      .sort({ unlockedAt: -1 });

    res.json({
      success: true,
      count: userAchievements.length,
      achievements: userAchievements
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllAchievements,
  getUserAchievements
};
