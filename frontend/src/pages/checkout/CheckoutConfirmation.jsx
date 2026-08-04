import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '@/api';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#212529',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 16px',
  },
  successBanner: {
    backgroundColor: '#d3f9d8',
    borderRadius: '10px',
    padding: '32px 24px',
    textAlign: 'center',
    marginBottom: '24px',
    boxShadow: '0 1px 4px rgba(33,37,41,0.08)',
  },
  successIconWrap: {
    width: '64px',
    height: '64px',
    borderRadius: '9999px',
    backgroundColor: '#37b24d',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  successIcon: {
    width: '32px',
    height: '32px',
    filter: 'brightness(0) invert(1)',
  },
  successHeading: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    color: '#212529',
    marginBottom: '8px',
  },
  successSubtitle: {
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '24px',
    color: '#495057',
    marginBottom: '16px',
  },
  orderIdBadge: {
    display: 'inline-block',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
    letterSpacing: '0.04em',
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '6px',
    padding: '6px 14px',
    color: '#212529',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 360px',
    gap: '24px',
    alignItems: 'start',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 4px rgba(33,37,41,0.08)',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '28px',
    color: '#212529',
    marginBottom: '16px',
  },
  orderItemRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    paddingBottom: '12px',
    marginBottom: '12px',
    borderBottom: '1px solid #e9ecef',
  },
  orderItemImg: {
    width: '64px',
    height: '64px',
    objectFit: 'cover',
    borderRadius: '6px',
    backgroundColor: '#f8f9fa',
    flexShrink: 0,
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '2px',
    lineHeight: '22px',
  },
  orderItemMeta: {
    fontSize: '13px',
    color: '#495057',
    lineHeight: '20px',
  },
  orderItemPrice: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#212529',
    flexShrink: 0,
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  infoLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    marginBottom: '4px',
  },
  infoValue: {
    fontSize: '14px',
    color: '#212529',
    lineHeight: '20px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
    color: '#495057',
    marginBottom: '8px',
  },
  divider: {
    height: '1px',
    backgroundColor: '#e9ecef',
    margin: '12px 0',
  },
  grandTotalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '18px',
    fontWeight: '700',
    color: '#212529',
    borderTop: '2px solid #212529',
    paddingTop: '12px',
    marginTop: '8px',
  },
  shippingFreeText: {
    color: '#37b24d',
    fontWeight: '600',
  },
  taxNote: {
    fontSize: '12px',
    color: '#495057',
    marginTop: '8px',
    lineHeight: '16px',
  },
  statusBadge: (status) => {
    const map = {
      confirmed: { bg: '#d3f9d8', color: '#37b24d' },
      pending: { bg: '#fff4e6', color: '#fd7e14' },
      processing: { bg: '#e8ecfd', color: '#4c6ef5' },
      shipped: { bg: '#e8ecfd', color: '#4c6ef5' },
      delivered: { bg: '#d3f9d8', color: '#37b24d' },
      cancelled: { bg: '#ffe3e3', color: '#f03e3e' },
    };
    const key = (status || '').toLowerCase();
    const { bg, color } = map[key] || { bg: '#e9ecef', color: '#495057' };
    return {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      padding: '3px 10px',
      borderRadius: '3px',
      backgroundColor: bg,
      color,
    };
  },
  alertBox: (type) => ({
    padding: '12px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    lineHeight: '20px',
    marginBottom: '16px',
    backgroundColor: type === 'error' ? '#ffe3e3' : '#d3f9d8',
    color: type === 'error' ? '#f03e3e' : '#37b24d',
  }),
  actionsRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginTop: '8px',
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#4c6ef5',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    minHeight: '44px',
    lineHeight: '24px',
    textDecoration: 'none',
    transition: 'background-color 0.15s',
  },
  btnSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#4c6ef5',
    backgroundColor: 'transparent',
    border: '1px solid #4c6ef5',
    borderRadius: '10px',
    cursor: 'pointer',
    minHeight: '44px',
    lineHeight: '24px',
    textDecoration: 'none',
    transition: 'background-color 0.15s',
  },
  loadingText: {
    color: '#495057',
    fontSize: '14px',
  },
  guestRegisterCard: {
    backgroundColor: '#e8ecfd',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 4px rgba(33,37,41,0.08)',
    marginTop: '0',
  },
  guestRegisterTitle: {
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '24px',
    color: '#212529',
    marginBottom: '8px',
  },
  guestRegisterText: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: '20px',
    marginBottom: '16px',
  },
  sidebarCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 4px rgba(33,37,41,0.08)',
    marginBottom: '16px',
  },
  sidebarTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '16px',
  },
  timelineItem: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
    alignItems: 'flex-start',
  },
  timelineDotDone: {
    width: '12px',
    height: '12px',
    borderRadius: '9999px',
    backgroundColor: '#37b24d',
    marginTop: '4px',
    flexShrink: 0,
  },
  timelineDotPending: {
    width: '12px',
    height: '12px',
    borderRadius: '9999px',
    backgroundColor: '#e9ecef',
    border: '2px solid #868e96',
    marginTop: '4px',
    flexShrink: 0,
  },
  timelineLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
    lineHeight: '20px',
  },
  timelineDate: {
    fontSize: '12px',
    color: '#495057',
    lineHeight: '16px',
  },
};

