import React, { useState, useEffect } from 'react';
import { habitsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import HabitCard from '../components/habits/HabitCard';
import HabitModal from '../components/habits/HabitModal';
import { CardSkeleton } from '../components/common/SkeletonLoader';
import {
  Flame,
  Plus,
  Trophy,
  Calendar,
  CheckCircle2,
  Sparkles,
  TrendingUp
} from 'lucide-react';

const Habits = () => {
  const { updateUser } = useAuth();
  const { showToast } = useToast();

  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const res = await habitsAPI.getAll();
      if (res.data.success) {
        setHabits(res.data.habits || []);
      }
    } catch (err) {
      console.error('Failed to load habits:', err);
      showToast({
        title: 'Error loading habits',
        message: 'Could not fetch your habit tracker.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleOpenAddModal = () => {
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const handleSaveHabit = async (habitData) => {
    setIsSaving(true);
    try {
      if (editingHabit) {
        const res = await habitsAPI.update(editingHabit._id, habitData);
        if (res.data.success) {
          showToast({
            title: 'Habit Updated',
            message: `"${habitData.name}" has been updated.`,
            type: 'success'
          });
        }
      } else {
        const res = await habitsAPI.create(habitData);
        if (res.data.success) {
          showToast({
            title: 'Habit Created 🔥',
            message: `"${habitData.name}" is now tracking daily consistency.`,
            type: 'success'
          });
        }
      }
      setIsModalOpen(false);
      fetchHabits();
    } catch (err) {
      showToast({
        title: 'Error saving habit',
        message: err.response?.data?.message || 'Could not save habit.',
        type: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleHabit = async (habitId, targetDate = null) => {
    try {
      setTogglingId(habitId);
      const res = await habitsAPI.toggle(habitId, targetDate);

      if (res.data.success) {
        if (res.data.completed) {
          showToast({
            title: 'Habit Completed! 🔥',
            message: `+5 XP awarded! Current streak: ${res.data.habit.currentStreak} days`,
            type: 'streak',
            xp: 5
          });
        } else {
          showToast({
            title: 'Habit Unchecked',
            message: 'Removed completion for this date.',
            type: 'info'
          });
        }

        if (res.data.user) {
          updateUser(res.data.user);
        }

        if (res.data.newlyUnlockedAchievements?.length > 0) {
          res.data.newlyUnlockedAchievements.forEach((ach) => {
            showToast({
              title: `🏆 Achievement Unlocked: ${ach.title}!`,
              message: ach.description,
              type: 'achievement',
              xp: ach.xpReward
            });
          });
        }

        fetchHabits();
      }
    } catch (err) {
      showToast({
        title: 'Error toggling habit',
        message: err.response?.data?.message || 'Could not toggle habit completion.',
        type: 'error'
      });
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteHabit = async (habitId) => {
    if (!window.confirm('Are you sure you want to delete this habit and its history?')) return;

    try {
      const res = await habitsAPI.delete(habitId);
      if (res.data.success) {
        showToast({
          title: 'Habit Deleted',
          message: 'Habit removed from tracker.',
          type: 'success'
        });
        fetchHabits();
      }
    } catch (err) {
      showToast({
        title: 'Delete Failed',
        message: 'Could not delete habit.',
        type: 'error'
      });
    }
  };

  // Overall statistics
  const totalStreaks = habits.reduce((acc, h) => acc + (h.currentStreak || 0), 0);
  const highestStreak = habits.reduce((max, h) => Math.max(max, h.longestStreak || 0), 0);
  const averageWeeklyRate =
    habits.length > 0
      ? Math.round(habits.reduce((acc, h) => acc + (h.weeklyRate || 0), 0) / habits.length)
      : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-700/60 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Flame className="w-3.5 h-3.5 fill-orange-500" />
            Consistency Builder
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Habit Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Track daily rituals, build momentum, and keep unbroken streaks in speaking, coding, reading, and wellness.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/25 transition flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New Habit
        </button>
      </div>

      {/* Habit Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Active Habits</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{habits.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
            <Flame className="w-5 h-5 fill-orange-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Longest Habit Streak</span>
            <div className="text-2xl font-bold text-amber-500 mt-0.5">
              {highestStreak} Days
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Weekly Consistency</span>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {averageWeeklyRate}%
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Habits Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : habits.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-700/60">
          <Flame className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            No habits yet.
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Create your first habit like "10 minutes of English speaking" or "Daily coding sprint".
          </p>
          <button
            onClick={handleOpenAddModal}
            className="mt-4 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-2 shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            Create First Habit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {habits.map((habit) => (
            <HabitCard
              key={habit._id}
              habit={habit}
              onToggle={handleToggleHabit}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteHabit}
              isToggling={togglingId === habit._id}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Habit Modal */}
      <HabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveHabit}
        habit={editingHabit}
        isSaving={isSaving}
      />
    </div>
  );
};

export default Habits;
