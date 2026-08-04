import { useState, useEffect, useCallback, useRef } from 'react';
import api from '@/api/client';

const POLL_INTERVAL_MS = 30000;

const useNotifications = () => {
  const [list, setList] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications');
      const notifications = response.data?.notifications ?? response.data ?? [];
      setList(notifications);
      setUnreadCount(notifications.filter((n) => !n.read).length);
      setError(null);
    } catch (err) {
      setError(err?.response?.data?.message ?? err.message ?? 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  const markRead = useCallback(async (notificationId) => {
    try {
      await api.post(`/notifications/${notificationId}/read`);
      setList((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      setError(err?.response?.data?.message ?? err.message ?? 'Failed to mark notification as read');
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await api.post('/notifications/read-all');
      setList((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      setError(err?.response?.data?.message ?? err.message ?? 'Failed to mark all notifications as read');
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    intervalRef.current = setInterval(fetchNotifications, POLL_INTERVAL_MS);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchNotifications]);

  return { list, unreadCount, loading, error, markRead, markAllRead, refresh: fetchNotifications };
};

export default useNotifications;
