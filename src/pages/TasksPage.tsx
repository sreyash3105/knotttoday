import { useState, useEffect, type FormEvent } from 'react';
import { Plus, Pencil, Trash2, Calendar, User } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { Modal } from '@/components/Modal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { StatusBadge } from '@/components/StatusBadge';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/context/AuthContext';
import { tasksData, images } from '@/data/mockData';
import type { Task, TaskStatus, TaskPriority } from '@/types';

const emptyTask: Omit<Task, 'id'> = {
  name: '', category: '', dueDate: '', priority: 'Medium', status: 'Pending', assignedPerson: '',
};

const statusColors: Record<TaskStatus, string> = {
  'Pending': 'border-l-champagne-400',
  'In Progress': 'border-l-blue-400',
  'Completed': 'border-l-green-400',
};

export function TasksPage() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { user } = useAuth();
  const storageKey = `wedding_tasks_${user?.id || 'visitor'}`;

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading tasks', e);
    }
    return [];
  });

  useEffect(() => {
    const handleDataChanged = () => {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setTasks(parsed);
        }
      } catch (e) {
        console.error('Error reloading tasks', e);
      }
    };

    window.addEventListener('wedding_data_changed', handleDataChanged);
    return () => window.removeEventListener('wedding_data_changed', handleDataChanged);
  }, [storageKey]);

  const [statusFilter, setStatusFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [formData, setFormData] = useState<Omit<Task, 'id'>>(emptyTask);

  const filtered = statusFilter === 'all' ? tasks : tasks.filter((t) => t.status === statusFilter);

  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
  const pending = tasks.filter((t) => t.status === 'Pending').length;

  const openAdd = () => {
    setEditingTask(null);
    setFormData(emptyTask);
    setIsFormOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    const { id, ...rest } = task;
    void id;
    setFormData(rest);
    setIsFormOpen(true);
  };

  const saveTasks = (updated: Task[]) => {
    setTasks(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
      window.dispatchEvent(new Event('wedding_data_changed'));
    } catch (err) {
      console.error('Failed to save tasks', err);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      const updated = tasks.map((t) => (t.id === editingTask.id ? { ...formData, id: editingTask.id } : t));
      saveTasks(updated);
      showToast('Task updated successfully!');
    } else {
      const updated = [...tasks, { ...formData, id: `t${Date.now()}` }];
      saveTasks(updated);
      showToast('Task added successfully!');
    }
    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      const updated = tasks.filter((t) => t.id !== deleteTarget.id);
      saveTasks(updated);
      showToast('Task deleted.', 'info');
      setDeleteTarget(null);
    }
  };

  const cycleStatus = (id: string) => {
    const order: TaskStatus[] = ['Pending', 'In Progress', 'Completed'];
    const updated = tasks.map((task) => {
      if (task.id !== id) return task;
      const nextIndex = (order.indexOf(task.status) + 1) % order.length;
      return { ...task, status: order[nextIndex] };
    });
    saveTasks(updated);
  };

  return (
    <Layout title={t('tasks')} subtitle={`${completed}/${tasks.length} tasks completed`}>
      <PageHeader
        title="Wedding Checklist"
        description="Track every task to make your wedding perfect"
        action={
          <button onClick={openAdd} className="btn-primary">
            <Plus className="h-4 w-4" /> {t('addTask')}
          </button>
        }
      />

      {/* Summary */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <p className="text-2xl font-semibold text-green-600">{completed}</p>
          <p className="text-sm text-charcoal/60">Completed</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-semibold text-blue-600">{inProgress}</p>
          <p className="text-sm text-charcoal/60">In Progress</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-semibold text-champagne-600">{pending}</p>
          <p className="text-sm text-charcoal/60">Pending</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6 card p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-charcoal/70">Overall Progress</span>
          <span className="text-sm font-semibold text-burgundy-700">
            {tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0}%
          </span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-burgundy-50">
          <div
            className="h-full rounded-full bg-gradient-to-r from-burgundy-500 to-rose-500 transition-all"
            style={{ width: `${tasks.length > 0 ? (completed / tasks.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Filter */}
      <div className="mb-4 flex gap-2">
        {['all', 'Pending', 'In Progress', 'Completed'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === status
                ? 'bg-burgundy-600 text-white'
                : 'bg-white text-charcoal/60 border border-burgundy-100 hover:bg-burgundy-50'
            }`}
          >
            {status === 'all' ? 'All Tasks' : status}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((task) => (
          <div
            key={task.id}
            className={`card border-l-4 p-4 ${statusColors[task.status]}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <button
                  onClick={() => cycleStatus(task.id)}
                  className="text-left"
                >
                  <p className="text-sm font-semibold text-burgundy-900 hover:text-burgundy-700">
                    {task.name}
                  </p>
                </button>
                <p className="mt-1 text-xs text-charcoal/50">{task.category}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-charcoal/50">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {task.dueDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" /> {task.assignedPerson}
                  </span>
                </div>
              </div>
              <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
                <StatusBadge status={task.status} type="task" />
                <StatusBadge status={task.priority} type="priority" />
              </div>
            </div>
            <div className="mt-3 flex gap-2 border-t border-burgundy-50 pt-2">
              <button
                onClick={() => cycleStatus(task.id)}
                className="text-xs font-medium text-burgundy-600 hover:text-burgundy-800"
              >
                Advance Status →
              </button>
              <button onClick={() => openEdit(task)} className="ml-auto rounded p-1 text-charcoal/40 hover:text-burgundy-600">
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => setDeleteTarget(task)} className="rounded p-1 text-charcoal/40 hover:text-red-600">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="card p-12 text-center">
          <p className="text-charcoal/50">No tasks found.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingTask ? 'Edit Task' : 'Add New Task'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">Task Name *</label>
            <input type="text" required value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field" placeholder="e.g. Book Caterer" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Category</label>
              <input type="text" value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-field" placeholder="e.g. Catering" />
            </div>
            <div>
              <label className="label-field">Due Date</label>
              <input type="text" value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="input-field" placeholder="e.g. Nov 20, 2026" />
            </div>
            <div>
              <label className="label-field">Priority</label>
              <select value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                className="input-field">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="label-field">Status</label>
              <select value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                className="input-field">
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="label-field">Assigned Person</label>
              <input type="text" value={formData.assignedPerson}
                onChange={(e) => setFormData({ ...formData, assignedPerson: e.target.value })}
                className="input-field" placeholder="e.g. Anjali" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setIsFormOpen(false)} className="btn-secondary flex-1">{t('cancel')}</button>
            <button type="submit" className="btn-primary flex-1">{editingTask ? t('save') : t('addTask')}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
      />
    </Layout>
  );
}
