import React, { useState, useEffect } from 'react';
import { vocabularyAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Star,
  RefreshCw,
  Volume2,
  Sparkles,
  ArrowRight,
  Search,
  Award
} from 'lucide-react';

const Vocabulary = () => {
  const { updateUser } = useAuth();
  const { showToast } = useToast();

  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [quizResult, setQuizResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState({ attempted: 0, correct: 0, xpEarned: 0 });
  const [activeTab, setActiveTab] = useState('quiz'); // 'quiz' or 'library'
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchWords = async () => {
    try {
      setLoading(true);
      const res = await vocabularyAPI.getAll({ limit: 50 });
      if (res.data.success && res.data.words?.length > 0) {
        setWords(res.data.words);
        setCurrentWord(res.data.words[0]);
      }
    } catch (err) {
      console.error('Failed to load words:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const handleNextWord = () => {
    if (words.length <= 1) return;
    const currentIndex = words.findIndex((w) => w._id === currentWord?._id);
    const nextIndex = (currentIndex + 1) % words.length;
    setCurrentWord(words[nextIndex]);
    setSelectedOption('');
    setQuizResult(null);
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOption || !currentWord || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await vocabularyAPI.submitAnswer(currentWord._id, selectedOption);

      if (res.data.success) {
        setQuizResult({
          isCorrect: res.data.isCorrect,
          correctAnswer: res.data.correctAnswer,
          meaning: res.data.meaning,
          example: res.data.example
        });

        setStats((prev) => ({
          attempted: prev.attempted + 1,
          correct: prev.correct + (res.data.isCorrect ? 1 : 0),
          xpEarned: prev.xpEarned + (res.data.pointsAwarded || 0)
        }));

        if (res.data.isCorrect) {
          showToast({
            title: 'Correct Answer! 🎉',
            message: `+10 XP earned for learning ${currentWord.word}`,
            type: 'success',
            xp: 10
          });
        } else {
          showToast({
            title: 'Not quite right',
            message: `The correct answer was: ${res.data.correctAnswer}`,
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
        title: 'Quiz error',
        message: err.response?.data?.message || 'Could not submit quiz.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredWords = words.filter(
    (w) =>
      w.word.toLowerCase().includes(search.toLowerCase()) ||
      w.meaning.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-700/60 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            Vocabulary Mastery
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Word Builder
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Expand your communication toolkit with high-value words, contextual examples, and instant knowledge quizzes.
          </p>
        </div>

        {/* Quiz Performance Bar */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-700">
          <div className="text-center px-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Attempted</span>
            <div className="text-sm font-extrabold text-slate-800 dark:text-white">{stats.attempted}</div>
          </div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-600" />
          <div className="text-center px-2">
            <span className="text-[10px] font-bold text-emerald-500 uppercase">Correct</span>
            <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{stats.correct}</div>
          </div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-600" />
          <div className="text-center px-2">
            <span className="text-[10px] font-bold text-indigo-500 uppercase">XP</span>
            <div className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">+{stats.xpEarned}</div>
          </div>
        </div>
      </div>

      {/* Tabs (Quiz & Word of the Day vs Library) */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'quiz'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Daily Flashcard & Quiz
        </button>
        <button
          onClick={() => setActiveTab('library')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'library'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Vocabulary Bank ({words.length})
        </button>
      </div>

      {activeTab === 'quiz' ? (
        <div className="space-y-6">
          {/* Flashcard Word Card */}
          {currentWord && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-700/60 shadow-subtle">
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Word of the Day · {currentWord.difficulty}
                </span>
                <button
                  onClick={handleNextWord}
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Next Word
                </button>
              </div>

              <div className="text-center py-4">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                  {currentWord.word}
                </h2>
                {currentWord.pronunciation && (
                  <p className="text-sm font-mono text-indigo-600 dark:text-indigo-400 mt-1">
                    {currentWord.pronunciation}
                  </p>
                )}

                <div className="mt-5 max-w-xl mx-auto p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 text-left space-y-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Meaning
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
                      {currentWord.meaning}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Example
                    </span>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic">
                      "{currentWord.example}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Quiz Mode */}
          {currentWord && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-700/60 shadow-subtle">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Quick Quiz: What does <span className="text-indigo-600 dark:text-indigo-400">"{currentWord.word}"</span> mean?
                </h3>
                <span className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3 fill-indigo-500" />
                  +10 XP
                </span>
              </div>

              <form onSubmit={handleQuizSubmit} className="space-y-3">
                {currentWord.options?.map((option, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isSelected = selectedOption === option;

                  let optionStyle = 'bg-slate-50 dark:bg-slate-700/40 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700';

                  if (quizResult) {
                    if (option === quizResult.correctAnswer) {
                      optionStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-900 dark:text-emerald-200';
                    } else if (isSelected && !quizResult.isCorrect) {
                      optionStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 text-rose-900 dark:text-rose-200';
                    }
                  } else if (isSelected) {
                    optionStyle = 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20';
                  }

                  return (
                    <label
                      key={idx}
                      className={`flex items-center gap-3.5 p-3.5 rounded-2xl border cursor-pointer transition-all ${optionStyle}`}
                    >
                      <input
                        type="radio"
                        name="vocabOption"
                        value={option}
                        disabled={Boolean(quizResult)}
                        checked={isSelected}
                        onChange={() => setSelectedOption(option)}
                        className="sr-only"
                      />
                      <span className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {letter}
                      </span>
                      <span className="text-xs sm:text-sm font-medium flex-1">
                        {option}
                      </span>
                      {quizResult && option === quizResult.correctAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      )}
                      {quizResult && isSelected && !quizResult.isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                      )}
                    </label>
                  );
                })}

                <div className="pt-3 flex items-center justify-between">
                  {!quizResult ? (
                    <button
                      type="submit"
                      disabled={isSubmitting || !selectedOption}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition disabled:opacity-50"
                    >
                      {isSubmitting ? 'Evaluating...' : 'Submit Answer'}
                    </button>
                  ) : (
                    <div className="w-full flex items-center justify-between">
                      <span className={`text-xs font-bold ${quizResult.isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {quizResult.isCorrect ? 'Correct! +10 XP earned 🎉' : 'Incorrect choice.'}
                      </span>
                      <button
                        type="button"
                        onClick={handleNextWord}
                        className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5"
                      >
                        Try Next Word
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      ) : (
        /* Vocabulary Bank List */
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-700/60 shadow-subtle space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search vocabulary words or meanings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {filteredWords.map((item) => (
              <div
                key={item._id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase">
                    {item.word}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300">
                    {item.difficulty}
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-200 font-medium">
                  {item.meaning}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                  "{item.example}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Vocabulary;
