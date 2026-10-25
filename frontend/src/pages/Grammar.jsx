import React, { useState, useEffect } from 'react';
import { grammarAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  FileEdit,
  CheckCircle2,
  XCircle,
  Star,
  RefreshCw,
  HelpCircle,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

const Grammar = () => {
  const { updateUser } = useAuth();
  const { showToast } = useToast();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Performance metrics
  const [stats, setStats] = useState({
    attempted: 0,
    correct: 0,
    accuracy: 100,
    xpEarned: 0
  });

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await grammarAPI.getAll({ limit: 30 });
      if (res.data.success && res.data.questions?.length > 0) {
        setQuestions(res.data.questions);
      }
    } catch (err) {
      console.error('Failed to load grammar questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const currentQuestion = questions[currentIndex];

  const handleNext = () => {
    if (questions.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % questions.length);
    setSelectedOption('');
    setResult(null);
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!selectedOption || !currentQuestion || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await grammarAPI.submitAnswer(currentQuestion._id, selectedOption);

      if (res.data.success) {
        setResult({
          isCorrect: res.data.isCorrect,
          correctAnswer: res.data.correctAnswer,
          explanation: res.data.explanation
        });

        const newAttempted = stats.attempted + 1;
        const newCorrect = stats.correct + (res.data.isCorrect ? 1 : 0);
        const newAccuracy = Math.round((newCorrect / newAttempted) * 100);

        setStats({
          attempted: newAttempted,
          correct: newCorrect,
          accuracy: newAccuracy,
          xpEarned: stats.xpEarned + (res.data.pointsAwarded || 0)
        });

        if (res.data.isCorrect) {
          showToast({
            title: 'Correct Grammar! ✍️',
            message: '+10 XP added to your total score.',
            type: 'success',
            xp: 10
          });
        } else {
          showToast({
            title: 'Grammar Miss',
            message: `Review the rule explanation below.`,
            type: 'error'
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
      }
    } catch (err) {
      showToast({
        title: 'Error submitting answer',
        message: err.response?.data?.message || 'Could not evaluate grammar answer.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-700/60 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <FileEdit className="w-3.5 h-3.5" />
            Grammar Precision
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Grammar Challenge
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Test your knowledge of sentence structures, modifiers, verb tenses, and prepositions.
          </p>
        </div>

        {/* Live Metrics */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-700">
          <div className="text-center px-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Attempted</span>
            <div className="text-sm font-extrabold text-slate-800 dark:text-white">{stats.attempted}</div>
          </div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-600" />
          <div className="text-center px-2">
            <span className="text-[10px] font-bold text-emerald-500 uppercase">Accuracy</span>
            <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{stats.accuracy}%</div>
          </div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-600" />
          <div className="text-center px-2">
            <span className="text-[10px] font-bold text-indigo-500 uppercase">XP</span>
            <div className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">+{stats.xpEarned}</div>
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      {currentQuestion ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-9 border border-slate-100 dark:border-slate-700/60 shadow-subtle">
          <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-700/60 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Question {currentIndex + 1} of {questions.length} · {currentQuestion.category}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                {currentQuestion.difficulty}
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-full">
                <Star className="w-3 h-3 fill-indigo-500" />
                +10 XP
              </span>
            </div>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed mb-6">
            {currentQuestion.question}
          </h2>

          <form onSubmit={handleSubmitAnswer} className="space-y-3">
            {currentQuestion.options?.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = selectedOption === opt;

              let optionStyle = 'bg-slate-50 dark:bg-slate-700/40 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700';

              if (result) {
                if (opt === result.correctAnswer) {
                  optionStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-900 dark:text-emerald-200';
                } else if (isSelected && !result.isCorrect) {
                  optionStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 text-rose-900 dark:text-rose-200';
                }
              } else if (isSelected) {
                optionStyle = 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20';
              }

              return (
                <label
                  key={idx}
                  className={`flex items-center gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${optionStyle}`}
                >
                  <input
                    type="radio"
                    name="grammarOption"
                    value={opt}
                    disabled={Boolean(result)}
                    checked={isSelected}
                    onChange={() => setSelectedOption(opt)}
                    className="sr-only"
                  />
                  <span className="w-7 h-7 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {letter}
                  </span>
                  <span className="text-xs sm:text-sm font-medium flex-1">
                    {opt}
                  </span>
                  {result && opt === result.correctAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  )}
                  {result && isSelected && !result.isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                  )}
                </label>
              );
            })}

            {/* Explanation card after submit */}
            {result && (
              <div className={`p-4 rounded-2xl border mt-4 space-y-1 animate-in fade-in ${
                result.isCorrect
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                  : 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100'
              }`}>
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <HelpCircle className="w-4 h-4" />
                  Grammar Rule Explanation
                </div>
                <p className="text-xs leading-relaxed">
                  {result.explanation}
                </p>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between">
              {!result ? (
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedOption}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Checking...' : 'Submit Answer'}
                </button>
              ) : (
                <div className="w-full flex items-center justify-between">
                  <span className={`text-xs font-bold ${result.isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {result.isCorrect ? 'Awesome! +10 XP earned 🎉' : 'Review the note above.'}
                  </span>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5"
                  >
                    Next Question
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
          <FileEdit className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No grammar questions loaded yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default Grammar;
