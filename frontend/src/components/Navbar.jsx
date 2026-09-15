import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Sun, Moon, Menu, X, GraduationCap, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = isAuthenticated
    ? [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/courses', label: 'Courses' },
        { to: '/ai-assistant', label: 'AI Assistant' },
        { to: '/community', label: 'Community' },
        { to: '/resume-builder', label: 'Resume' },
      ]
    : [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-purple-100 bg-white/70 backdrop-blur-lg dark:border-royal-darkBorder dark:bg-royal-darkCard/70">
      <div className="page-container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-black text-primary-650 dark:text-primary-400">
          <GraduationCap className="h-7 w-7 text-primary-600 dark:text-primary-400 animate-pulse-subtle" />
          SkillSphere
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-semibold text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-sm font-semibold text-gray-600 hover:text-primary-600 dark:text-gray-300 transition-colors">
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleTheme}
            className="rounded-xl border border-purple-50 p-2 dark:border-royal-darkBorder hover:bg-primary-50 dark:hover:bg-primary-950/20 text-gray-500 dark:text-gray-400 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          {isAuthenticated ? (
            <>
              <NotificationBell />
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setProfileOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-xl border border-purple-100 dark:border-royal-darkBorder py-1.5 pl-1.5 pr-3.5 hover:bg-gray-50 dark:hover:bg-royal-darkCard bg-white dark:bg-royal-darkCard"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-600 text-xs font-bold text-white shadow-sm shadow-primary-500/30">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{user?.name?.split(' ')[0]}</span>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-44 card p-1.5 animate-fade-in border border-purple-100 dark:border-royal-darkBorder bg-white dark:bg-royal-darkCard">
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-705 hover:bg-primary-50/50 dark:hover:bg-royal-darkBg/40 dark:text-gray-300"
                    >
                      <User className="h-4 w-4" /> Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-650 font-semibold hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="hidden items-center gap-3 sm:flex">
              <Link to="/login" className="text-sm font-bold text-gray-650 hover:text-primary-650 dark:text-gray-300 dark:hover:text-primary-400">
                Login
              </Link>
              <Link to="/register" className="btn-primary py-2 px-5 text-xs font-bold">
                Get Started
              </Link>
            </div>
          )}

          <button className="p-2 border border-purple-50 rounded-xl dark:border-royal-darkBorder lg:hidden" onClick={() => setMobileOpen((o) => !o)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-gray-200 dark:border-gray-800 lg:hidden">
          <div className="page-container flex flex-col gap-1 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {link.label}
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800">
                Admin
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800">
                  Profile
                </Link>
                <button onClick={handleLogout} className="rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-primary-600">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
