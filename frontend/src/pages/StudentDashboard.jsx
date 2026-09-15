import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Clock,
  Award,
  User,
  Bell,
  Play,
  BarChart3,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import * as userService from '../services/userService';
import * as enrollmentService from '../services/enrollmentService';
import * as notificationService from '../services/notificationService';
import * as aiService from '../services/aiService';
import Loader from '../components/Loader';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import EmptyState from '../components/EmptyState';
import Badge from '../components/Badge';

const COLORS = ['#7c3aed', '#22d3ee', '#f97316', '#10b981'];

const StudentDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestion, setSuggestion] = useState('');
  const [suggestionLoading, setSuggestionLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, enrollRes, notifRes] = await Promise.all([
          userService.getDashboard(),
          enrollmentService.getMyEnrollments(),
          notificationService.getNotifications(),
        ]);
        setData(dashRes);
        setEnrollments(enrollRes.enrollments || []);
        setNotifications(notifRes.notifications || []);
      } catch (err) {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleGetSuggestion = async () => {
    setSuggestionLoading(true);
    try {
      const topic =
        data?.recentEnrollments?.[0]?.course?.category || 'web development';
      const res = await aiService.chatWithAI(
        `In 2-3 short sentences, suggest what a student learning ${topic} should focus on next to improve their skills.`,
        'ask'
      );
      setSuggestion(res.chat.response);
    } catch {
      toast.error('AI suggestion unavailable. Check API key.');
    } finally {
      setSuggestionLoading(false);
    }
  };

  if (loading) return <Loader full />;

  const stats = data?.stats || {};
  const recentEnrollments = data?.recentEnrollments || [];
  const unreadNotifs = notifications.filter((n) => !n.isRead);
  const inProgress = enrollments.filter((e) => e.status === 'in-progress');
  const completed = enrollments.filter((e) => e.status === 'completed');

  const chartData = [
    { name: 'Completed', value: stats.completedCourses || 0 },
    { name: 'In Progress', value: stats.inProgressCourses || 0 },
  ];

  const categoryData = enrollments.reduce((acc, e) => {
    const cat = e.course?.category || 'Other';
    const existing = acc.find((c) => c.name === cat);
    if (existing) existing.count++;
    else acc.push({ name: cat, count: 1 });
    return acc;
  }, []);

  return (
    <div className="page-container animate-fade-in space-y-8 py-6">
      {/* Welcome Section */}
      <div className="rounded-2xl bg-gradient-to-r from-primary-600 via-purple-600 to-indigo-600 p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="mt-1 text-purple-200 text-sm">
              {stats.inProgressCourses > 0
                ? `You have ${stats.inProgressCourses} course${stats.inProgressCourses > 1 ? 's' : ''} in progress. Keep going!`
                : 'Ready to start a new learning journey?'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 text-sm font-semibold transition-all"
            >
              <BookOpen className="h-4 w-4" /> Browse Courses
            </Link>
          </div>
        </div>
        {/* Quick stats row */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl bg-white/10 backdrop-blur-sm p-3 text-center">
            <p className="text-xl font-black">{enrollments.length}</p>
            <p className="text-xs text-purple-200">Enrolled</p>
          </div>
          <div className="rounded-xl bg-white/10 backdrop-blur-sm p-3 text-center">
            <p className="text-xl font-black">{completed.length}</p>
            <p className="text-xs text-purple-200">Completed</p>
          </div>
          <div className="rounded-xl bg-white/10 backdrop-blur-sm p-3 text-center">
            <p className="text-xl font-black">{stats.avgProgress || 0}%</p>
            <p className="text-xs text-purple-200">Avg Progress</p>
          </div>
          <div className="rounded-xl bg-white/10 backdrop-blur-sm p-3 text-center">
            <p className="text-xl font-black">{unreadNotifs.length}</p>
            <p className="text-xs text-purple-200">Updates</p>
          </div>
        </div>
      </div>

      {/* Main grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={BookOpen}
              label="Courses Enrolled"
              value={stats.totalCourses || 0}
              color="primary"
            />
            <StatCard
              icon={CheckCircle2}
              label="Completed"
              value={stats.completedCourses || 0}
              color="green"
            />
            <StatCard
              icon={TrendingUp}
              label="Avg Progress"
              value={`${stats.avgProgress || 0}%`}
              color="amber"
            />
            <StatCard
              icon={Award}
              label="Certificates"
              value={stats.completedCourses || 0}
              color="purple"
            />
          </div>

          {/* Continue Learning */}
          {inProgress.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Continue Learning
                  </h2>
                  <p className="text-xs text-gray-400">Pick up where you left off</p>
                </div>
                <Play className="h-5 w-5 text-primary-500" />
              </div>
              <div className="space-y-4">
                {inProgress.slice(0, 4).map((e) => (
                  <Link
                    to={`/courses/${e.course?._id}`}
                    key={e._id}
                    className="block rounded-xl border border-purple-50 dark:border-royal-darkBorder hover:border-primary-300 dark:hover:border-primary-800 p-4 bg-gray-50/20 dark:bg-royal-darkBg/10 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                        {e.course?.title}
                      </p>
                      <span className="text-[10px] font-bold text-primary-500">
                        {e.progress}%
                      </span>
                    </div>
                    <ProgressBar value={e.progress} showLabel={false} />
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {/* Enrolled Courses */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  My Courses
                </h2>
                <p className="text-xs text-gray-400">
                  {enrollments.length} course{enrollments.length !== 1 && 's'} enrolled
                </p>
              </div>
              <Link
                to="/courses"
                className="flex items-center gap-1 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
              >
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {enrollments.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                title="No courses enrolled"
                description="Explore courses and start learning today."
                action={
                  <Link to="/courses" className="btn-primary mt-2">
                    Browse Courses
                  </Link>
                }
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {enrollments.slice(0, 6).map((e) => (
                  <Link
                    to={`/courses/${e.course?._id}`}
                    key={e._id}
                    className="block rounded-xl border border-purple-100 dark:border-royal-darkBorder p-4 hover:border-primary-300 dark:hover:border-primary-800 hover:shadow-sm transition-all bg-white dark:bg-royal-darkCard"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                          {e.course?.title}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {e.course?.category}
                        </p>
                      </div>
                      <Badge
                        text={e.status === 'completed' ? 'Done' : `${e.progress}%`}
                        variant={e.status === 'completed' ? 'Beginner' : 'Intermediate'}
                      />
                    </div>
                    <ProgressBar value={e.progress} showLabel={false} />
                  </Link>
                ))}
              </div>
            )}
          </Card>

          {/* Recommended Courses */}
          {recentEnrollments.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Recommended For You
                  </h2>
                  <p className="text-xs text-gray-400">
                    Based on your interests
                  </p>
                </div>
                <Sparkles className="h-5 w-5 text-amber-400" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {enrollments
                  .filter((e) => e.status === 'in-progress')
                  .slice(0, 4)
                  .map((e) => (
                    <div
                      key={e._id}
                      className="rounded-xl border border-purple-100 dark:border-royal-darkBorder p-4 bg-gradient-to-br from-primary-50/50 to-transparent dark:from-primary-950/10"
                    >
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {e.course?.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {e.course?.category} • Continue your learning journey
                      </p>
                      <Link
                        to={`/courses/${e.course?._id}`}
                        className="inline-flex items-center gap-1 mt-3 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        Resume <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right column - 1/3 width */}
        <div className="space-y-6">
          {/* Profile Summary */}
          <Card className="p-6 text-center">
            <div className="flex justify-center mb-3">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-2xl font-black text-white shadow-md shadow-primary-500/20">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {user?.name}
            </h3>
            <p className="text-xs text-gray-400">{user?.email}</p>
            <div className="mt-3">
              <Badge text={user?.role || 'student'} variant={user?.role || 'student'} />
            </div>
            <Link
              to="/profile"
              className="btn-secondary w-full mt-4 py-2 text-xs"
            >
              <User className="h-3.5 w-3.5" /> View Profile
            </Link>
          </Card>

          {/* Learning Progress Chart */}
          <Card className="p-6">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">
              Learning Progress
            </h2>
            {stats.totalCourses > 0 ? (
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={4}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-3 w-full">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {stats.completedCourses || 0}
                    </p>
                    <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-primary-500" /> Completed
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {stats.inProgressCourses || 0}
                    </p>
                    <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-cyan-400" /> In Progress
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="py-8 text-center text-xs text-gray-400">
                Enroll in courses to see your progress
              </p>
            )}
          </Card>

          {/* Categories Distribution */}
          {categoryData.length > 0 && (
            <Card className="p-6">
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">
                Learning Categories
              </h2>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Notifications */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Notifications
              </h2>
              <Bell className="h-4 w-4 text-gray-400" />
            </div>
            {notifications.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">
                No notifications yet
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.slice(0, 5).map((n) => (
                  <div
                    key={n._id}
                    className={`rounded-lg p-3 text-xs ${
                      !n.isRead
                        ? 'bg-primary-50 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/30'
                        : 'bg-gray-50 dark:bg-royal-darkBg/20'
                    }`}
                  >
                    <p
                      className={`${
                        !n.isRead
                          ? 'font-semibold text-gray-900 dark:text-white'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {n.message}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* AI Suggestion */}
          <Card className="p-6 bg-gradient-to-br from-primary-950 to-indigo-950 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-[18px] w-[18px] text-amber-400" />
              <h2 className="text-sm font-bold">AI Suggestion</h2>
            </div>
            {suggestion ? (
              <p className="text-xs font-medium leading-relaxed text-gray-300">
                {suggestion}
              </p>
            ) : (
              <p className="text-xs text-gray-400">
                Get a personalized learning suggestion.
              </p>
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

export default StudentDashboard;

