import React, { useState, useEffect } from 'react';
import { tasksAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import TaskItem from '../components/tasks/TaskItem';
import TaskModal from '../components/tasks/TaskModal';
import { ListSkeleton } from '../components/common/SkeletonLoader';
import {
  CheckSquare,
  Plus,
  Filter,
  Search,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';

const Tasks = () => {
  const { updateUser } = useAuth();
  const { showToast } = useToast();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'completed'
  const [priorityFilter, setPriorityFilter] = useState('All'); // 'All', 'High', 'Medium', 'Low'
  const [search, setSearch] = useState('');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await tasksAPI.getAll({
        status: statusFilter === 'all' ? undefined : statusFilter,
        priority: priorityFilter === 'All' ? undefined : priorityFilter
      });

      if (res.data.success) {
        setTasks(res.data.tasks || []);
      }
    } catch (err) {
      console.error('Failed to load tasks:', err);
      showToast({
        title: 'Error loading tasks',
        message: 'Could not fetch your daily task list.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, priorityFilter]);

  const handleOpenAddModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    setIsSaving(true);
    try {
      if (editingTask) {
        const res = await tasksAPI.update(editingTask._id, taskData);
        if (res.data.success) {
          showToast({
            title: 'Task Updated',
            message: `"${taskData.title}" has been updated.`,
            type: 'success'
          });
        }
      } else {
        const res = await tasksAPI.create(taskData);
        if (res.data.success) {
          showToast({
            title: 'Task Created ✅',
            message: `"${taskData.title}" added to your day.`,
            type: 'success'
          });
        }
      }
      setIsModalOpen(false);
      fetchTasks();
    } catch (err) {
      showToast({
        title: 'Error saving task',
        message: err.response?.data?.message || 'Could not save task.',
        type: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleTask = async (taskId, nextCompletedState) => {
    try {
      setTogglingId(taskId);
      const res = await tasksAPI.update(taskId, { completed: nextCompletedState });

      if (res.data.success) {
        if (nextCompletedState) {
          showToast({
            title: 'Task Completed! 🚀',
            message: '+5 XP added to your total score.',
            type: 'success',
            xp: 5
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

        fetchTasks();
      }
    } catch (err) {
      showToast({
        title: 'Error updating task',
        message: 'Could not toggle task state.',
        type: 'error'
      });
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const res = await tasksAPI.delete(taskId);
      if (res.data.success) {
        showToast({
          title: 'Task Deleted',
          message: 'Task removed from your list.',
          type: 'success'
        });
        fetchTasks();
      }
    } catch (err) {
      showToast({
        title: 'Delete Failed',
        message: 'Could not delete task.',
        type: 'error'
      });
    }
  };

  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase())
  );

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-700/60 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <CheckSquare className="w-3.5 h-3.5" />
            Daily Planner & Tasks
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Today's Tasks
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Plan your day and stay productive. Check off goals to build daily momentum and earn +5 XP per task.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/25 transition flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Task
        </button>
      </div>

      {/* Progress & Quick Stats Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Total Tasks</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{tasks.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Completed</span>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {completedCount}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Completion Rate</span>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
              {progressRate}%
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-subtle flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300'
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'pending'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300'
            }`}
          >
            Pending ({tasks.length - completedCount})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'completed'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          <div className="relative flex-1 sm:w-48">
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          </div>
        </div>
      </div>

      {/* Task List */}
      {loading ? (
        <ListSkeleton rows={4} />
      ) : filteredTasks.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-700/60">
          <CheckSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            No tasks yet.
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Start planning your day and build your productivity momentum.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="mt-4 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-2 shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            Add First Task
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((t) => (
            <TaskItem
              key={t._id}
              task={t}
              onToggle={handleToggleTask}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteTask}
              isToggling={togglingId === t._id}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        task={editingTask}
        isSaving={isSaving}
      />
    </div>
  );
};

export default Tasks;
