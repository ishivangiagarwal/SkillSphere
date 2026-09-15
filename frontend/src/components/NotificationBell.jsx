import { useEffect, useState, useRef } from 'react';
import { Bell, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as notificationService from '../services/notificationService';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getNotifications();
      setNotifications(res.notifications);
      setUnreadCount(res.unreadCount);
    } catch {
      // silently ignore - notifications are non-critical
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    fetchNotifications();
  };

  const handleMarkRead = async (id) => {
    await notificationService.markAsRead(id);
    fetchNotifications();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 card p-0 z-50 animate-fade-in">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 p-3">
            <h4 className="font-semibold text-sm">Notifications</h4>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="text-xs text-primary-600 hover:underline">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-sm text-gray-500">No notifications yet</p>
            ) : (
              notifications.map((n) => (
                <Link
                  to={n.link || '#'}
                  key={n._id}
                  onClick={() => !n.isRead && handleMarkRead(n._id)}
                  className={`block border-b border-gray-50 dark:border-gray-800 p-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    !n.isRead ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!n.isRead ? (
                      <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary-500" />
                    ) : (
                      <Check className="mt-0.5 h-3 w-3 flex-shrink-0 text-gray-400" />
                    )}
                    <span>{n.message}</span>
                  </div>
                  <span className="ml-4 mt-1 block text-[11px] text-gray-400">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
