import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const STATUS_OPTIONS = [
  { value: 'pending_payment', label: 'Pending Payment' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'return_requested', label: 'Return Requested' },
  { value: 'returned', label: 'Returned' },
  { value: 'refunded', label: 'Refunded' },
];

const STATUS_STYLES = {
  pending_payment: { bg: '#fff3e6', color: '#fd7e14' },
  confirmed: { bg: '#e8ecfd', color: '#4c6ef5' },
  processing: { bg: '#e8ecfd', color: '#4c6ef5' },
  shipped: { bg: '#e8ecfd', color: '#3b5bdb' },
  delivered: { bg: '#d3f9d8', color: '#37b24d' },
  cancelled: { bg: '#ffe3e3', color: '#f03e3e' },
  return_requested: { bg: '#fff4e6', color: '#fd7e14' },
  returned: { bg: '#e9ecef', color: '#495057' },
  refunded: { bg: '#d3f9d8', color: '#37b24d' },
};

const ADVANCE_TRANSITIONS = {
  pending_payment: 'confirmed',
  confirmed: 'processing',
  processing: 'shipped',
  shipped: 'delivered',
  return_requested: 'returned',
  returned: 'refunded',
};

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || { bg: '#e9ecef', color: '#495057' };
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: '9999px',
        backgroundColor: style.bg,
        color: style.color,
        fontSize: '12px',
        fontWeight: '600',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        lineHeight: '16px',
        fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {status ? status.replace(/_/g, ' ') : 'Unknown'}
    </span>
  );
}

