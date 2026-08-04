import checkIcon from '@/assets/icons/check.svg';
import packageIcon from '@/assets/icons/package.svg';
import bellIcon from '@/assets/icons/bell.svg';

function formatTimestamp(ts) {
  if (!ts) return '';
  const date = new Date(ts);
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
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function getNotificationIcon(type) {
  if (!type) return bellIcon;
  const lower = type.toLowerCase();
  if (lower.includes('order') || lower.includes('ship') || lower.includes('deliver')) return packageIcon;
  if (lower.includes('confirm') || lower.includes('success') || lower.includes('complete')) return checkIcon;
  return bellIcon;
}

export default function NotificationItem({ notification, onMarkRead, onClose }) {
  const id = notification.id ?? notification.notification_id;
  const isRead = Boolean(notification.read_at || notification.readAt);
  const message = notification.message || notification.body || '';
  const type = notification.type || '';
  const createdAt = notification.created_at || notification.createdAt || null;
  const iconSrc = getNotificationIcon(type);

  const handleMarkRead = (e) => {
    e.stopPropagation();
    if (!isRead && onMarkRead) {
      onMarkRead(id);
    }
  };

  return (
    <li
      className={`notification-item${isRead ? ' notification-item--read' : ' notification-item--unread'}`}
      role="listitem"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '12px 16px',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: isRead ? '#fff' : '#ebf8ff',
        transition: 'background-color 0.2s',
        cursor: 'default',
      }}
    >
      <div
        className="notification-item__icon"
        aria-hidden="true"
        style={{
          flexShrink: 0,
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: isRead ? '#e2e8f0' : '#bee3f8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={iconSrc}
          alt=""
          width={18}
          height={18}
          style={{ display: 'block', opacity: isRead ? 0.5 : 1 }}
        />
      </div>

      <div
        className="notification-item__body"
        style={{ flex: 1, minWidth: 0 }}
      >
        <p
          className="notification-item__message"
          style={{
            margin: 0,
            fontSize: '14px',
            lineHeight: '1.4',
            color: isRead ? '#718096' : '#1a202c',
            fontWeight: isRead ? 400 : 500,
            wordBreak: 'break-word',
          }}
        >
          {message}
        </p>
        {createdAt && (
          <time
            className="notification-item__timestamp"
            dateTime={createdAt}
            style={{
              display: 'block',
              marginTop: '4px',
              fontSize: '12px',
              color: '#a0aec0',
            }}
          >
            {formatTimestamp(createdAt)}
          </time>
        )}
      </div>

      {!isRead && (
        <button
          className="notification-item__mark-read"
          aria-label="Mark notification as read"
          onClick={handleMarkRead}
          title="Mark as read"
          style={{
            flexShrink: 0,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              display: 'block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#3182ce',
            }}
          />
        </button>
      )}
    </li>
  );
}
