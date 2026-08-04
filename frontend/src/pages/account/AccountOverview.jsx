import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 16px',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    color: '#212529',
    margin: '0 0 8px 0',
  },
  pageSub: {
    fontSize: '14px',
    color: '#495057',
    margin: '0 0 32px 0',
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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(33,37,41,0.08)',
    marginBottom: '24px',
  },
  profileRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  avatar: {
    width: '64px',
    height: '64px',
    borderRadius: '9999px',
    backgroundColor: '#e8ecfd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: '700',
    color: '#4c6ef5',
    flexShrink: 0,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#212529',
    margin: '0 0 4px 0',
  },
  profileEmail: {
    fontSize: '14px',
    color: '#495057',
    margin: '0',
  },
  editLink: {
    color: '#4c6ef5',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  tilesRow: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '24px',
  },
  tile: {
    flex: '1',
    minWidth: '140px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '20px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    boxShadow: '0 1px 3px rgba(33,37,41,0.08)',
    transition: 'box-shadow 0.15s',
    border: '1px solid transparent',
  },
  tileIcon: {
    width: '32px',
    height: '32px',
  },
  tileName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    margin: 0,
  },
  tileSub: {
    fontSize: '14px',
    color: '#495057',
    margin: 0,
  },
  quickLinksCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 1px 3px rgba(33,37,41,0.08)',
    overflow: 'hidden',
    marginBottom: '24px',
  },
  quickLinkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 20px',
    borderBottom: '1px solid #868e96',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    fontSize: '16px',
    color: '#212529',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    justifyContent: 'flex-start',
    borderBottom: '1px solid #e9ecef',
  },
  quickLinkItemLast: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 20px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    fontSize: '16px',
    color: '#212529',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    justifyContent: 'flex-start',
  },
  quickLinkIcon: {
    width: '20px',
    height: '20px',
    flexShrink: 0,
  },
  quickLinkLabel: {
    flex: 1,
    fontWeight: '500',
  },
  quickLinkChevron: {
    width: '16px',
    height: '16px',
    color: '#868e96',
  },
  skeletonBase: {
    backgroundColor: '#e9ecef',
    borderRadius: '6px',
    animation: 'shimmer 1.5s infinite',
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
  },
  badge: {
    display: 'inline-block',
    backgroundColor: '#e8ecfd',
    color: '#4c6ef5',
    borderRadius: '9999px',
    padding: '2px 10px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
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

function QuickLinkButton({ icon, label, onClick, isLast = false }) {
  const baseStyle = isLast ? styles.quickLinkItemLast : styles.quickLinkItem;
  return (
    <button
      style={baseStyle}
      onClick={onClick}
      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f8f9fa'; }}
      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
      onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '-2px'; }}
      onBlur={e => { e.currentTarget.style.outline = 'none'; }}
    >
      {icon && (
        <img src={icon} alt="" aria-hidden="true" style={styles.quickLinkIcon} />
      )}
      <span style={styles.quickLinkLabel}>{label}</span>
      <img src="/src/assets/icons/chevron-right.svg" alt="" aria-hidden="true" style={{ width: '16px', height: '16px', opacity: 0.4 }} />
    </button>
  );
}

