import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  container: {
    maxWidth: '720px',
    margin: '0 auto',
    padding: '32px 16px',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    color: '#4c6ef5',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '24px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    color: '#212529',
    margin: '0',
  },
  pageSub: {
    fontSize: '14px',
    color: '#495057',
    margin: '0 0 32px 0',
    lineHeight: '1.5',
  },
  btnGhost: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '10px 20px',
    backgroundColor: 'transparent',
    color: '#4c6ef5',
    fontSize: '14px',
    fontWeight: '600',
    border: '1px solid #4c6ef5',
    borderRadius: '10px',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    minHeight: '44px',
    transition: 'background-color 0.15s',
    whiteSpace: 'nowrap',
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '10px 24px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    minHeight: '44px',
    transition: 'background-color 0.15s',
    textDecoration: 'none',
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    border: '1px solid #f03e3e',
    borderRadius: '10px',
    padding: '16px 20px',
    color: '#f03e3e',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
  },
  successBanner: {
    backgroundColor: '#d3f9d8',
    border: '1px solid #37b24d',
    borderRadius: '10px',
    padding: '16px 20px',
    color: '#37b24d',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
  },
  skeletonBase: {
    backgroundColor: '#e9ecef',
    borderRadius: '6px',
  },
  notifList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 1px 3px rgba(33,37,41,0.08)',
    overflow: 'hidden',
  },
  notifItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    padding: '16px 20px',
    borderBottom: '1px solid #e9ecef',
    cursor: 'pointer',
    transition: 'background-color 0.12s',
    position: 'relative',
    background: 'none',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    borderBottom: '1px solid #e9ecef',
  },
  notifItemUnread: {
    backgroundColor: '#f1f3ff',
  },
  notifItemRead: {
    backgroundColor: '#ffffff',
  },
  notifDot: {
    width: '10px',
    height: '10px',
    borderRadius: '9999px',
    backgroundColor: '#4c6ef5',
    flexShrink: 0,
    marginTop: '6px',
  },
  notifDotRead: {
    width: '10px',
    height: '10px',
    borderRadius: '9999px',
    backgroundColor: 'transparent',
    flexShrink: 0,
    marginTop: '6px',
  },
  notifContent: {
    flex: 1,
    minWidth: 0,
  },
  notifTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
    margin: '0 0 4px 0',
    lineHeight: '1.4',
  },
  notifTitleRead: {
    fontSize: '14px',
    fontWeight: '400',
    color: '#495057',
    margin: '0 0 4px 0',
    lineHeight: '1.4',
  },
  notifBody: {
    fontSize: '16px',
    color: '#212529',
    margin: '0 0 6px 0',
    lineHeight: '1.625',
  },
  notifBodyRead: {
    fontSize: '16px',
    color: '#495057',
    margin: '0 0 6px 0',
    lineHeight: '1.625',
  },
  notifTime: {
    fontSize: '12px',
    color: '#868e96',
    margin: '0',
  },
  notifActions: {
    display: 'flex',
    flexShrink: 0,
    alignItems: 'center',
  },
  markReadBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#4c6ef5',
    fontSize: '12px',
    fontWeight: '500',
    padding: '4px 8px',
    borderRadius: '6px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    whiteSpace: 'nowrap',
    minHeight: '44px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '64px 24px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 1px 3px rgba(33,37,41,0.08)',
    textAlign: 'center',
  },
  emptyIcon: {
    width: '48px',
    height: '48px',
    marginBottom: '16px',
    opacity: 0.35,
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#212529',
    margin: '0 0 8px 0',
  },
  emptyText: {
    fontSize: '14px',
    color: '#495057',
    margin: '0 0 24px 0',
    lineHeight: '1.5',
  },
  sectionLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    marginBottom: '16px',
  },
  unreadBadge: {
    display: 'inline-block',
    backgroundColor: '#e8ecfd',
    color: '#4c6ef5',
    borderRadius: '9999px',
    padding: '2px 10px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginLeft: '10px',
    verticalAlign: 'middle',
  },
};

