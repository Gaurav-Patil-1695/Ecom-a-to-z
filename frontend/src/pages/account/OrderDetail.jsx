import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  container: {
    maxWidth: '800px',
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
    margin: '0 0 4px 0',
  },
  pageSub: {
    fontSize: '14px',
    color: '#495057',
    margin: '0 0 32px 0',
    lineHeight: '1.5',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(33,37,41,0.08)',
    marginBottom: '24px',
  },
  sectionLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    marginBottom: '16px',
    margin: '0 0 16px 0',
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
  badge: {
    display: 'inline-block',
    borderRadius: '9999px',
    padding: '2px 10px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  timelineWrap: {
    position: 'relative',
    paddingLeft: '28px',
  },
  timelineLine: {
    position: 'absolute',
    left: '9px',
    top: '12px',
    bottom: '12px',
    width: '2px',
    backgroundColor: '#e9ecef',
  },
  timelineItem: {
    position: 'relative',
    marginBottom: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  timelineDot: {
    position: 'absolute',
    left: '-22px',
    top: '4px',
    width: '14px',
    height: '14px',
    borderRadius: '9999px',
    border: '2px solid #e9ecef',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
  },
  timelineDotActive: {
    position: 'absolute',
    left: '-22px',
    top: '4px',
    width: '14px',
    height: '14px',
    borderRadius: '9999px',
    border: '2px solid #4c6ef5',
    backgroundColor: '#4c6ef5',
    boxSizing: 'border-box',
  },
  timelineDotCompleted: {
    position: 'absolute',
    left: '-22px',
    top: '4px',
    width: '14px',
    height: '14px',
    borderRadius: '9999px',
    border: '2px solid #37b24d',
    backgroundColor: '#37b24d',
    boxSizing: 'border-box',
  },
  timelineStatus: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
    margin: 0,
  },
  timelineDate: {
    fontSize: '12px',
    color: '#495057',
    margin: 0,
  },
  timelineNote: {
    fontSize: '12px',
    color: '#495057',
    margin: 0,
    fontStyle: 'italic',
  },
  orderItemRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    paddingBottom: '16px',
    borderBottom: '1px solid #e9ecef',
    marginBottom: '16px',
  },
  orderItemImg: {
    width: '60px',
    height: '60px',
    borderRadius: '6px',
    objectFit: 'cover',
    backgroundColor: '#e9ecef',
    flexShrink: 0,
  },
  orderItemInfo: {
    flex: 1,
    minWidth: 0,
  },
  orderItemName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
    margin: '0 0 4px 0',
    lineHeight: '1.4',
  },
  orderItemMeta: {
    fontSize: '12px',
    color: '#495057',
    margin: '0 0 2px 0',
  },
  orderItemPrice: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
    flexShrink: 0,
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    fontSize: '14px',
    color: '#495057',
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '16px',
    fontWeight: '700',
    color: '#212529',
    borderTop: '1px solid #e9ecef',
    paddingTop: '12px',
    marginTop: '8px',
  },
  trackingWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  trackingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#212529',
  },
  trackingLabel: {
    color: '#495057',
    fontSize: '12px',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    minWidth: '100px',
  },
  trackingValue: {
    color: '#212529',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '14px',
  },
  actionsRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    alignItems: 'center',
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
  },
  btnGhost: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '10px 24px',
    backgroundColor: 'transparent',
    color: '#4c6ef5',
    fontSize: '16px',
    fontWeight: '600',
    border: '1px solid #4c6ef5',
    borderRadius: '10px',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    minHeight: '44px',
    transition: 'background-color 0.15s',
  },
  btnDanger: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '10px 24px',
    backgroundColor: 'transparent',
    color: '#f03e3e',
    fontSize: '16px',
    fontWeight: '600',
    border: '1px solid #f03e3e',
    borderRadius: '10px',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    minHeight: '44px',
    transition: 'background-color 0.15s',
  },
  modalOverlay: {
    position: 'fixed',
    inset: '0',
    backgroundColor: 'rgba(33,37,41,0.48)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '16px',
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    maxWidth: '400px',
    width: '100%',
    boxShadow: '0 8px 32px rgba(33,37,41,0.18)',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#212529',
    margin: '0 0 8px 0',
  },
  modalText: {
    fontSize: '14px',
    color: '#495057',
    margin: '0 0 24px 0',
    lineHeight: '1.5',
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #e9ecef',
    margin: '0 0 16px 0',
  },
  notFoundWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '64px 24px',
    textAlign: 'center',
  },
  notFoundTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#212529',
    margin: '16px 0 8px 0',
  },
  notFoundText: {
    fontSize: '14px',
    color: '#495057',
    margin: '0 0 24px 0',
    lineHeight: '1.5',
  },
};

