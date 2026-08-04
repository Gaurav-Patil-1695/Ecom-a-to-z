import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  stepper: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '32px',
    gap: '8px',
  },
  stepItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  stepCircle: (active, done) => ({
    width: '28px',
    height: '28px',
    borderRadius: '9999px',
    backgroundColor: done ? '#37b24d' : active ? '#4c6ef5' : '#e9ecef',
    color: done || active ? '#ffffff' : '#adb5bd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '600',
    flexShrink: 0,
  }),
  stepLabel: (active) => ({
    fontSize: '14px',
    fontWeight: active ? '600' : '400',
    color: active ? '#212529' : '#495057',
  }),
  stepDivider: {
    flex: 1,
    height: '1px',
    backgroundColor: '#868e96',
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
  sectionSubTitle: {
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '24px',
    color: '#212529',
    marginBottom: '12px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
    color: '#495057',
    marginBottom: '8px',
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    borderTop: '1px solid #868e96',
    paddingTop: '12px',
    marginTop: '4px',
  },
  divider: {
    height: '1px',
    backgroundColor: '#e9ecef',
    margin: '16px 0',
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
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  promoRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-start',
    marginBottom: '8px',
  },
  promoInput: (hasError) => ({
    flex: 1,
    padding: '10px 12px',
    fontSize: '14px',
    lineHeight: '20px',
    color: '#212529',
    backgroundColor: '#ffffff',
    border: `1px solid ${hasError ? '#f03e3e' : '#868e96'}`,
    borderRadius: '6px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    transition: 'border-color 0.15s',
  }),
  promoApplyBtn: (loading) => ({
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: loading ? '#adb5bd' : '#4c6ef5',
    border: 'none',
    borderRadius: '6px',
    cursor: loading ? 'not-allowed' : 'pointer',
    whiteSpace: 'nowrap',
    minHeight: '44px',
    lineHeight: '20px',
    flexShrink: 0,
    transition: 'background-color 0.15s',
  }),
  promoRemoveBtn: {
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#f03e3e',
    backgroundColor: 'transparent',
    border: '1px solid #f03e3e',
    borderRadius: '6px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    minHeight: '44px',
    lineHeight: '20px',
    flexShrink: 0,
    transition: 'background-color 0.15s',
  },
  promoAppliedBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    fontWeight: '600',
    padding: '4px 10px',
    borderRadius: '3px',
    backgroundColor: '#d3f9d8',
    color: '#37b24d',
    marginBottom: '8px',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    letterSpacing: '0.04em',
  },
  errorText: {
    fontSize: '12px',
    color: '#f03e3e',
    marginTop: '4px',
    lineHeight: '16px',
  },
  alertBox: (type) => ({
    padding: '12px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    lineHeight: '20px',
    marginBottom: '16px',
    backgroundColor: type === 'error' ? '#ffe3e3' : type === 'success' ? '#d3f9d8' : '#fff4e6',
    color: type === 'error' ? '#f03e3e' : type === 'success' ? '#37b24d' : '#fd7e14',
  }),
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
    justifyContent: 'flex-end',
  },
  btnPrimary: {
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
    transition: 'background-color 0.15s',
  },
  btnSecondary: {
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
    transition: 'background-color 0.15s',
  },
  loadingText: {
    color: '#495057',
    fontSize: '14px',
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
};

const STEPS = [
  { label: 'Address', path: '/checkout/address' },
  { label: 'Payment', path: '/checkout/payment' },
  { label: 'Review', path: '/checkout/review' },
];

