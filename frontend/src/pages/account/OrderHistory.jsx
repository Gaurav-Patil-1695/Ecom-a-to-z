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
  skeletonBase: {
    backgroundColor: '#e9ecef',
    borderRadius: '6px',
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
    opacity: 0.4,
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
  filterRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '24px',
    alignItems: 'center',
  },
  filterChip: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 14px',
    borderRadius: '9999px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    border: '1px solid #868e96',
    backgroundColor: 'transparent',
    color: '#495057',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    transition: 'all 0.15s',
    minHeight: '36px',
  },
  filterChipActive: {
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    borderColor: '#4c6ef5',
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 1px 3px rgba(33,37,41,0.08)',
    marginBottom: '16px',
    overflow: 'hidden',
    cursor: 'pointer',
    border: '1px solid transparent',
    transition: 'box-shadow 0.15s, border-color 0.15s',
  },
  orderCardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid #e9ecef',
    flexWrap: 'wrap',
    gap: '8px',
  },
  orderCardBody: {
    padding: '16px 20px',
  },
  orderCardFooter: {
    padding: '12px 20px',
    borderTop: '1px solid #e9ecef',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '8px',
  },
  orderId: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '14px',
    fontWeight: '400',
    color: '#212529',
    letterSpacing: '0em',
    lineHeight: '20px',
  },
  orderDate: {
    fontSize: '14px',
    color: '#495057',
  },
  orderTotal: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
  },
  orderItemsPreview: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  orderItemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  orderItemThumb: {
    width: '48px',
    height: '48px',
    borderRadius: '6px',
    backgroundColor: '#e9ecef',
    objectFit: 'cover',
    flexShrink: 0,
  },
  orderItemInfo: {
    flex: 1,
    minWidth: 0,
  },
  orderItemName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#212529',
    margin: '0 0 2px 0',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  orderItemMeta: {
    fontSize: '12px',
    color: '#495057',
    margin: '0',
  },
  moreItems: {
    fontSize: '13px',
    color: '#495057',
    fontStyle: 'italic',
    marginTop: '4px',
  },
  viewBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    color: '#4c6ef5',
    fontSize: '14px',
    fontWeight: '500',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    minHeight: '44px',
    textDecoration: 'none',
  },
};

const STATUS_CONFIG = {
  pending: { label: 'Pending', bg: '#fff4e6', color: '#fd7e14', border: '#fd7e14' },
  confirmed: { label: 'Confirmed', bg: '#e8ecfd', color: '#4c6ef5', border: '#4c6ef5' },
  processing: { label: 'Processing', bg: '#e8ecfd', color: '#4c6ef5', border: '#4c6ef5' },
  shipped: { label: 'Shipped', bg: '#d3f9d8', color: '#37b24d', border: '#37b24d' },
  delivered: { label: 'Delivered', bg: '#d3f9d8', color: '#37b24d', border: '#37b24d' },
  cancelled: { label: 'Cancelled', bg: '#ffe3e3', color: '#f03e3e', border: '#f03e3e' },
  return_requested: { label: 'Return requested', bg: '#fff4e6', color: '#fd7e14', border: '#fd7e14' },
  returned: { label: 'Returned', bg: '#e9ecef', color: '#495057', border: '#868e96' },
  refunded: { label: 'Refunded', bg: '#e9ecef', color: '#495057', border: '#868e96' },
};

