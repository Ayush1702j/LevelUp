import React from 'react';
import { Flame, Trophy, Check, Edit2, Trash2, Star } from 'lucide-react';

const HabitCard = ({ habit, onToggle, onEdit, onDelete, isToggling = false }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/60 shadow-subtle hover:shadow-card transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
              {habit.name}
            </h3>
            {habit.category && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
                {habit.category}
              </span>
            )}
          </div>
          {habit.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {habit.description}
            </p>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(habit)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/60 transition"
            title="Edit Habit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(habit._id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
            title="Delete Habit"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Streak indicators */}
      <div className="flex items-center gap-4 py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700/50 mb-4">
        <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400">
          <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
          <span>{habit.currentStreak || 0} Day Streak</span>
        </div>
        <div className="h-3 w-px bg-slate-200 dark:bg-slate-600" />
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span>Best: {habit.longestStreak || 0} Days</span>
        </div>
      </div>

      {/* Weekly 7-day visual history grid */}
      <div className="mb-4">
        <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
          Past 7 Days
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {habit.weekStatus?.map((day, idx) => (
            <button
              key={idx}
              onClick={() => onToggle(habit._id, day.date)}
              className={`flex flex-col items-center py-2 px-1 rounded-xl text-center border transition-all ${
                day.isCompleted
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                  : day.isToday
                  ? 'bg-white dark:bg-slate-900 border-indigo-300 dark:border-indigo-600 text-slate-700 dark:text-slate-300 ring-2 ring-indigo-500/20'
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700/50 text-slate-400'
              }`}
              title={`${day.date}: ${day.isCompleted ? 'Completed' : 'Missed / Pending'}`}
            >
              <span className="text-[10px] font-bold uppercase">{day.dayName}</span>
              <div className="mt-1 flex items-center justify-center">
                {day.isCompleted ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Today's completion action */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {habit.isCompletedToday ? 'Completed today' : 'Pending for today'}
        </span>

        <button
          onClick={() => onToggle(habit._id)}
          disabled={isToggling}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
            habit.isCompletedToday
              ? 'bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/70 dark:hover:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {habit.isCompletedToday ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              Done
            </>
          ) : (
            <>
              <Star className="w-3 h-3 fill-white" />
              Complete (+5 XP)
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default HabitCard;
