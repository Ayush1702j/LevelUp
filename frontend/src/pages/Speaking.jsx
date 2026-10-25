import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { challengesAPI, progressAPI } from '../services/api';
import {
  Mic,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Volume2,
  Star,
  RefreshCw,
  Lightbulb,
  Award
} from 'lucide-react';

const TOPICS = [
  {
    topic: 'Describe Your Favorite Technology',
    prompt: 'Talk about a technology, app, or gadget you use every single day. Explain why you enjoy it and how it enhances your productivity.',
    category: 'Technology'
  },
  {
    topic: 'A Significant Challenge You Overcame',
    prompt: 'Discuss a time when something went wrong or felt difficult. What steps did you take to solve it and what was the lesson?',
    category: 'Experience'
  },
  {
    topic: 'Review a Book, Movie, or Story',
    prompt: 'Deliver an engaging review without major spoilers. Describe the characters, theme, and why you would recommend it.',
    category: 'Storytelling'
  },
  {
    topic: 'Your Ideal Morning Routine',
    prompt: 'Describe how your ideal productive morning unfolds from waking up to starting your first deep-work task.',
    category: 'Lifestyle'
  },
  {
    topic: 'Explain an API Simply to a Non-Technical Friend',
    prompt: 'Use clear analogies (like a restaurant menu and waiter) to explain what an API is and why software uses them.',
    category: 'Technical'
  },
  {
    topic: 'Pitch Your Dream Business or Application',
    prompt: 'You have 60 seconds to introduce a problem, your unique product solution, and why users will love it.',
    category: 'Pitch'
  }
];

const Speaking = () => {
  const { updateUser } = useAuth();
  const { showToast } = useToast();

  const [topicIndex, setTopicIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [speakingChallengeId, setSpeakingChallengeId] = useState(null);

  const timerRef = useRef(null);

  const currentTopic = TOPICS[topicIndex];

  // Fetch speaking challenge from DB if available
  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await challengesAPI.getAll({ category: 'Speaking' });
        if (res.data.success && res.data.challenges?.length > 0) {
          setSpeakingChallengeId(res.data.challenges[0]._id);
        }
      } catch (err) {
        console.error('Failed to get speaking challenge ID:', err);
      }
    };
    fetchChallenge();
  }, []);

  // Countdown timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsActive(false);
            setIsCompleted(true);
            showToast({
              title: "Time's Up! 🎉",
              message: 'Great job speaking continuously for 60 seconds!',
              type: 'success'
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft, showToast]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(60);
    setIsCompleted(false);
  };

  const handleNextTopic = () => {
    handleReset();
    setTopicIndex((prev) => (prev + 1) % TOPICS.length);
  };

  const handleCompleteChallenge = async () => {
    setIsSaving(true);
    try {
      let res;
      if (speakingChallengeId) {
        res = await challengesAPI.complete(speakingChallengeId);
      } else {
        // Fallback to progress API
        res = await challengesAPI.getAll({ category: 'Speaking' });
        if (res.data.challenges?.[0]?._id) {
          res = await challengesAPI.complete(res.data.challenges[0]._id);
        }
      }

      if (res && res.data.success) {
        showToast({
          title: 'Speaking Challenge Completed! 🎉',
          message: '+20 XP awarded to your profile!',
          type: 'success',
          xp: 20
        });

        if (res.data.user) {
          updateUser(res.data.user);
        }

        if (res.data.streakIncreased) {
          showToast({
            title: '🔥 Daily Streak Active!',
            message: `Current streak: ${res.data.currentStreak} Days`,
            type: 'streak'
          });
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
      } else {
        showToast({
          title: 'Challenge Saved! 🎉',
          message: 'Great practice session completed!',
          type: 'success',
          xp: 20
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not record speaking session.';
      showToast({
        title: 'Already recorded today',
        message: msg,
        type: 'info'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Format seconds into MM:SS
  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const progressPercent = Math.round(((60 - timeLeft) / 60) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-700/60 shadow-subtle text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Mic className="w-3.5 h-3.5" />
            Speaking Confidence Trainer
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            1-Minute Speaking Challenge
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Train spontaneous articulation. Speak continuously without stopping until the timer rings.
          </p>
        </div>

        <span className="inline-flex items-center justify-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-3.5 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-900/40">
          <Star className="w-3.5 h-3.5 fill-indigo-500" />
          +20 XP Reward
        </span>
      </div>

      {/* Main Speaking Stage Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-slate-100 dark:border-slate-700/60 shadow-subtle">
        {/* Topic Banner */}
        <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-700/60">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Topic {topicIndex + 1} of {TOPICS.length} · {currentTopic.category}
          </span>
          <button
            onClick={handleNextTopic}
            className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Switch Topic
          </button>
        </div>

        <div className="py-6 text-center max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
            "{currentTopic.topic}"
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            {currentTopic.prompt}
          </p>
        </div>

        {/* Big Circular Countdown Display */}
        <div className="my-8 flex flex-col items-center justify-center">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
            {/* SVG circle progress ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-slate-100 dark:stroke-slate-700"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-indigo-600 dark:stroke-indigo-500 transition-all duration-1000 ease-linear"
                strokeWidth="6"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * progressPercent) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Timer Digits */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className={`font-mono text-4xl sm:text-5xl font-black tracking-tight ${
                timeLeft <= 10 && timeLeft > 0 ? 'text-rose-600 animate-pulse' : 'text-slate-900 dark:text-white'
              }`}>
                {formatTime(timeLeft)}
              </span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                {isActive ? 'Speaking Now...' : isCompleted ? "Time's Up! 🎉" : 'Ready to speak'}
              </span>
            </div>
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 max-w-md mx-auto">
          {!isActive ? (
            <button
              onClick={handleStart}
              className="flex-1 min-w-[120px] py-3.5 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              {timeLeft === 60 ? 'Start (01:00)' : 'Resume'}
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex-1 min-w-[120px] py-3.5 px-5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md shadow-amber-500/20 transition flex items-center justify-center gap-2"
            >
              <Pause className="w-4 h-4 fill-white" />
              Pause
            </button>
          )}

          <button
            onClick={handleReset}
            className="py-3.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-sm transition flex items-center justify-center gap-1.5"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>

          {(isCompleted || timeLeft <= 15) && (
            <button
              onClick={handleCompleteChallenge}
              disabled={isSaving}
              className="w-full mt-2 py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSaving ? 'Awarding XP...' : 'Complete Challenge (+20 XP)'}
            </button>
          )}
        </div>
      </div>

      {/* Speaking Advice & Tips */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 border border-slate-100 dark:border-slate-700/60 shadow-subtle">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          Professional Speaking Tips
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-300">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">1. Structure with STAR</h4>
            <p>Situation, Task, Action, Result. Having a mental template keeps you from rambling or getting stuck.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">2. Embrace The Pause</h4>
            <p>Instead of saying "um" or "like", take a deliberate 1-second breath. Pauses convey authority and composure.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">3. Clear Enunciation</h4>
            <p>Do not rush. Pronounce word endings clearly (-ed, -s, -ing) to make your speech sound polished and confident.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Speaking;
