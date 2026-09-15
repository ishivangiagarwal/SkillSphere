import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Users, BookOpen, MessageSquare, GraduationCap, Trash2, Shield, ShieldOff } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import * as adminService from '../services/adminService';
import * as courseService from '../services/courseService';
import * as postService from '../services/postService';
import Loader from '../components/Loader';
import Card from '../components/Card';
import Badge from '../components/Badge';

const TABS = ['Overview', 'Users', 'Courses', 'Posts'];

const AdminPanel = () => {
  const [tab, setTab] = useState('Overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, coursesRes] = await Promise.all([
        adminService.getStats(),
        adminService.getAllUsers(),
        courseService.getCourses(),
      ]);
      setStats(statsRes);
      setUsers(usersRes.users);
      setCourses(coursesRes.courses);
    } catch {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleToggleActive = async (user) => {
    try {
      await adminService.updateUser(user._id, { isActive: !user.isActive });
      setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, isActive: !u.isActive } : u)));
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await adminService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success('User deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Delete this course permanently?')) return;
    try {
      await adminService.adminDeleteCourse(id);
      setCourses((prev) => prev.filter((c) => c._id !== id));
      toast.success('Course deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete course');
    }
  };

  if (loading) return <Loader full />;

  return (
    <div className="page-container py-10">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-bold sm:text-3xl">Admin Panel</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Manage users, courses, and platform activity.</p>
      </div>

      <div className="mb-8 flex gap-2 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Overview' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Card className="flex items-center gap-3"><Users className="h-8 w-8 text-primary-600" /><div><p className="text-xl font-bold">{stats.stats.totalUsers}</p><p className="text-xs text-gray-500">Total Users</p></div></Card>
            <Card className="flex items-center gap-3"><BookOpen className="h-8 w-8 text-accent-600" /><div><p className="text-xl font-bold">{stats.stats.totalCourses}</p><p className="text-xs text-gray-500">Courses</p></div></Card>
            <Card className="flex items-center gap-3"><MessageSquare className="h-8 w-8 text-purple-600" /><div><p className="text-xl font-bold">{stats.stats.totalPosts}</p><p className="text-xs text-gray-500">Posts</p></div></Card>
            <Card className="flex items-center gap-3"><GraduationCap className="h-8 w-8 text-emerald-500" /><div><p className="text-xl font-bold">{stats.stats.totalEnrollments}</p><p className="text-xs text-gray-500">Enrollments</p></div></Card>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <h3 className="mb-4 font-semibold">Users by Role</h3>
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

            {stats.coursesByCategory?.length > 0 && (
              <Card>
                <h3 className="mb-4 font-semibold">Courses by Category</h3>
                <ResponsiveContainer width="100%" height={220}>
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
        </div>
      )}

      {tab === 'Users' && (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 dark:border-gray-800 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">Status</th><th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-gray-50 dark:border-gray-900">
                  <td className="p-4 font-medium">{u.name}</td>
                  <td className="p-4 text-gray-500">{u.email}</td>
                  <td className="p-4"><Badge text={u.role} variant={u.role} /></td>
                  <td className="p-4">
                    <span className={`text-xs font-semibold ${u.isActive ? 'text-green-600' : 'text-red-500'}`}>
                      {u.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleToggleActive(u)} className="rounded-lg border border-gray-200 dark:border-gray-700 p-1.5 hover:bg-gray-50 dark:hover:bg-gray-800" title={u.isActive ? 'Deactivate' : 'Activate'}>
                        {u.isActive ? <ShieldOff className="h-4 w-4 text-amber-500" /> : <Shield className="h-4 w-4 text-green-500" />}
                      </button>
                      <button onClick={() => handleDeleteUser(u._id)} className="rounded-lg border border-gray-200 dark:border-gray-700 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === 'Courses' && (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 dark:border-gray-800 text-left text-xs uppercase text-gray-500">
              <tr><th className="p-4">Title</th><th className="p-4">Category</th><th className="p-4">Instructor</th><th className="p-4">Actions</th></tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c._id} className="border-b border-gray-50 dark:border-gray-900">
                  <td className="p-4 font-medium">{c.title}</td>
                  <td className="p-4 text-gray-500">{c.category}</td>
                  <td className="p-4 text-gray-500">{c.instructor?.name}</td>
                  <td className="p-4">
                    <button onClick={() => handleDeleteCourse(c._id)} className="rounded-lg border border-gray-200 dark:border-gray-700 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === 'Posts' && <PostsTab />}
    </div>
  );
};

const PostsTab = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await postService.getPosts();
        setPosts(res.posts);
      } catch {
        toast.error('Failed to load posts');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post permanently?')) return;
    try {
      await adminService.adminDeletePost(id);
      setPosts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Post deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete post');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-4">
      {posts.map((p) => (
        <Card key={p._id} className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">{p.author?.name}</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{p.content}</p>
          </div>
          <button onClick={() => handleDelete(p._id)} className="flex-shrink-0 rounded-lg border border-gray-200 dark:border-gray-700 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20">
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
        </Card>
      ))}
    </div>
  );
};

export default AdminPanel;