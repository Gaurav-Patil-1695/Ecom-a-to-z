import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#212529',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 24px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '32px',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    lineHeight: '40px',
    letterSpacing: '-0.02em',
    color: '#212529',
    margin: '0',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '24px',
    marginBottom: '40px',
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 4px rgba(33,37,41,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  statLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    lineHeight: '16px',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    color: '#212529',
  },
  statSubtext: {
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
    color: '#495057',
  },
  statAccentBar: {
    height: '4px',
    borderRadius: '3px',
    marginTop: '8px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '700',
    letterSpacing: '-0.01em',
    lineHeight: '32px',
    color: '#212529',
    marginBottom: '20px',
    marginTop: '0',
  },
  tilesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '24px',
    marginBottom: '40px',
  },
  tile: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 4px rgba(33,37,41,0.08)',
    textDecoration: 'none',
    color: '#212529',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    transition: 'box-shadow 0.15s ease, transform 0.15s ease',
    cursor: 'pointer',
    border: '1px solid #e9ecef',
  },
  tileIconWrapper: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileIcon: {
    width: '24px',
    height: '24px',
  },
  tileTitle: {
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '24px',
    color: '#212529',
    margin: '0',
  },
  tileDesc: {
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
    color: '#495057',
    margin: '0',
  },
  tileArrow: {
    fontSize: '18px',
    color: '#4c6ef5',
    alignSelf: 'flex-end',
    marginTop: 'auto',
  },
  recentSection: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 4px rgba(33,37,41,0.08)',
    marginBottom: '40px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    padding: '8px 12px',
    textAlign: 'left',
    borderBottom: '2px solid #e9ecef',
  },
  td: {
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
    color: '#343a40',
    padding: '12px',
    borderBottom: '1px solid #e9ecef',
  },
  badge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    lineHeight: '16px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 24px',
    color: '#495057',
    fontSize: '14px',
  },
  loadingText: {
    textAlign: 'center',
    padding: '40px 24px',
    color: '#495057',
    fontSize: '16px',
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '24px',
    fontSize: '14px',
  },
  navBar: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e9ecef',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
    height: '56px',
  },
  navBrand: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#4c6ef5',
    textDecoration: 'none',
    letterSpacing: '0em',
    lineHeight: '28px',
  },
  navLink: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#343a40',
    textDecoration: 'none',
    padding: '4px 0',
    borderBottom: '2px solid transparent',
    transition: 'color 0.15s, border-color 0.15s',
  },
  navLinkActive: {
    color: '#4c6ef5',
    borderBottomColor: '#4c6ef5',
  },
  codeFont: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '14px',
  },
};

const STATUS_BADGE_STYLES = {
  pending: { backgroundColor: '#fff4e6', color: '#fd7e14' },
  processing: { backgroundColor: '#e8ecfd', color: '#4c6ef5' },
  shipped: { backgroundColor: '#e8ecfd', color: '#3b5bdb' },
  delivered: { backgroundColor: '#d3f9d8', color: '#37b24d' },
  cancelled: { backgroundColor: '#ffe3e3', color: '#f03e3e' },
  returned: { backgroundColor: '#e9ecef', color: '#495057' },
  default: { backgroundColor: '#e9ecef', color: '#495057' },
};

function getStatusBadgeStyle(status) {
  if (!status) return STATUS_BADGE_STYLES.default;
  const key = status.toLowerCase();
  return STATUS_BADGE_STYLES[key] || STATUS_BADGE_STYLES.default;
}

const QUICK_TILES = [
  {
    title: 'Products',
    description: 'Manage catalogue, SKUs, and images',
    to: '/admin/products',
    color: '#e8ecfd',
    iconColor: '#4c6ef5',
    icon: 'package',
  },
  {
    title: 'Categories',
    description: 'Create and organise product categories',
    to: '/admin/categories',
    color: '#d3f9d8',
    iconColor: '#37b24d',
    icon: 'grid',
  },
  {
    title: 'Brands',
    description: 'Add and manage brands',
    to: '/admin/brands',
    color: '#fff3e6',
    iconColor: '#fd7e14',
    icon: 'star',
  },
  {
    title: 'Orders',
    description: 'View and process customer orders',
    to: '/admin/orders',
    color: '#ffe3e3',
    iconColor: '#f03e3e',
    icon: 'cart',
  },
  {
    title: 'Return Requests',
    description: 'Review and approve return requests',
    to: '/admin/returns',
    color: '#fff4e6',
    iconColor: '#fd7e14',
    icon: 'package',
  },
  {
    title: 'Promo Codes',
    description: 'Create and manage promotional codes',
    to: '/admin/promos',
    color: '#e8ecfd',
    iconColor: '#3b5bdb',
    icon: 'edit',
  },
  {
    title: 'Reports',
    description: 'View sales and performance reports',
    to: '/admin/reports',
    color: '#d3f9d8',
    iconColor: '#37b24d',
    icon: 'external-link',
  },
];

const ICON_MAP = {
  package: '/src/assets/icons/package.svg',
  cart: '/src/assets/icons/cart.svg',
  star: '/src/assets/icons/star.svg',
  edit: '/src/assets/icons/edit.svg',
  'external-link': '/src/assets/icons/external-link.svg',
  grid: '/src/assets/icons/check.svg',
};

function TileIcon({ icon, color, iconColor }) {
  return (
    <div style={{ ...styles.tileIconWrapper, backgroundColor: color }}>
      <img
        src={ICON_MAP[icon] || ICON_MAP['package']}
        alt=""
        style={{ ...styles.tileIcon, filter: 'none' }}
        aria-hidden="true"
      />
    </div>
  );
}

