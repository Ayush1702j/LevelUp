import React, { useState, useEffect } from 'react';
import { progressAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProgressBar from '../components/common/ProgressBar';
import { CardSkeleton } from '../components/common/SkeletonLoader';
import {
  BarChart2,
  TrendingUp,
  Star,
  Flame,
  Trophy,
  PieChart as PieIcon,
  Layers,
  Award
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

const COLORS = ['#f43f5e', '#f59e0b', '#10b981', '#6366f1', '#ec4899', '#8b5cf6'];

const Progress = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [summaryRes, weeklyRes, catRes] = await Promise.all([
          progressAPI.getSummary(),
          progressAPI.getWeekly(),
          progressAPI.getCategory()
        ]);

        if (summaryRes.data.success) {
          setSummary(summaryRes.data);
        }
        if (weeklyRes.data.success) {
          setWeekly(weeklyRes.data.data || []);
        }
        if (catRes.data.success) {
          setCategoryData(catRes.data.data || []);
        }
      } catch (err) {
        console.error('Failed to load progress analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading && !summary) {
    return (
      <div className="space-y-6">
        <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  // Calculate category completion ratios for display
  const totalActivities = summary?.totalCompleted || 1;
  const categoryMap = summary?.categoryMap || {};

  const categoriesOverview = [
    { name: 'Speaking', count: categoryMap['Speaking'] || 0, color: 'rose' },
    { name: 'Vocabulary', count: categoryMap['Vocabulary'] || 0, color: 'amber' },
    { name: 'Grammar', count: categoryMap['Grammar'] || 0, color: 'emerald' },
    { name: 'Productivity', count: categoryMap['Productivity'] || 0, color: 'indigo' },
    { name: 'Habits', count: categoryMap['Habits'] || 0, color: 'orange' },
  ].map(cat => ({
    ...cat,
    percent: Math.min(100, Math.round((cat.count / Math.max(1, totalActivities)) * 100 * 2.5))
  }));

  const overallProgress = Math.min(
    100,
    Math.round(((user?.totalPoints || 0) / (user?.levelInfo?.maxXp || 500)) * 100)
  );

  // Prepare Pie chart data filtering out 0 counts
  const pieData = categoryData
    .filter((c) => c.count > 0)
    .map((c) => ({ name: c.category, value: c.count }));

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-700/60 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <BarChart2 className="w-3.5 h-3.5" />
            Performance & Analytics
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Progress Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Real-time breakdown of your learning consistency, XP velocity, category balance, and habit streaks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
            {summary?.totalCompleted || 0} Total Activities Recorded
          </span>
        </div>
      </div>

      {/* Overall Progress & Category Performance Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Tier Dial Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/60 shadow-subtle flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Overall Progress
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Milestone completion towards next Level tier
            </p>

            <div className="flex items-center justify-center my-4">
              <div className="text-center">
                <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
                  {overallProgress}%
                </div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
                  Tier Completion
                </div>
              </div>
            </div>

            <ProgressBar value={overallProgress} max={100} showPercent={false} size="lg" color="indigo" />
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Rank: {user?.level || 'Explorer'}</span>
            <span>{user?.totalPoints || 0} XP Earned</span>
          </div>
        </div>

        {/* Category Performance Breakdown */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/60 shadow-subtle">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Category Performance
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            Activity intensity distributed across your daily growth pillars
          </p>

          <div className="space-y-4">
            {categoriesOverview.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>{item.name}</span>
                  <span>{item.percent}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percent}%`,
                      backgroundColor:
                        item.name === 'Speaking'
                          ? '#f43f5e'
                          : item.name === 'Vocabulary'
                          ? '#f59e0b'
                          : item.name === 'Grammar'
                          ? '#10b981'
                          : item.name === 'Productivity'
                          ? '#6366f1'
                          : '#ec4899'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Grid: Weekly Activity & XP Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/60 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Weekly Activity Frequency
              </h3>
              <p className="text-xs text-slate-400">
                Daily completed challenges over the last 7 days
              </p>
            </div>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <Bar dataKey="activities" fill="#6366f1" radius={[6, 6, 0, 0]} name="Completed Activities" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* XP Growth Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/60 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Daily XP Velocity
              </h3>
              <p className="text-xs text-slate-400">
                XP earned per day across all actions
              </p>
            </div>
            <Star className="w-4 h-4 text-amber-500" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weekly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <Line
                  type="monotone"
                  dataKey="xp"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#f59e0b' }}
                  name="XP Earned"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Category Distribution Pie Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-700/60 shadow-subtle">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-indigo-500" />
              Focus Distribution by Category
            </h3>
            <p className="text-xs text-slate-400">
              Proportion of completed activities in your personal database
            </p>
          </div>
        </div>

        {pieData.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400">
            Complete activities to populate your focus distribution breakdown.
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;
