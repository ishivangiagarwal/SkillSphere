import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  FolderGit2,
  CheckSquare,
  FileText,
  Users,
  Sparkles,
  User,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import NotificationBell from '../components/NotificationBell';

const SidebarLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    const role = user?.role;
    const items = [];

    if (role === 'admin') {
      items.push(
        { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/courses', label: 'Courses', icon: BookOpen },
        { to: '/community', label: 'Community', icon: Users },
        { to: '/ai-assistant', label: 'AI Assistant', icon: Sparkles },
        { to: '/profile', label: 'Profile', icon: User },
      );
    } else if (role === 'mentor') {
      items.push(
        { to: '/mentor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/courses', label: 'Courses', icon: BookOpen },
        { to: '/community', label: 'Community', icon: Users },
        { to: '/ai-assistant', label: 'AI Assistant', icon: Sparkles },
        { to: '/profile', label: 'Profile', icon: User },
      );
    } else {
      items.push(
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/courses', label: 'Courses', icon: BookOpen },
        { to: '/projects', label: 'Projects', icon: FolderGit2 },
        { to: '/tasks', label: 'Tasks', icon: CheckSquare },
        { to: '/notes', label: 'Notes', icon: FileText },
        { to: '/community', label: 'Community', icon: Users },
        { to: '/ai-assistant', label: 'AI Assistant', icon: Sparkles },
        { to: '/profile', label: 'Portfolio', icon: User },
        { to: '/resume-builder', label: 'Resume', icon: FileText },
      );
    }
    return items;
  };

  const navItems = getNavItems();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-royal-lightBg dark:bg-royal-darkBg">
      {/* Sidebar - Desktop */}
      <aside className="hidden w-64 border-r border-purple-100 bg-white p-5 dark:border-royal-darkBorder dark:bg-royal-darkCard lg:block flex-shrink-0">
        <div className="flex flex-col h-full justify-between">
          <div>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 px-2 py-3 text-xl font-black text-primary-600 dark:text-primary-400">
              <GraduationCap className="h-8 w-8 text-primary-600 dark:text-primary-400 animate-pulse-subtle" />
              <span>SkillSphere</span>
            </Link>

            {/* Navigation links */}
            <nav className="mt-8 space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${active
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                      : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600 dark:text-gray-400 dark:hover:bg-primary-950/20 dark:hover:text-primary-400'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </div>
                    {active && <ChevronRight className="h-4 w-4" />}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User profile & controls at bottom */}
          <div className="border-t border-purple-100 dark:border-royal-darkBorder pt-4 mt-6">
            <div className="flex items-center gap-3 px-2 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 text-sm font-bold text-white shadow">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{user?.name}</p>
                <p className="truncate text-xs text-gray-400 capitalize">{user?.role}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 mt-2"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Sidebar - Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-royal-darkBg/60 backdrop-blur-sm">
          <div className="relative flex w-full max-w-xs flex-col bg-white dark:bg-royal-darkCard p-5 border-r border-purple-100 dark:border-royal-darkBorder animate-fade-in">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2 text-xl font-black text-primary-600 dark:text-primary-400">
                <GraduationCap className="h-8 w-8" />
                <span>SkillSphere</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-xl border border-gray-200 p-2 dark:border-royal-darkBorder hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-8 space-y-1.5 flex-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${active
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600 dark:text-gray-400 dark:hover:bg-primary-950/20 dark:hover:text-primary-400'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-purple-100 dark:border-royal-darkBorder pt-4 mt-auto">
              <div className="flex items-center gap-3 px-2 py-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 text-sm font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{user?.name}</p>
                  <p className="truncate text-xs text-gray-400 capitalize">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 mt-2"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main container area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-purple-100 bg-white/80 dark:border-royal-darkBorder dark:bg-royal-darkCard/80 backdrop-blur-md px-6 shadow-sm shadow-purple-500/[0.02]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-xl border border-purple-100 p-2 dark:border-royal-darkBorder hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme switcher */}
            <button
              onClick={toggleTheme}
              className="rounded-xl border border-purple-100 p-2 dark:border-royal-darkBorder hover:bg-primary-50 dark:hover:bg-primary-950/20 text-gray-500 dark:text-gray-400 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {/* Notification */}
            <NotificationBell />

            {/* User Profile display */}
            <Link to="/profile" className="hidden items-center gap-2.5 rounded-xl border border-purple-100 dark:border-royal-darkBorder px-3 py-1.5 hover:bg-primary-50 dark:hover:bg-primary-950/20 sm:flex">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-600 text-xs font-bold text-white shadow-sm shadow-primary-500/30">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-semibold">{user?.name?.split(' ')[0]}</span>
            </Link>
          </div>
        </header>

        {/* Content outlet body */}
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
