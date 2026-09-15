import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { Send, Bot, User, Trash2, Code2, Map, HelpCircle, FileText, MessageSquare } from 'lucide-react';
import * as aiService from '../services/aiService';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Card from '../components/Card';

const MODES = [
  { key: 'ask', label: 'Ask a Question', icon: MessageSquare, placeholder: 'Ask any programming question...' },
  { key: 'explain-code', label: 'Explain Code', icon: Code2, placeholder: 'Paste your code here to get an explanation...' },
  { key: 'roadmap', label: 'Learning Roadmap', icon: Map, placeholder: 'e.g. Full Stack MERN Development' },
  { key: 'quiz', label: 'Generate Quiz', icon: HelpCircle, placeholder: 'e.g. JavaScript Closures' },
  { key: 'summarize', label: 'Summarize Notes', icon: FileText, placeholder: 'Paste your notes to summarize...' },
];

const AIAssistant = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState('ask');
  const [prompt, setPrompt] = useState('');
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const bottomRef = useRef(null);

  const fetchHistory = async () => {
    try {
      const res = await aiService.getChatHistory();
      setChats(res.chats.slice().reverse());
    } catch {
      // ignore
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await aiService.chatWithAI(prompt, mode);
      setChats((prev) => [...prev, res.chat]);
      setPrompt('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI request failed. Check Gemini API key configuration on the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await aiService.deleteChatEntry(id);
      setChats((prev) => prev.filter((c) => c._id !== id));
    } catch {
      toast.error('Failed to delete entry');
    }
  };

  const activeMode = MODES.find((m) => m.key === mode);

  return (
    <div className="animate-fade-in flex flex-col h-[calc(100vh-8.5rem)]">
      {/* Page Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl text-gray-900 dark:text-white">AI Learning Assistant</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Powered by Gemini AI — ask questions, explain code, and generate roadmaps.</p>
        </div>
      </div>

      {/* Modes Bar */}
      <div className="mb-6 flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 ${
              mode === m.key
                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                : 'bg-white dark:bg-royal-darkCard text-gray-600 dark:text-gray-400 border border-purple-100 dark:border-royal-darkBorder hover:bg-primary-50 dark:hover:bg-primary-950/20'
            }`}
          >
            <m.icon className="h-4 w-4" /> {m.label}
          </button>
        ))}
      </div>

      {/* Dual Pane Layout */}
      <div className="flex flex-1 gap-6 overflow-hidden min-h-0">
        
        {/* Left Side Pane - Chat History / Queries */}
        <Card className="hidden md:flex w-72 flex-col p-4 border border-purple-100 dark:border-royal-darkBorder bg-white dark:bg-royal-darkCard">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Recent Queries</h3>
          <div className="flex-1 overflow-y-auto space-y-2 px-1">
            {chats.map((c) => (
              <button
                key={c._id}
                onClick={() => {
                  const el = document.getElementById(`chat-${c._id}`);
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                    className="w-full text-left rounded-xl p-3 text-xs text-gray-500 dark:text-gray-300 hover:bg-primary-50/50 dark:hover:bg-primary-950/20 hover:text-primary-600 dark:hover:text-primary-400 border border-transparent hover:border-purple-100 dark:hover:border-royal-darkBorder transition-all line-clamp-2 leading-relaxed"
              >
                {c.prompt}
              </button>
            ))}
            {chats.length === 0 && (
              <p className="text-center text-xs text-gray-400 py-12">No past queries</p>
            )}
          </div>
        </Card>

        {/* Right Side Pane - Active Conversational Thread */}
        <Card className="flex flex-1 flex-col overflow-hidden border border-purple-100 dark:border-royal-darkBorder bg-white dark:bg-royal-darkCard">
          {/* Active Chat Header */}
          <div className="border-b border-purple-50 dark:border-royal-darkBorder p-4 bg-gray-50/50 dark:bg-royal-darkCard/30 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-950 dark:text-primary-400 flex items-center justify-center border border-primary-500/10">
              <Bot className="h-4 w-4 animate-pulse-subtle" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white">Active Chat Workspace</p>
              <p className="text-[10px] text-gray-400">Mode: {activeMode?.label}</p>
            </div>
          </div>

          {/* Conversation Bubbles Container */}
          <div className="flex-1 space-y-6 overflow-y-auto p-5 scroll-smooth">
            {historyLoading ? (
              <div className="flex h-full items-center justify-center"><Loader /></div>
            ) : chats.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center text-gray-400 space-y-3">
                <div className="rounded-full bg-primary-50 dark:bg-royal-darkBorder/40 p-4 border border-dashed border-primary-200 dark:border-primary-800">
                  <Bot className="h-10 w-10 text-primary-500" />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-800 dark:text-gray-200">Start a new query</p>
                  <p className="text-xs text-gray-400 mt-1">Select a mode above and ask any programming question.</p>
                </div>
              </div>
            ) : (
              chats.map((chat) => (
                <div key={chat._id} id={`chat-${chat._id}`} className="space-y-4 pt-2 border-b border-purple-50/30 dark:border-royal-darkBorder/20 pb-4">
                  {/* User Question */}
                  <div className="flex items-start justify-end gap-3">
                    <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-2.5 text-xs sm:text-sm text-white shadow-sm shadow-primary-500/10 leading-relaxed">
                      {chat.prompt}
                    </div>
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-950 dark:text-primary-400 text-xs font-bold shadow border border-primary-500/10">
                      U
                    </div>
                  </div>
                  {/* AI Response */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400 text-xs font-bold shadow border border-purple-500/10">
                      AI
                    </div>
                    <div className="group relative max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-tl-sm bg-gray-50 dark:bg-royal-darkBg/50 border border-purple-50 dark:border-royal-darkBorder px-4 py-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed shadow-sm">
                      {chat.response}
                      <button
                        onClick={() => handleDelete(chat._id)}
                        className="absolute -right-2 -top-2 hidden rounded-full bg-white dark:bg-royal-darkCard border border-purple-100 dark:border-royal-darkBorder p-1.5 shadow hover:text-red-500 group-hover:block transition-all"
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* Prompt Entry Box */}
          <form onSubmit={handleSend} className="flex items-center gap-3 border-t border-purple-50 dark:border-royal-darkBorder p-4 bg-white dark:bg-royal-darkCard/50">
              <textarea
              rows={2}
              className="input-field flex-1 resize-none bg-gray-50/50 dark:bg-royal-darkCard/70"
              placeholder={activeMode?.placeholder}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
            />
            <button type="submit" disabled={loading || !prompt.trim()} className="btn-primary flex-shrink-0 py-3 px-4">
              {loading ? '...' : <Send className="h-4 w-4" />}
            </button>
          </form>
        </Card>

      </div>
    </div>
  );
};

export default AIAssistant;
