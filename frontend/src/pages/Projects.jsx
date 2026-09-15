import { useState, useEffect } from 'react';
import { Plus, Github, ExternalLink, Trash2, Code, Laptop } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import Modal from '../components/Modal';

const DEFAULT_PROJECTS = [
  {
    id: '1',
    title: 'Portfolio Website',
    desc: 'A gorgeous developer portfolio showcase styled with advanced animations and glassmorphic cards.',
    tags: ['React', 'Tailwind CSS', 'Framer Motion'],
    github: 'https://github.com',
    live: 'https://example.com',
  },
  {
    id: '2',
    title: 'Task Manager App',
    desc: 'Collaborative task planner with Kanban boards, customizable labels, and drag-and-drop lists.',
    tags: ['MERN Stack', 'Socket.io', 'Tailwind'],
    github: 'https://github.com',
    live: 'https://example.com',
  },
  {
    id: '3',
    title: 'Chat Application',
    desc: 'Realtime chatting service supporting private rooms, multimedia messages, and user statuses.',
    tags: ['Socket.io', 'React', 'Node.js', 'Express'],
    github: 'https://github.com',
    live: 'https://example.com',
  },
  {
    id: '4',
    title: 'E-Commerce Website',
    desc: 'Modern digital shopfront featuring Stripe integration, dynamic cart systems, and admin analytics dashboard.',
    tags: ['Next.js', 'Stripe API', 'MongoDB'],
    github: 'https://github.com',
    live: 'https://example.com',
  },
  {
    id: '5',
    title: 'Blog Website',
    desc: 'Markdown-powered blogging portal with user verification, comments, and post search.',
    tags: ['MERN Stack', 'React Hook Form'],
    github: 'https://github.com',
    live: 'https://example.com',
  },
  {
    id: '6',
    title: 'Weather App',
    desc: 'Beautiful weather viewer fetching stats from OpenWeather API with custom dynamic backgrounds.',
    tags: ['React', 'REST API', 'CSS Grid'],
    github: 'https://github.com',
    live: 'https://example.com',
  }
];

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [tags, setTags] = useState('');
  const [github, setGithub] = useState('');
  const [live, setLive] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('skillsphere_projects');
    if (stored) {
      setProjects(JSON.parse(stored));
    } else {
      localStorage.setItem('skillsphere_projects', JSON.stringify(DEFAULT_PROJECTS));
      setProjects(DEFAULT_PROJECTS);
    }
  }, []);

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim()) {
      toast.error('Please enter a title and description');
      return;
    }

    const newProj = {
      id: Date.now().toString(),
      title,
      desc,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      github: github || 'https://github.com',
      live: live || 'https://example.com'
    };

    const updated = [newProj, ...projects];
    setProjects(updated);
    localStorage.setItem('skillsphere_projects', JSON.stringify(updated));

    // Reset Form
    setTitle('');
    setDesc('');
    setTags('');
    setGithub('');
    setLive('');
    setModalOpen(false);
    toast.success('Project added successfully!');
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem('skillsphere_projects', JSON.stringify(updated));
    toast.success('Project deleted');
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl text-gray-900 dark:text-white">My Projects</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Manage and showcase your project portfolio.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus className="h-4 w-4" /> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <Card key={p.id} className="flex flex-col justify-between overflow-hidden border border-purple-100 dark:border-royal-darkBorder">
            <div>
              {/* Graphic Card Header */}
              <div className="flex h-32 items-center justify-center bg-gradient-to-br from-primary-600 to-indigo-600 dark:from-primary-900/60 dark:to-primary-950 text-white">
                <Laptop className="h-10 w-10 text-primary-200 dark:text-primary-400 animate-pulse-subtle" />
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-1">{p.title}</h3>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">{p.desc}</p>
                
                {/* Tech tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tags.map((t, idx) => (
                    <span key={idx} className="rounded-md bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-600 dark:bg-primary-950/40 dark:text-primary-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Links footer */}
            <div className="flex items-center gap-3 border-t border-purple-50 dark:border-royal-darkBorder p-4 bg-gray-50/50 dark:bg-royal-darkCard/30">
              <a
                href={p.live}
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-purple-100 bg-white py-2 text-xs font-bold text-primary-600 hover:bg-primary-50 hover:border-primary-200 dark:border-royal-darkBorder dark:bg-royal-darkCard dark:text-primary-300 dark:hover:bg-primary-950/20 transition-all"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Live Demo
              </a>
              <a
                href={p.github}
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-purple-100 bg-white py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-200 dark:border-royal-darkBorder dark:bg-royal-darkCard dark:text-gray-300 dark:hover:bg-gray-800/55 transition-all"
              >
                <Github className="h-3.5 w-3.5" /> GitHub
              </a>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal Form for adding new project */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New Project">
        <form onSubmit={handleAddProject} className="space-y-4">
          <div>
            <label className="label-text">Project Title</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Portfolio Website"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label-text">Description</label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="Describe your project, technologies, and features..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label-text">Tech Stack (comma separated)</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. React, Tailwind CSS, Node.js"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label-text">GitHub URL</label>
              <input
                type="url"
                className="input-field"
                placeholder="https://github.com/..."
                value={github}
                onChange={(e) => setGithub(e.target.value)}
              />
            </div>
            <div>
              <label className="label-text">Live Demo URL</label>
              <input
                type="url"
                className="input-field"
                placeholder="https://..."
                value={live}
                onChange={(e) => setLive(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Project
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;
