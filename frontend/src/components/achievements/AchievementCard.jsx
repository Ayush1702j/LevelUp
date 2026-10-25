import React from 'react';
import {
  Trophy,
  Flame,
  Zap,
  Star,
  BookOpen,
  Mic,
  Heart,
  ShieldCheck,
  Award,
  Lock,
  CheckCircle2
} from 'lucide-react';

const iconMap = {
  flame: Flame,
  zap: Zap,
  star: Star,
  'shield-check': ShieldCheck,
  award: Award,
  mic: Mic,
  'book-open': BookOpen,
  'edit-3': Trophy,
  'check-circle-2': CheckCircle2,
  heart: Heart,
  trophy: Trophy
};

const AchievementCard = ({ achievement }) => {
  const IconComponent = iconMap[achievement.icon] || Trophy;

  return (
    <div
      className={`rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between ${
        achievement.isUnlocked
          ? 'bg-gradient-to-b from-white to-amber-50/20 dark:from-slate-800 dark:to-amber-950/20 border-amber-300 dark:border-amber-600/60 shadow-md shadow-amber-500/5'
          : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 opacity-70 grayscale-30'
      }`}
    >
      <div>
        {/* Top badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
              achievement.isUnlocked
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-400 border-slate-200 dark:border-slate-600'
            }`}
          >
            <IconComponent className="w-6 h-6" />
          </div>

          <div className="flex items-center gap-1.5">
            {achievement.isUnlocked ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3 h-3" />
                Unlocked
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded-full">
                <Lock className="w-3 h-3" />
                Locked
              </span>
            )}

            <span className="flex items-center gap-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-900/40">
              <Star className="w-3 h-3 fill-indigo-500" />
              +{achievement.xpReward || 50} XP
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <h4 className="font-bold text-base text-slate-900 dark:text-white mb-1.5">
          {achievement.title}
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          {achievement.description}
        </p>
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Target: {achievement.requirementThreshold} {achievement.requirementType}</span>
        {achievement.isUnlocked && achievement.unlockedAt && (
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
            {new Date(achievement.unlockedAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default AchievementCard;
