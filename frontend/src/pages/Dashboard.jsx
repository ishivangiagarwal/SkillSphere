import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle2, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import * as userService from '../services/userService';
import * as aiService from '../services/aiService';
import Loader from '../components/Loader';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import EmptyState from '../components/EmptyState';

const COLORS = ['#7c3aed', '#22d3ee'];

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [suggestion, setSuggestion] = useState('');
  const [suggestionLoading, setSuggestionLoading] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await userService.getDashboard();
        setData(res);
      } catch (err) {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleGetSuggestion = async () => {
    setSuggestionLoading(true);
    try {
      const topic = data?.recentEnrollments?.[0]?.course?.category || 'web development';
      const res = await aiService.chatWithAI(
        `In 2-3 short sentences, suggest what a student learning ${topic} should focus on next to improve their skills.`,
        'ask'
      );
      setSuggestion(res.chat.response);
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI suggestion failed. Check your AI provider API key configuration.');
    } finally {
      setSuggestionLoading(false);
    }
  };

  if (loading) return <Loader full />;

  const chartData = [
    { name: 'Completed', value: data?.stats.completedCourses || 0 },
    { name: 'In Progress', value: data?.stats.inProgressCourses || 0 },
  ];

  return (
    <div className="page-container animate-fade-in space-y-8 py-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl text-gray-900 dark:text-white">
          Welcome back, {user?.name?.split(' ')[0]} 
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Let's continue your learning journey.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center gap-4 border border-purple-100 dark:border-royal-darkBorder bg-white dark:bg-royal-darkCard p-5">
          <div className="rounded-xl bg-primary-100 p-3 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{data?.stats.totalCourses || 0}</p>
            <p className="text-xs font-semibold text-gray-400">Courses Enrolled</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 border border-purple-100 dark:border-royal-darkBorder bg-white dark:bg-royal-darkCard p-5">
          <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{data?.stats.completedCourses || 0}</p>
            <p className="text-xs font-semibold text-gray-400">Completed</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 border border-purple-100 dark:border-royal-darkBorder bg-white dark:bg-royal-darkCard p-5">
          <div className="rounded-xl bg-accent-400/20 p-3 text-accent-600">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{data?.stats.avgProgress || 0}%</p>
            <p className="text-xs font-semibold text-gray-400">Avg Progress</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 border border-purple-100 dark:border-royal-darkBorder bg-white dark:bg-royal-darkCard p-5">
          <div className="rounded-xl bg-purple-100 p-3 text-purple-600 dark:bg-primary-900/40 dark:text-purple-400">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-black capitalize text-gray-900 dark:text-white">{user?.role}</p>
            <p className="text-xs font-semibold text-gray-400">Account Type</p>
          </div>
        </Card>
      </div>

      {/* Main widgets */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6 border border-purple-100 dark:border-royal-darkBorder bg-white dark:bg-royal-darkCard">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h2>
              <p className="text-xs text-gray-400">Your recent course progress.</p>
            </div>
            <Link to="/courses" className="flex items-center gap-1 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline">
              Browse courses <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {data?.recentEnrollments?.length ? (
            <div className="space-y-4">
              {data.recentEnrollments.map((e) => (
                <Link
                  to={`/courses/${e.course?._id}`}
                  key={e._id}
                  className="block rounded-xl border border-purple-50 hover:border-primary-300 dark:border-royal-darkBorder dark:hover:border-primary-800 p-4 bg-gray-50/20 dark:bg-royal-darkBg/10 hover:shadow-sm transition-all"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{e.course?.title}</p>
                    <span className="text-[10px] font-bold text-primary-500 uppercase">
                      {e.status === 'completed' ? 'Completed' : 'In progress'}
                    </span>
                  </div>
                  <ProgressBar value={e.progress} />
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No courses yet"
              description="Enroll in a course to start tracking your progress."
              action={<Link to="/courses" className="btn-primary mt-2">Browse Courses</Link>}
            />
          )}
        </Card>

        <div className="space-y-6">
          <Card className="p-6 border border-purple-100 dark:border-royal-darkBorder bg-white dark:bg-royal-darkCard">
            <h2 className="mb-2 text-base font-bold text-gray-900 dark:text-white">Learning Progress</h2>
            {data?.stats.totalCourses ? (
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={60} paddingAngle={4}>
                      {chartData.map((entry, index) => (
                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 flex gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary-500" /> Completed ({data?.stats.completedCourses})
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" /> In Progress ({data?.stats.inProgressCourses})
                  </span>
                </div>
              </div>
            ) : (
              <p className="py-8 text-center text-xs text-gray-400">Enroll in courses to see your progress chart</p>
            )}
          </Card>

          <Card className="p-6 border border-purple-100 dark:border-royal-darkBorder bg-gradient-to-br from-primary-950 to-indigo-950 text-white">
            <div className="mb-3 flex items-center gap-2">
<Sparkles className="h-[18px] w-[18px] text-accent-400" />
              <h2 className="text-sm font-bold">AI Learning Suggestion</h2>
            </div>
            {suggestion ? (
              <p className="text-xs font-medium leading-relaxed text-gray-300">{suggestion}</p>
            ) : (
              <p className="text-xs text-gray-400">Get a personalized suggestion powered by AI.</p>
            )}
            <button
              onClick={handleGetSuggestion}
              disabled={suggestionLoading}
              className="mt-4 w-full rounded-xl border border-white/10 bg-white/10 py-2.5 text-xs font-bold text-white transition-all hover:bg-white/20 active:scale-95"
            >
              {suggestionLoading ? 'Thinking...' : 'Get Suggestion'}
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;