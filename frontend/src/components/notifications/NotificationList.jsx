import NotificationItem from './NotificationItem';

export default function NotificationList({ notifications, loading, onMarkRead, onClose }) {
  if (loading && notifications.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 16px',
          color: '#718096',
          fontSize: '14px',
        }}
      >
        Loading notifications…
      </div>
    );
  }

  if (!loading && notifications.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 16px',
          color: '#718096',
          fontSize: '14px',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '32px', lineHeight: 1 }} aria-hidden="true">🔔</span>
        <span>No notifications yet</span>
      </div>
    );
  }

  return (
    <ul
      className="notification-list"
      role="list"
      aria-label="Notification items"
      style={{
        listStyle: 'none',
        margin: 0,
        padding: 0,
      }}
    >
      {notifications.map((notification) => {
        const id = notification.id ?? notification.notification_id;
        return (
          <NotificationItem
            key={id}
            notification={notification}
            onMarkRead={onMarkRead}
            onClose={onClose}
          />
        );
      })}
    </ul>
  );
}
