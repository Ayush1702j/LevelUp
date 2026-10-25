const Progress = require('../models/Progress');
const User = require('../models/User');
const Task = require('../models/Task');
const Habit = require('../models/Habit');
const { getTodayDateString } = require('../utils/streakHelper');
const { getLevelDetails, getPersonalizedRecommendation } = require('../utils/gamification');

// Helper to format day name
const formatDayName = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short' });
};

// @desc    Get overall user progress and stats
// @route   GET /api/progress
// @access  Private
const getProgressSummary = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const today = getTodayDateString();

    const todayProgress = await Progress.find({ userId: user._id, date: today });
    const todayTasksCompleted = await Task.countDocuments({
      userId: user._id,
      completed: true,
      date: today
    });

    // Count today's habit completions
    const userHabits = await Habit.find({ userId: user._id });
    const todayHabitsCompleted = userHabits.filter(h => (h.completedDates || []).includes(today)).length;

    const totalTodayCompleted = todayProgress.length;
    // Standard daily target is 4 activities (e.g. speaking, vocab, grammar, task/habit)
    const dailyTarget = 4;
    const todayProgressPercent = Math.min(100, Math.round((totalTodayCompleted / dailyTarget) * 100));

    // Category distribution
    const categoryStats = await Progress.aggregate([
      { $match: { userId: user._id } },
      { $group: { _id: '$category', count: { $sum: 1 }, totalXp: { $sum: '$pointsEarned' } } }
    ]);

    const categoryMap = {
      Speaking: 0,
      Vocabulary: 0,
      Grammar: 0,
      Productivity: 0,
      Habits: 0,
      Thought: 0
    };

    categoryStats.forEach(item => {
      if (categoryMap[item._id] !== undefined) {
        categoryMap[item._id] = item.count;
      }
    });

    const totalCompleted = await Progress.countDocuments({ userId: user._id });
    const recommendation = await getPersonalizedRecommendation(user._id);
    const levelInfo = getLevelDetails(user.totalPoints);

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        levelInfo
      },
      today: {
        date: today,
        completedCount: totalTodayCompleted,
        dailyTarget,
        progressPercent: todayProgressPercent,
        tasksCompleted: todayTasksCompleted,
        habitsCompleted: todayHabitsCompleted
      },
      totalCompleted,
      categoryMap,
      recommendation
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get past 7 days activity for Recharts
// @route   GET /api/progress/weekly
// @access  Private
const getWeeklyActivity = async (req, res) => {
  try {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }

    const weeklyProgress = await Progress.find({
      userId: req.user._id,
      date: { $in: days }
    });

    const data = days.map(dateStr => {
      const dayRecords = weeklyProgress.filter(p => p.date === dateStr);
      const xpEarned = dayRecords.reduce((sum, r) => sum + (r.pointsEarned || 0), 0);

      return {
        date: dateStr,
        day: formatDayName(dateStr),
        activities: dayRecords.length,
        xp: xpEarned
      };
    });

    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get category analytics for Recharts
// @route   GET /api/progress/category
// @access  Private
const getCategoryPerformance = async (req, res) => {
  try {
    const stats = await Progress.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: '$category', count: { $sum: 1 }, xp: { $sum: '$pointsEarned' } } }
    ]);

    const categories = ['Speaking', 'Vocabulary', 'Grammar', 'Productivity', 'Habits', 'Thought'];
    const map = {};
    stats.forEach(s => {
      map[s._id] = { count: s.count, xp: s.xp };
    });

    const data = categories.map(cat => ({
      category: cat,
      count: map[cat]?.count || 0,
      xp: map[cat]?.xp || 0
    }));

    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProgressSummary,
  getWeeklyActivity,
  getCategoryPerformance
};