function formatCurrency(amount) {
  if (amount == null) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateString) {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

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
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#4c6ef5',
    padding: '0',
    marginBottom: '20px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    fontWeight: '500',
  },
  headerRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '16px',
    marginBottom: '24px',
  },
  titleGroup: {
    flex: '1 1 auto',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '32px',
    letterSpacing: '-0.01em',
    color: '#212529',
    margin: '0 0 6px 0',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  orderId: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '13px',
    color: '#4c6ef5',
    fontWeight: '500',
  },
  actionGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    alignItems: 'center',
  },
  advanceBtn: (disabled) => ({
    padding: '10px 20px',
    backgroundColor: disabled ? '#e9ecef' : '#4c6ef5',
    color: disabled ? '#adb5bd' : '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    minHeight: '44px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    transition: 'background-color 0.15s',
  }),
  cancelBtn: (disabled) => ({
    padding: '10px 20px',
    backgroundColor: '#ffffff',
    color: disabled ? '#adb5bd' : '#f03e3e',
    border: `1px solid ${disabled ? '#e9ecef' : '#f03e3e'}`,
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    minHeight: '44px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  }),
  errorBanner: {
    backgroundColor: '#ffe3e3',
    border: '1px solid #f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    color: '#f03e3e',
    fontSize: '14px',
    marginBottom: '20px',
  },
  successBanner: {
    backgroundColor: '#d3f9d8',
    border: '1px solid #37b24d',
    borderRadius: '6px',
    padding: '12px 16px',
    color: '#37b24d',
    fontSize: '14px',
    marginBottom: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
    padding: '24px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    margin: '0 0 16px 0',
    paddingBottom: '12px',
    borderBottom: '1px solid #e9ecef',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  field: {
    marginBottom: '12px',
  },
  fieldLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    marginBottom: '4px',
    display: 'block',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  fieldValue: {
    fontSize: '14px',
    color: '#343a40',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    lineHeight: '20px',
  },
  fullCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
    overflow: 'hidden',
    marginBottom: '20px',
  },
  fullCardHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid #e9ecef',
  },
  fullCardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    margin: 0,
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thead: {
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #e9ecef',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    whiteSpace: 'nowrap',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  td: {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#343a40',
    verticalAlign: 'middle',
    borderBottom: '1px solid #e9ecef',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  summaryTable: {
    minWidth: '280px',
    width: '100%',
    maxWidth: '360px',
  },
  summaryLine: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    fontSize: '14px',
    color: '#343a40',
    borderBottom: '1px solid #e9ecef',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0 0 0',
    fontSize: '16px',
    fontWeight: '700',
    color: '#212529',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  timelineList: {
    listStyle: 'none',
    padding: '0',
    margin: '0',
  },
  timelineItem: {
    display: 'flex',
    gap: '12px',
    paddingBottom: '20px',
    position: 'relative',
  },
  timelineDotWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexShrink: 0,
    width: '20px',
  },
  timelineDot: (active) => ({
    width: '12px',
    height: '12px',
    borderRadius: '9999px',
    backgroundColor: active ? '#4c6ef5' : '#adb5bd',
    flexShrink: 0,
    marginTop: '4px',
  }),
  timelineLine: {
    flex: 1,
    width: '2px',
    backgroundColor: '#e9ecef',
    marginTop: '4px',
  },
  timelineContent: {
    flex: 1,
  },
  timelineStatus: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '2px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    textTransform: 'capitalize',
  },
  timelineDate: {
    fontSize: '12px',
    color: '#495057',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  timelineNote: {
    fontSize: '13px',
    color: '#495057',
    marginTop: '4px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  loadingState: {
    textAlign: 'center',
    padding: '80px 24px',
    fontSize: '14px',
    color: '#495057',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  refundCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
    padding: '24px',
    marginBottom: '20px',
  },
  refundItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #e9ecef',
    fontSize: '14px',
    color: '#343a40',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  confirmModal: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(33,37,41,0.48)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '24px',
  },
  confirmBox: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '440px',
    width: '100%',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  confirmTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '12px',
  },
  confirmText: {
    fontSize: '14px',
    color: '#495057',
    marginBottom: '24px',
    lineHeight: '1.5',
  },
  confirmBtns: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  confirmCancelBtn: {
    padding: '10px 20px',
    backgroundColor: '#ffffff',
    color: '#343a40',
    border: '1px solid #868e96',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    minHeight: '44px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  confirmOkBtn: (danger) => ({
    padding: '10px 20px',
    backgroundColor: danger ? '#f03e3e' : '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  }),
};

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [advancing, setAdvancing] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const [confirmAction, setConfirmAction] = useState(null);

  const getToken = () => localStorage.getItem('accessToken');

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = getToken();
      const [orderRes, timelineRes, refundsRes] = await Promise.all([
        fetch(`/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`/api/orders/${id}/timeline`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`/api/orders/${id}/refunds`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!orderRes.ok) {
        const data = await orderRes.json().catch(() => ({}));
        throw new Error(data.message || `Error ${orderRes.status}`);
      }

      const orderData = await orderRes.json();
      setOrder(orderData.order || orderData);

      if (timelineRes.ok) {
        const tlData = await timelineRes.json();
        setTimeline(tlData.timeline || tlData.data || tlData || []);
      }

      if (refundsRes.ok) {
        const rfData = await refundsRes.json();
        setRefunds(rfData.refunds || rfData.data || rfData || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load order.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleAdvance = async () => {
    setConfirmAction({
      type: 'advance',
      title: 'Advance Order Status',
      message: `Move this order from "${order.status.replace(/_/g, ' ')}" to "${ADVANCE_TRANSITIONS[order.status].replace(/_/g, ' ')}"?`,
      danger: false,
    });
  };

  const handleCancel = () => {
    setConfirmAction({
      type: 'cancel',
      title: 'Cancel Order',
      message: 'Are you sure you want to cancel this order? This action cannot be undone.',
      danger: true,
    });
  };

  const handleConfirm = async () => {
    const action = confirmAction;
    setConfirmAction(null);

    if (action.type === 'advance') {
      setAdvancing(true);
      setError('');
      setSuccessMsg('');
      try {
        const token = getToken();
        const res = await fetch(`/api/orders/${id}/advance`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
        setSuccessMsg('Order status advanced successfully.');
        await fetchOrder();
      } catch (err) {
        setError(err.message || 'Failed to advance order status.');
      } finally {
        setAdvancing(false);
      }
    } else if (action.type === 'cancel') {
      setCancelling(true);
      setError('');
      setSuccessMsg('');
      try {
        const token = getToken();
        const res = await fetch(`/api/orders/${id}/cancel`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
        setSuccessMsg('Order cancelled successfully.');
        await fetchOrder();
      } catch (err) {
        setError(err.message || 'Failed to cancel order.');
      } finally {
        setCancelling(false);
      }
    }
  };

  const handleDismissConfirm = () => setConfirmAction(null);

  const canAdvance = order && ADVANCE_TRANSITIONS[order.status];
  const canCancel =
    order &&
    !['cancelled', 'delivered', 'returned', 'refunded'].includes(order.status);

  const items = order?.items || order?.orderItems || [];
  const shippingAddress = order?.shippingAddress || order?.shipping_address || {};
  const customer = order?.user || order?.customer || {};

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loadingState} aria-live="polite" aria-busy="true">
            Loading order…
          </div>
        </div>
      </div>
    );
  }

  if (!loading && !order && error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <button style={styles.backBtn} onClick={() => navigate('/admin/orders')}>
            ← Back to Orders
          </button>
          <div style={styles.errorBanner} role="alert">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button style={styles.backBtn} onClick={() => navigate('/admin/orders')}>
          ← Back to Orders
        </button>

        {error && (
          <div style={styles.errorBanner} role="alert">
            {error}
          </div>
        )}

        {successMsg && (
          <div style={styles.successBanner} role="status">
            {successMsg}
          </div>
        )}

        {order && (
          <>
            {/* Header */}
            <div style={styles.headerRow}>
              <div style={styles.titleGroup}>
                <h1 style={styles.title}>
                  Order{' '}
                  <span style={styles.orderId}>#{String(order.id).slice(0, 8).toUpperCase()}</span>
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <StatusBadge status={order.status} />
                  <span style={{ fontSize: '13px', color: '#495057' }}>
                    Placed {formatDate(order.createdAt || order.created_at)}
                  </span>
                </div>
              </div>
              <div style={styles.actionGroup}>
                {canAdvance && (
                  <button
                    style={styles.advanceBtn(advancing || !canAdvance)}
                    onClick={handleAdvance}
                    disabled={advancing || !canAdvance}
                    aria-label={`Advance status to ${ADVANCE_TRANSITIONS[order.status]}`}
                  >
                    {advancing
                      ? 'Advancing…'
                      : `Advance to ${ADVANCE_TRANSITIONS[order.status].replace(/_/g, ' ')}`}
                  </button>
                )}
                {canCancel && (
                  <button
                    style={styles.cancelBtn(cancelling || !canCancel)}
                    onClick={handleCancel}
                    disabled={cancelling || !canCancel}
                    aria-label="Cancel order"
                  >
                    {cancelling ? 'Cancelling…' : 'Cancel Order'}
                  </button>
                )}
              </div>
            </div>

            {/* Info Cards */}
            <div style={styles.grid}>
              {/* Customer Info */}
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Customer</h2>
                <div style={styles.field}>
                  <span style={styles.fieldLabel}>Name</span>
                  <span style={styles.fieldValue}>
                    {order.customerName ||
                      (customer.firstName || customer.lastName
                        ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim()
                        : '—')}
                  </span>
                </div>
                <div style={styles.field}>
                  <span style={styles.fieldLabel}>Email</span>
                  <span style={styles.fieldValue}>
                    {order.customerEmail || customer.email || '—'}
                  </span>
                </div>
                {(customer.phone || order.customerPhone) && (
                  <div style={styles.field}>
                    <span style={styles.fieldLabel}>Phone</span>
                    <span style={styles.fieldValue}>
                      {customer.phone || order.customerPhone}
                    </span>
                  </div>
                )}
                {customer.id && (
                  <div style={styles.field}>
                    <span style={styles.fieldLabel}>User ID</span>
                    <span
                      style={{
                        ...styles.fieldValue,
                        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                        fontSize: '13px',
                      }}
                    >
                      {customer.id}
                    </span>
                  </div>
                )}
              </div>

              {/* Shipping Address */}
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Shipping Address</h2>
                {Object.keys(shippingAddress).length > 0 ? (
                  <>
                    {shippingAddress.name && (
                      <div style={styles.field}>
                        <span style={styles.fieldLabel}>Name</span>
                        <span style={styles.fieldValue}>{shippingAddress.name}</span>
                      </div>
                    )}
                    <div style={styles.field}>
                      <span style={styles.fieldLabel}>Address</span>
                      <span style={{ ...styles.fieldValue, display: 'block' }}>
                        {[
                          shippingAddress.line1 || shippingAddress.addressLine1,
                          shippingAddress.line2 || shippingAddress.addressLine2,
                          shippingAddress.city,
                          shippingAddress.state,
                          shippingAddress.pincode || shippingAddress.postalCode,
                          shippingAddress.country,
                        ]
                          .filter(Boolean)
                          .join(', ')}
                      </span>
                    </div>
                    {shippingAddress.phone && (
                      <div style={styles.field}>
                        <span style={styles.fieldLabel}>Phone</span>
                        <span style={styles.fieldValue}>{shippingAddress.phone}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <span style={styles.fieldValue}>—</span>
                )}
              </div>

              {/* Payment Info */}
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Payment</h2>
                <div style={styles.field}>
                  <span style={styles.fieldLabel}>Status</span>
                  <span
                    style={{
                      ...styles.fieldValue,
                      color:
                        (order.paymentStatus || order.payment_status) === 'paid'
                          ? '#37b24d'
                          : (order.paymentStatus || order.payment_status) === 'failed'
                          ? '#f03e3e'
                          : '#fd7e14',
                      fontWeight: '500',
                      textTransform: 'capitalize',
                    }}
                  >
                    {(order.paymentStatus || order.payment_status)
                      ? (order.paymentStatus || order.payment_status).replace(/_/g, ' ')
                      : '—'}
                  </span>
                </div>
                {(order.paymentMethod || order.payment_method) && (
                  <div style={styles.field}>
                    <span style={styles.fieldLabel}>Method</span>
                    <span style={{ ...styles.fieldValue, textTransform: 'capitalize' }}>
                      {(order.paymentMethod || order.payment_method).replace(/_/g, ' ')}
                    </span>
                  </div>
                )}
                {(order.transactionId || order.transaction_id) && (
                  <div style={styles.field}>
                    <span style={styles.fieldLabel}>Transaction ID</span>
                    <span
                      style={{
                        ...styles.fieldValue,
                        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                        fontSize: '13px',
                      }}
                    >
                      {order.transactionId || order.transaction_id}
                    </span>
                  </div>
                )}
                {(order.promoCode || order.promo_code) && (
                  <div style={styles.field}>
                    <span style={styles.fieldLabel}>Promo Code</span>
                    <span
                      style={{
                        ...styles.fieldValue,
                        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                        fontSize: '13px',
                        color: '#4c6ef5',
                      }}
                    >
                      {order.promoCode || order.promo_code}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div style={styles.fullCard}>
              <div style={styles.fullCardHeader}>
                <h2 style={styles.fullCardTitle}>Order Items</h2>
              </div>
              {items.length === 0 ? (
                <div style={{ padding: '32px 24px', color: '#495057', fontSize: '14px' }}>No items found.</div>
              ) : (
                <>
                  <div style={styles.tableWrapper}>
                    <table style={styles.table} aria-label="Order items">
                      <thead style={styles.thead}>
                        <tr>
                          <th style={styles.th} scope="col">Product</th>
                          <th style={styles.th} scope="col">SKU</th>
                          <th style={styles.th} scope="col">Qty</th>
                          <th style={styles.th} scope="col">Unit Price</th>
                          <th style={styles.th} scope="col">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, idx) => (
                          <tr key={item.id || idx}>
                            <td style={styles.td}>
                              <div style={{ fontWeight: '500', color: '#212529' }}>
                                {item.productName || item.product_name || item.name || '—'}
                              </div>
                              {item.variantLabel && (
                                <div style={{ fontSize: '12px', color: '#495057', marginTop: '2px' }}>
                                  {item.variantLabel}
                                </div>
                              )}
                            </td>
                            <td style={styles.td}>
                              <span
                                style={{
                                  fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                                  fontSize: '13px',
                                }}
                              >
                                {item.skuCode || item.sku_code || item.sku || '—'}
                              </span>
                            </td>
                            <td style={styles.td}>{item.quantity || '—'}</td>
                            <td style={styles.td}>
                              {formatCurrency(item.unitPrice || item.unit_price || item.price)}
                            </td>
                            <td style={{ ...styles.td, fontWeight: '500' }}>
                              {formatCurrency(
                                item.subtotal ||
                                  (item.quantity &&
                                    (item.unitPrice || item.unit_price || item.price)
                                    ? item.quantity * (item.unitPrice || item.unit_price || item.price)
                                    : null)
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Order Summary */}
                  <div style={{ padding: '20px 24px' }}>
                    <div style={styles.summaryRow}>
                      <div style={styles.summaryTable}>
                        {(order.subtotal != null) && (
                          <div style={styles.summaryLine}>
                            <span>Subtotal</span>
                            <span>{formatCurrency(order.subtotal)}</span>
                          </div>
                        )}
                        {(order.shippingAmount != null || order.shipping_amount != null) && (
                          <div style={styles.summaryLine}>
                            <span>Shipping</span>
                            <span>{formatCurrency(order.shippingAmount || order.shipping_amount)}</span>
                          </div>
                        )}
                        {(order.discountAmount != null || order.discount_amount != null) && (
                          <div style={styles.summaryLine}>
                            <span>Discount</span>
                            <span style={{ color: '#37b24d' }}>
                              -{formatCurrency(order.discountAmount || order.discount_amount)}
                            </span>
                          </div>
                        )}
                        {(order.taxAmount != null || order.tax_amount != null) && (
                          <div style={styles.summaryLine}>
                            <span>Tax</span>
                            <span>{formatCurrency(order.taxAmount || order.tax_amount)}</span>
                          </div>
                        )}
                        <div style={styles.summaryTotal}>
                          <span>Total</span>
                          <span>{formatCurrency(order.totalAmount || order.total_amount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Order Timeline */}
            <div style={{ ...styles.grid, gridTemplateColumns: refunds.length > 0 ? '1fr 1fr' : '1fr' }}>
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Status Timeline</h2>
                {timeline.length === 0 ? (
                  <p style={{ fontSize: '14px', color: '#495057', margin: 0 }}>No timeline events.</p>
                ) : (
                  <ul style={styles.timelineList} aria-label="Order status timeline">
                    {timeline.map((event, idx) => (
                      <li key={event.id || idx} style={styles.timelineItem}>
                        <div style={styles.timelineDotWrapper}>
                          <div style={styles.timelineDot(idx === 0)} />
                          {idx < timeline.length - 1 && <div style={styles.timelineLine} />}
                        </div>
                        <div style={styles.timelineContent}>
                          <div style={styles.timelineStatus}>
                            {(event.status || event.toStatus || event.to_status || '').replace(/_/g, ' ')}
                          </div>
                          <div style={styles.timelineDate}>
                            {formatDate(event.createdAt || event.created_at || event.timestamp)}
                          </div>
                          {(event.note || event.comment || event.notes) && (
                            <div style={styles.timelineNote}>
                              {event.note || event.comment || event.notes}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Refunds */}
              {refunds.length > 0 && (
                <div style={styles.card}>
                  <h2 style={styles.cardTitle}>Refunds</h2>
                  {refunds.map((refund, idx) => (
                    <div key={refund.id || idx} style={styles.refundItem}>
                      <div>
                        <div style={{ fontWeight: '500', color: '#212529', marginBottom: '2px' }}>
                          {formatCurrency(refund.amount)}
                        </div>
                        <div style={{ fontSize: '12px', color: '#495057' }}>
                          {formatDate(refund.createdAt || refund.created_at)}
                        </div>
                        {refund.reason && (
                          <div style={{ fontSize: '12px', color: '#495057', marginTop: '2px' }}>
                            {refund.reason}
                          </div>
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'capitalize',
                          color:
                            refund.status === 'completed'
                              ? '#37b24d'
                              : refund.status === 'failed'
                              ? '#f03e3e'
                              : '#fd7e14',
                        }}
                      >
                        {(refund.status || '').replace(/_/g, ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div
          style={styles.confirmModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleDismissConfirm();
          }}
        >
          <div style={styles.confirmBox}>
            <h2 id="confirm-title" style={styles.confirmTitle}>
              {confirmAction.title}
            </h2>
            <p style={styles.confirmText}>{confirmAction.message}</p>
            <div style={styles.confirmBtns}>
              <button
                style={styles.confirmCancelBtn}
                onClick={handleDismissConfirm}
              >
                Cancel
              </button>
              <button
                style={styles.confirmOkBtn(confirmAction.danger)}
                onClick={handleConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
