import React from 'react';
import { Star, CheckCircle2, ArrowRight, Mic, BookOpen, FileEdit, CheckSquare, Zap } from 'lucide-react';

const ChallengeCard = ({ challenge, onStart, onComplete, isCompleting = false }) => {
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Speaking':
        return <Mic className="w-4 h-4 text-rose-500" />;
      case 'Vocabulary':
        return <BookOpen className="w-4 h-4 text-amber-500" />;
      case 'Grammar':
        return <FileEdit className="w-4 h-4 text-emerald-500" />;
      case 'Productivity':
        return <CheckSquare className="w-4 h-4 text-indigo-500" />;
      default:
        return <Zap className="w-4 h-4 text-purple-500" />;
    }
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'Hard':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800';
      default:
        return 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200';
    }
  };

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between ${
      challenge.isCompletedToday
        ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/10'
        : 'border-slate-100 dark:border-slate-700/60 shadow-subtle hover:shadow-card hover:border-slate-200 dark:hover:border-slate-600'
    }`}>
      <div>
        {/* Card Header badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200">
            {getCategoryIcon(challenge.category)}
            <span>{challenge.category}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${getDifficultyColor(challenge.difficulty)}`}>
              {challenge.difficulty}
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-900/40">
              <Star className="w-3 h-3 fill-indigo-500 text-indigo-500" />
              +{challenge.points || 20} XP
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2 leading-snug">
          {challenge.title}
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          {challenge.description}
        </p>

        {challenge.promptDetails && (
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 text-[11px] text-slate-500 dark:text-slate-400 mb-4 italic">
            💡 {challenge.promptDetails}
          </div>
        )}
      </div>

      {/* Action button */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
        {challenge.isCompletedToday ? (
          <div className="flex items-center justify-center gap-2 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-4 h-4" />
            Completed Today
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {onStart && (
              <button
                onClick={() => onStart(challenge)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white transition"
              >
                Start Challenge
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {onComplete && (
              <button
                onClick={() => onComplete(challenge._id)}
                disabled={isCompleting}
                className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition disabled:opacity-50"
              >
                {isCompleting ? 'Saving...' : 'Mark Done'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengeCard;
