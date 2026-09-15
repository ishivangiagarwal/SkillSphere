import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  Plus,
  Settings,
  Bell,
  User,
  Edit3,
  Trash2,
  Eye,
  ArrowRight,
  GraduationCap,
  BarChart3,
  Clock,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import * as mentorService from '../services/mentorService';
import * as courseService from '../services/courseService';
import * as enrollmentService from '../services/enrollmentService';
import * as notificationService from '../services/notificationService';
import Loader from '../components/Loader';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import EmptyState from '../components/EmptyState';
import Badge from '../components/Badge';
import Modal from '../components/Modal';

const MentorDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    level: 'Beginner',
    tags: '',
    duration: 10,
  });
  const [creating, setCreating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, notifRes] = await Promise.all([
          mentorService.getMentorDashboard(),
          notificationService.getNotifications(),
        ]);
        setDashboard(dashRes);
        setNotifications(notifRes.notifications || []);
      } catch (err) {
        toast.error('Failed to load mentor dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const payload = {
        ...createForm,
        tags: createForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
        duration: Number(createForm.duration),
      };
      await courseService.createCourse(payload);
      toast.success('Course created successfully');
      setShowCreateModal(false);
      setCreateForm({
        title: '',
        description: '',
        category: 'Web Development',
        level: 'Beginner',
        tags: '',
        duration: 10,
      });
      // Refresh dashboard
      const dashRes = await mentorService.getMentorDashboard();
      setDashboard(dashRes);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create course');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Delete this course permanently? This cannot be undone.')) return;
    try {
      await courseService.deleteCourse(courseId);
      toast.success('Course deleted');
      const dashRes = await mentorService.getMentorDashboard();
      setDashboard(dashRes);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete course');
    }
  };

  const handleViewStudents = async (course) => {
    setSelectedCourse(course);
    setStudentsLoading(true);
    try {
      const res = await mentorService.getCourseStudents(course._id);
      setStudents(res.students || []);
    } catch (err) {
      toast.error('Failed to load students');
    } finally {
      setStudentsLoading(false);
    }
  };

  if (loading) return <Loader full />;

  const stats = dashboard?.stats || { totalCourses: 0, totalStudents: 0 };
  const courses = dashboard?.courses || [];
  const recentEnrollments = dashboard?.recentEnrollments || [];
  const unreadNotifs = notifications.filter((n) => !n.isRead);

  const chartData = courses.map((c) => ({
    name: c.title?.length > 15 ? c.title.substring(0, 15) + '...' : c.title || 'Untitled',
    students: c.enrolledStudents || 0,
    progress: c.avgProgress || 0,
  }));

  const CATEGORIES = [
    'Web Development',
    'Data Science',
    'Mobile Development',
    'DevOps',
    'AI & ML',
    'Programming Basics',
  ];

  return (
    <div className="page-container animate-fade-in space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Mentor Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your courses and students
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary shadow-lg shadow-primary-500/25"
          >
            <Plus className="h-4 w-4" /> Create Course
          </button>
          <Link to="/profile" className="btn-secondary py-2.5">
            <Settings className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={BookOpen}
          label="Total Courses"
          value={stats.totalCourses}
          color="primary"
        />
        <StatCard
          icon={Users}
          label="Total Students"
          value={stats.totalStudents}
          color="blue"
        />
        <StatCard
          icon={GraduationCap}
          label="Active Students"
          value={courses.reduce((sum, c) => sum + (c.enrolledStudents || 0), 0)}
          color="green"
        />
        <StatCard
          icon={BarChart3}
          label="Avg Course Progress"
          value={
            courses.length > 0
              ? `${Math.round(courses.reduce((s, c) => s + (c.avgProgress || 0), 0) / courses.length)}%`
              : '—'
          }
          color="amber"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
        {['overview', 'courses', 'students'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium border-b-2 transition-colors capitalize ${
              activeTab === tab
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            {tab === 'overview' ? 'Overview' : tab === 'courses' ? 'My Courses' : 'Student Progress'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Course Analytics Chart */}
          {chartData.length > 0 && (
            <Card className="p-6">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
                Course Analytics
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="students" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Students" />
                  <Bar dataKey="progress" fill="#22d3ee" radius={[4, 4, 0, 0]} name="Avg Progress %" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Recent Enrollments */}
          <Card className="p-6">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
              Recent Enrollments
            </h3>
            {recentEnrollments.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No enrollments yet"
                description="Students will appear here when they enroll in your courses."
              />
            ) : (
              <div className="space-y-3">
                {recentEnrollments.slice(0, 8).map((e) => (
                  <div
                    key={e._id}
                    className="flex items-center justify-between rounded-xl border border-purple-50 dark:border-royal-darkBorder p-3 bg-gray-50/20 dark:bg-royal-darkBg/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center text-xs font-bold text-white">
                        {e.student?.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          {e.student?.name || 'Unknown Student'}
                        </p>
                        <p className="text-xs text-gray-400">
                          Enrolled in {e.course?.title || 'Unknown Course'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-gray-400">
                        {new Date(e.enrolledAt || e.createdAt).toLocaleDateString()}
                      </span>
                      <ProgressBar value={e.progress || 0} showLabel={false} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Notifications */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Notifications
              </h3>
              <Bell className="h-4 w-4 text-gray-400" />
            </div>
            {notifications.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">No notifications</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {notifications.slice(0, 5).map((n) => (
                  <div
                    key={n._id}
                    className={`rounded-lg p-3 text-xs ${
                      !n.isRead
                        ? 'bg-primary-50 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/30'
                        : 'bg-gray-50 dark:bg-royal-darkBg/20'
                    }`}
                  >
                    <p className={!n.isRead ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                      {n.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'courses' && (
        <div className="space-y-4">
          {courses.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No courses yet"
              description="Create your first course to get started."
              action={
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary mt-2"
                >
                  <Plus className="h-4 w-4" /> Create Course
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {courses.map((course) => (
                <Card
                  key={course._id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {course.title}
                      </h4>
                      <Badge
                        text={course.isPublished ? 'Published' : 'Draft'}
                        variant={course.isPublished ? 'Beginner' : 'Intermediate'}
                      />
                    </div>
                    <p className="text-xs text-gray-400">
                      {course.category} • {course.level} • {course.enrolledStudents || 0} students
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>Avg Progress: {course.avgProgress || 0}%</span>
                      <span>Completed: {course.completedStudents || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/courses/${course._id}`}
                      className="rounded-lg border border-gray-200 dark:border-royal-darkBorder p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                      title="View Course"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      to={`/courses/${course._id}`}
                      className="rounded-lg border border-gray-200 dark:border-royal-darkBorder p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                      title="Edit Course"
                    >
                      <Edit3 className="h-4 w-4 text-primary-600" />
                    </Link>
                    <button
                      onClick={() => handleDeleteCourse(course._id)}
                      className="rounded-lg border border-gray-200 dark:border-royal-darkBorder p-2 hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Delete Course"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                    <button
                      onClick={() => handleViewStudents(course)}
                      className="btn-secondary py-2 px-3 text-xs"
                    >
                      <Users className="h-3.5 w-3.5" /> Students
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'students' && (
        <div className="space-y-4">
          {courses.length === 0 ? (
            <EmptyState icon={Users} title="No courses to track" description="Create courses to see student progress." />
          ) : (
            courses.map((course) => (
              <Card key={course._id} className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    {course.title}
                  </h4>
                  <button
                    onClick={() => handleViewStudents(course)}
                    className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    View Details
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-black text-gray-900 dark:text-white">
                      {course.enrolledStudents || 0}
                    </p>
                    <p className="text-[10px] text-gray-400">Enrolled</p>
                  </div>
                  <div>
                    <p className="text-lg font-black text-gray-900 dark:text-white">
                      {course.completedStudents || 0}
                    </p>
                    <p className="text-[10px] text-gray-400">Completed</p>
                  </div>
                  <div>
                    <p className="text-lg font-black text-gray-900 dark:text-white">
                      {course.avgProgress || 0}%
                    </p>
                    <p className="text-[10px] text-gray-400">Avg Progress</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Create Course Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Course"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreateCourse} className="space-y-4">
          <div>
            <label className="label-text">Course Title</label>
            <input
              className="input-field"
              placeholder="e.g. Advanced React Development"
              value={createForm.title}
              onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label-text">Description</label>
            <textarea
              rows={3}
              className="input-field"
              placeholder="Describe what students will learn..."
              value={createForm.description}
              onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-text">Category</label>
              <select
                className="input-field"
                value={createForm.category}
                onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-text">Level</label>
              <select
                className="input-field"
                value={createForm.level}
                onChange={(e) => setCreateForm({ ...createForm, level: e.target.value })}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-text">Duration (hours)</label>
              <input
                type="number"
                className="input-field"
                min={1}
                value={createForm.duration}
                onChange={(e) => setCreateForm({ ...createForm, duration: e.target.value })}
              />
            </div>
            <div>
              <label className="label-text">Tags (comma separated)</label>
              <input
                className="input-field"
                placeholder="React, Hooks, State"
                value={createForm.tags}
                onChange={(e) => setCreateForm({ ...createForm, tags: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-3 pt-3">
            <button type="submit" disabled={creating} className="btn-primary py-2.5 px-6">
              {creating ? 'Creating...' : 'Create Course'}
            </button>
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="btn-secondary py-2.5 px-6"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Students Modal */}
      <Modal
        isOpen={!!selectedCourse && !showCreateModal}
        onClose={() => setSelectedCourse(null)}
        title={selectedCourse ? `Students - ${selectedCourse.title}` : 'Students'}
        maxWidth="max-w-2xl"
      >
        {studentsLoading ? (
          <Loader />
        ) : students.length === 0 ? (
          <EmptyState icon={Users} title="No students enrolled" description="Share your course to attract students." />
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {students.map((s) => (
              <div
                key={s._id}
                className="flex items-center justify-between rounded-xl border border-purple-50 dark:border-royal-darkBorder p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                    {s.student?.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {s.student?.name || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-400">{s.student?.email}</p>
                  </div>
                </div>
                <div className="text-right w-32">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                    {s.progress}% complete
                  </p>
                  <ProgressBar value={s.progress} showLabel={false} />
                  <p className="text-[10px] text-gray-400 mt-1">
                    {s.completedLessons}/{s.totalLessons} lessons
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MentorDashboard;

