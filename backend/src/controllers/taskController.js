const Task = require('../models/Task');
const Progress = require('../models/Progress');
const User = require('../models/User');
const { updateUserStreak, getTodayDateString } = require('../utils/streakHelper');
const { getLevelDetails, checkAndAwardAchievements } = require('../utils/gamification');

// @desc    Get user tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { status, priority, date } = req.query;
    const filter = { userId: req.user._id };

    if (status === 'completed') {
      filter.completed = true;
    } else if (status === 'pending') {
      filter.completed = false;
    }

    if (priority && priority !== 'All') {
      filter.priority = priority;
    }

    if (date) {
      filter.date = date;
    }

    const tasks = await Task.find(filter).sort({ completed: 1, createdAt: -1 });

    const totalCount = await Task.countDocuments({ userId: req.user._id });
    const completedCount = await Task.countDocuments({ userId: req.user._id, completed: true });

    res.json({
      success: true,
      count: tasks.length,
      totalCount,
      completedCount,
      tasks
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, priority, date } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Task title is required' });
    }

    const task = await Task.create({
      userId: req.user._id,
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'Medium',
      date: date || getTodayDateString(),
      completed: false
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const { title, description, priority, date, completed } = req.body;

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (priority !== undefined) task.priority = priority;
    if (date !== undefined) task.date = date;

    const wasCompleted = task.completed;
    if (completed !== undefined) {
      task.completed = completed;
      if (completed) {
        task.completedAt = new Date();
      } else {
        task.completedAt = null;
      }
    }

    await task.save();

    let pointsAwarded = 0;
    let newlyUnlockedAchievements = [];
    let updatedUser = null;

    // If just marked completed, award 5 XP and check streaks
    if (!wasCompleted && task.completed) {
      pointsAwarded = 5;
      const today = getTodayDateString();

      await Progress.create({
        userId: req.user._id,
        category: 'Productivity',
        title: `Completed Task: ${task.title}`,
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
      message: 'Task updated successfully',
      task,
      pointsAwarded,
      newlyUnlockedAchievements,
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, message: 'Task removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
