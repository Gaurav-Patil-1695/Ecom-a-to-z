import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#212529',
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
    flexWrap: 'wrap',
    gap: '16px',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    lineHeight: '40px',
    letterSpacing: '-0.02em',
    color: '#212529',
    margin: '0',
  },
  filterRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  filterLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#495057',
    lineHeight: '20px',
  },
  select: {
    fontSize: '14px',
    fontWeight: '400',
    color: '#212529',
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '6px',
    padding: '8px 12px',
    lineHeight: '20px',
    cursor: 'pointer',
    outline: 'none',
    minWidth: '140px',
    height: '44px',
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
    border: '1px solid #e9ecef',
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
  sectionSubTitle: {
    fontSize: '20px',
    fontWeight: '600',
    letterSpacing: '0em',
    lineHeight: '28px',
    color: '#212529',
    marginBottom: '16px',
    marginTop: '0',
  },
  panel: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 4px rgba(33,37,41,0.08)',
    marginBottom: '32px',
    border: '1px solid #e9ecef',
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
    whiteSpace: 'nowrap',
  },
  thRight: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    padding: '8px 12px',
    textAlign: 'right',
    borderBottom: '2px solid #e9ecef',
    whiteSpace: 'nowrap',
  },
  td: {
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
    color: '#343a40',
    padding: '12px',
    borderBottom: '1px solid #e9ecef',
  },
  tdRight: {
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
    color: '#343a40',
    padding: '12px',
    borderBottom: '1px solid #e9ecef',
    textAlign: 'right',
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
  twoColGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  },
  barChart: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  barRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  barLabelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barLabel: {
    fontSize: '14px',
    fontWeight: '400',
    color: '#343a40',
    lineHeight: '20px',
  },
  barValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
    lineHeight: '20px',
  },
  barTrack: {
    height: '8px',
    backgroundColor: '#e9ecef',
    borderRadius: '9999px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '9999px',
    transition: 'width 0.4s ease',
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '24px',
    fontSize: '14px',
  },
  loadingText: {
    textAlign: 'center',
    padding: '40px 24px',
    color: '#495057',
    fontSize: '16px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 24px',
    color: '#495057',
    fontSize: '14px',
  },
  codeFont: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '14px',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #e9ecef',
    margin: '24px 0',
  },
  trendUp: {
    color: '#37b24d',
    fontWeight: '600',
    fontSize: '13px',
  },
  trendDown: {
    color: '#f03e3e',
    fontWeight: '600',
    fontSize: '13px',
  },
  trendNeutral: {
    color: '#495057',
    fontWeight: '600',
    fontSize: '13px',
  },
};

const PERIOD_OPTIONS = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '1y', label: 'Last 12 months' },
];

