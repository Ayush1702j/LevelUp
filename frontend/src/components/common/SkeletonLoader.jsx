import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/60 animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
      <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
    </div>
    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-32 mb-2"></div>
    <div className="h-3 bg-slate-100 dark:bg-slate-700/50 rounded w-20"></div>
  </div>
);

export const ListSkeleton = ({ rows = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div
        key={i}
        className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/60 animate-pulse flex items-center justify-between"
      >
        <div className="flex items-center gap-3 w-3/4">
          <div className="w-5 h-5 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
            <div className="h-3 bg-slate-100 dark:bg-slate-700/50 rounded w-1/3"></div>
          </div>
        </div>
        <div className="w-16 h-6 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
      </div>
    ))}
  </div>
);