export default function CheckoutReview() {
  const navigate = useNavigate();

  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    fetchReviewData();
  }, []);

  async function fetchReviewData() {
    setLoading(true);
    setLoadError('');
    try {
      const response = await api.get('/checkout/review');
      setReviewData(response.data);
      if (response.data?.promoCode) {
        setPromoApplied(response.data.promoCode);
        setPromoCode(response.data.promoCode.code || '');
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Failed to load order review. Please try again.';
      setLoadError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleApplyPromo() {
    const trimmed = promoCode.trim().toUpperCase();
    if (!trimmed) {
      setPromoError('Please enter a promo code.');
      return;
    }
    setPromoLoading(true);
    setPromoError('');
    try {
      const cartId = localStorage.getItem('cartId');
      if (!cartId) {
        setPromoError('Cart not found. Please refresh the page.');
        setPromoLoading(false);
        return;
      }
      const response = await api.post(`/carts/${cartId}/promo`, { code: trimmed });
      const data = response.data;
      setPromoApplied(data.promoCode || data.promo || { code: trimmed, discount: data.discount || 0 });
      await fetchReviewData();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Invalid or expired promo code.';
      setPromoError(msg);
      setPromoApplied(null);
    } finally {
      setPromoLoading(false);
    }
  }

  function handleRemovePromo() {
    setPromoApplied(null);
    setPromoCode('');
    setPromoError('');
    fetchReviewData();
  }

  async function handlePlaceOrder() {
    setSubmitError('');
    setSubmitting(true);
    try {
      const response = await api.post('/checkout/place-order', {});
      const data = response.data;
      const orderId = data.orderId || data.order?.id || data.id;
      if (orderId) {
        navigate(`/checkout/confirmation?orderId=${orderId}`);
      } else {
        navigate('/checkout/confirmation');
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Failed to place order. Please try again.';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  }

  const items = reviewData?.items || reviewData?.cart?.items || [];
  const address = reviewData?.address || reviewData?.shippingAddress || null;
  const payment = reviewData?.payment || reviewData?.paymentMethod || null;
  const subtotal = reviewData?.subtotal ?? reviewData?.cart?.subtotal ?? null;
  const shipping = reviewData?.shipping ?? reviewData?.shippingCharge ?? reviewData?.cart?.shipping ?? null;
  const tax = reviewData?.tax ?? reviewData?.taxes ?? reviewData?.cart?.tax ?? null;
  const discount = reviewData?.discount ?? reviewData?.cart?.discount ?? null;
  const total = reviewData?.total ?? reviewData?.cart?.total ?? null;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Stepper */}
        <nav style={styles.stepper} aria-label="Checkout steps">
          {STEPS.map((step, index) => {
            const isDone = index < 2;
            const isActive = index === 2;
            return (
              <div
                key={step.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flex: index < STEPS.length - 1 ? 1 : 'none',
                  gap: '8px',
                }}
              >
                <div style={styles.stepItem}>
                  <div
                    style={styles.stepCircle(isActive, isDone)}
                    aria-current={isActive ? 'step' : undefined}
                  >
                    {isDone ? '✓' : index + 1}
                  </div>
                  <span style={styles.stepLabel(isActive)}>{step.label}</span>
                </div>
                {index < STEPS.length - 1 && <div style={styles.stepDivider} />}
              </div>
            );
          })}
        </nav>

        {loading ? (
          <div style={styles.card}>
            <p style={styles.loadingText}>Loading order review…</p>
          </div>
        ) : loadError ? (
          <div style={styles.alertBox('error')} role="alert">
            {loadError}
            <button
              type="button"
              onClick={fetchReviewData}
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
          </div>
        ) : (
          <div style={styles.layout}>
            {/* Main content */}
            <main>
              {submitError && (
                <div style={styles.alertBox('error')} role="alert">
                  {submitError}
                </div>
              )}

              {/* Order Items */}
              <div style={styles.card}>
                <h1 style={styles.sectionTitle}>Review Your Order</h1>
                {items.length === 0 ? (
                  <p style={styles.loadingText}>No items in your order.</p>
                ) : (
                  items.map((item, idx) => (
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
                        src={item.imageUrl || item.image || '/src/assets/images/placeholder-product.svg'}
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
                      </div>
                      <div style={styles.orderItemPrice}>
                        {formatCurrency((item.price || item.unitPrice || 0) * item.quantity)}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Delivery & Payment summary */}
              <div style={styles.card}>
                <div style={styles.infoGrid}>
                  {/* Delivery address */}
                  <div>
                    <p style={styles.infoLabel}>Delivery Address</p>
                    {address ? (
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
                    ) : (
                      <div style={{ ...styles.infoValue, color: '#495057' }}>Not set</div>
                    )}
                    <button
                      type="button"
                      onClick={() => navigate('/checkout/address')}
                      style={{
                        marginTop: '8px',
                        color: '#4c6ef5',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '600',
                        padding: '0',
                        textDecoration: 'underline',
                      }}
                    >
                      Change
                    </button>
                  </div>

                  {/* Payment method */}
                  <div>
                    <p style={styles.infoLabel}>Payment Method</p>
                    {payment ? (
                      <div style={styles.infoValue}>
                        <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                          {payment.label || payment.method || payment.type || 'Payment selected'}
                        </div>
                        {payment.maskedCard && (
                          <div style={{ color: '#495057' }}>**** **** **** {payment.maskedCard}</div>
                        )}
                        {payment.upiId && (
                          <div style={{ color: '#495057' }}>UPI: {payment.upiId}</div>
                        )}
                      </div>
                    ) : (
                      <div style={{ ...styles.infoValue, color: '#495057' }}>Not set</div>
                    )}
                    <button
                      type="button"
                      onClick={() => navigate('/checkout/payment')}
                      style={{
                        marginTop: '8px',
                        color: '#4c6ef5',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '600',
                        padding: '0',
                        textDecoration: 'underline',
                      }}
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>

              {/* Promo code */}
              <div style={styles.card}>
                <h2 style={styles.sectionSubTitle}>Promo Code</h2>
                {promoApplied ? (
                  <div>
                    <span style={styles.promoAppliedBadge}>
                      <img src="/src/assets/icons/check.svg" alt="" style={{ width: '14px', height: '14px' }} />
                      {promoApplied.code || promoCode}
                    </span>
                    <div style={{ ...styles.summaryRow, marginBottom: '12px' }}>
                      <span style={{ color: '#37b24d', fontSize: '13px' }}>
                        Promo applied
                        {promoApplied.discountAmount != null
                          ? ` — you save ${formatCurrency(promoApplied.discountAmount)}`
                          : promoApplied.discount != null
                          ? ` — you save ${formatCurrency(promoApplied.discount)}`
                          : ''}
                      </span>
                      <button
                        type="button"
                        style={styles.promoRemoveBtn}
                        onClick={handleRemovePromo}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={styles.promoRow}>
                      <input
                        type="text"
                        id="promoCode"
                        name="promoCode"
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value);
                          setPromoError('');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleApplyPromo();
                        }}
                        placeholder="Enter promo code"
                        style={styles.promoInput(!!promoError)}
                        aria-label="Promo code"
                        aria-invalid={!!promoError}
                        aria-describedby={promoError ? 'promo-error' : undefined}
                        disabled={promoLoading}
                      />
                      <button
                        type="button"
                        style={styles.promoApplyBtn(promoLoading)}
                        onClick={handleApplyPromo}
                        disabled={promoLoading}
                        aria-busy={promoLoading}
                      >
                        {promoLoading ? 'Applying…' : 'Apply'}
                      </button>
                    </div>
                    {promoError && (
                      <p id="promo-error" style={styles.errorText}>{promoError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={styles.actions}>
                <button
                  type="button"
                  style={styles.btnSecondary}
                  onClick={() => navigate('/checkout/payment')}
                >
                  Back to Payment
                </button>
                <button
                  type="button"
                  style={{
                    ...styles.btnPrimary,
                    opacity: submitting ? 0.7 : 1,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                  }}
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                  aria-busy={submitting}
                >
                  {submitting ? 'Placing Order…' : 'Place Order'}
                </button>
              </div>
            </main>

            {/* Order totals sidebar */}
            <aside>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 4px rgba(33,37,41,0.08)' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#212529', marginBottom: '16px' }}>
                  Order Totals
                </h2>

                {/* Item rows */}
                {items.map((item, idx) => (
                  <div key={item.id || item.skuId || idx} style={styles.summaryRow}>
                    <span style={{ flex: 1, marginRight: '8px', color: '#212529' }}>
                      {item.productName || item.name}
                      <span style={{ color: '#495057' }}> × {item.quantity}</span>
                    </span>
                    <span style={{ fontWeight: '500' }}>
                      {formatCurrency((item.price || item.unitPrice || 0) * item.quantity)}
                    </span>
                  </div>
                ))}

                <div style={styles.divider} />

                {/* Subtotal */}
                {subtotal != null && (
                  <div style={styles.summaryRow}>
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                )}

                {/* Discount */}
                {discount != null && discount > 0 && (
                  <div style={{ ...styles.summaryRow, color: '#37b24d' }}>
                    <span>Discount</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}

                {/* Promo discount */}
                {promoApplied && (promoApplied.discountAmount || promoApplied.discount) > 0 && (
                  <div style={{ ...styles.summaryRow, color: '#37b24d' }}>
                    <span>
                      Promo ({promoApplied.code || promoCode})
                    </span>
                    <span>
                      -{formatCurrency(promoApplied.discountAmount || promoApplied.discount)}
                    </span>
                  </div>
                )}

                {/* Shipping */}
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

                {/* Tax */}
                {tax != null && (
                  <div style={styles.summaryRow}>
                    <span>Taxes &amp; Fees</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                )}

                {/* Grand total */}
                {total != null && (
                  <div style={styles.grandTotalRow}>
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                )}

                {tax != null && (
                  <p style={styles.taxNote}>* Taxes included in total as applicable.</p>
                )}

                {/* Place order from sidebar too */}
                <button
                  type="button"
                  style={{
                    ...styles.btnPrimary,
                    width: '100%',
                    marginTop: '16px',
                    opacity: submitting ? 0.7 : 1,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    textAlign: 'center',
                  }}
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                  aria-busy={submitting}
                >
                  {submitting ? 'Placing Order…' : 'Place Order'}
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
