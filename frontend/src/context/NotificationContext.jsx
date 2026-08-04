import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function apiFetch(path, options = {}, token = null) {
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    let errBody = null;
    try {
      errBody = await res.json();
    } catch {
      // ignore
    }
    const err = new Error(
      (errBody && (errBody.message || errBody.error)) || `HTTP ${res.status}`
    );
    err.status = res.status;
    err.body = errBody;
    throw err;
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export function NotificationProvider({ children }) {
  const { token, isAuthenticated } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const pollingRef = useRef(null);

  const deriveUnreadCount = useCallback((list) => {
    return Array.isArray(list)
      ? list.filter((n) => !n.read && !n.isRead && !n.read_at).length
      : 0;
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated || !token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/notifications', {}, token);
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.notifications)
        ? data.notifications
        : [];
      setNotifications(list);
      setUnreadCount(deriveUnreadCount(list));
    } catch (err) {
      setError(err.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, deriveUnreadCount]);

  const markAsRead = useCallback(
    async (notificationId) => {
      if (!isAuthenticated || !token) return;
      try {
        await apiFetch(
          `/notifications/${notificationId}/read`,
          { method: 'POST' },
          token
        );
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, read: true, isRead: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        setError(err.message || 'Failed to mark notification as read');
      }
    },
    [isAuthenticated, token]
  );

  const markAllAsRead = useCallback(async () => {
    if (!isAuthenticated || !token) return;
    try {
      await apiFetch('/notifications/read-all', { method: 'POST' }, token);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true, isRead: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      setError(err.message || 'Failed to mark all notifications as read');
    }
  }, [isAuthenticated, token]);

  // Initial fetch and polling setup when authenticated
  useEffect(() => {
    if (!isAuthenticated || !token) {
      setNotifications([]);
      setUnreadCount(0);
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      return;
    }

    fetchNotifications();

    // Poll every 60 seconds to keep notification count fresh
    pollingRef.current = setInterval(() => {
      fetchNotifications();
    }, 60000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [isAuthenticated, token, fetchNotifications]);

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return ctx;
}

export default NotificationContext;