function StatCard({ label, value, subtext, accentColor }) {
  return (
    <div style={styles.statCard}>
      <span style={styles.statLabel}>{label}</span>
      <span style={styles.statValue}>{value}</span>
      {subtext && <span style={styles.statSubtext}>{subtext}</span>}
      <div style={{ ...styles.statAccentBar, backgroundColor: accentColor || '#4c6ef5' }} />
    </div>
  );
}

function QuickTile({ tile }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={tile.to}
      style={{
        ...styles.tile,
        boxShadow: hovered
          ? '0 4px 16px rgba(76,110,245,0.12)'
          : '0 1px 4px rgba(33,37,41,0.08)',
        transform: hovered ? 'translateY(-2px)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <TileIcon icon={tile.icon} color={tile.color} iconColor={tile.iconColor} />
      <p style={styles.tileTitle}>{tile.title}</p>
      <p style={styles.tileDesc}>{tile.description}</p>
      <span style={styles.tileArrow} aria-hidden="true">
        &rarr;
      </span>
    </Link>
  );
}

const MOCK_RECENT_ORDERS = [
  { orderId: 'ORD-10042', customer: 'Alice Johnson', total: '₹2,450', status: 'delivered', date: '2024-06-10' },
  { orderId: 'ORD-10041', customer: 'Bob Smith', total: '₹870', status: 'processing', date: '2024-06-10' },
  { orderId: 'ORD-10040', customer: 'Carol White', total: '₹5,100', status: 'shipped', date: '2024-06-09' },
  { orderId: 'ORD-10039', customer: 'David Lee', total: '₹330', status: 'pending', date: '2024-06-09' },
  { orderId: 'ORD-10038', customer: 'Eve Kumar', total: '₹1,200', status: 'cancelled', date: '2024-06-08' },
];

const MOCK_STATS = [
  { label: 'Total Orders', value: '1,284', subtext: '+12 today', accentColor: '#4c6ef5' },
  { label: 'Revenue', value: '₹4,82,310', subtext: 'This month', accentColor: '#37b24d' },
  { label: 'Active Users', value: '3,921', subtext: '+58 this week', accentColor: '#fd7e14' },
  { label: 'Pending Returns', value: '17', subtext: 'Awaiting review', accentColor: '#f03e3e' },
  { label: 'Products', value: '342', subtext: '28 out of stock', accentColor: '#3b5bdb' },
  { label: 'Promo Codes', value: '9', subtext: 'Active codes', accentColor: '#fd7e14' },
];

export default function AdminDashboard() {
  const [stats] = useState(MOCK_STATS);
  const [recentOrders] = useState(MOCK_RECENT_ORDERS);
  const [loading] = useState(false);
  const [error] = useState(null);

  return (
    <div style={styles.page}>
      <nav style={styles.navBar} role="navigation" aria-label="Admin navigation">
        <Link to="/admin" style={styles.navBrand}>
          Admin Panel
        </Link>
        <Link
          to="/admin"
          style={{ ...styles.navLink, ...styles.navLinkActive }}
          aria-current="page"
        >
          Dashboard
        </Link>
        <Link to="/admin/reports" style={styles.navLink}>
          Reports
        </Link>
      </nav>

      <main style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>Admin Dashboard</h1>
        </div>

        {error && (
          <div style={styles.errorBanner} role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <div style={styles.loadingText} role="status" aria-live="polite">
            Loading dashboard data…
          </div>
        ) : (
          <>
            <section aria-labelledby="stats-heading">
              <h2 id="stats-heading" style={{ ...styles.sectionTitle, fontSize: '20px', fontWeight: '600' }}>
                Overview
              </h2>
              <div style={styles.statsGrid}>
                {stats.map((stat) => (
                  <StatCard
                    key={stat.label}
                    label={stat.label}
                    value={stat.value}
                    subtext={stat.subtext}
                    accentColor={stat.accentColor}
                  />
                ))}
              </div>
            </section>

            <section aria-labelledby="quick-access-heading">
              <h2 id="quick-access-heading" style={styles.sectionTitle}>
                Quick Access
              </h2>
              <div style={styles.tilesGrid}>
                {QUICK_TILES.map((tile) => (
                  <QuickTile key={tile.title} tile={tile} />
                ))}
              </div>
            </section>

            <section aria-labelledby="recent-orders-heading">
              <h2 id="recent-orders-heading" style={styles.sectionTitle}>
                Recent Orders
              </h2>
              <div style={styles.recentSection}>
                {recentOrders.length === 0 ? (
                  <div style={styles.emptyState}>No recent orders found.</div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={styles.table} aria-label="Recent orders">
                      <thead>
                        <tr>
                          <th style={styles.th} scope="col">Order ID</th>
                          <th style={styles.th} scope="col">Customer</th>
                          <th style={styles.th} scope="col">Total</th>
                          <th style={styles.th} scope="col">Status</th>
                          <th style={styles.th} scope="col">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order) => {
                          const badgeStyle = getStatusBadgeStyle(order.status);
                          return (
                            <tr key={order.orderId}>
                              <td style={styles.td}>
                                <span style={styles.codeFont}>{order.orderId}</span>
                              </td>
                              <td style={styles.td}>{order.customer}</td>
                              <td style={styles.td}>{order.total}</td>
                              <td style={styles.td}>
                                <span
                                  style={{
                                    ...styles.badge,
                                    backgroundColor: badgeStyle.backgroundColor,
                                    color: badgeStyle.color,
                                  }}
                                >
                                  {order.status}
                                </span>
                              </td>
                              <td style={styles.td}>{order.date}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
