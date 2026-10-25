import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  progressAPI,
  challengesAPI,
  thoughtsAPI,
  achievementsAPI
} from '../services/api';
import StatCard from '../components/common/StatCard';
import ProgressBar from '../components/common/ProgressBar';
import { CardSkeleton } from '../components/common/SkeletonLoader';
import {
  Flame,
  Star,
  CheckCircle2,
  Trophy,
  ArrowRight,
  Mic,
  BookOpen,
  FileEdit,
  Brain,
  Sparkles,
  Zap,
  TrendingUp
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState(null);
  const [todayChallenges, setTodayChallenges] = useState([]);
  const [todayThought, setTodayThought] = useState(null);
  const [thoughtAnswer, setThoughtAnswer] = useState('');
  const [isSubmittingThought, setIsSubmittingThought] = useState(false);
  const [recentAchievements, setRecentAchievements] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [summaryRes, challengesRes, thoughtRes, achRes, weeklyRes] = await Promise.all([
        progressAPI.getSummary(),
        challengesAPI.getToday(),
        thoughtsAPI.getToday(),
        achievementsAPI.getUserAchievements(),
        progressAPI.getWeekly()
      ]);

      if (summaryRes.data.success) {
        setSummaryData(summaryRes.data);
        if (summaryRes.data.user) {
          updateUser(summaryRes.data.user);
        }
      }

      if (challengesRes.data.success) {
        setTodayChallenges(challengesRes.data.challenges || []);
      }

      if (thoughtRes.data.success) {
        setTodayThought(thoughtRes.data);
        if (thoughtRes.data.thought?.answer) {
          setThoughtAnswer(thoughtRes.data.thought.answer);
        }
      }

      if (achRes.data.success) {
        setRecentAchievements(achRes.data.achievements?.slice(0, 3) || []);
      }

      if (weeklyRes.data.success) {
        setWeeklyData(weeklyRes.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showToast({
        title: 'Error loading dashboard',
        message: 'Could not fetch latest progress metrics. Please refresh.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleThoughtSubmit = async (e) => {
    e.preventDefault();
    if (!thoughtAnswer.trim()) return;

    setIsSubmittingThought(true);
    try {
      const res = await thoughtsAPI.submit({
        question: todayThought?.question,
        answer: thoughtAnswer.trim()
      });

      if (res.data.success) {
        showToast({
          title: 'Reflection Saved! 🧠',
          message: res.data.pointsAwarded > 0 ? '+10 XP earned for today’s reflection.' : 'Answer updated.',
          type: 'success',
          xp: res.data.pointsAwarded || null
        });

        if (res.data.user) {
          updateUser(res.data.user);
        }

        // Check for achievements
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

        fetchDashboardData();
      }
    } catch (error) {
      showToast({
        title: 'Submission failed',
        message: error.response?.data?.message || 'Could not save reflection.',
        type: 'error'
      });
    } finally {
      setIsSubmittingThought(false);
    }
  };

  const handleChallengeAction = (category) => {
    switch (category) {
      case 'Speaking':
        navigate('/speaking');
        break;
      case 'Vocabulary':
        navigate('/vocabulary');
        break;
      case 'Grammar':
        navigate('/grammar');
        break;
      case 'Productivity':
      default:
        navigate('/tasks');
        break;
    }
  };

  if (loading && !summaryData) {
    return (
      <div className="space-y-6">
        <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  const levelInfo = user?.levelInfo || {
    level: user?.level || 'Beginner',
    progressPercent: 65,
    minXp: 200,
    maxXp: 500
  };

  const todayProgress = summaryData?.today || {
    progressPercent: 50,
    completedCount: 2,
    dailyTarget: 4
  };

  const recommendation = summaryData?.recommendation;

  return (
    <div className="space-y-8 pb-10">
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-600/15">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-indigo-100 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Member'} 👋
          </h1>
          <p className="text-sm sm:text-base text-indigo-100/90 mt-1 max-w-xl">
            Ready to Level Up today? Build your streak and crush today's daily focus challenges.
          </p>
        </div>

        {/* Level Banner Widget */}
        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 min-w-[240px]">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Trophy className="w-4 h-4" />
              Level {user?.level || 'Explorer'}
            </span>
            <span className="text-white/90">{user?.totalPoints || 0} XP</span>
          </div>
          <ProgressBar
            value={levelInfo.progressPercent || 0}
            max={100}
            showPercent={false}
            color="orange"
            size="sm"
          />
          <div className="flex justify-between text-[11px] text-white/70 mt-1">
            <span>{levelInfo.minXp || 0} XP</span>
            <span>{levelInfo.maxXp || 500} XP Next Tier</span>
          </div>
        </div>
      </div>

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current Streak"
          value={`${user?.currentStreak || 0} Days`}
          subtitle={`Best: ${user?.longestStreak || 0} days recorded`}
          icon={Flame}
          color="orange"
        />
        <StatCard
          title="Total XP"
          value={user?.totalPoints || 0}
          subtitle="Keep completing to climb"
          icon={Star}
          color="indigo"
        />
        <StatCard
          title="Challenges Done"
          value={summaryData?.totalCompleted || 0}
          subtitle="Activities finished all-time"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Current Rank"
          value={user?.level || 'Beginner'}
          subtitle={`Tier progression active`}
          icon={Trophy}
          color="purple"
        />
      </div>

      {/* Today's Progress Bar Widget */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 border border-slate-100 dark:border-slate-700/60 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Today's Daily Target
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Complete {todayProgress.dailyTarget} activities to hit 100% daily momentum.
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {todayProgress.progressPercent}%
            </span>
            <span className="text-xs text-slate-400 block font-medium">
              {todayProgress.completedCount} of {todayProgress.dailyTarget} completed
            </span>
          </div>
        </div>

        <ProgressBar
          value={todayProgress.progressPercent}
          max={100}
          showPercent={false}
          size="lg"
          color="indigo"
        />
      </div>

      {/* Personalized Recommendation Banner */}
      {recommendation && (
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-indigo-500/10 dark:from-amber-950/40 dark:to-indigo-950/40 rounded-3xl p-6 border border-amber-300/80 dark:border-amber-700/60 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-amber-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Recommended For You
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
                  +{recommendation.points} XP
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {recommendation.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {recommendation.description}
              </p>
            </div>
          </div>

          <Link
            to={recommendation.actionUrl}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition flex items-center gap-1.5 flex-shrink-0"
          >
            Start Challenge
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Today's Challenges Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              Today's Challenges
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Quick bite-sized activities designed to sharpen your communication and habits.
            </p>
          </div>
          <Link
            to="/challenges"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            View All
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Speaking Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/60 shadow-subtle hover:shadow-card transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-lg border border-rose-100 dark:border-rose-900">
                  <Mic className="w-3.5 h-3.5" />
                  Speaking Challenge
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3 fill-indigo-500" />
                  +20 XP
                </span>
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                1-Minute Impromptu Speech
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Pick a spontaneous topic and speak continuously for 60 seconds with a real timer.
              </p>
            </div>
            <button
              onClick={() => handleChallengeAction('Speaking')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              Start Challenge
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Vocabulary Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/60 shadow-subtle hover:shadow-card transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-100 dark:border-amber-900">
                  <BookOpen className="w-3.5 h-3.5" />
                  Vocabulary Power
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3 fill-indigo-500" />
                  +10 XP
                </span>
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                Word of the Day & Quiz
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Explore sophisticated words, review sentences, and test yourself on definitions.
              </p>
            </div>
            <button
              onClick={() => handleChallengeAction('Vocabulary')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              Learn Words
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Grammar Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/60 shadow-subtle hover:shadow-card transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-900">
                  <FileEdit className="w-3.5 h-3.5" />
                  Grammar Exercise
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3 fill-indigo-500" />
                  +10 XP
                </span>
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                Sentence Accuracy Booster
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Solve grammar questions, discover common pitfalls, and read instant explanations.
              </p>
            </div>
            <button
              onClick={() => handleChallengeAction('Grammar')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              Start Exercise
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Thought of the Day Section */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 border border-slate-100 dark:border-slate-700/60 shadow-subtle">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Brain className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Thought of the Day
            </h2>
          </div>
          <span className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/40">
            <Star className="w-3 h-3 fill-indigo-500" />
            +10 XP
          </span>
        </div>

        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4 italic">
          "{todayThought?.question || 'What is one thing you want to improve today?'}"
        </p>

        <form onSubmit={handleThoughtSubmit} className="space-y-3">
          <textarea
            rows="2"
            value={thoughtAnswer}
            onChange={(e) => setThoughtAnswer(e.target.value)}
            placeholder="Type your reflection here (e.g. I want to articulate my ideas more concisely)..."
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmittingThought || !thoughtAnswer.trim()}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition disabled:opacity-50"
            >
              {isSubmittingThought ? 'Saving...' : todayThought?.isAnswered ? 'Update Reflection' : 'Submit Reflection (+10 XP)'}
            </button>
          </div>
        </form>
      </div>

      {/* Weekly Activity Chart & Recent Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/60 shadow-subtle">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                Weekly Activity
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Number of activities completed over the past 7 days
              </p>
            </div>
            <Link to="/progress" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              Detailed Analytics
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="activities" fill="#6366f1" radius={[6, 6, 0, 0]} name="Activities Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/60 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                Recent Badges
              </h2>
              <Link to="/achievements" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                View All
              </Link>
            </div>

            {recentAchievements.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  No unlocked achievements yet. Complete daily activities to earn your first badge!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAchievements.map((item, index) => {
                  const ach = item.achievementId || item;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50/40 dark:bg-slate-700/40 border border-amber-200/60 dark:border-slate-600/60"
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {ach.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {ach.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60">
            <Link
              to="/achievements"
              className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold text-center block transition"
            >
              Explore All Badges
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
