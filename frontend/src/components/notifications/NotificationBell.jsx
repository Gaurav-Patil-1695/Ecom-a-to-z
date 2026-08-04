import { useState, useEffect, useRef } from 'react';
import bellIcon from '@/assets/icons/bell.svg';
import NotificationList from './NotificationList';
import { useAuth } from '@/store/authStore';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function fetchNotifications(token) {
  const res = await fetch(`${API_BASE}/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.notifications || data || [];
}

async function markAllRead(token) {
  await fetch(`${API_BASE}/notifications/read-all`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
}

async function markOneRead(token, notificationId) {
  await fetch(`${API_BASE}/notifications/${notificationId}/read`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export default function NotificationBell() {
  const { token, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read_at && !n.readAt).length;

  const loadNotifications = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const items = await fetchNotifications(token);
      setNotifications(items);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [user, token]);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleToggle = () => {
    setOpen((prev) => !prev);
    if (!open) {
      loadNotifications();
    }
  };

  const handleMarkAllRead = async () => {
    if (!token) return;
    await markAllRead(token);
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read_at: new Date().toISOString() }))
    );
  };

  const handleMarkOneRead = async (notificationId) => {
    if (!token) return;
    await markOneRead(token, notificationId);
    setNotifications((prev) =>
      prev.map((n) =>
        (n.id === notificationId || n.notification_id === notificationId)
          ? { ...n, read_at: new Date().toISOString() }
          : n
      )
    );
  };

  if (!user) return null;

  return (
    <div className="notification-bell" ref={dropdownRef} style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        className="notification-bell__button"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={handleToggle}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={bellIcon}
          alt=""
          aria-hidden="true"
          width={24}
          height={24}
          style={{ display: 'block' }}
        />
        {unreadCount > 0 && (
          <span
            className="notification-bell__badge"
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              minWidth: '16px',
              height: '16px',
              padding: '0 4px',
              borderRadius: '8px',
              backgroundColor: '#e53e3e',
              color: '#fff',
              fontSize: '10px',
              fontWeight: 700,
              lineHeight: '16px',
              textAlign: 'center',
              boxSizing: 'border-box',
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="notification-bell__dropdown"
          role="dialog"
          aria-label="Notifications"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '360px',
            maxHeight: '480px',
            backgroundColor: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div
            className="notification-bell__dropdown-header"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderBottom: '1px solid #e2e8f0',
              flexShrink: 0,
            }}
          >
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#1a202c' }}>
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: '#3182ce',
                  padding: '0',
                  fontWeight: 500,
                }}
              >
                Mark all as read
              </button>
            )}
          </div>

          <div style={{ overflowY: 'auto', flex: 1 }}>
            <NotificationList
              notifications={notifications}
              loading={loading}
              onMarkRead={handleMarkOneRead}
              onClose={() => setOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
