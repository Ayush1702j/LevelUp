import React from 'react';
import { Check, Edit2, Trash2, Calendar, Star } from 'lucide-react';

const TaskItem = ({ task, onToggle, onEdit, onDelete, isToggling = false }) => {
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-900';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-900';
      case 'Low':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-900';
      default:
        return 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200';
    }
  };

  return (
    <div
      className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
        task.completed
          ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-80'
          : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700/60 shadow-subtle hover:shadow-card'
      }`}
    >
      <div className="flex items-start gap-3.5 flex-1 min-w-0 pr-4">
        {/* Toggle completion checkbox button */}
        <button
          onClick={() => onToggle(task._id, !task.completed)}
          disabled={isToggling}
          className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center border transition-all duration-200 flex-shrink-0 ${
            task.completed
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400'
          }`}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark completed'}
        >
          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Task Title & Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4
              className={`text-sm font-semibold leading-snug transition-all ${
                task.completed
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              {task.title}
            </h4>

            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getPriorityBadge(task.priority)}`}>
              {task.priority}
            </span>

            {!task.completed && (
              <span className="flex items-center gap-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.5 rounded">
                <Star className="w-2.5 h-2.5 fill-indigo-500" />
                +5 XP
              </span>
            )}
          </div>

          {task.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {task.description}
            </p>
          )}

          {task.date && (
            <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 mt-2">
              <Calendar className="w-3 h-3" />
              <span>{task.date}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons (Edit & Delete) */}
      <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(task)}
          className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition"
          title="Edit Task"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
          title="Delete Task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
