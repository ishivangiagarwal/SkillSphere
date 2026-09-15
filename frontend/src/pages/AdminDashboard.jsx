import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  GraduationCap,
  MessageSquare,
  Search,
  Trash2,
  Shield,
  ShieldOff,
  CheckCircle,
  XCircle,
  Bell,
  Activity,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import toast from 'react-hot-toast';
import * as adminService from '../services/adminService';
import * as courseService from '../services/courseService';
import * as notificationService from '../services/notificationService';
import Loader from '../components/Loader';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';

const CHART_COLORS = ['#7c3aed', '#22d3ee', '#f97316', '#10b981', '#e11d48', '#6366f1'];

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'users', label: 'Users' },
  { id: 'courses', label: 'Courses' },
  { id: 'mentors', label: 'Mentors' },
  { id: 'analytics', label: 'Analytics' },
];

const AdminDashboard = () => {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [courseSearch, setCourseSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const loadAll = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, coursesRes, mentorsRes, notifRes] = await Promise.all([
        adminService.getStats(),
        adminService.getAllUsers(),
        courseService.getCourses(),
        adminService.getMentors().catch(() => ({ mentors: [] })),
        notificationService.getNotifications().catch(() => ({ notifications: [], unreadCount: 0 })),
      ]);
      setStats(statsRes);
      setUsers(usersRes.users || []);
      setCourses(coursesRes.courses || []);
      setMentors(mentorsRes.mentors || []);
      setNotifications(notifRes.notifications || []);
    } catch {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredCourses = courses.filter((c) =>
    c.title?.toLowerCase().includes(courseSearch.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleToggleActive = async (u) => {
    try {
      await adminService.updateUser(u._id, { isActive: !u.isActive });
      setUsers((prev) =>
        prev.map((x) => (x._id === u._id ? { ...x, isActive: !u.isActive } : x))
      );
      toast.success(`User ${u.isActive ? 'deactivated' : 'activated'}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await adminService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success('User deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Delete this course permanently?')) return;
    try {
      await adminService.adminDeleteCourse(id);
      setCourses((prev) => prev.filter((c) => c._id !== id));
      toast.success('Course deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleApproveMentor = async (mentorId, approved) => {
    try {
      await adminService.updateUser(mentorId, { isActive: approved });
      setMentors((prev) =>
        prev.map((m) => (m._id === mentorId ? { ...m, isActive: approved } : m))
      );
      toast.success(`Mentor ${approved ? 'approved' : 'rejected'}`);
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  if (loading) return <Loader full />;

  const unreadNotifs = notifications.filter((n) => !n.isRead);

  return (
    <div className="page-container animate-fade-in space-y-6 py-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage users, courses, mentors, and platform activity
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t.id
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard icon={Users} label="Total Users" value={stats.stats?.totalUsers || 0} color="primary" />
            <StatCard icon={Users} label="Students" value={stats.stats?.totalStudents || 0} color="blue" />
            <StatCard icon={GraduationCap} label="Mentors" value={stats.stats?.totalMentors || 0} color="purple" />
            <StatCard icon={BookOpen} label="Courses" value={stats.stats?.totalCourses || 0} color="green" />
            <StatCard icon={MessageSquare} label="Posts" value={stats.stats?.totalPosts || 0} color="amber" />
            <StatCard icon={GraduationCap} label="Enrollments" value={stats.stats?.totalEnrollments || 0} color="cyan" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {stats.usersByRole?.length > 0 && (
              <Card className="p-6">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Users by Role</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stats.usersByRole}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="role" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}
            {stats.coursesByCategory?.length > 0 && (
              <Card className="p-6">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Courses by Category</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={stats.coursesByCategory}
                      dataKey="count"
                      nameKey="category"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      label={({ category, count }) => `${category}: ${count}`}
                    >
                      {stats.coursesByCategory.map((entry, index) => (
                        <Cell key={entry.category} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            )}
          </div>

          {/* Recent Activity & Notifications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary-500" /> Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <span className="h-2 w-2 rounded-full bg-primary-500" />
                  {users.length} users registered
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  {courses.length} courses available
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  {mentors.length} mentors on platform
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  {stats.stats?.totalEnrollments || 0} total enrollments
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary-500" /> Notifications
                </h3>
                {unreadNotifs.length > 0 && (
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    {unreadNotifs.length}
                  </span>
                )}
              </div>
              {notifications.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">No notifications</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {notifications.slice(0, 6).map((n) => (
                    <div
                      key={n._id}
                      className={`rounded-lg p-2.5 text-xs ${
                        !n.isRead
                          ? 'bg-primary-50 dark:bg-primary-950/20'
                          : 'bg-gray-50 dark:bg-royal-darkBg/20'
                      }`}
                    >
                      <p className={!n.isRead ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-500'}>
                        {n.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {tab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                className="input-field pl-9"
                placeholder="Search users by name or email..."
                value={userSearch}
                onChange={(e) => { setUserSearch(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <select className="input-field sm:w-48" value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}>
              <option value="all">All Roles</option>
              <option value="student">Student</option>
              <option value="mentor">Mentor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <Card className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 dark:border-gray-800 text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Joined</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((u) => (
                  <tr key={u._id} className="border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50/50 dark:hover:bg-gray-900/20">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center text-xs font-bold text-white">
                          {u.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-500">{u.email}</td>
                    <td className="p-4"><Badge text={u.role} variant={u.role} /></td>
                    <td className="p-4">
                      <span className={`text-xs font-semibold ${u.isActive ? 'text-green-600' : 'text-red-500'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleToggleActive(u)}
                          className="rounded-lg border border-gray-200 dark:border-royal-darkBorder p-1.5 hover:bg-gray-50 dark:hover:bg-gray-800"
                          title={u.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {u.isActive ? <ShieldOff className="h-3.5 w-3.5 text-amber-500" /> : <Shield className="h-3.5 w-3.5 text-green-500" />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="rounded-lg border border-gray-200 dark:border-royal-darkBorder p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-gray-200 dark:border-royal-darkBorder p-2 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-gray-200 dark:border-royal-darkBorder p-2 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Courses Tab */}
      {tab === 'courses' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              className="input-field pl-9"
              placeholder="Search courses..."
              value={courseSearch}
              onChange={(e) => setCourseSearch(e.target.value)}
            />
          </div>
          {filteredCourses.length === 0 ? (
            <EmptyState icon={BookOpen} title="No courses found" description="Try adjusting your search." />
          ) : (
            <Card className="overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100 dark:border-gray-800 text-left text-xs uppercase text-gray-500">
                  <tr>
                    <th className="p-4">Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Level</th>
                    <th className="p-4">Instructor</th>
                    <th className="p-4">Published</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((c) => (
                    <tr key={c._id} className="border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50/50 dark:hover:bg-gray-900/20">
                      <td className="p-4 font-medium">{c.title}</td>
                      <td className="p-4 text-gray-500">{c.category}</td>
                      <td className="p-4"><Badge text={c.level} variant={c.level} /></td>
                      <td className="p-4 text-gray-500">{c.instructor?.name || 'Unknown'}</td>
                      <td className="p-4">
                        <span className={`text-xs font-semibold ${c.isPublished !== false ? 'text-green-600' : 'text-amber-500'}`}>
                          {c.isPublished !== false ? 'Yes' : 'Draft'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          <Link
                            to={`/courses/${c._id}`}
                            className="rounded-lg border border-gray-200 dark:border-royal-darkBorder p-1.5 hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <svg className="h-3.5 w-3.5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleDeleteCourse(c._id)}
                            className="rounded-lg border border-gray-200 dark:border-royal-darkBorder p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </div>
      )}

      {/* Mentors Tab */}
      {tab === 'mentors' && (
        <div className="space-y-4">
          {mentors.length === 0 ? (
            <EmptyState icon={GraduationCap} title="No mentors registered" description="Mentors will appear here when they sign up." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mentors.map((m) => (
                <Card key={m._id} className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-sm font-bold text-white">
                      {m.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{m.name}</p>
                      <p className="text-xs text-gray-400 truncate">{m.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge text="mentor" variant="mentor" />
                    <span className={`text-xs font-semibold ${m.isActive ? 'text-green-600' : 'text-red-500'}`}>
                      {m.isActive ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {!m.isActive ? (
                      <button
                        onClick={() => handleApproveMentor(m._id, true)}
                        className="flex-1 btn-primary py-1.5 text-xs"
                      >
                        <CheckCircle className="h-3.5 w-3.5" /> Approve
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApproveMentor(m._id, false)}
                        className="flex-1 btn-secondary py-1.5 text-xs"
                      >
                        <XCircle className="h-3.5 w-3.5" /> Revoke
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteUser(m._id)}
                      className="rounded-lg border border-gray-200 dark:border-royal-darkBorder p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {tab === 'analytics' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Users} label="Total Users" value={stats.stats?.totalUsers || 0} color="primary" />
            <StatCard icon={BookOpen} label="Total Courses" value={stats.stats?.totalCourses || 0} color="green" />
            <StatCard icon={MessageSquare} label="Total Posts" value={stats.stats?.totalPosts || 0} color="amber" />
            <StatCard icon={GraduationCap} label="Total Enrollments" value={stats.stats?.totalEnrollments || 0} color="cyan" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {stats.usersByRole?.length > 0 && (
              <Card className="p-6">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Users by Role</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={stats.usersByRole}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="role" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}
            {stats.coursesByCategory?.length > 0 && (
              <Card className="p-6">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Courses by Category</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={stats.coursesByCategory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}
          </div>

          <Card className="p-6">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Platform Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="rounded-xl bg-primary-50 dark:bg-primary-950/30 p-4">
                <p className="text-2xl font-black text-primary-600">{stats.stats?.totalStudents || 0}</p>
                <p className="text-xs text-gray-500">Students</p>
              </div>
              <div className="rounded-xl bg-purple-50 dark:bg-purple-950/30 p-4">
                <p className="text-2xl font-black text-purple-600">{stats.stats?.totalMentors || 0}</p>
                <p className="text-xs text-gray-500">Mentors</p>
              </div>
              <div className="rounded-xl bg-green-50 dark:bg-green-950/30 p-4">
                <p className="text-2xl font-black text-green-600">{stats.stats?.totalCourses || 0}</p>
                <p className="text-xs text-gray-500">Courses</p>
              </div>
              <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 p-4">
                <p className="text-2xl font-black text-amber-600">{stats.stats?.totalEnrollments || 0}</p>
                <p className="text-xs text-gray-500">Enrollments</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