const STATUS_ORDER = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'out_for_delivery',
  'delivered',
];

const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  return_requested: 'Return requested',
  returned: 'Returned',
  refunded: 'Refunded',
};

function getStatusBadgeStyle(status) {
  const s = (status || '').toLowerCase();
  if (s === 'delivered') {
    return { ...styles.badge, backgroundColor: '#d3f9d8', color: '#37b24d' };
  }
  if (s === 'cancelled') {
    return { ...styles.badge, backgroundColor: '#ffe3e3', color: '#f03e3e' };
  }
  if (s === 'return_requested' || s === 'returned') {
    return { ...styles.badge, backgroundColor: '#fff4e6', color: '#fd7e14' };
  }
  if (s === 'refunded') {
    return { ...styles.badge, backgroundColor: '#e8ecfd', color: '#4c6ef5' };
  }
  if (s === 'shipped' || s === 'out_for_delivery') {
    return { ...styles.badge, backgroundColor: '#e8ecfd', color: '#4c6ef5' };
  }
  return { ...styles.badge, backgroundColor: '#e9ecef', color: '#495057' };
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

function formatDateShort(dateStr) {
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
  if (amount == null) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

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

function OrderDetailSkeleton() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <SkeletonLine width="80px" height="16px" style={{ marginBottom: '24px' }} />
        <SkeletonLine width="260px" height="40px" style={{ marginBottom: '8px' }} />
        <SkeletonLine width="200px" height="16px" style={{ marginBottom: '32px' }} />
        <div style={styles.card}>
          <SkeletonLine width="120px" height="12px" style={{ marginBottom: '16px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ ...styles.skeletonBase, width: '14px', height: '14px', borderRadius: '9999px', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <SkeletonLine width="140px" height="14px" style={{ marginBottom: '4px' }} />
                  <SkeletonLine width="100px" height="12px" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={styles.card}>
          <SkeletonLine width="100px" height="12px" style={{ marginBottom: '16px' }} />
          {[1, 2].map(i => (
            <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <div style={{ ...styles.skeletonBase, width: '60px', height: '60px', borderRadius: '6px', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <SkeletonLine width="180px" height="14px" style={{ marginBottom: '6px' }} />
                <SkeletonLine width="120px" height="12px" style={{ marginBottom: '4px' }} />
                <SkeletonLine width="80px" height="12px" />
              </div>
              <SkeletonLine width="60px" height="14px" style={{ flexShrink: 0 }} />
            </div>
          ))}
        </div>
        <div style={styles.card}>
          <SkeletonLine width="80px" height="12px" style={{ marginBottom: '16px' }} />
          <SkeletonLine width="100%" height="14px" style={{ marginBottom: '8px' }} />
          <SkeletonLine width="80%" height="14px" style={{ marginBottom: '8px' }} />
          <SkeletonLine width="60%" height="14px" />
        </div>
      </div>
    </div>
  );
}

function CancelModal({ order, onConfirm, onCancel, cancelling, cancelError }) {
  return (
    <div
      style={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-modal-title"
      onClick={e => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div style={styles.modal}>
        <p id="cancel-modal-title" style={styles.modalTitle}>Cancel order</p>
        <p style={styles.modalText}>
          Are you sure you want to cancel order <strong style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace" }}>{order.order_number || order.id}</strong>? This action cannot be undone.
        </p>
        {cancelError && (
          <div style={{ ...styles.errorBanner, marginBottom: '16px' }} role="alert">
            <span>⚠️</span>
            <span>{cancelError}</span>
          </div>
        )}
        <div style={styles.modalActions}>
          <button
            style={{
              ...styles.btnGhost,
              fontSize: '14px',
              padding: '8px 16px',
              minHeight: '44px',
            }}
            onClick={onCancel}
            disabled={cancelling}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f1f3ff'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
            onBlur={e => { e.currentTarget.style.outline = 'none'; }}
          >
            Keep order
          </button>
          <button
            style={{
              ...styles.btnDanger,
              backgroundColor: cancelling ? '#adb5bd' : '#f03e3e',
              color: '#ffffff',
              border: 'none',
              cursor: cancelling ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              padding: '8px 16px',
              minHeight: '44px',
            }}
            onClick={onConfirm}
            disabled={cancelling}
            onFocus={e => { e.currentTarget.style.outline = '2px solid #f03e3e'; e.currentTarget.style.outlineOffset = '2px'; }}
            onBlur={e => { e.currentTarget.style.outline = 'none'; }}
          >
            {cancelling ? 'Cancelling…' : 'Cancel order'}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusTimeline({ timeline, currentStatus }) {
  if (!timeline || timeline.length === 0) {
    const status = (currentStatus || '').toLowerCase();
    const isCancelled = status === 'cancelled';
    const isReturn = status === 'return_requested' || status === 'returned' || status === 'refunded';

    let steps;
    if (isCancelled) {
      steps = [{ status: 'cancelled', label: 'Cancelled', completed: true, active: true }];
    } else if (isReturn) {
      steps = STATUS_ORDER.map(s => ({
        status: s,
        label: STATUS_LABELS[s] || s,
        completed: true,
        active: false,
      }));
      steps.push({ status: currentStatus, label: STATUS_LABELS[status] || status, completed: false, active: true });
    } else {
      const idx = STATUS_ORDER.indexOf(status);
      steps = STATUS_ORDER.map((s, i) => ({
        status: s,
        label: STATUS_LABELS[s] || s,
        completed: i < idx,
        active: i === idx,
      }));
    }

    return (
      <div style={styles.timelineWrap}>
        <div style={styles.timelineLine} />
        {steps.map((step, i) => (
          <div key={step.status + i} style={{ ...styles.timelineItem, ...(i === steps.length - 1 ? { marginBottom: 0 } : {}) }}>
            <div
              style={
                step.active
                  ? styles.timelineDotActive
                  : step.completed
                    ? styles.timelineDotCompleted
                    : styles.timelineDot
              }
            />
            <p style={{
              ...styles.timelineStatus,
              color: step.active ? '#4c6ef5' : step.completed ? '#37b24d' : '#adb5bd',
            }}>
              {step.label}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={styles.timelineWrap}>
      <div style={styles.timelineLine} />
      {timeline.map((entry, i) => {
        const isLast = i === timeline.length - 1;
        return (
          <div key={entry.id || i} style={{ ...styles.timelineItem, ...(isLast ? { marginBottom: 0 } : {}) }}>
            <div style={isLast ? styles.timelineDotActive : styles.timelineDotCompleted} />
            <p style={{
              ...styles.timelineStatus,
              color: isLast ? '#4c6ef5' : '#37b24d',
            }}>
              {STATUS_LABELS[(entry.status || '').toLowerCase()] || entry.status}
            </p>
            {entry.created_at && (
              <p style={styles.timelineDate}>{formatDate(entry.created_at)}</p>
            )}
            {entry.note && (
              <p style={styles.timelineNote}>{entry.note}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TrackingInfo({ tracking }) {
  if (!tracking) return null;
  const carrier = tracking.carrier || tracking.courier || '';
  const trackingNumber = tracking.tracking_number || tracking.trackingNumber || '';
  const url = tracking.tracking_url || tracking.trackingUrl || '';
  const estimatedDelivery = tracking.estimated_delivery || tracking.estimatedDelivery || '';

  if (!carrier && !trackingNumber) return null;

  return (
    <div style={styles.trackingWrap}>
      {carrier && (
        <div style={styles.trackingRow}>
          <span style={styles.trackingLabel}>Carrier</span>
          <span style={{ fontSize: '14px', color: '#212529' }}>{carrier}</span>
        </div>
      )}
      {trackingNumber && (
        <div style={styles.trackingRow}>
          <span style={styles.trackingLabel}>Tracking #</span>
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#4c6ef5', fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace", fontSize: '14px', textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline'; }}
              onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none'; }}
            >
              {trackingNumber}
              <img src="/src/assets/icons/external-link.svg" alt="Open tracking" aria-hidden="true" style={{ width: '12px', height: '12px', marginLeft: '4px', verticalAlign: 'middle' }} />
            </a>
          ) : (
            <span style={styles.trackingValue}>{trackingNumber}</span>
          )}
        </div>
      )}
      {estimatedDelivery && (
        <div style={styles.trackingRow}>
          <span style={styles.trackingLabel}>Est. delivery</span>
          <span style={{ fontSize: '14px', color: '#212529' }}>{formatDateShort(estimatedDelivery)}</span>
        </div>
      )}
    </div>
  );
}

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [tracking, setTracking] = useState(null);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetchOrderData();
  }, [id]);

  async function fetchOrderData() {
    setLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const orderRes = await fetch(`/api/orders/${id}`, { headers });
      if (orderRes.status === 404 || orderRes.status === 403) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      if (!orderRes.ok) throw new Error('Failed to load order details.');
      const orderData = await orderRes.json();
      const orderObj = orderData.data || orderData.order || orderData;
      setOrder(orderObj);

      const [timelineRes, trackingRes] = await Promise.all([
        fetch(`/api/orders/${id}/timeline`, { headers }),
        fetch(`/api/orders/${id}/tracking`, { headers }),
      ]);

      if (timelineRes.ok) {
        const tlData = await timelineRes.json();
        const tl = tlData.data || tlData.timeline || tlData || [];
        setTimeline(Array.isArray(tl) ? tl : []);
      }

      if (trackingRes.ok) {
        const trData = await trackingRes.json();
        setTracking(trData.data || trData.tracking || trData || null);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelConfirm() {
    setCancelling(true);
    setCancelError(null);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const res = await fetch(`/api/orders/${id}/cancel`, { method: 'POST', headers });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to cancel order. Please try again.');
      }
      setOrder(prev => prev ? { ...prev, status: 'cancelled' } : prev);
      setCancelSuccess(true);
      setShowCancelModal(false);
    } catch (err) {
      setCancelError(err.message || 'Failed to cancel order. Please try again.');
    } finally {
      setCancelling(false);
    }
  }

  function handleReturnRequest() {
    navigate(`/account/orders/${id}/return`);
  }

  if (loading) {
    return <OrderDetailSkeleton />;
  }

  if (notFound) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <button
            style={styles.backLink}
            onClick={() => navigate('/account/orders')}
            onMouseEnter={e => { e.currentTarget.style.color = '#3b5bdb'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#4c6ef5'; }}
            onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
            onBlur={e => { e.currentTarget.style.outline = 'none'; }}
            aria-label="Back to order history"
          >
            <img src="/src/assets/icons/chevron-left.svg" alt="" aria-hidden="true" style={{ width: '16px', height: '16px' }} />
            Back to order history
          </button>
          <div style={styles.notFoundWrap}>
            <img src="/src/assets/icons/package.svg" alt="" aria-hidden="true" style={{ width: '48px', height: '48px', opacity: 0.35 }} />
            <p style={styles.notFoundTitle}>Order not found</p>
            <p style={styles.notFoundText}>
              Order not found or you do not have permission to view it.
            </p>
            <button
              style={styles.btnPrimary}
              onClick={() => navigate('/account/orders')}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#3b5bdb'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#4c6ef5'; }}
              onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
              onBlur={e => { e.currentTarget.style.outline = 'none'; }}
            >
              Go to order history
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <button
            style={styles.backLink}
            onClick={() => navigate('/account/orders')}
            onMouseEnter={e => { e.currentTarget.style.color = '#3b5bdb'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#4c6ef5'; }}
            onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
            onBlur={e => { e.currentTarget.style.outline = 'none'; }}
            aria-label="Back to order history"
          >
            <img src="/src/assets/icons/chevron-left.svg" alt="" aria-hidden="true" style={{ width: '16px', height: '16px' }} />
            Back to order history
          </button>
          <div style={styles.errorBanner} role="alert">
            <span style={{ fontSize: '18px' }}>⚠️</span>
            <span style={{ flex: 1 }}>{error}</span>
            <button
              style={{
                background: 'none',
                border: 'none',
                color: '#f03e3e',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                padding: '0',
              }}
              onClick={fetchOrderData}
              onFocus={e => { e.currentTarget.style.outline = '2px solid #f03e3e'; e.currentTarget.style.outlineOffset = '2px'; }}
              onBlur={e => { e.currentTarget.style.outline = 'none'; }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const status = (order.status || '').toLowerCase();
  const orderNumber = order.order_number || order.id || '';
  const placedAt = order.created_at || order.placed_at || '';
  const items = order.items || order.order_items || [];
  const shippingAddress = order.shipping_address || order.address || null;
  const subtotal = order.subtotal || order.sub_total || null;
  const shippingCost = order.shipping_cost || order.shipping || 0;
  const discount = order.discount || order.discount_amount || 0;
  const total = order.total || order.total_amount || null;

  const canCancel = ['pending', 'confirmed', 'processing'].includes(status);
  const canReturn = status === 'delivered';
  const isCancelled = status === 'cancelled';
  const hasTracking = tracking && (tracking.tracking_number || tracking.trackingNumber || tracking.carrier);
  const showTrackingSection = ['shipped', 'out_for_delivery', 'delivered'].includes(status) || hasTracking;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Back link */}
        <button
          style={styles.backLink}
          onClick={() => navigate('/account/orders')}
          onMouseEnter={e => { e.currentTarget.style.color = '#3b5bdb'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#4c6ef5'; }}
          onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
          onBlur={e => { e.currentTarget.style.outline = 'none'; }}
          aria-label="Back to order history"
        >
          <img src="/src/assets/icons/chevron-left.svg" alt="" aria-hidden="true" style={{ width: '16px', height: '16px' }} />
          Back to order history
        </button>

        {/* Page title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '4px' }}>
          <h1 style={{ ...styles.pageTitle, margin: 0 }}>Order details</h1>
          <span style={getStatusBadgeStyle(status)}>
            {STATUS_LABELS[status] || status}
          </span>
        </div>
        {orderNumber && (
          <p style={styles.pageSub}>#{orderNumber}{placedAt ? ` · Placed ${formatDateShort(placedAt)}` : ''}</p>
        )}

        {/* Cancel success banner */}
        {cancelSuccess && (
          <div style={styles.successBanner} role="status">
            <span style={{ fontSize: '18px' }}>✓</span>
            <span>Your order has been cancelled successfully.</span>
          </div>
        )}

        {/* Action error banner */}
        {actionError && (
          <div style={styles.errorBanner} role="alert">
            <span style={{ fontSize: '18px' }}>⚠️</span>
            <span>{actionError}</span>
          </div>
        )}

        {/* Order error banner (partial load) */}
        {error && (
          <div style={styles.errorBanner} role="alert">
            <span style={{ fontSize: '18px' }}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Status timeline */}
        <div style={styles.card}>
          <p style={styles.sectionLabel}>Order status</p>
          <StatusTimeline timeline={timeline} currentStatus={order.status} />
        </div>

        {/* Tracking info */}
        {showTrackingSection && (
          <div style={styles.card}>
            <p style={styles.sectionLabel}>Tracking</p>
            {hasTracking ? (
              <TrackingInfo tracking={tracking} />
            ) : (
              <p style={{ fontSize: '14px', color: '#495057', margin: 0 }}>
                Tracking information will be available once your order has been shipped.
              </p>
            )}
          </div>
        )}

        {/* Order items */}
        <div style={styles.card}>
          <p style={styles.sectionLabel}>Items ({items.length})</p>
          {items.length === 0 ? (
            <p style={{ fontSize: '14px', color: '#495057', margin: 0 }}>No items found.</p>
          ) : (
            <div>
              {items.map((item, idx) => {
                const name = item.product_name || item.name || item.title || 'Product';
                const sku = item.sku_code || item.sku || item.variant || '';
                const qty = item.quantity || item.qty || 1;
                const price = item.unit_price || item.price || item.total_price || null;
                const imgSrc = item.image_url || item.image || null;
                const isLast = idx === items.length - 1;
                return (
                  <div
                    key={item.id || idx}
                    style={{
                      ...styles.orderItemRow,
                      ...(isLast ? { borderBottom: 'none', marginBottom: 0, paddingBottom: 0 } : {}),
                    }}
                  >
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={name}
                        style={styles.orderItemImg}
                        onError={e => { e.currentTarget.src = '/src/assets/images/placeholder-product.svg'; }}
                      />
                    ) : (
                      <div style={styles.orderItemImg}>
                        <img
                          src="/src/assets/images/placeholder-product.svg"
                          alt=""
                          aria-hidden="true"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }}
                        />
                      </div>
                    )}
                    <div style={styles.orderItemInfo}>
                      <p style={styles.orderItemName}>{name}</p>
                      {sku && (
                        <p style={styles.orderItemMeta}>SKU: <span style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace" }}>{sku}</span></p>
                      )}
                      <p style={styles.orderItemMeta}>Qty: {qty}</p>
                    </div>
                    {price != null && (
                      <span style={styles.orderItemPrice}>{formatCurrency(price)}</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Order totals */}
          {(subtotal != null || total != null) && (
            <div style={{ marginTop: '16px' }}>
              <hr style={styles.divider} />
              {subtotal != null && (
                <div style={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
              )}
              {shippingCost != null && (
                <div style={styles.summaryRow}>
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}</span>
                </div>
              )}
              {discount != null && discount !== 0 && (
                <div style={{ ...styles.summaryRow, color: '#37b24d' }}>
                  <span>Discount</span>
                  <span>-{formatCurrency(Math.abs(discount))}</span>
                </div>
              )}
              {total != null && (
                <div style={styles.summaryTotal}>
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Shipping address */}
        {shippingAddress && (
          <div style={styles.card}>
            <p style={styles.sectionLabel}>Shipping address</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {(shippingAddress.first_name || shippingAddress.last_name) && (
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#212529' }}>
                  {[shippingAddress.first_name, shippingAddress.last_name].filter(Boolean).join(' ')}
                </p>
              )}
              {shippingAddress.phone && (
                <p style={{ margin: 0, fontSize: '14px', color: '#495057' }}>{shippingAddress.phone}</p>
              )}
              {shippingAddress.line1 && (
                <p style={{ margin: 0, fontSize: '14px', color: '#495057' }}>{shippingAddress.line1}</p>
              )}
              {shippingAddress.line2 && (
                <p style={{ margin: 0, fontSize: '14px', color: '#495057' }}>{shippingAddress.line2}</p>
              )}
              {(shippingAddress.city || shippingAddress.state || shippingAddress.postal_code) && (
                <p style={{ margin: 0, fontSize: '14px', color: '#495057' }}>
                  {[shippingAddress.city, shippingAddress.state, shippingAddress.postal_code].filter(Boolean).join(', ')}
                </p>
              )}
              {shippingAddress.country && (
                <p style={{ margin: 0, fontSize: '14px', color: '#495057' }}>{shippingAddress.country}</p>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        {(canCancel || canReturn) && !cancelSuccess && (
          <div style={{ ...styles.card, marginBottom: '0' }}>
            <p style={styles.sectionLabel}>Actions</p>
            <div style={styles.actionsRow}>
              {canCancel && (
                <button
                  style={styles.btnDanger}
                  onClick={() => { setCancelError(null); setShowCancelModal(true); }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#ffe3e3'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  onFocus={e => { e.currentTarget.style.outline = '2px solid #f03e3e'; e.currentTarget.style.outlineOffset = '2px'; }}
                  onBlur={e => { e.currentTarget.style.outline = 'none'; }}
                  aria-label="Cancel this order"
                >
                  Cancel order
                </button>
              )}
              {canReturn && (
                <button
                  style={styles.btnGhost}
                  onClick={handleReturnRequest}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f1f3ff'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
                  onBlur={e => { e.currentTarget.style.outline = 'none'; }}
                  aria-label="Request a return for this order"
                >
                  Request return
                </button>
              )}
            </div>
          </div>
        )}

        {isCancelled && (
          <div style={{ marginTop: '8px' }}>
            <button
              style={styles.btnGhost}
              onClick={() => navigate('/account/orders')}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f1f3ff'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
              onBlur={e => { e.currentTarget.style.outline = 'none'; }}
            >
              Back to order history
            </button>
          </div>
        )}
      </div>

      {/* Cancel confirmation modal */}
      {showCancelModal && order && (
        <CancelModal
          order={order}
          onConfirm={handleCancelConfirm}
          onCancel={() => { setShowCancelModal(false); setCancelError(null); }}
          cancelling={cancelling}
          cancelError={cancelError}
        />
      )}
    </div>
  );
}
