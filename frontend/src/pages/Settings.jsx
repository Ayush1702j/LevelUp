import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authAPI } from '../services/api';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Lock,
  Bell,
  User,
  Shield,
  Check,
  Save,
  AlertTriangle
} from 'lucide-react';

const Settings = () => {
  const { user, updateUser, theme, toggleTheme, logout } = useAuth();
  const { showToast } = useToast();

  // Notification toggles state
  const [notifications, setNotifications] = useState({
    dailyReminder: user?.notificationSettings?.dailyReminder ?? true,
    streakAlert: user?.notificationSettings?.streakAlert ?? true,
    achievementAlert: user?.notificationSettings?.achievementAlert ?? true
  });
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleToggleNotification = async (key) => {
    const nextState = { ...notifications, [key]: !notifications[key] };
    setNotifications(nextState);
    setIsSavingNotifications(true);

    try {
      const res = await authAPI.updateProfile({ notificationSettings: nextState });
      if (res.data.success) {
        updateUser(res.data.user);
        showToast({
          title: 'Notification Settings Updated',
          message: 'Your preferences have been saved.',
          type: 'success'
        });
      }
    } catch (err) {
      showToast({
        title: 'Update failed',
        message: 'Could not update notification preferences.',
        type: 'error'
      });
    } finally {
      setIsSavingNotifications(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast({
        title: 'Validation Error',
        message: 'Please fill in both current and new password.',
        type: 'error'
      });
      return;
    }

    if (newPassword.length < 6) {
      showToast({
        title: 'Validation Error',
        message: 'New password must be at least 6 characters long.',
        type: 'error'
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      showToast({
        title: 'Validation Error',
        message: 'New passwords do not match.',
        type: 'error'
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await authAPI.changePassword({ currentPassword, newPassword });
      if (res.data.success) {
        showToast({
          title: 'Password Changed Successfully 🔒',
          message: 'Your security credentials have been updated.',
          type: 'success'
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (err) {
      showToast({
        title: 'Password Change Failed',
        message: err.response?.data?.message || 'Could not change password.',
        type: 'error'
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-700/60 shadow-subtle">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
          <SettingsIcon className="w-3.5 h-3.5" />
          Preferences & Account
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Application Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
          Manage your theme, notification triggers, security credentials, and application preferences.
        </p>
      </div>

      {/* Theme & Display Mode */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-700/60 shadow-subtle">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              Appearance & Theme
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Choose between clean light mode or comfortable dark theme.
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                Dark Mode
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications Preferences */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-700/60 shadow-subtle space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600" />
            In-App Notifications & Alerts
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure when LevelUp surfaces celebratory toasts and progress reminders.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Daily Challenge Reminders</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Receive toasts when new daily challenges become available.</p>
            </div>
            <button
              onClick={() => handleToggleNotification('dailyReminder')}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                notifications.dailyReminder ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${notifications.dailyReminder ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Streak Momentum Alerts</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Celebrate each consecutive day added to your daily streak.</p>
            </div>
            <button
              onClick={() => handleToggleNotification('streakAlert')}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                notifications.streakAlert ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${notifications.streakAlert ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Achievement Unlocked Banners</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Instant animated notifications when milestone badges are unlocked.</p>
            </div>
            <button
              onClick={() => handleToggleNotification('achievementAlert')}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                notifications.achievementAlert ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${notifications.achievementAlert ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Password & Security */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-700/60 shadow-subtle space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-600" />
            Security & Password
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Update your account password securely.
          </p>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-2 disabled:opacity-50"
            >
              <Shield className="w-4 h-4" />
              {isChangingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Account / Danger Zone */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-rose-100 dark:border-rose-950/60 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Session Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Signed in as <span className="font-semibold text-slate-700 dark:text-slate-300">{user?.email}</span>.
          </p>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
        >
          Sign Out of LevelUp
        </button>
      </div>
    </div>
  );
};

export default Settings;