export default function AccountOverview() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [addressCount, setAddressCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [userRes, notifRes, ordersRes, addrRes] = await Promise.all([
          fetch('/api/users/me', { headers }),
          fetch('/api/notifications', { headers }),
          fetch('/api/orders', { headers }),
          fetch('/api/users/me/addresses', { headers }),
        ]);

        if (!userRes.ok) throw new Error('Failed to load account data.');

        const userData = await userRes.json();
        setUser(userData);

        if (notifRes.ok) {
          const notifData = await notifRes.json();
          const notifications = notifData.data || notifData.notifications || notifData || [];
          const unread = Array.isArray(notifications)
            ? notifications.filter(n => !n.read_at && !n.readAt).length
            : 0;
          setUnreadCount(unread);
        }

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          const orders = ordersData.data || ordersData.orders || ordersData || [];
          setOrderCount(Array.isArray(orders) ? orders.length : 0);
        }

        if (addrRes.ok) {
          const addrData = await addrRes.json();
          const addrs = addrData.data || addrData.addresses || addrData || [];
          setAddressCount(Array.isArray(addrs) ? addrs.length : 0);
        }
      } catch (err) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function getInitials(name) {
    if (!name) return '?';
    return name
      .split(' ')
      .map(p => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <SkeletonLine width="240px" height="40px" style={{ marginBottom: '8px' }} />
          <SkeletonLine width="320px" height="20px" style={{ marginBottom: '32px' }} />
          <div style={styles.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ ...styles.skeletonBase, width: '64px', height: '64px', borderRadius: '9999px' }} />
              <div style={{ flex: 1 }}>
                <SkeletonLine width="180px" height="20px" style={{ marginBottom: '8px' }} />
                <SkeletonLine width="240px" height="16px" />
              </div>
            </div>
          </div>
          <div style={styles.tilesRow}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ ...styles.tile, cursor: 'default' }}>
                <SkeletonLine width="32px" height="32px" style={{ borderRadius: '6px' }} />
                <SkeletonLine width="80px" height="16px" />
                <SkeletonLine width="120px" height="14px" />
              </div>
            ))}
          </div>
          <div style={styles.quickLinksCard}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ padding: '16px 20px', borderBottom: i < 3 ? '1px solid #e9ecef' : 'none' }}>
                <SkeletonLine width="160px" height="16px" />
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
        <h1 style={styles.pageTitle}>My Account</h1>
        <p style={styles.pageSub}>
          Save your details for faster checkout and access your full order history anytime.
        </p>

        {error && (
          <div style={styles.errorBanner} role="alert">
            <span style={{ fontSize: '18px' }}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Profile Summary */}
        <div style={styles.card}>
          <p style={{ ...styles.sectionLabel, marginBottom: '16px' }}>Profile summary</p>
          <div style={styles.profileRow}>
            <div style={styles.avatar} aria-hidden="true">
              {user ? getInitials(`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.name || user.email || '') : '?'}
            </div>
            <div style={styles.profileInfo}>
              <p style={styles.profileName}>
                {user
                  ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.name || 'Account Holder'
                  : 'Account Holder'}
              </p>
              <p style={styles.profileEmail}>
                {user ? user.email : ''}
              </p>
            </div>
            <button
              style={{ ...styles.editLink, background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
              onClick={() => navigate('/account/profile')}
              aria-label="Edit profile"
            >
              <img src="/src/assets/icons/edit.svg" alt="Edit" style={{ width: '18px', height: '18px' }} />
            </button>
          </div>
        </div>

        {/* Stat Tiles */}
        <div style={styles.tilesRow}>
          {/* Orders tile */}
          <div
            role="button"
            tabIndex={0}
            style={styles.tile}
            onClick={() => navigate('/account/orders')}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate('/account/orders'); }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(76,110,245,0.15)'; e.currentTarget.style.border = '1px solid #4c6ef5'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(33,37,41,0.08)'; e.currentTarget.style.border = '1px solid transparent'; }}
            onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
            onBlur={e => { e.currentTarget.style.outline = 'none'; }}
            aria-label="View order history"
          >
            <img src="/src/assets/icons/package.svg" alt="" aria-hidden="true" style={styles.tileIcon} />
            <p style={styles.tileName}>{orderCount}</p>
            <p style={styles.tileSub}>Orders</p>
            <span style={{ fontSize: '12px', color: '#495057' }}>Track your orders and view order history</span>
          </div>

          {/* Addresses tile */}
          <div
            role="button"
            tabIndex={0}
            style={styles.tile}
            onClick={() => navigate('/account/addresses')}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate('/account/addresses'); }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(76,110,245,0.15)'; e.currentTarget.style.border = '1px solid #4c6ef5'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(33,37,41,0.08)'; e.currentTarget.style.border = '1px solid transparent'; }}
            onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
            onBlur={e => { e.currentTarget.style.outline = 'none'; }}
            aria-label="Manage addresses"
          >
            <img src="/src/assets/icons/map-pin.svg" alt="" aria-hidden="true" style={styles.tileIcon} />
            <p style={styles.tileName}>{addressCount}</p>
            <p style={styles.tileSub}>Addresses</p>
            <span style={{ fontSize: '12px', color: '#495057' }}>Manage your saved addresses</span>
          </div>

          {/* Notifications tile */}
          <div
            role="button"
            tabIndex={0}
            style={styles.tile}
            onClick={() => navigate('/account/notifications')}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate('/account/notifications'); }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(76,110,245,0.15)'; e.currentTarget.style.border = '1px solid #4c6ef5'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(33,37,41,0.08)'; e.currentTarget.style.border = '1px solid transparent'; }}
            onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
            onBlur={e => { e.currentTarget.style.outline = 'none'; }}
            aria-label="View notifications"
          >
            <img src="/src/assets/icons/bell.svg" alt="" aria-hidden="true" style={styles.tileIcon} />
            <p style={styles.tileName}>
              {unreadCount > 0 ? (
                <span style={styles.badge}>{unreadCount} new</span>
              ) : (
                unreadCount
              )}
            </p>
            <span style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#495057' }}>Notifications</span>
            <p style={{ margin: 0, fontSize: '14px', color: '#495057' }}>Unread notifications</p>
          </div>
        </div>

        {/* Quick Links */}
        <p style={styles.sectionLabel}>Quick links</p>
        <div style={styles.quickLinksCard}>
          <button
            style={styles.quickLinkItem}
            onClick={() => navigate('/account/profile')}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f8f9fa'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '-2px'; }}
            onBlur={e => { e.currentTarget.style.outline = 'none'; }}
          >
            <img src="/src/assets/icons/user.svg" alt="" aria-hidden="true" style={{ width: '20px', height: '20px', flexShrink: 0 }} />
            <span style={styles.quickLinkLabel}>Edit profile</span>
            <img src="/src/assets/icons/chevron-right.svg" alt="" aria-hidden="true" style={{ width: '16px', height: '16px', opacity: 0.4 }} />
          </button>

          <button
            style={styles.quickLinkItem}
            onClick={() => navigate('/account/orders')}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f8f9fa'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '-2px'; }}
            onBlur={e => { e.currentTarget.style.outline = 'none'; }}
          >
            <img src="/src/assets/icons/package.svg" alt="" aria-hidden="true" style={{ width: '20px', height: '20px', flexShrink: 0 }} />
            <span style={styles.quickLinkLabel}>Order history</span>
            <img src="/src/assets/icons/chevron-right.svg" alt="" aria-hidden="true" style={{ width: '16px', height: '16px', opacity: 0.4 }} />
          </button>

          <button
            style={styles.quickLinkItem}
            onClick={() => navigate('/account/addresses')}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f8f9fa'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '-2px'; }}
            onBlur={e => { e.currentTarget.style.outline = 'none'; }}
          >
            <img src="/src/assets/icons/map-pin.svg" alt="" aria-hidden="true" style={{ width: '20px', height: '20px', flexShrink: 0 }} />
            <span style={styles.quickLinkLabel}>Saved addresses</span>
            <img src="/src/assets/icons/chevron-right.svg" alt="" aria-hidden="true" style={{ width: '16px', height: '16px', opacity: 0.4 }} />
          </button>

          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 20px',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              width: '100%',
              textAlign: 'left',
              fontSize: '16px',
              color: '#212529',
              fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              justifyContent: 'flex-start',
            }}
            onClick={() => navigate('/account/notifications')}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f8f9fa'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '-2px'; }}
            onBlur={e => { e.currentTarget.style.outline = 'none'; }}
          >
            <img src="/src/assets/icons/bell.svg" alt="" aria-hidden="true" style={{ width: '20px', height: '20px', flexShrink: 0 }} />
            <span style={styles.quickLinkLabel}>Notifications</span>
            {unreadCount > 0 && (
              <span style={{ ...styles.badge, marginRight: '8px' }}>{unreadCount}</span>
            )}
            <img src="/src/assets/icons/chevron-right.svg" alt="" aria-hidden="true" style={{ width: '16px', height: '16px', opacity: 0.4 }} />
          </button>
        </div>
      </div>
    </div>
  );
}
