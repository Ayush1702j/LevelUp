import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mic,
  BookOpen,
  FileEdit,
  CheckSquare,
  Flame,
  BarChart2,
  Trophy,
  Star,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: Mic,
      color: 'rose',
      title: 'Speaking Practice',
      description: 'Overcome fear and boost English fluency with timed 1-minute impromptu speech challenges.'
    },
    {
      icon: BookOpen,
      color: 'amber',
      title: 'Vocabulary Power',
      description: 'Master practical, high-impact English words with pronunciation, examples, and instant quizzes.'
    },
    {
      icon: FileEdit,
      color: 'emerald',
      title: 'Grammar Precision',
      description: 'Strengthen sentence accuracy and professional expression with clear explanations.'
    },
    {
      icon: CheckSquare,
      color: 'indigo',
      title: 'Daily Tasks Planner',
      description: 'Prioritize your top coding, study, and life tasks. Turn intentions into executable wins.'
    },
    {
      icon: Flame,
      color: 'orange',
      title: 'Habit Tracking',
      description: 'Build indestructible consistency with 7-day visual grids, streaks, and milestone alerts.'
    },
    {
      icon: BarChart2,
      color: 'blue',
      title: 'Progress Analytics',
      description: 'Watch your skills compound through real-time charts, category balance, and XP curves.'
    }
  ];

  const steps = [
    { step: '01', title: 'Choose Your Challenge', desc: 'Select from daily speaking, vocabulary, grammar, or focus activities tailored to your day.' },
    { step: '02', title: 'Complete Daily Activity', desc: 'Engage for just 5 to 15 minutes to sharpen your articulation, mindset, and habits.' },
    { step: '03', title: 'Earn XP & Level Up', desc: 'Collect XP for every completed task, climb from Beginner to LevelUp Master, and unlock badges.' },
    { step: '04', title: 'Protect Your Streak', desc: 'Stack consecutive active days to cement lifelong habits that withstand distractions.' },
    { step: '05', title: 'Track Your Growth', desc: 'Inspect weekly activity graphs and recommendations designed to keep you improving.' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
              <Zap className="w-5 h-5 fill-white text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
              LevelUp
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-600/20 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            Small habits. Better communication. Stronger you.
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.15]">
            Turn Personal Growth into <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 bg-clip-text text-transparent">Measurable Wins</span>.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Improve your English speaking confidence, vocabulary, grammar, daily productivity, and habits through simple daily challenges and gamified progression.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-xl shadow-indigo-600/25 transition flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-base border border-slate-200 dark:border-slate-700 transition shadow-subtle flex items-center justify-center gap-2"
            >
              Try Demo Account
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-xs border border-slate-200 dark:border-slate-700 shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">100%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Free & Open API Ready</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-xs border border-slate-200 dark:border-slate-700 shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-orange-500">7+ Days</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Streak Momentum System</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-xs border border-slate-200 dark:border-slate-700 shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-500">60s</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Daily Speaking Sprint</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-xs border border-slate-200 dark:border-slate-700 shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-500">5 Tiers</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Gamified Levels & XP</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-100/50 dark:bg-slate-800/30 border-y border-slate-200/60 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
              Complete Personal Growth Suite
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Everything you need to build consistency and communicate with poise.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/60 shadow-subtle hover:shadow-card hover:-translate-y-1 transition duration-200"
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5 border border-indigo-100 dark:border-indigo-900/40">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {feat.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
              Simple 5-Step System
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              How LevelUp Transforms Your Daily Habits
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700/60 shadow-subtle flex flex-col justify-between"
              >
                <div>
                  <span className="text-3xl font-black text-indigo-600/30 dark:text-indigo-400/30">
                    {item.step}
                  </span>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white mt-3 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gamification & Analytics Preview */}
      <section className="py-20 bg-gradient-to-b from-indigo-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-400/30">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                Gamification Architecture
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-snug">
                Earn XP, Level Up, and Unlock Legendary Badges.
              </h3>
              <p className="mt-4 text-slate-300 text-base leading-relaxed">
                Consistency shouldn’t feel like a chore. LevelUp transforms daily self-discipline into a satisfying reward loop.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm">Streak Protection & Multipliers</h5>
                    <p className="text-xs text-slate-400">Complete at least one daily activity to preserve your streak.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm">Real XP Tier Milestones</h5>
                    <p className="text-xs text-slate-400">Progress through Beginner, Explorer, Consistent, Achiever, to LevelUp Master.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm">Rule-Based Personalized Coach</h5>
                    <p className="text-xs text-slate-400">Smart recommendations point you toward your weakest communication area.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual preview card */}
            <div className="bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl backdrop-blur-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                    AM
                  </div>
                  <div>
                    <h4 className="font-bold text-base">Alex Mercer</h4>
                    <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5" /> Explorer · Level 2
                    </span>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-orange-400 bg-orange-950/60 px-3 py-1.5 rounded-full border border-orange-800">
                  <Flame className="w-4 h-4 fill-orange-500" />
                  7 Day Streak
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                  <span>Level Progress</span>
                  <span>450 / 500 XP (90%)</span>
                </div>
                <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full w-[90%]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-700/50 border border-slate-600">
                  <span className="text-xs text-slate-400">Challenges Done</span>
                  <div className="text-xl font-bold mt-1 text-white">24</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-700/50 border border-slate-600">
                  <span className="text-xs text-slate-400">Habits Maintained</span>
                  <div className="text-xl font-bold mt-1 text-emerald-400">4 Active</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Ready to Level Up?
          </h3>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Start your personal growth journey today. Small daily actions create massive long-term results.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/register"
              className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-xl shadow-indigo-600/25 transition flex items-center gap-2"
            >
              Get Started Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">LevelUp</span>
            <span>— Small habits. Better communication. Stronger you.</span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <a href="#features" className="hover:text-indigo-600 transition">Features</a>
            <a href="#about" className="hover:text-indigo-600 transition">About</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition">GitHub</a>
            <span className="hover:text-indigo-600 transition cursor-pointer">Privacy</span>
          </div>

          <div>
            &copy; {new Date().getFullYear()} LevelUp Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
