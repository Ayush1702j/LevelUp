const User = require('../models/User');
const Progress = require('../models/Progress');
const Task = require('../models/Task');
const Habit = require('../models/Habit');
const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');

const LEVEL_TIERS = [
  { level: 'Beginner', minXp: 0, maxXp: 200 },
  { level: 'Explorer', minXp: 200, maxXp: 500 },
  { level: 'Consistent', minXp: 500, maxXp: 1000 },
  { level: 'Achiever', minXp: 1000, maxXp: 2000 },
  { level: 'LevelUp Master', minXp: 2000, maxXp: 5000 }
];

const getLevelDetails = (totalPoints = 0) => {
  let matchedTier = LEVEL_TIERS[0];

  for (let i = LEVEL_TIERS.length - 1; i >= 0; i--) {
    if (totalPoints >= LEVEL_TIERS[i].minXp) {
      matchedTier = LEVEL_TIERS[i];
      break;
    }
  }

  const range = matchedTier.maxXp - matchedTier.minXp;
  const earnedInRange = Math.max(0, totalPoints - matchedTier.minXp);
  const progressPercent = Math.min(100, Math.round((earnedInRange / range) * 100));

  return {
    level: matchedTier.level,
    totalPoints,
    minXp: matchedTier.minXp,
    maxXp: matchedTier.maxXp,
    progressPercent
  };
};

/**
 * Checks all achievements for a given user and awards any newly earned ones
 * @param {string} userId 
 * @returns {Promise<Array>} newly unlocked achievements
 */
const checkAndAwardAchievements = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return [];

    const existingUserAchievements = await UserAchievement.find({ userId }).populate('achievementId');
    const unlockedIds = new Set(existingUserAchievements.map(ua => ua.achievementId?._id?.toString()).filter(Boolean));

    const allAchievements = await Achievement.find();
    const newlyUnlocked = [];

    // Pre-calculate user metrics
    const progressCountByCategory = await Progress.aggregate([
      { $match: { userId: user._id } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const categoryMap = {};
    progressCountByCategory.forEach(item => {
      categoryMap[item._id] = item.count;
    });

    const totalProgressCount = await Progress.countDocuments({ userId: user._id });
    const completedTasksCount = await Task.countDocuments({ userId: user._id, completed: true });
    const activeHabits = await Habit.find({ userId: user._id });
    const maxHabitStreak = activeHabits.reduce((max, h) => Math.max(max, h.longestStreak || 0), 0);

    for (const ach of allAchievements) {
      if (unlockedIds.has(ach._id.toString())) continue;

      let isEligible = false;

      switch (ach.requirementType) {
        case 'streak':
          isEligible = (user.currentStreak >= ach.requirementThreshold || user.longestStreak >= ach.requirementThreshold);
          break;
        case 'xp':
          isEligible = (user.totalPoints >= ach.requirementThreshold);
          break;
        case 'speaking':
          isEligible = ((categoryMap['Speaking'] || 0) >= ach.requirementThreshold);
          break;
        case 'vocabulary':
          isEligible = ((categoryMap['Vocabulary'] || 0) >= ach.requirementThreshold);
          break;
        case 'grammar':
          isEligible = ((categoryMap['Grammar'] || 0) >= ach.requirementThreshold);
          break;
        case 'tasks':
          isEligible = (completedTasksCount >= ach.requirementThreshold);
          break;
        case 'habits':
          isEligible = (maxHabitStreak >= ach.requirementThreshold);
          break;
        case 'totalActivities':
          isEligible = (totalProgressCount >= ach.requirementThreshold);
          break;
        default:
          break;
      }

      if (isEligible) {
        // Unlock achievement
        await UserAchievement.create({
          userId: user._id,
          achievementId: ach._id,
          unlockedAt: new Date()
        });

        // Award bonus XP
        user.totalPoints = (user.totalPoints || 0) + (ach.xpReward || 50);
        user.level = getLevelDetails(user.totalPoints).level;
        await user.save();

        newlyUnlocked.push(ach);
      }
    }

    return newlyUnlocked;
  } catch (err) {
    console.error('Error checking achievements:', err);
    return [];
  }
};

/**
 * Calculates rule-based personalized recommendation
 * @param {string} userId
 */
const getPersonalizedRecommendation = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return null;

  // Look back at the past 7 days of activities
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

  const recentProgress = await Progress.find({
    userId,
    date: { $gte: sevenDaysAgoStr }
  });

  const categoryCounts = {
    Speaking: 0,
    Vocabulary: 0,
    Grammar: 0,
    Productivity: 0,
    Habits: 0
  };

  recentProgress.forEach(p => {
    if (categoryCounts[p.category] !== undefined) {
      categoryCounts[p.category]++;
    }
  });

  // Check tasks completed in the last 7 days
  const recentTasks = await Task.countDocuments({
    userId,
    completed: true,
    date: { $gte: sevenDaysAgoStr }
  });
  categoryCounts.Productivity += recentTasks;

  // Determine the area with lowest activity
  const areas = [
    {
      category: 'Speaking',
      count: categoryCounts.Speaking,
      title: '1-Minute Speaking Challenge',
      description: 'Your speaking activity has been low this week. Practice talking fluently for 60 seconds on a new prompt.',
      reason: 'Low speaking activity in the last 7 days',
      actionUrl: '/speaking',
      icon: 'mic',
      points: 20
    },
    {
      category: 'Vocabulary',
      count: categoryCounts.Vocabulary,
      title: 'Power Vocabulary Quiz',
      description: 'Strengthen your word mastery with 5 new words and testing yourself on definitions.',
      reason: 'Low vocabulary practice in recent sessions',
      actionUrl: '/vocabulary',
      icon: 'book-open',
      points: 10
    },
    {
      category: 'Grammar',
      count: categoryCounts.Grammar,
      title: 'Daily Grammar Booster',
      description: 'Sharp precision is key. Test your sentence construction and master common English pitfalls.',
      reason: 'Grammar review needed to maintain accuracy',
      actionUrl: '/grammar',
      icon: 'edit-3',
      points: 10
    },
    {
      category: 'Productivity',
      count: categoryCounts.Productivity,
      title: 'Daily Priority Planner',
      description: 'Organize your top 3 tasks for today and stay focused on what moves the needle.',
      reason: 'Plan your day to keep your productivity high',
      actionUrl: '/tasks',
      icon: 'check-square',
      points: 15
    }
  ];

  // Sort ascending by count
  areas.sort((a, b) => a.count - b.count);

  return areas[0];
};

module.exports = {
  LEVEL_TIERS,
  getLevelDetails,
  checkAndAwardAchievements,
  getPersonalizedRecommendation
};
