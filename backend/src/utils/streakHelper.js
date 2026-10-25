// Helper for dates and streaks

const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0];
};

const getYesterdayDateString = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

/**
 * Updates a user's streak based on an activity completed today
 * @param {Object} user - Mongoose User document
 * @returns {Boolean} whether streak was incremented
 */
const updateUserStreak = (user) => {
  const today = getTodayDateString();
  const last = user.lastActivityDate;

  if (!last) {
    user.currentStreak = 1;
    user.longestStreak = Math.max(user.longestStreak || 0, 1);
    user.lastActivityDate = today;
    return true;
  }

  if (last === today) {
    // Already did an activity today; streak remains current
    return false;
  }

  const lastDate = new Date(last);
  const todayDate = new Date(today);
  const diffTime = todayDate - lastDate;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    user.currentStreak = (user.currentStreak || 0) + 1;
  } else {
    // Missed one or more days, reset to 1
    user.currentStreak = 1;
  }

  user.longestStreak = Math.max(user.longestStreak || 0, user.currentStreak);
  user.lastActivityDate = today;
  return true;
};

/**
 * Calculates current and longest streaks from an array of date strings ['YYYY-MM-DD']
 * @param {Array<string>} completedDates
 * @returns {{ currentStreak: number, longestStreak: number }}
 */
const calculateHabitStreaks = (completedDates = []) => {
  if (!completedDates || completedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Remove duplicates and sort ascending
  const uniqueSortedDates = Array.from(new Set(completedDates)).sort();
  const dateSet = new Set(uniqueSortedDates);

  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  // 1. Calculate current streak
  let currentStreak = 0;
  let checkDate = new Date(today);

  // If today is not completed, check if yesterday was completed to keep streak alive
  if (!dateSet.has(today)) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const dateStr = checkDate.toISOString().split('T')[0];
    if (dateSet.has(dateStr)) {
      currentStreak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // 2. Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate = null;

  for (const dateStr of uniqueSortedDates) {
    const currentDate = new Date(dateStr);
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diffTime = currentDate - prevDate;
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak += 1;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
    prevDate = currentDate;
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak)
  };
};

module.exports = {
  getTodayDateString,
  getYesterdayDateString,
  updateUserStreak,
  calculateHabitStreaks
};