const MOCK_REPORTS = {
  '7d': {
    summary: [
      { label: 'Total Revenue', value: '₹38,420', subtext: '+8.2% vs prior period', accentColor: '#4c6ef5', trend: 'up' },
      { label: 'Orders Placed', value: '142', subtext: '+5 vs prior period', accentColor: '#37b24d', trend: 'up' },
      { label: 'Avg Order Value', value: '₹2,706', subtext: '+3.1% vs prior period', accentColor: '#3b5bdb', trend: 'up' },
      { label: 'Return Requests', value: '6', subtext: '-2 vs prior period', accentColor: '#fd7e14', trend: 'down_good' },
      { label: 'Cancelled Orders', value: '8', subtext: '+1 vs prior period', accentColor: '#f03e3e', trend: 'down_bad' },
      { label: 'New Customers', value: '34', subtext: '+12 vs prior period', accentColor: '#fd7e14', trend: 'up' },
    ],
    revenueByCategory: [
      { category: 'Electronics', revenue: '₹14,800', raw: 14800 },
      { category: 'Clothing', revenue: '₹9,200', raw: 9200 },
      { category: 'Home & Kitchen', revenue: '₹7,500', raw: 7500 },
      { category: 'Sports', revenue: '₹4,320', raw: 4320 },
      { category: 'Books', revenue: '₹2,600', raw: 2600 },
    ],
    topProducts: [
      { rank: 1, name: 'Wireless Headphones Pro', sku: 'WHP-001', unitsSold: 28, revenue: '₹8,960' },
      { rank: 2, name: 'Running Shoes X3', sku: 'RSX-003', unitsSold: 19, revenue: '₹5,700' },
      { rank: 3, name: 'Smart Watch Series 4', sku: 'SWS-004', unitsSold: 14, revenue: '₹4,900' },
      { rank: 4, name: 'Cotton Blend T-Shirt', sku: 'CBT-012', unitsSold: 41, revenue: '₹3,280' },
      { rank: 5, name: 'Stainless Steel Bottle', sku: 'SSB-007', unitsSold: 33, revenue: '₹2,640' },
    ],
    orderStatusBreakdown: [
      { status: 'delivered', count: 98, pct: 69 },
      { status: 'processing', count: 18, pct: 13 },
      { status: 'shipped', count: 12, pct: 8 },
      { status: 'pending', count: 6, pct: 4 },
      { status: 'cancelled', count: 8, pct: 6 },
    ],
    promoCodeUsage: [
      { code: 'WELCOME10', uses: 22, discountTotal: '₹2,200' },
      { code: 'FLAT15', uses: 14, discountTotal: '₹1,890' },
      { code: 'FREESHIP', uses: 9, discountTotal: '₹900' },
    ],
    returnsBreakdown: [
      { reason: 'Defective / Damaged', count: 3 },
      { reason: 'Wrong item received', count: 2 },
      { reason: 'Changed mind', count: 1 },
    ],
  },
  '30d': {
    summary: [
      { label: 'Total Revenue', value: '₹1,82,640', subtext: '+11.4% vs prior period', accentColor: '#4c6ef5', trend: 'up' },
      { label: 'Orders Placed', value: '624', subtext: '+43 vs prior period', accentColor: '#37b24d', trend: 'up' },
      { label: 'Avg Order Value', value: '₹2,926', subtext: '+1.8% vs prior period', accentColor: '#3b5bdb', trend: 'up' },
      { label: 'Return Requests', value: '27', subtext: '-4 vs prior period', accentColor: '#fd7e14', trend: 'down_good' },
      { label: 'Cancelled Orders', value: '38', subtext: '+3 vs prior period', accentColor: '#f03e3e', trend: 'down_bad' },
      { label: 'New Customers', value: '148', subtext: '+31 vs prior period', accentColor: '#fd7e14', trend: 'up' },
    ],
    revenueByCategory: [
      { category: 'Electronics', revenue: '₹72,400', raw: 72400 },
      { category: 'Clothing', revenue: '₹41,200', raw: 41200 },
      { category: 'Home & Kitchen', revenue: '₹34,800', raw: 34800 },
      { category: 'Sports', revenue: '₹20,100', raw: 20100 },
      { category: 'Books', revenue: '₹14,140', raw: 14140 },
    ],
    topProducts: [
      { rank: 1, name: 'Wireless Headphones Pro', sku: 'WHP-001', unitsSold: 112, revenue: '₹35,840' },
      { rank: 2, name: 'Smart Watch Series 4', sku: 'SWS-004', unitsSold: 74, revenue: '₹25,900' },
      { rank: 3, name: 'Running Shoes X3', sku: 'RSX-003', unitsSold: 88, revenue: '₹26,400' },
      { rank: 4, name: 'Cotton Blend T-Shirt', sku: 'CBT-012', unitsSold: 183, revenue: '₹14,640' },
      { rank: 5, name: 'Stainless Steel Bottle', sku: 'SSB-007', unitsSold: 141, revenue: '₹11,280' },
    ],
    orderStatusBreakdown: [
      { status: 'delivered', count: 428, pct: 69 },
      { status: 'processing', count: 87, pct: 14 },
      { status: 'shipped', count: 49, pct: 8 },
      { status: 'pending', count: 22, pct: 3 },
      { status: 'cancelled', count: 38, pct: 6 },
    ],
    promoCodeUsage: [
      { code: 'WELCOME10', uses: 98, discountTotal: '₹9,800' },
      { code: 'FLAT15', uses: 61, discountTotal: '₹8,235' },
      { code: 'FREESHIP', uses: 44, discountTotal: '₹4,400' },
      { code: 'SUMMER20', uses: 29, discountTotal: '₹6,090' },
    ],
    returnsBreakdown: [
      { reason: 'Defective / Damaged', count: 12 },
      { reason: 'Wrong item received', count: 8 },
      { reason: 'Changed mind', count: 7 },
    ],
  },
  '90d': {
    summary: [
      { label: 'Total Revenue', value: '₹5,48,920', subtext: '+14.7% vs prior period', accentColor: '#4c6ef5', trend: 'up' },
      { label: 'Orders Placed', value: '1,872', subtext: '+124 vs prior period', accentColor: '#37b24d', trend: 'up' },
      { label: 'Avg Order Value', value: '₹2,932', subtext: '+2.3% vs prior period', accentColor: '#3b5bdb', trend: 'up' },
      { label: 'Return Requests', value: '83', subtext: '-9 vs prior period', accentColor: '#fd7e14', trend: 'down_good' },
      { label: 'Cancelled Orders', value: '114', subtext: '-7 vs prior period', accentColor: '#f03e3e', trend: 'down_good' },
      { label: 'New Customers', value: '441', subtext: '+88 vs prior period', accentColor: '#fd7e14', trend: 'up' },
    ],
    revenueByCategory: [
      { category: 'Electronics', revenue: '₹2,17,200', raw: 217200 },
      { category: 'Clothing', revenue: '₹1,23,600', raw: 123600 },
      { category: 'Home & Kitchen', revenue: '₹1,04,400', raw: 104400 },
      { category: 'Sports', revenue: '₹60,300', raw: 60300 },
      { category: 'Books', revenue: '₹43,420', raw: 43420 },
    ],
    topProducts: [
      { rank: 1, name: 'Wireless Headphones Pro', sku: 'WHP-001', unitsSold: 336, revenue: '₹1,07,520' },
      { rank: 2, name: 'Smart Watch Series 4', sku: 'SWS-004', unitsSold: 222, revenue: '₹77,700' },
      { rank: 3, name: 'Running Shoes X3', sku: 'RSX-003', unitsSold: 264, revenue: '₹79,200' },
      { rank: 4, name: 'Cotton Blend T-Shirt', sku: 'CBT-012', unitsSold: 549, revenue: '₹43,920' },
      { rank: 5, name: 'Stainless Steel Bottle', sku: 'SSB-007', unitsSold: 423, revenue: '₹33,840' },
    ],
    orderStatusBreakdown: [
      { status: 'delivered', count: 1284, pct: 69 },
      { status: 'processing', count: 261, pct: 14 },
      { status: 'shipped', count: 149, pct: 8 },
      { status: 'pending', count: 64, pct: 3 },
      { status: 'cancelled', count: 114, pct: 6 },
    ],
    promoCodeUsage: [
      { code: 'WELCOME10', uses: 294, discountTotal: '₹29,400' },
      { code: 'FLAT15', uses: 183, discountTotal: '₹24,705' },
      { code: 'SUMMER20', uses: 141, discountTotal: '₹29,610' },
      { code: 'FREESHIP', uses: 132, discountTotal: '₹13,200' },
    ],
    returnsBreakdown: [
      { reason: 'Defective / Damaged', count: 36 },
      { reason: 'Wrong item received', count: 24 },
      { reason: 'Changed mind', count: 23 },
    ],
  },
  '1y': {
    summary: [
      { label: 'Total Revenue', value: '₹21,93,680', subtext: '+18.2% vs prior year', accentColor: '#4c6ef5', trend: 'up' },
      { label: 'Orders Placed', value: '7,488', subtext: '+832 vs prior year', accentColor: '#37b24d', trend: 'up' },
      { label: 'Avg Order Value', value: '₹2,929', subtext: '+1.9% vs prior year', accentColor: '#3b5bdb', trend: 'up' },
      { label: 'Return Requests', value: '332', subtext: '-28 vs prior year', accentColor: '#fd7e14', trend: 'down_good' },
      { label: 'Cancelled Orders', value: '456', subtext: '-14 vs prior year', accentColor: '#f03e3e', trend: 'down_good' },
      { label: 'New Customers', value: '1,764', subtext: '+312 vs prior year', accentColor: '#fd7e14', trend: 'up' },
    ],
    revenueByCategory: [
      { category: 'Electronics', revenue: '₹8,68,800', raw: 868800 },
      { category: 'Clothing', revenue: '₹4,94,400', raw: 494400 },
      { category: 'Home & Kitchen', revenue: '₹4,17,600', raw: 417600 },
      { category: 'Sports', revenue: '₹2,41,200', raw: 241200 },
      { category: 'Books', revenue: '₹1,71,680', raw: 171680 },
    ],
    topProducts: [
      { rank: 1, name: 'Wireless Headphones Pro', sku: 'WHP-001', unitsSold: 1344, revenue: '₹4,30,080' },
      { rank: 2, name: 'Smart Watch Series 4', sku: 'SWS-004', unitsSold: 888, revenue: '₹3,10,800' },
      { rank: 3, name: 'Running Shoes X3', sku: 'RSX-003', unitsSold: 1056, revenue: '₹3,16,800' },
      { rank: 4, name: 'Cotton Blend T-Shirt', sku: 'CBT-012', unitsSold: 2196, revenue: '₹1,75,680' },
      { rank: 5, name: 'Stainless Steel Bottle', sku: 'SSB-007', unitsSold: 1692, revenue: '₹1,35,360' },
    ],
    orderStatusBreakdown: [
      { status: 'delivered', count: 5136, pct: 69 },
      { status: 'processing', count: 1044, pct: 14 },
      { status: 'shipped', count: 596, pct: 8 },
      { status: 'pending', count: 256, pct: 3 },
      { status: 'cancelled', count: 456, pct: 6 },
    ],
    promoCodeUsage: [
      { code: 'WELCOME10', uses: 1176, discountTotal: '₹1,17,600' },
      { code: 'FLAT15', uses: 732, discountTotal: '₹98,820' },
      { code: 'SUMMER20', uses: 564, discountTotal: '₹1,18,440' },
      { code: 'FREESHIP', uses: 528, discountTotal: '₹52,800' },
      { code: 'NEWUSER5', uses: 294, discountTotal: '₹14,700' },
    ],
    returnsBreakdown: [
      { reason: 'Defective / Damaged', count: 144 },
      { reason: 'Wrong item received', count: 96 },
      { reason: 'Changed mind', count: 92 },
    ],
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

const STATUS_BAR_COLORS = {
  delivered: '#37b24d',
  processing: '#4c6ef5',
  shipped: '#3b5bdb',
  pending: '#fd7e14',
  cancelled: '#f03e3e',
  default: '#868e96',
};

const CATEGORY_BAR_COLORS = [
  '#4c6ef5',
  '#37b24d',
  '#fd7e14',
  '#3b5bdb',
  '#f03e3e',
];

function getStatusBadgeStyle(status) {
  if (!status) return STATUS_BADGE_STYLES.default;
  const key = status.toLowerCase();
  return STATUS_BADGE_STYLES[key] || STATUS_BADGE_STYLES.default;
}

function getStatusBarColor(status) {
  if (!status) return STATUS_BAR_COLORS.default;
  const key = status.toLowerCase();
  return STATUS_BAR_COLORS[key] || STATUS_BAR_COLORS.default;
}

function StatCard({ label, value, subtext, accentColor, trend }) {
  let trendStyle = styles.trendNeutral;
  let trendPrefix = '';
  if (trend === 'up') { trendStyle = styles.trendUp; trendPrefix = '▲ '; }
  else if (trend === 'down_bad') { trendStyle = styles.trendDown; trendPrefix = '▼ '; }
  else if (trend === 'down_good') { trendStyle = styles.trendUp; trendPrefix = '▼ '; }

  return (
    <div style={styles.statCard}>
      <span style={styles.statLabel}>{label}</span>
      <span style={styles.statValue}>{value}</span>
      {subtext && (
        <span style={trendStyle}>
          {trendPrefix}{subtext}
        </span>
      )}
      <div style={{ ...styles.statAccentBar, backgroundColor: accentColor || '#4c6ef5' }} />
    </div>
  );
}

function BarChart({ rows, maxRaw, colorFn }) {
  return (
    <div style={styles.barChart}>
      {rows.map((row, idx) => {
        const pct = maxRaw > 0 ? Math.round((row.raw / maxRaw) * 100) : row.pct || 0;
        const fillColor = colorFn ? colorFn(row, idx) : CATEGORY_BAR_COLORS[idx % CATEGORY_BAR_COLORS.length];
        return (
          <div key={row.category || row.status} style={styles.barRow}>
            <div style={styles.barLabelRow}>
              <span style={styles.barLabel}>{row.category || row.status}</span>
              <span style={styles.barValue}>{row.revenue || row.count}</span>
            </div>
            <div style={styles.barTrack}>
              <div
                style={{
                  ...styles.barFill,
                  width: `${pct}%`,
                  backgroundColor: fillColor,
                }}
                role="presentation"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OrderStatusChart({ rows }) {
  const maxCount = rows.reduce((acc, r) => Math.max(acc, r.count), 0);
  return (
    <div style={styles.barChart}>
      {rows.map((row) => {
        const badgeStyle = getStatusBadgeStyle(row.status);
        const barColor = getStatusBarColor(row.status);
        return (
          <div key={row.status} style={styles.barRow}>
            <div style={styles.barLabelRow}>
              <span
                style={{
                  ...styles.badge,
                  backgroundColor: badgeStyle.backgroundColor,
                  color: badgeStyle.color,
                }}
              >
                {row.status}
              </span>
              <span style={styles.barValue}>
                {row.count.toLocaleString()} ({row.pct}%)
              </span>
            </div>
            <div style={styles.barTrack}>
              <div
                style={{
                  ...styles.barFill,
                  width: `${row.pct}%`,
                  backgroundColor: barColor,
                }}
                role="presentation"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminReports() {
  const [period, setPeriod] = useState('30d');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const timer = setTimeout(() => {
      const data = MOCK_REPORTS[period];
      if (data) {
        setReport(data);
      } else {
        setError('Failed to load report data. Please try again.');
      }
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [period]);

  const maxCategoryRaw = report
    ? Math.max(...report.revenueByCategory.map((r) => r.raw))
    : 1;

  return (
    <div style={styles.page}>
      <nav style={styles.navBar} role="navigation" aria-label="Admin navigation">
        <Link to="/admin" style={styles.navBrand}>
          Admin Panel
        </Link>
        <Link to="/admin" style={styles.navLink}>
          Dashboard
        </Link>
        <Link
          to="/admin/reports"
          style={{ ...styles.navLink, ...styles.navLinkActive }}
          aria-current="page"
        >
          Reports
        </Link>
      </nav>

      <main style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>Reports</h1>
          <div style={styles.filterRow}>
            <label htmlFor="period-select" style={styles.filterLabel}>
              Period:
            </label>
            <select
              id="period-select"
              style={styles.select}
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              aria-label="Select reporting period"
            >
              {PERIOD_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div style={styles.errorBanner} role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <div style={styles.loadingText} role="status" aria-live="polite">
            Loading report data…
          </div>
        ) : report ? (
          <>
            {/* Summary KPIs */}
            <section aria-labelledby="summary-heading">
              <h2 id="summary-heading" style={styles.sectionTitle}>
                Summary
              </h2>
              <div style={styles.statsGrid}>
                {report.summary.map((stat) => (
                  <StatCard
                    key={stat.label}
                    label={stat.label}
                    value={stat.value}
                    subtext={stat.subtext}
                    accentColor={stat.accentColor}
                    trend={stat.trend}
                  />
                ))}
              </div>
            </section>

            {/* Revenue by Category + Order Status */}
            <div style={styles.twoColGrid}>
              <section aria-labelledby="rev-cat-heading">
                <div style={styles.panel}>
                  <h2 id="rev-cat-heading" style={styles.sectionSubTitle}>
                    Revenue by Category
                  </h2>
                  {report.revenueByCategory.length === 0 ? (
                    <div style={styles.emptyState}>No data available.</div>
                  ) : (
                    <BarChart
                      rows={report.revenueByCategory}
                      maxRaw={maxCategoryRaw}
                      colorFn={(_row, idx) => CATEGORY_BAR_COLORS[idx % CATEGORY_BAR_COLORS.length]}
                    />
                  )}
                </div>
              </section>

              <section aria-labelledby="order-status-heading">
                <div style={styles.panel}>
                  <h2 id="order-status-heading" style={styles.sectionSubTitle}>
                    Order Status Breakdown
                  </h2>
                  {report.orderStatusBreakdown.length === 0 ? (
                    <div style={styles.emptyState}>No data available.</div>
                  ) : (
                    <OrderStatusChart rows={report.orderStatusBreakdown} />
                  )}
                </div>
              </section>
            </div>

            {/* Top Products */}
            <section aria-labelledby="top-products-heading">
              <h2 id="top-products-heading" style={styles.sectionTitle}>
                Top Products
              </h2>
              <div style={styles.panel}>
                {report.topProducts.length === 0 ? (
                  <div style={styles.emptyState}>No product data available.</div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={styles.table} aria-label="Top products by revenue">
                      <thead>
                        <tr>
                          <th style={styles.th} scope="col">#</th>
                          <th style={styles.th} scope="col">Product</th>
                          <th style={styles.th} scope="col">SKU</th>
                          <th style={styles.thRight} scope="col">Units Sold</th>
                          <th style={styles.thRight} scope="col">Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.topProducts.map((product) => (
                          <tr key={product.sku}>
                            <td style={styles.td}>
                              <span
                                style={{
                                  fontWeight: product.rank === 1 ? '700' : '400',
                                  color: product.rank === 1 ? '#4c6ef5' : '#343a40',
                                }}
                              >
                                {product.rank}
                              </span>
                            </td>
                            <td style={styles.td}>{product.name}</td>
                            <td style={styles.td}>
                              <span style={styles.codeFont}>{product.sku}</span>
                            </td>
                            <td style={styles.tdRight}>{product.unitsSold.toLocaleString()}</td>
                            <td style={{ ...styles.tdRight, fontWeight: '600' }}>{product.revenue}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>

            {/* Promo Code Usage + Returns */}
            <div style={styles.twoColGrid}>
              <section aria-labelledby="promo-usage-heading">
                <div style={styles.panel}>
                  <h2 id="promo-usage-heading" style={styles.sectionSubTitle}>
                    Promo Code Usage
                  </h2>
                  {report.promoCodeUsage.length === 0 ? (
                    <div style={styles.emptyState}>No promo code usage data available.</div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={styles.table} aria-label="Promo code usage">
                        <thead>
                          <tr>
                            <th style={styles.th} scope="col">Code</th>
                            <th style={styles.thRight} scope="col">Uses</th>
                            <th style={styles.thRight} scope="col">Discount Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {report.promoCodeUsage.map((promo) => (
                            <tr key={promo.code}>
                              <td style={styles.td}>
                                <span style={styles.codeFont}>{promo.code}</span>
                              </td>
                              <td style={styles.tdRight}>{promo.uses.toLocaleString()}</td>
                              <td style={{ ...styles.tdRight, fontWeight: '600' }}>{promo.discountTotal}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </section>

              <section aria-labelledby="returns-heading">
                <div style={styles.panel}>
                  <h2 id="returns-heading" style={styles.sectionSubTitle}>
                    Returns by Reason
                  </h2>
                  {report.returnsBreakdown.length === 0 ? (
                    <div style={styles.emptyState}>No return data available.</div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={styles.table} aria-label="Returns by reason">
                        <thead>
                          <tr>
                            <th style={styles.th} scope="col">Reason</th>
                            <th style={styles.thRight} scope="col">Count</th>
                          </tr>
                        </thead>
                        <tbody>
                          {report.returnsBreakdown.map((row) => (
                            <tr key={row.reason}>
                              <td style={styles.td}>{row.reason}</td>
                              <td style={styles.tdRight}>{row.count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
