import React from 'react';

const ProgressBar = ({ value = 0, max = 100, label = null, showPercent = true, color = 'indigo', size = 'md' }) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const heightMap = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  const colorMap = {
    indigo: 'bg-gradient-to-r from-indigo-500 to-violet-500',
    emerald: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    orange: 'bg-gradient-to-r from-orange-500 to-amber-500',
    purple: 'bg-gradient-to-r from-purple-500 to-pink-500',
    blue: 'bg-gradient-to-r from-blue-500 to-cyan-500'
  };

  const heightClass = heightMap[size] || heightMap.md;
  const colorClass = colorMap[color] || colorMap.indigo;

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex justify-between items-center text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
          {label && <span>{label}</span>}
          {showPercent && <span>{percentage}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-100 dark:bg-slate-700/60 rounded-full overflow-hidden ${heightClass}`}>
        <div
          className={`${heightClass} rounded-full transition-all duration-500 ease-out ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
