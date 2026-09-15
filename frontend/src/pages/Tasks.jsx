import { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowLeft, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import Modal from '../components/Modal';

const DEFAULT_TASKS = [
  { id: '1', title: 'Learn React Hooks', priority: 'Low', status: 'todo' },
  { id: '2', title: 'Design Dashboard UI', priority: 'Medium', status: 'todo' },
  { id: '3', title: 'Create Project Repo', priority: 'Low', status: 'todo' },
  { id: '4', title: 'Build Login Page', priority: 'High', status: 'progress' },
  { id: '5', title: 'Work on API Integration', priority: 'Medium', status: 'progress' },
  { id: '6', title: 'Setup Project', priority: 'Low', status: 'completed' },
  { id: '7', title: 'Install Dependencies', priority: 'Medium', status: 'completed' },
  { id: '8', title: 'Create Database', priority: 'Low', status: 'completed' }
];

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Low');
  const [status, setStatus] = useState('todo');

  useEffect(() => {
    const stored = localStorage.getItem('skillsphere_tasks');
    if (stored) {
      setTasks(JSON.parse(stored));
    } else {
      localStorage.setItem('skillsphere_tasks', JSON.stringify(DEFAULT_TASKS));
      setTasks(DEFAULT_TASKS);
    }
  }, []);

  const saveTasks = (newTasks) => {
    setTasks(newTasks);
    localStorage.setItem('skillsphere_tasks', JSON.stringify(newTasks));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Task title is required');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title,
      priority,
      status
    };

    saveTasks([...tasks, newTask]);
    setTitle('');
    setPriority('Low');
    setStatus('todo');
    setModalOpen(false);
    toast.success('Task created successfully');
  };

  const moveTask = (id, newStatus) => {
    const updated = tasks.map(t => t.id === id ? { ...t, status: newStatus } : t);
    saveTasks(updated);
  };

  const handleDelete = (id) => {
    const updated = tasks.filter(t => t.id !== id);
    saveTasks(updated);
    toast.success('Task deleted');
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case 'High': return 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 border border-red-100 dark:border-red-900/40';
      case 'Medium': return 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40';
      default: return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40';
    }
  };

  const renderColumn = (colStatus, titleText) => {
    const filtered = tasks.filter(t => t.status === colStatus);
    return (
      <div className="flex flex-col rounded-2xl bg-gray-50/50 p-4 dark:bg-royal-darkCard/25 border border-purple-50 dark:border-royal-darkBorder flex-1">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-gray-800 dark:text-gray-200">{titleText}</h3>
          <span className="rounded-lg bg-purple-100 px-2 py-0.5 text-xs font-bold text-primary-600 dark:bg-primary-950/50 dark:text-primary-300">
            {filtered.length}
          </span>
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto min-h-[300px]">
          {filtered.map((t) => (
            <Card key={t.id} className="p-4 hover:shadow border border-purple-100 dark:border-royal-darkBorder shadow-sm relative group bg-white dark:bg-royal-darkCard transition-all">
              <div className="flex items-start justify-between gap-2">
                <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${getPriorityColor(t.priority)}`}>
                  {t.priority}
                </span>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity p-0.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <h4 className="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-200 leading-snug">{t.title}</h4>

              {/* Action movement controls */}
              <div className="mt-4 flex items-center justify-between border-t border-purple-50 dark:border-royal-darkBorder pt-2 text-gray-400">
                <button
                  onClick={() => moveTask(t.id, colStatus === 'progress' ? 'todo' : 'progress')}
                  disabled={colStatus === 'todo'}
                  className="rounded hover:bg-gray-100 dark:hover:bg-royal-darkBorder/40 p-1 disabled:opacity-30"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>
                <div className="flex gap-1">
                  {colStatus === 'completed' ? (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-medium">
                      <CheckCircle className="h-3 w-3" /> Done
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                      <Clock className="h-3 w-3" /> Active
                    </span>
                  )}
                </div>
                <button
                  onClick={() => moveTask(t.id, colStatus === 'todo' ? 'progress' : 'completed')}
                  disabled={colStatus === 'completed'}
                  className="rounded hover:bg-gray-100 dark:hover:bg-royal-darkBorder/40 p-1 disabled:opacity-30"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-gray-200 dark:border-royal-darkBorder text-center text-xs text-gray-400">
              No tasks
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in flex flex-col h-full">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl text-gray-900 dark:text-white">Task Manager</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Organize, track, and complete your learning tasks.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus className="h-4 w-4" /> Add Task
        </button>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row flex-1">
        {renderColumn('todo', 'To Do')}
        {renderColumn('progress', 'In Progress')}
        {renderColumn('completed', 'Completed')}
      </div>

      {/* Modal Form */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Task">
        <form onSubmit={handleAddTask} className="space-y-4">
          <div>
            <label className="label-text">Task Title</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Design Dashboard UI"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label-text">Priority</label>
              <select className="input-field" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div>
              <label className="label-text">Stage</label>
              <select className="input-field" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="todo">To Do</option>
                <option value="progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Tasks;
