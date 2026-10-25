import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { challengesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ChallengeCard from '../components/challenges/ChallengeCard';
import { CardSkeleton } from '../components/common/SkeletonLoader';
import { Target, Search, Filter, Sparkles } from 'lucide-react';

const Challenges = () => {
  const { updateUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [search, setSearch] = useState('');
  const [completingId, setCompletingId] = useState(null);

  const categories = ['All', 'Speaking', 'Vocabulary', 'Grammar', 'Productivity', 'Mindset', 'Habits'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const res = await challengesAPI.getAll({ category, difficulty, search });
      if (res.data.success) {
        setChallenges(res.data.challenges);
      }
    } catch (err) {
      console.error('Failed to load challenges:', err);
      showToast({
        title: 'Error loading challenges',
        message: 'Could not fetch challenge library.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, [category, difficulty]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchChallenges();
  };

  const handleStartChallenge = (challenge) => {
    if (challenge.category === 'Speaking') {
      navigate('/speaking');
    } else if (challenge.category === 'Vocabulary') {
      navigate('/vocabulary');
    } else if (challenge.category === 'Grammar') {
      navigate('/grammar');
    } else if (challenge.category === 'Productivity' || challenge.category === 'Habits') {
      navigate('/tasks');
    } else {
      // General challenge, allow complete directly
      handleCompleteChallenge(challenge._id);
    }
  };

  const handleCompleteChallenge = async (id) => {
    try {
      setCompletingId(id);
      const res = await challengesAPI.complete(id);

      if (res.data.success) {
        showToast({
          title: 'Challenge Completed! 🎉',
          message: `+${res.data.pointsEarned} XP awarded to your profile.`,
          type: 'success',
          xp: res.data.pointsEarned
        });

        if (res.data.user) {
          updateUser(res.data.user);
        }

        if (res.data.streakIncreased) {
          showToast({
            title: '🔥 Streak Increased!',
            message: `You are now on a ${res.data.currentStreak} day streak!`,
            type: 'streak'
          });
        }

        if (res.data.newlyUnlockedAchievements?.length > 0) {
          res.data.newlyUnlockedAchievements.forEach(ach => {
            showToast({
              title: `🏆 Achievement Unlocked: ${ach.title}!`,
              message: ach.description,
              type: 'achievement',
              xp: ach.xpReward
            });
          });
        }

        fetchChallenges();
      }
    } catch (err) {
      showToast({
        title: 'Unable to complete challenge',
        message: err.response?.data?.message || 'Something went wrong.',
        type: 'error'
      });
    } finally {
      setCompletingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-700/60 shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Target className="w-3.5 h-3.5" />
              Daily Growth Challenges
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Challenge Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Complete curated communication, focus, and mindset challenges to build skills and earn daily XP.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              {challenges.filter(c => c.isCompletedToday).length} / {challenges.length} Done Today
            </span>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700/60 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  category === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Difficulty & Search */}
          <div className="flex items-center gap-2">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {difficulties.map(d => (
                <option key={d} value={d}>
                  Difficulty: {d}
                </option>
              ))}
            </select>

            <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-56">
              <input
                type="text"
                placeholder="Search challenges..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </form>
          </div>
        </div>
      </div>

      {/* Challenges Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : challenges.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-700">
          <Target className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            No challenges found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or selecting a different category filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {challenges.map((ch) => (
            <ChallengeCard
              key={ch._id}
              challenge={ch}
              onStart={handleStartChallenge}
              onComplete={handleCompleteChallenge}
              isCompleting={completingId === ch._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Challenges;