const FILTER_OPTIONS = [
  { value: 'all', label: 'All orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'return_requested', label: 'Return requested' },
];

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

function StatusBadge({ status }) {
  const normalised = (status || '').toLowerCase().replace(/[\s-]/g, '_');
  const config = STATUS_CONFIG[normalised] || {
    label: status || 'Unknown',
    bg: '#e9ecef',
    color: '#495057',
    border: '#868e96',
  };
  return (
    <span
      style={{
        display: 'inline-block',
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
        borderRadius: '9999px',
        padding: '2px 12px',
        fontSize: '12px',
        fontWeight: '600',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        lineHeight: '16px',
        whiteSpace: 'nowrap',
      }}
      aria-label={`Order status: ${config.label}`}
    >
      {config.label}
    </span>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

function OrderCardSkeleton() {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 1px 3px rgba(33,37,41,0.08)',
        marginBottom: '16px',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #e9ecef', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
        <SkeletonLine width="160px" height="16px" />
        <SkeletonLine width="80px" height="22px" style={{ borderRadius: '9999px' }} />
      </div>
      <div style={{ padding: '16px 20px' }}>
        {[1, 2].map(i => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: i < 2 ? '12px' : '0' }}>
            <SkeletonLine width="48px" height="48px" style={{ borderRadius: '6px', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <SkeletonLine width="60%" height="14px" style={{ marginBottom: '6px' }} />
              <SkeletonLine width="40%" height="12px" />
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '12px 20px', borderTop: '1px solid #e9ecef', display: 'flex', justifyContent: 'space-between' }}>
        <SkeletonLine width="100px" height="16px" />
        <SkeletonLine width="80px" height="16px" />
      </div>
    </div>
  );
}

function OrderCard({ order, onClick }) {
  const items = order.items || order.order_items || [];
  const previewItems = items.slice(0, 2);
  const extraCount = items.length - previewItems.length;

  return (
    <div
      role="button"
      tabIndex={0}
      style={styles.orderCard}
      onClick={() => onClick(order)}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(order);
        }
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(76,110,245,0.12)';
        e.currentTarget.style.borderColor = '#4c6ef5';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(33,37,41,0.08)';
        e.currentTarget.style.borderColor = 'transparent';
      }}
      onFocus={e => {
        e.currentTarget.style.outline = '2px solid #4c6ef5';
        e.currentTarget.style.outlineOffset = '2px';
      }}
      onBlur={e => {
        e.currentTarget.style.outline = 'none';
      }}
      aria-label={`Order ${order.order_number || order.id}, status ${order.status}`}
    >
      {/* Header */}
      <div style={styles.orderCardHeader}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={styles.orderId}>
            {order.order_number ? `#${order.order_number}` : `#${order.id}`}
          </span>
          <span style={styles.orderDate}>
            {formatDate(order.created_at || order.createdAt)}
          </span>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Body: item previews */}
      {previewItems.length > 0 && (
        <div style={styles.orderCardBody}>
          <div style={styles.orderItemsPreview}>
            {previewItems.map((item, idx) => {
              const name =
                item.product_name ||
                (item.product && item.product.name) ||
                item.name ||
                'Product';
              const image =
                item.product_image ||
                (item.product && item.product.image_url) ||
                item.image_url ||
                null;
              const qty = item.quantity || 1;
              const sku = item.sku_code || item.variant || '';
              return (
                <div key={idx} style={styles.orderItemRow}>
                  {image ? (
                    <img
                      src={image}
                      alt=""
                      aria-hidden="true"
                      style={styles.orderItemThumb}
                      onError={e => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        ...styles.orderItemThumb,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      aria-hidden="true"
                    >
                      <img
                        src="/src/assets/icons/package.svg"
                        alt=""
                        aria-hidden="true"
                        style={{ width: '24px', height: '24px', opacity: 0.4 }}
                      />
                    </div>
                  )}
                  <div style={styles.orderItemInfo}>
                    <p style={styles.orderItemName}>{name}</p>
                    <p style={styles.orderItemMeta}>
                      Qty: {qty}{sku ? ` · ${sku}` : ''}
                    </p>
                  </div>
                </div>
              );
            })}
            {extraCount > 0 && (
              <p style={styles.moreItems}>
                +{extraCount} more {extraCount === 1 ? 'item' : 'items'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={styles.orderCardFooter}>
        <span style={styles.orderTotal}>
          {formatCurrency(order.total_amount || order.total || order.grand_total)}
        </span>
        <button
          style={styles.viewBtn}
          onClick={e => {
            e.stopPropagation();
            onClick(order);
          }}
          onFocus={e => {
            e.currentTarget.style.outline = '2px solid #4c6ef5';
            e.currentTarget.style.outlineOffset = '2px';
          }}
          onBlur={e => {
            e.currentTarget.style.outline = 'none';
          }}
          tabIndex={-1}
          aria-hidden="true"
        >
          View order
          <img
            src="/src/assets/icons/chevron-right.svg"
            alt=""
            aria-hidden="true"
            style={{ width: '14px', height: '14px', opacity: 0.6 }}
          />
        </button>
      </div>
    </div>
  );
}

export default function OrderHistory() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch('/api/orders', { headers });
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Please log in to view your order history.');
        }
        throw new Error('Failed to load orders. Please try again.');
      }
      const data = await res.json();
      const list = data.data || data.orders || data || [];
      setOrders(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  function handleOrderClick(order) {
    navigate(`/account/orders/${order.id}`);
  }

  const filteredOrders =
    activeFilter === 'all'
      ? orders
      : orders.filter(order => {
          const normalised = (order.status || '').toLowerCase().replace(/[\s-]/g, '_');
          return normalised === activeFilter;
        });

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <SkeletonLine width="80px" height="16px" style={{ marginBottom: '24px' }} />
          <SkeletonLine width="260px" height="40px" style={{ marginBottom: '8px' }} />
          <SkeletonLine width="320px" height="16px" style={{ marginBottom: '32px' }} />
          {/* Filter row skeleton */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {[1, 2, 3, 4].map(i => (
              <SkeletonLine key={i} width="90px" height="36px" style={{ borderRadius: '9999px' }} />
            ))}
          </div>
          {/* Order card skeletons */}
          {[1, 2, 3].map(i => (
            <OrderCardSkeleton key={i} />
          ))}
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

        <h1 style={styles.pageTitle}>Order history</h1>
        <p style={styles.pageSub}>
          View and track all your past and current orders.
        </p>

        {/* Error banner */}
        {error && (
          <div style={styles.errorBanner} role="alert">
            <span style={{ fontSize: '18px' }}>⚠️</span>
            <span style={{ flex: 1 }}>{error}</span>
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
              onClick={fetchOrders}
              onFocus={e => { e.currentTarget.style.outline = '2px solid #f03e3e'; e.currentTarget.style.outlineOffset = '2px'; }}
              onBlur={e => { e.currentTarget.style.outline = 'none'; }}
            >
              Retry
            </button>
          </div>
        )}

        {!error && (
          <>
            {/* Filter chips */}
            <div style={styles.filterRow} role="group" aria-label="Filter orders by status">
              {FILTER_OPTIONS.map(option => {
                const isActive = activeFilter === option.value;
                return (
                  <button
                    key={option.value}
                    style={{
                      ...styles.filterChip,
                      ...(isActive ? styles.filterChipActive : {}),
                    }}
                    onClick={() => setActiveFilter(option.value)}
                    aria-pressed={isActive}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = '#f1f3ff';
                        e.currentTarget.style.borderColor = '#4c6ef5';
                        e.currentTarget.style.color = '#4c6ef5';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = '#868e96';
                        e.currentTarget.style.color = '#495057';
                      }
                    }}
                    onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
                    onBlur={e => { e.currentTarget.style.outline = 'none'; }}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            {/* Results count */}
            {orders.length > 0 && (
              <p style={styles.sectionLabel}>
                {filteredOrders.length}{' '}
                {filteredOrders.length === 1 ? 'order' : 'orders'}
                {activeFilter !== 'all' ? ` · filtered by ${FILTER_OPTIONS.find(o => o.value === activeFilter)?.label || activeFilter}` : ''}
              </p>
            )}

            {/* Empty state */}
            {filteredOrders.length === 0 ? (
              <div style={styles.emptyState}>
                <img
                  src="/src/assets/icons/package.svg"
                  alt=""
                  aria-hidden="true"
                  style={styles.emptyIcon}
                />
                {orders.length === 0 ? (
                  <>
                    <p style={styles.emptyTitle}>No orders yet</p>
                    <p style={styles.emptyText}>
                      You haven't placed any orders. Start shopping to see your orders here.
                    </p>
                    <button
                      style={styles.btnPrimary}
                      onClick={() => navigate('/')}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#3b5bdb'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#4c6ef5'; }}
                      onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
                      onBlur={e => { e.currentTarget.style.outline = 'none'; }}
                    >
                      Browse products
                    </button>
                  </>
                ) : (
                  <>
                    <p style={styles.emptyTitle}>No orders found</p>
                    <p style={styles.emptyText}>
                      No orders match the current filter.
                    </p>
                    <button
                      style={{
                        ...styles.btnPrimary,
                        backgroundColor: 'transparent',
                        color: '#4c6ef5',
                        border: '1px solid #4c6ef5',
                      }}
                      onClick={() => setActiveFilter('all')}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f1f3ff'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
                      onBlur={e => { e.currentTarget.style.outline = 'none'; }}
                    >
                      Clear filter
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div>
                {filteredOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onClick={handleOrderClick}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