const ORDER_TIMELINE_STEPS = [
  { key: 'order_placed', label: 'Order Placed' },
  { key: 'payment_confirmed', label: 'Payment Confirmed' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
];

export default function CheckoutConfirmation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    } else {
      setLoading(false);
    }
    checkGuestStatus();
  }, [orderId]);

  async function fetchOrder(id) {
    setLoading(true);
    setLoadError('');
    try {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Failed to load order details.';
      setLoadError(msg);
    } finally {
      setLoading(false);
    }
  }

  function checkGuestStatus() {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const guestFlag = localStorage.getItem('isGuest');
      if (!token || guestFlag === 'true') {
        setIsGuest(true);
      }
    } catch {
      // ignore
    }
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  }

  const items = order?.items || order?.orderItems || [];
  const address = order?.shippingAddress || order?.address || null;
  const payment = order?.payment || order?.paymentMethod || null;
  const subtotal = order?.subtotal ?? null;
  const shipping = order?.shipping ?? order?.shippingCharge ?? null;
  const tax = order?.tax ?? order?.taxes ?? null;
  const discount = order?.discount ?? null;
  const total = order?.total ?? order?.totalAmount ?? null;
  const status = order?.status || 'confirmed';
  const timeline = order?.timeline || order?.statusHistory || [];

  const displayOrderId = orderId || order?.id || order?.orderId;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Success Banner */}
        <div style={styles.successBanner} role="status" aria-live="polite">
          <div style={styles.successIconWrap} aria-hidden="true">
            <img
              src="/src/assets/icons/check.svg"
              alt=""
              style={styles.successIcon}
            />
          </div>
          <h1 style={styles.successHeading}>Order Confirmed!</h1>
          <p style={styles.successSubtitle}>
            Thank you for your purchase. Your order has been placed successfully.
          </p>
          {displayOrderId && (
            <div>
              <span style={{ fontSize: '14px', color: '#495057', marginRight: '8px' }}>
                Order ID:
              </span>
              <span style={styles.orderIdBadge}>{displayOrderId}</span>
            </div>
          )}
          {status && (
            <div style={{ marginTop: '12px' }}>
              <span style={styles.statusBadge(status)}>{status.replace(/_/g, ' ')}</span>
            </div>
          )}
        </div>

        {loading ? (
          <div style={styles.card}>
            <p style={styles.loadingText}>Loading order details…</p>
          </div>
        ) : loadError ? (
          <div style={styles.alertBox('error')} role="alert">
            {loadError}
            {orderId && (
              <button
                type="button"
                onClick={() => fetchOrder(orderId)}
                style={{
                  marginLeft: '12px',
                  color: '#f03e3e',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  textDecoration: 'underline',
                }}
              >
                Retry
              </button>
            )}
          </div>
        ) : (
          <div style={styles.layout}>
            {/* Main content */}
            <main>
              {/* Order Items */}
              {items.length > 0 && (
                <div style={styles.card}>
                  <h2 style={styles.sectionTitle}>Items Ordered</h2>
                  {items.map((item, idx) => (
                    <div
                      key={item.id || item.skuId || idx}
                      style={{
                        ...styles.orderItemRow,
                        ...(idx === items.length - 1
                          ? { borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }
                          : {}),
                      }}
                    >
                      <img
                        src={
                          item.imageUrl ||
                          item.image ||
                          '/src/assets/images/placeholder-product.svg'
                        }
                        alt={item.productName || item.name || 'Product'}
                        style={styles.orderItemImg}
                        onError={(e) => {
                          e.target.src = '/src/assets/images/placeholder-product.svg';
                        }}
                      />
                      <div style={styles.orderItemInfo}>
                        <div style={styles.orderItemName}>
                          {item.productName || item.name || 'Product'}
                        </div>
                        {(item.variantLabel || item.sku || item.skuCode) && (
                          <div style={styles.orderItemMeta}>
                            {item.variantLabel || item.sku || item.skuCode}
                          </div>
                        )}
                        <div style={styles.orderItemMeta}>Qty: {item.quantity}</div>
                        {item.unitPrice != null && (
                          <div style={{ ...styles.orderItemMeta, color: '#495057' }}>
                            {formatCurrency(item.unitPrice)} each
                          </div>
                        )}
                      </div>
                      <div style={styles.orderItemPrice}>
                        {formatCurrency(
                          (item.price || item.unitPrice || 0) * item.quantity
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Delivery & Payment info */}
              {(address || payment) && (
                <div style={styles.card}>
                  <div style={styles.infoGrid}>
                    {address && (
                      <div>
                        <p style={styles.infoLabel}>Delivery Address</p>
                        <div style={styles.infoValue}>
                          <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                            {address.fullName}
                          </div>
                          <div>
                            {[
                              address.addressLine1,
                              address.addressLine2,
                              address.city,
                              address.state,
                              address.pinCode,
                              address.country,
                            ]
                              .filter(Boolean)
                              .join(', ')}
                          </div>
                          {address.phone && (
                            <div style={{ color: '#495057', marginTop: '2px' }}>
                              Phone: {address.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {payment && (
                      <div>
                        <p style={styles.infoLabel}>Payment Method</p>
                        <div style={styles.infoValue}>
                          <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                            {payment.label ||
                              payment.method ||
                              payment.type ||
                              'Payment confirmed'}
                          </div>
                          {payment.maskedCard && (
                            <div style={{ color: '#495057' }}>
                              **** **** **** {payment.maskedCard}
                            </div>
                          )}
                          {payment.upiId && (
                            <div style={{ color: '#495057' }}>UPI: {payment.upiId}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Order timeline from API */}
              {timeline.length > 0 && (
                <div style={styles.card}>
                  <h2 style={styles.sectionTitle}>Order Timeline</h2>
                  {timeline.map((event, idx) => (
                    <div key={idx} style={styles.timelineItem}>
                      <div style={styles.timelineDotDone} aria-hidden="true" />
                      <div>
                        <div style={styles.timelineLabel}>
                          {event.status
                            ? event.status.replace(/_/g, ' ')
                            : event.label || event.event || ''}
                        </div>
                        {(event.createdAt || event.timestamp || event.date) && (
                          <div style={styles.timelineDate}>
                            {formatDate(
                              event.createdAt || event.timestamp || event.date
                            )}
                          </div>
                        )}
                        {event.note && (
                          <div
                            style={{ fontSize: '13px', color: '#495057', marginTop: '2px' }}
                          >
                            {event.note}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Default next steps when no timeline */}
              {timeline.length === 0 && (
                <div style={styles.card}>
                  <h2 style={styles.sectionTitle}>What Happens Next?</h2>
                  {ORDER_TIMELINE_STEPS.map((step, idx) => (
                    <div key={step.key} style={styles.timelineItem}>
                      <div
                        style={
                          idx <= 1
                            ? styles.timelineDotDone
                            : styles.timelineDotPending
                        }
                        aria-hidden="true"
                      />
                      <div>
                        <div
                          style={{
                            ...styles.timelineLabel,
                            color: idx <= 1 ? '#212529' : '#868e96',
                          }}
                        >
                          {step.label}
                        </div>
                        {idx === 0 && order?.createdAt && (
                          <div style={styles.timelineDate}>
                            {formatDate(order.createdAt)}
                          </div>
                        )}
                        {idx === 1 && payment && (
                          <div style={styles.timelineDate}>Payment received</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Guest register prompt */}
              {isGuest && (
                <div style={styles.guestRegisterCard}>
                  <h2 style={styles.guestRegisterTitle}>Save Your Order Details</h2>
                  <p style={styles.guestRegisterText}>
                    Create an account to track your order, manage returns, and enjoy a faster
                    checkout next time.
                  </p>
                  <div style={styles.actionsRow}>
                    <Link
                      to={
                        displayOrderId
                          ? `/checkout/guest-register?orderId=${displayOrderId}`
                          : '/checkout/guest-register'
                      }
                      style={styles.btnPrimary}
                    >
                      Create Account
                    </Link>
                    <Link to="/" style={styles.btnSecondary}>
                      Continue as Guest
                    </Link>
                  </div>
                </div>
              )}

              {/* Actions for registered users */}
              {!isGuest && (
                <div style={{ ...styles.actionsRow, marginTop: '8px' }}>
                  {displayOrderId && (
                    <Link
                      to={`/orders/${displayOrderId}`}
                      style={styles.btnPrimary}
                    >
                      View Order Details
                    </Link>
                  )}
                  <Link to="/orders" style={styles.btnSecondary}>
                    My Orders
                  </Link>
                  <Link to="/" style={styles.btnSecondary}>
                    Continue Shopping
                  </Link>
                </div>
              )}
            </main>

            {/* Sidebar: order totals */}
            <aside>
              <div style={styles.sidebarCard}>
                <h2 style={styles.sidebarTitle}>Order Summary</h2>

                {items.map((item, idx) => (
                  <div
                    key={item.id || item.skuId || idx}
                    style={styles.summaryRow}
                  >
                    <span
                      style={{ flex: 1, marginRight: '8px', color: '#212529' }}
                    >
                      {item.productName || item.name}
                      <span style={{ color: '#495057' }}> &times; {item.quantity}</span>
                    </span>
                    <span style={{ fontWeight: '500' }}>
                      {formatCurrency(
                        (item.price || item.unitPrice || 0) * item.quantity
                      )}
                    </span>
                  </div>
                ))}

                {items.length > 0 && <div style={styles.divider} />}

                {subtotal != null && (
                  <div style={styles.summaryRow}>
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                )}

                {discount != null && discount > 0 && (
                  <div style={{ ...styles.summaryRow, color: '#37b24d' }}>
                    <span>Discount</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}

                {shipping != null && (
                  <div style={styles.summaryRow}>
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span style={styles.shippingFreeText}>Free</span>
                      ) : (
                        formatCurrency(shipping)
                      )}
                    </span>
                  </div>
                )}

                {tax != null && (
                  <div style={styles.summaryRow}>
                    <span>Taxes &amp; Fees</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                )}

                {total != null && (
                  <div style={styles.grandTotalRow}>
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                )}

                {tax != null && (
                  <p style={styles.taxNote}>* Taxes included in total as applicable.</p>
                )}
              </div>

              {/* Estimated delivery */}
              {(order?.estimatedDelivery || order?.expectedDelivery) && (
                <div style={styles.sidebarCard}>
                  <h2 style={styles.sidebarTitle}>Estimated Delivery</h2>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <img
                      src="/src/assets/icons/package.svg"
                      alt=""
                      style={{ width: '20px', height: '20px', opacity: 0.7 }}
                    />
                    <span
                      style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#212529',
                      }}
                    >
                      {formatDate(
                        order.estimatedDelivery || order.expectedDelivery
                      )}
                    </span>
                  </div>
                </div>
              )}

              {/* Quick actions */}
              <div style={styles.sidebarCard}>
                <h2 style={styles.sidebarTitle}>Quick Actions</h2>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  {displayOrderId && (
                    <Link
                      to={`/orders/${displayOrderId}`}
                      style={{
                        ...styles.btnSecondary,
                        fontSize: '14px',
                        padding: '10px 16px',
                        minHeight: '40px',
                        textAlign: 'center',
                      }}
                    >
                      Track Order
                    </Link>
                  )}
                  <Link
                    to="/"
                    style={{
                      ...styles.btnPrimary,
                      fontSize: '14px',
                      padding: '10px 16px',
                      minHeight: '40px',
                      textAlign: 'center',
                    }}
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
