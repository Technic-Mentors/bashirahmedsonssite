import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { adminApi } from '../../../api/client';
import { formatDateTime } from '../../../utils/format';
import { useDisclosure } from '../../../hooks/useDisclosure';

export default function NotificationBell() {
  const { isOpen, toggle, close } = useDisclosure();
  const [data, setData] = useState({ notifications: [], unreadCount: 0 });
  const ref = useRef(null);
  const navigate = useNavigate();

  async function load() {
    const { data: res } = await adminApi.get('/notifications');
    setData(res.data);
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) close();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [close]);

  async function handleMarkAllRead() {
    setData((d) => ({ notifications: [], unreadCount: 0 }));
    await adminApi.put('/notifications/read-all');
  }

  async function handleNotificationClick(notification) {
    setData((d) => ({
      notifications: d.notifications.filter((n) => n.id !== notification.id),
      unreadCount: notification.is_read ? d.unreadCount : Math.max(0, d.unreadCount - 1),
    }));

    if (!notification.is_read) {
      adminApi.put(`/notifications/${notification.id}/read`).catch(() => {});
    }
    if (notification.link) {
      close();
      navigate(notification.link);
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={toggle} className="relative text-charcoal-light hover:text-gold-600" aria-label="Notifications">
        <BellIcon />
        {data.unreadCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[10px] font-semibold text-white">
            {data.unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-30 mt-2 w-80 rounded-lg border border-stone-200 bg-white shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-stone-100 px-4 py-3">
              <span className="text-sm font-semibold text-charcoal">Notifications</span>
              {data.notifications.length > 0 && (
                <button onClick={handleMarkAllRead} className="text-xs font-medium text-gold-600 hover:text-gold-700">
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {data.notifications.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-charcoal-light">No notifications yet.</p>
              ) : (
                <AnimatePresence initial={false}>
                  {data.notifications.map((n) => (
                    <motion.button
                      key={n.id}
                      type="button"
                      onClick={() => handleNotificationClick(n)}
                      initial={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`block w-full overflow-hidden border-b border-stone-50 px-4 py-3 text-left transition-colors hover:bg-stone-50 ${n.is_read ? '' : 'bg-gold-50/40'}`}
                    >
                      <p className="text-sm font-medium text-charcoal">{n.title}</p>
                      <p className="text-xs text-charcoal-light">{n.message}</p>
                      <p className="mt-1 text-[11px] text-stone-400">{formatDateTime(n.created_at)}</p>
                    </motion.button>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
