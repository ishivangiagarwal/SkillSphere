import { useState, useEffect } from 'react';
import { Plus, Search, Trash2, BookOpen, Calendar, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import Modal from '../components/Modal';

const DEFAULT_NOTES = [
  { id: '1', title: 'React Hooks Notes', subject: 'React', content: 'useState: manages local component state.\nuseEffect: deals with side effects (API calls, subscriptions).\nuseContext: reads and subscribes to context.', updated: '2h ago' },
  { id: '2', title: 'Node.js API Concepts', subject: 'Node.js', content: 'Express routing: routers, request/response cycle middleware.\nREST standards: GET, POST, PUT, DELETE.\nJWT Auth: sign tokens, save in cookies or auth headers.', updated: '1d ago' },
  { id: '3', title: 'MongoDB Commands', subject: 'MongoDB', content: 'db.collection.find(): filters data.\ndb.collection.insertOne(): saves a single document.\ndb.collection.aggregate(): runs aggregation pipelines (match, group).', updated: '2d ago' },
  { id: '4', title: 'DSA - Arrays', subject: 'DSA', content: 'Two-pointer technique: useful for sorting / searching.\nSliding window: optimal for subarray problems.\nTime complexity: O(1) read access, O(n) insert/delete.', updated: '5d ago' },
  { id: '5', title: 'Operating System Notes', subject: 'OS', content: 'CPU scheduling: FIFO, Shortest Job First, Round Robin.\nVirtual memory: paging, swapping, fragmentation.\nProcesses vs Threads: shared memory vs isolated space.', updated: '1w ago' }
];

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('skillsphere_notes');
    if (stored) {
      setNotes(JSON.parse(stored));
    } else {
      localStorage.setItem('skillsphere_notes', JSON.stringify(DEFAULT_NOTES));
      setNotes(DEFAULT_NOTES);
    }
  }, []);

  const saveNotes = (newNotes) => {
    setNotes(newNotes);
    localStorage.setItem('skillsphere_notes', JSON.stringify(newNotes));
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    const newNote = {
      id: Date.now().toString(),
      title,
      subject: subject || 'General',
      content,
      updated: 'Just now'
    };

    saveNotes([newNote, ...notes]);
    setTitle('');
    setSubject('');
    setContent('');
    setModalOpen(false);
    toast.success('Note created');
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this note?')) return;
    const updated = notes.filter(n => n.id !== id);
    saveNotes(updated);
    toast.success('Note deleted');
  };

  const handleViewNote = (note) => {
    setSelectedNote(note);
    setViewModalOpen(true);
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl text-gray-900 dark:text-white">My Notes</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Jot down reference guides, code snippets, and study material.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus className="h-4 w-4" /> New Note
        </button>
      </div>

      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          className="input-field pl-10"
          placeholder="Search notes by title or subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="overflow-hidden border border-purple-100 dark:border-royal-darkBorder">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-purple-100 bg-gray-50/50 text-xs font-bold uppercase tracking-wider text-gray-500 dark:border-royal-darkBorder dark:bg-royal-darkCard/55 dark:text-gray-400">
                <th className="p-4 pl-6">Title</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Updated</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50 dark:divide-royal-darkBorder">
              {filteredNotes.map((n) => (
                <tr
                  key={n.id}
                  onClick={() => handleViewNote(n)}
                  className="group hover:bg-primary-50/20 dark:hover:bg-primary-950/10 cursor-pointer transition-colors"
                >
                  <td className="p-4 pl-6 font-semibold text-gray-800 dark:text-gray-200">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary-500" />
                      <span>{n.title}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-primary-600 dark:bg-primary-950/40 dark:text-primary-300">
                      {n.subject}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{n.updated}</span>
                    </div>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewNote(n);
                        }}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-primary-600 dark:hover:bg-royal-darkBorder/40 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(n.id, e)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredNotes.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-sm text-gray-400">
                    No notes found. Create a new note to start!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Note Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Note">
        <form onSubmit={handleAddNote} className="space-y-4">
          <div>
            <label className="label-text">Note Title</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Redux Toolkit Cheat Sheet"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label-text">Subject / Topic</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Redux"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div>
            <label className="label-text">Content</label>
            <textarea
              className="input-field"
              rows={6}
              placeholder="Start typing your notes here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Note
            </button>
          </div>
        </form>
      </Modal>

      {/* View Note Modal */}
      <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} title={selectedNote?.title || 'View Note'}>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-400">Subject:</span>
            <span className="rounded-md bg-purple-50 px-2 py-0.5 text-xs font-bold text-primary-600 dark:bg-primary-950/40 dark:text-primary-300">
              {selectedNote?.subject}
            </span>
          </div>
          <div className="rounded-xl bg-gray-50 dark:bg-royal-darkCard/50 p-4 border border-purple-50 dark:border-royal-darkBorder">
            <p className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-mono">
              {selectedNote?.content}
            </p>
          </div>
          <div className="flex justify-end pt-2">
            <button onClick={() => setViewModalOpen(false)} className="btn-secondary">
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Notes;
