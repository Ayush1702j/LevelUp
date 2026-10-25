const Habit = require('../models/Habit');
const Progress = require('../models/Progress');
const User = require('../models/User');
const { getTodayDateString, calculateHabitStreaks, updateUserStreak } = require('../utils/streakHelper');
const { getLevelDetails, checkAndAwardAchievements } = require('../utils/gamification');

// Helper to get past 7 days array
const getLast7Days = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
};

// @desc    Get all habits with streaks & 7-day completion status
// @route   GET /api/habits
// @access  Private
const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user._id }).sort({ createdAt: -1 });
    const last7Days = getLast7Days();
    const today = getTodayDateString();

    const formattedHabits = habits.map(habit => {
      const datesSet = new Set(habit.completedDates || []);
      const weekStatus = last7Days.map(dateStr => ({
        date: dateStr,
        dayName: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'narrow' }),
        isCompleted: datesSet.has(dateStr),
        isToday: dateStr === today
      }));

      // Calculate recent 7-day completion percentage
      const completedPast7 = last7Days.filter(d => datesSet.has(d)).length;
      const weeklyRate = Math.round((completedPast7 / 7) * 100);

      return {
        ...habit.toObject(),
        weekStatus,
        isCompletedToday: datesSet.has(today),
        weeklyRate
      };
    });

    res.json({
      success: true,
      count: formattedHabits.length,
      last7Days,
      today,
      habits: formattedHabits
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new habit
// @route   POST /api/habits
// @access  Private
const createHabit = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Habit name is required' });
    }

    const habit = await Habit.create({
      userId: req.user._id,
      name: name.trim(),
      description: description ? description.trim() : '',
      category: category || 'General',
      completedDates: [],
      currentStreak: 0,
      longestStreak: 0
    });

    res.status(201).json({
      success: true,
      message: 'Habit created successfully',
      habit
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update habit details
// @route   PUT /api/habits/:id
// @access  Private
const updateHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id });

    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    const { name, description, category } = req.body;

    if (name) habit.name = name.trim();
    if (description !== undefined) habit.description = description.trim();
    if (category) habit.category = category;

    await habit.save();

    res.json({
      success: true,
      message: 'Habit updated successfully',
      habit
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete habit
// @route   DELETE /api/habits/:id
// @access  Private
const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    res.json({ success: true, message: 'Habit removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle habit completion for a specific date (default today)
// @route   POST /api/habits/:id/toggle
// @access  Private
const toggleHabitDate = async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id });

    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    const targetDate = req.body.date || getTodayDateString();
    const dateIndex = habit.completedDates.indexOf(targetDate);

    let completed = false;
    let pointsAwarded = 0;
    let user = null;
    let newlyUnlockedAchievements = [];

    if (dateIndex === -1) {
      // Mark completed
      habit.completedDates.push(targetDate);
      completed = true;
      pointsAwarded = 5;

      // Update streaks
      const streaks = calculateHabitStreaks(habit.completedDates);
      habit.currentStreak = streaks.currentStreak;
      habit.longestStreak = streaks.longestStreak;
      await habit.save();

      // Record progress and update user XP/streak
      await Progress.create({
        userId: req.user._id,
        category: 'Habits',
        title: `Habit Checked: ${habit.name}`,
        pointsEarned: pointsAwarded,
        date: targetDate
      });

      user = await User.findById(req.user._id);
      user.totalPoints = (user.totalPoints || 0) + pointsAwarded;
      user.level = getLevelDetails(user.totalPoints).level;
      updateUserStreak(user);
      await user.save();

      newlyUnlockedAchievements = await checkAndAwardAchievements(user._id);
    } else {
      // Unmark completed
      habit.completedDates.splice(dateIndex, 1);
      completed = false;

      // Recalculate streaks
      const streaks = calculateHabitStreaks(habit.completedDates);
      habit.currentStreak = streaks.currentStreak;
      habit.longestStreak = streaks.longestStreak;
      await habit.save();

      // Remove progress record for that habit on that date
      await Progress.findOneAndDelete({
        userId: req.user._id,
        category: 'Habits',
        title: `Habit Checked: ${habit.name}`,
        date: targetDate
      });

      user = await User.findById(req.user._id);
    }

    const levelInfo = user ? getLevelDetails(user.totalPoints) : null;

    res.json({
      success: true,
      message: completed ? `Habit completed! +${pointsAwarded} XP` : 'Habit unchecked',
      completed,
      habit,
      pointsAwarded,
      newlyUnlockedAchievements,
      user: user ? { ...user.toObject(), levelInfo } : null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  toggleHabitDate
};