function SkeletonLine({ width = '100%', height = '16px', style = {} }) {
  return (
    <div
      style={{
        ...styles.skeletonBase,
        width,
        height,
        ...style,
      }}
    />
  );
}

function formatRelativeTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  const now = new Date();
  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

function NotificationItem({ notification, onMarkRead, markingRead }) {
  const isRead = !!(notification.read_at || notification.readAt);
  const title = notification.title || notification.subject || '';
  const body = notification.body || notification.message || notification.content || '';
  const createdAt = notification.created_at || notification.createdAt || '';

  return (
    <div
      style={{
        ...styles.notifItem,
        ...(isRead ? styles.notifItemRead : styles.notifItemUnread),
      }}
      role="article"
      aria-label={isRead ? title : `Unread: ${title}`}
    >
      <div style={isRead ? styles.notifDotRead : styles.notifDot} aria-hidden="true" />
      <div style={styles.notifContent}>
        {title ? (
          <p style={isRead ? styles.notifTitleRead : styles.notifTitle}>{title}</p>
        ) : null}
        {body ? (
          <p style={isRead ? styles.notifBodyRead : styles.notifBody}>{body}</p>
        ) : null}
        {createdAt && (
          <p style={styles.notifTime}>
            <time dateTime={createdAt}>{formatRelativeTime(createdAt)}</time>
          </p>
        )}
      </div>
      {!isRead && (
        <div style={styles.notifActions}>
          <button
            style={styles.markReadBtn}
            onClick={() => onMarkRead(notification.id)}
            disabled={markingRead === notification.id}
            aria-label={`Mark notification as read: ${title}`}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#e8ecfd'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
            onBlur={e => { e.currentTarget.style.outline = 'none'; }}
          >
            {markingRead === notification.id ? 'Marking…' : 'Mark read'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function Notifications() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [markingRead, setMarkingRead] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  const showToast = useCallback((message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch('/api/notifications', { headers });
      if (!res.ok) throw new Error('Unable to load notifications. Please try again.');
      const data = await res.json();
      const list = data.data || data.notifications || data || [];
      setNotifications(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message || 'Unable to load notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  async function handleMarkRead(notificationId) {
    setMarkingRead(notificationId);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const res = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
        headers,
      });
      if (!res.ok) throw new Error('Failed to mark notification as read.');
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId
            ? { ...n, read_at: new Date().toISOString(), readAt: new Date().toISOString() }
            : n
        )
      );
    } catch (err) {
      showToast(err.message || 'Failed to mark notification as read.', 'error');
    } finally {
      setMarkingRead(null);
    }
  }

  async function handleMarkAllRead() {
    setMarkingAll(true);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const res = await fetch('/api/notifications/read-all', {
        method: 'POST',
        headers,
      });
      if (!res.ok) throw new Error('Failed to mark all notifications as read.');
      const now = new Date().toISOString();
      setNotifications(prev =>
        prev.map(n => ({ ...n, read_at: now, readAt: now }))
      );
      showToast('All notifications marked as read', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to mark all notifications as read.', 'error');
    } finally {
      setMarkingAll(false);
    }
  }

  const unreadCount = notifications.filter(n => !n.read_at && !n.readAt).length;

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <SkeletonLine width="80px" height="16px" style={{ marginBottom: '24px' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '12px' }}>
            <SkeletonLine width="200px" height="40px" style={{ flex: 'none' }} />
            <SkeletonLine width="140px" height="44px" style={{ borderRadius: '10px', flex: 'none' }} />
          </div>
          <SkeletonLine width="260px" height="16px" style={{ marginBottom: '32px' }} />
          <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0 1px 3px rgba(33,37,41,0.08)', overflow: 'hidden' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px 20px', borderBottom: i < 5 ? '1px solid #e9ecef' : 'none' }}>
                <SkeletonLine width="10px" height="10px" style={{ borderRadius: '9999px', marginTop: '6px', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <SkeletonLine width="160px" height="14px" style={{ marginBottom: '8px' }} />
                  <SkeletonLine width="100%" height="16px" style={{ marginBottom: '6px' }} />
                  <SkeletonLine width="80%" height="16px" style={{ marginBottom: '8px' }} />
                  <SkeletonLine width="60px" height="12px" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Back link */}
        <button
          style={styles.backLink}
          onClick={() => navigate('/account')}
          onMouseEnter={e => { e.currentTarget.style.color = '#3b5bdb'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#4c6ef5'; }}
          onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
          onBlur={e => { e.currentTarget.style.outline = 'none'; }}
          aria-label="Back to account overview"
        >
          <img
            src="/src/assets/icons/chevron-left.svg"
            alt=""
            aria-hidden="true"
            style={{ width: '16px', height: '16px' }}
          />
          Back to account
        </button>

        {/* Page header */}
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>
            Notifications
            {unreadCount > 0 && (
              <span style={styles.unreadBadge} aria-label={`${unreadCount} unread`}>
                {unreadCount} new
              </span>
            )}
          </h1>
          {unreadCount > 0 && (
            <button
              style={{
                ...styles.btnGhost,
                ...(markingAll ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
              }}
              onClick={handleMarkAllRead}
              disabled={markingAll}
              onMouseEnter={e => { if (!markingAll) e.currentTarget.style.backgroundColor = '#f1f3ff'; }}
              onMouseLeave={e => { if (!markingAll) e.currentTarget.style.backgroundColor = 'transparent'; }}
              onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
              onBlur={e => { e.currentTarget.style.outline = 'none'; }}
            >
              {markingAll ? 'Marking…' : 'Mark all as read'}
            </button>
          )}
        </div>
        <p style={styles.pageSub}>Stay up to date with your orders, returns, and account activity.</p>

        {/* Toast */}
        {toastMessage && (
          <div
            style={toastType === 'success' ? styles.successBanner : styles.errorBanner}
            role="status"
            aria-live="polite"
          >
            <span style={{ fontSize: '18px' }}>{toastType === 'success' ? '✓' : '⚠️'}</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div style={styles.errorBanner} role="alert">
            <span style={{ fontSize: '18px' }}>⚠️</span>
            <span>{error}</span>
            <button
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                color: '#f03e3e',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                padding: '0',
                minHeight: '44px',
              }}
              onClick={fetchNotifications}
              onFocus={e => { e.currentTarget.style.outline = '2px solid #f03e3e'; e.currentTarget.style.outlineOffset = '2px'; }}
              onBlur={e => { e.currentTarget.style.outline = 'none'; }}
              aria-label="Retry loading notifications"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty state */}
        {!error && notifications.length === 0 && (
          <div style={styles.emptyState}>
            <img
              src="/src/assets/icons/bell.svg"
              alt=""
              aria-hidden="true"
              style={styles.emptyIcon}
            />
            <p style={styles.emptyTitle}>You're all caught up — no notifications yet</p>
            <p style={styles.emptyText}>
              We'll notify you about your orders, returns, and account activity.
            </p>
            <button
              style={styles.btnPrimary}
              onClick={() => navigate('/products')}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#3b5bdb'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#4c6ef5'; }}
              onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
              onBlur={e => { e.currentTarget.style.outline = 'none'; }}
            >
              Browse products
            </button>
          </div>
        )}

        {/* Notification list */}
        {!error && notifications.length > 0 && (
          <div>
            <p style={styles.sectionLabel}>
              {notifications.length} {notifications.length === 1 ? 'notification' : 'notifications'}
            </p>
            <div
              style={styles.notifList}
              role="list"
              aria-label="Notifications"
            >
              {notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  role="listitem"
                  style={{
                    borderBottom: index < notifications.length - 1 ? '1px solid #e9ecef' : 'none',
                  }}
                >
                  <NotificationItem
                    notification={notification}
                    onMarkRead={handleMarkRead}
                    markingRead={markingRead}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
