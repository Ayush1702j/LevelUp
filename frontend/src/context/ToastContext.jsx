import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Award, Star, Flame, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(({ title, message, type = 'success', xp = null, duration = 4000 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type, xp }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast floating container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map((t) => {
          let bgClass = 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white border-slate-200 dark:border-slate-700 shadow-xl';
          let icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />;

          if (t.type === 'error') {
            icon = <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />;
            bgClass = 'bg-rose-50 dark:bg-rose-950/70 text-rose-900 dark:text-rose-100 border-rose-200 dark:border-rose-900 shadow-xl';
          } else if (t.type === 'achievement') {
            icon = <Award className="w-6 h-6 text-amber-500 flex-shrink-0 animate-bounce" />;
            bgClass = 'bg-gradient-to-r from-amber-500/10 to-indigo-500/10 dark:from-amber-950/40 dark:to-indigo-950/40 bg-white dark:bg-slate-800 border-amber-300 dark:border-amber-700 shadow-2xl';
          } else if (t.type === 'streak') {
            icon = <Flame className="w-5 h-5 text-orange-500 flex-shrink-0" />;
          }

          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border transition-all duration-300 transform translate-y-0 opacity-100 ${bgClass}`}
            >
              {icon}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm leading-tight">{t.title}</h4>
                  {t.xp && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-full">
                      <Star className="w-3 h-3 fill-indigo-500 text-indigo-500" />
                      +{t.xp} XP
                    </span>
                  )}
                </div>
                {t.message && (
                  <p className="text-xs mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
                    {t.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
