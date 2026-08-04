import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  container: {
    maxWidth: '720px',
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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(33,37,41,0.08)',
    marginBottom: '24px',
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
  successPanel: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '48px 24px',
    boxShadow: '0 1px 3px rgba(33,37,41,0.08)',
    marginBottom: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  successIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '9999px',
    backgroundColor: '#d3f9d8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    fontSize: '32px',
  },
  successTitle: {
    fontSize: '24px',
    fontWeight: '700',
    letterSpacing: '-0.01em',
    lineHeight: '32px',
    color: '#212529',
    margin: '0 0 8px 0',
  },
  successSub: {
    fontSize: '14px',
    color: '#495057',
    margin: '0 0 24px 0',
    lineHeight: '1.5',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    padding: '16px 0',
    borderBottom: '1px solid #e9ecef',
  },
  itemRowLast: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    padding: '16px 0',
  },
  itemImage: {
    width: '64px',
    height: '64px',
    borderRadius: '6px',
    objectFit: 'cover',
    backgroundColor: '#e9ecef',
    flexShrink: 0,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    margin: '0 0 4px 0',
  },
  itemMeta: {
    fontSize: '14px',
    color: '#495057',
    margin: '0 0 2px 0',
  },
  itemPrice: {
    fontSize: '14px',
    color: '#212529',
    fontWeight: '500',
    margin: '4px 0 0 0',
  },
  checkboxWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '8px',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    accentColor: '#4c6ef5',
    cursor: 'pointer',
  },
  checkboxLabel: {
    fontSize: '14px',
    color: '#212529',
    cursor: 'pointer',
    userSelect: 'none',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#212529',
    marginBottom: '6px',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '16px',
    color: '#212529',
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '6px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    lineHeight: '1.5',
    transition: 'border-color 0.15s',
    cursor: 'pointer',
    appearance: 'auto',
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '16px',
    color: '#212529',
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '6px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    lineHeight: '1.5',
    resize: 'vertical',
    minHeight: '96px',
    transition: 'border-color 0.15s',
  },
  fieldError: {
    fontSize: '12px',
    color: '#f03e3e',
    marginTop: '4px',
    display: 'block',
  },
  hint: {
    fontSize: '12px',
    color: '#495057',
    marginTop: '4px',
    display: 'block',
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
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
  btnRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  skeletonBase: {
    backgroundColor: '#e9ecef',
    borderRadius: '6px',
  },
  orderIdLabel: {
    fontSize: '14px',
    color: '#495057',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    marginBottom: '0',
  },
  noItemsMsg: {
    fontSize: '14px',
    color: '#495057',
    margin: '0',
    fontStyle: 'italic',
  },
  returnedBadge: {
    display: 'inline-block',
    backgroundColor: '#e9ecef',
    color: '#495057',
    borderRadius: '9999px',
    padding: '2px 10px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginLeft: '8px',
    verticalAlign: 'middle',
  },
};

const RETURN_REASONS = [
  '',
  'Item arrived damaged',
  'Wrong item received',
  'Item not as described',
  'Changed my mind',
  'Item does not fit',
  'Defective / not working',
  'Other',
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

function formatCurrency(amount, currency = 'USD') {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  } catch {
    return `$${Number(amount).toFixed(2)}`;
  }
}

export default function ReturnRequest() {
  const navigate = useNavigate();
  const { id: orderId } = useParams();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [order, setOrder] = useState(null);
  const [eligibleItems, setEligibleItems] = useState([]);

  const [selectedItemIds, setSelectedItemIds] = useState(new Set());
  const [reasons, setReasons] = useState({});
  const [comments, setComments] = useState({});
  const [globalReason, setGlobalReason] = useState('');
  const [globalComments, setGlobalComments] = useState('');
  const [usePerItem, setUsePerItem] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true);
      setLoadError(null);
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`/api/orders/${orderId}`, { headers });
        if (!res.ok) {
          if (res.status === 404) throw new Error('Order not found or you do not have permission to view it.');
          throw new Error('Failed to load order. Please try again.');
        }
        const data = await res.json();
        const orderData = data.data || data.order || data;
        setOrder(orderData);

        const items = orderData.items || orderData.order_items || [];
        const eligible = items.filter(item => {
          const returned = item.return_requested || item.returnRequested || false;
          return !returned;
        });
        setEligibleItems(eligible);
      } catch (err) {
        setLoadError(err.message || 'Failed to load order. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    if (orderId) fetchOrder();
  }, [orderId]);

  function toggleItem(itemId) {
    setSelectedItemIds(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
    setFieldErrors(prev => ({ ...prev, items: undefined }));
  }

  function setItemReason(itemId, value) {
    setReasons(prev => ({ ...prev, [itemId]: value }));
    setFieldErrors(prev => ({ ...prev, [`reason_${itemId}`]: undefined }));
  }

  function setItemComments(itemId, value) {
    setComments(prev => ({ ...prev, [itemId]: value }));
  }

  function validate() {
    const errs = {};

    if (selectedItemIds.size === 0) {
      errs.items = 'Please select at least one item to return.';
    }

    if (usePerItem) {
      selectedItemIds.forEach(itemId => {
        if (!reasons[itemId]) {
          errs[`reason_${itemId}`] = 'Please select a reason for this item.';
        }
      });
    } else {
      if (!globalReason) {
        errs.globalReason = 'Please select a reason for the return.';
      }
    }

    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError(null);
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const returnItems = Array.from(selectedItemIds).map(itemId => ({
        order_item_id: itemId,
        reason: usePerItem ? (reasons[itemId] || globalReason) : globalReason,
        comments: usePerItem ? (comments[itemId] || globalComments || '') : globalComments,
      }));

      const res = await fetch(`/api/orders/${orderId}/return-requests`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          items: returnItems,
          reason: globalReason,
          comments: globalComments,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to submit return request. Please try again.');
      }

      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit return request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <SkeletonLine width="120px" height="16px" style={{ marginBottom: '24px' }} />
          <SkeletonLine width="280px" height="40px" style={{ marginBottom: '8px' }} />
          <SkeletonLine width="340px" height="16px" style={{ marginBottom: '32px' }} />
          <div style={styles.card}>
            <SkeletonLine width="140px" height="12px" style={{ marginBottom: '16px' }} />
            {[1, 2].map(i => (
              <div key={i} style={{ display: 'flex', gap: '16px', padding: '16px 0', borderBottom: i < 2 ? '1px solid #e9ecef' : 'none' }}>
                <SkeletonLine width="64px" height="64px" style={{ borderRadius: '6px', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <SkeletonLine width="180px" height="16px" style={{ marginBottom: '6px' }} />
                  <SkeletonLine width="120px" height="14px" style={{ marginBottom: '4px' }} />
                  <SkeletonLine width="80px" height="14px" />
                </div>
              </div>
            ))}
          </div>
          <div style={styles.card}>
            <SkeletonLine width="100px" height="12px" style={{ marginBottom: '16px' }} />
            <SkeletonLine width="100%" height="44px" style={{ borderRadius: '6px', marginBottom: '20px' }} />
            <SkeletonLine width="100%" height="96px" style={{ borderRadius: '6px', marginBottom: '20px' }} />
            <SkeletonLine width="160px" height="44px" style={{ borderRadius: '10px' }} />
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <button
            style={styles.backLink}
            onClick={() => navigate(`/account/orders/${orderId}`)}
            onMouseEnter={e => { e.currentTarget.style.color = '#3b5bdb'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#4c6ef5'; }}
            onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
            onBlur={e => { e.currentTarget.style.outline = 'none'; }}
          >
            <img src="/src/assets/icons/chevron-left.svg" alt="" aria-hidden="true" style={{ width: '16px', height: '16px' }} />
            Back to order
          </button>
          <div style={styles.errorBanner} role="alert">
            <span style={{ fontSize: '18px' }}>⚠️</span>
            <span>{loadError}</span>
          </div>
          <button
            style={styles.btnGhost}
            onClick={() => navigate('/account/orders')}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f1f3ff'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
            onBlur={e => { e.currentTarget.style.outline = 'none'; }}
          >
            Go to Order History
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <button
            style={styles.backLink}
            onClick={() => navigate(`/account/orders/${orderId}`)}
            onMouseEnter={e => { e.currentTarget.style.color = '#3b5bdb'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#4c6ef5'; }}
            onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
            onBlur={e => { e.currentTarget.style.outline = 'none'; }}
          >
            <img src="/src/assets/icons/chevron-left.svg" alt="" aria-hidden="true" style={{ width: '16px', height: '16px' }} />
            Back to order
          </button>
          <div style={styles.successPanel} role="status">
            <div style={styles.successIcon} aria-hidden="true">✓</div>
            <h1 style={styles.successTitle}>Return request submitted</h1>
            <p style={styles.successSub}>
              Our team will review your request within 1–2 business days.
            </p>
            <button
              style={styles.btnPrimary}
              onClick={() => navigate(`/account/orders/${orderId}`)}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#3b5bdb'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#4c6ef5'; }}
              onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
              onBlur={e => { e.currentTarget.style.outline = 'none'; }}
            >
              Back to order detail
            </button>
          </div>
        </div>
      </div>
    );
  }

  const orderNumber = order
    ? (order.order_number || order.orderNumber || order.id || orderId)
    : orderId;

  const allItems = order ? (order.items || order.order_items || []) : [];
  const ineligibleItems = allItems.filter(item => {
    const returned = item.return_requested || item.returnRequested || false;
    return returned;
  });

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Back link */}
        <button
          style={styles.backLink}
          onClick={() => navigate(`/account/orders/${orderId}`)}
          onMouseEnter={e => { e.currentTarget.style.color = '#3b5bdb'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#4c6ef5'; }}
          onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
          onBlur={e => { e.currentTarget.style.outline = 'none'; }}
          aria-label="Back to order detail"
        >
          <img
            src="/src/assets/icons/chevron-left.svg"
            alt=""
            aria-hidden="true"
            style={{ width: '16px', height: '16px' }}
          />
          Back to order history
        </button>

        <h1 style={styles.pageTitle}>Return request</h1>
        <p style={styles.pageSub}>
          Select the items you want to return and provide a reason.
          Order{' '}
          <span style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace", fontSize: '14px' }}>
            #{orderNumber}
          </span>
        </p>

        {submitError && (
          <div style={styles.errorBanner} role="alert">
            <span style={{ fontSize: '18px' }}>⚠️</span>
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Item selection */}
          <div style={styles.card}>
            <p style={styles.sectionLabel}>Select items to return</p>

            {eligibleItems.length === 0 && ineligibleItems.length === 0 && (
              <p style={styles.noItemsMsg}>No items found for this order.</p>
            )}

            {eligibleItems.length === 0 && ineligibleItems.length > 0 && (
              <p style={styles.noItemsMsg}>All items in this order have already been returned or a return has been requested.</p>
            )}

            {eligibleItems.map((item, idx) => {
              const itemId = item.id || item.order_item_id || item.orderItemId;
              const isSelected = selectedItemIds.has(itemId);
              const isLast = idx === eligibleItems.length - 1 && ineligibleItems.length === 0;
              const imageUrl = item.image_url || item.imageUrl || item.product_image || null;
              const itemName = item.product_name || item.productName || item.name || 'Item';
              const sku = item.sku_code || item.skuCode || item.sku || null;
              const qty = item.quantity || item.qty || 1;
              const price = item.unit_price || item.unitPrice || item.price || 0;
              const currency = order?.currency || 'USD';

              return (
                <div key={itemId} style={isLast ? styles.itemRowLast : styles.itemRow}>
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={itemName}
                      style={styles.itemImage}
                      onError={e => { e.currentTarget.src = '/src/assets/images/placeholder-product.svg'; }}
                    />
                  ) : (
                    <img
                      src="/src/assets/images/placeholder-product.svg"
                      alt=""
                      aria-hidden="true"
                      style={styles.itemImage}
                    />
                  )}
                  <div style={styles.itemInfo}>
                    <p style={styles.itemName}>{itemName}</p>
                    {sku && <p style={styles.itemMeta}>SKU: {sku}</p>}
                    <p style={styles.itemMeta}>Qty: {qty}</p>
                    <p style={styles.itemPrice}>{formatCurrency(price, currency)}</p>
                    <div style={styles.checkboxWrapper}>
                      <input
                        type="checkbox"
                        id={`item-${itemId}`}
                        checked={isSelected}
                        onChange={() => toggleItem(itemId)}
                        style={styles.checkbox}
                        aria-describedby={fieldErrors[`reason_${itemId}`] ? `reason-error-${itemId}` : undefined}
                      />
                      <label htmlFor={`item-${itemId}`} style={styles.checkboxLabel}>
                        Include this item in the return
                      </label>
                    </div>

                    {/* Per-item reason (shown if usePerItem and item is selected) */}
                    {usePerItem && isSelected && (
                      <div style={{ marginTop: '12px' }}>
                        <label
                          htmlFor={`reason-${itemId}`}
                          style={{ ...styles.label, fontSize: '12px' }}
                        >
                          Reason for return
                          <span aria-hidden="true" style={{ color: '#f03e3e', marginLeft: '2px' }}>*</span>
                        </label>
                        <select
                          id={`reason-${itemId}`}
                          value={reasons[itemId] || ''}
                          onChange={e => setItemReason(itemId, e.target.value)}
                          style={{
                            ...styles.select,
                            ...(fieldErrors[`reason_${itemId}`] ? { borderColor: '#f03e3e' } : {}),
                          }}
                          aria-invalid={fieldErrors[`reason_${itemId}`] ? 'true' : 'false'}
                          aria-describedby={fieldErrors[`reason_${itemId}`] ? `reason-error-${itemId}` : undefined}
                          onFocus={e => { e.currentTarget.style.borderColor = '#4c6ef5'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(76,110,245,0.15)'; }}
                          onBlur={e => { e.currentTarget.style.borderColor = fieldErrors[`reason_${itemId}`] ? '#f03e3e' : '#868e96'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                          {RETURN_REASONS.map(r => (
                            <option key={r} value={r} disabled={r === ''}>
                              {r === '' ? 'Select a reason…' : r}
                            </option>
                          ))}
                        </select>
                        {fieldErrors[`reason_${itemId}`] && (
                          <span id={`reason-error-${itemId}`} role="alert" style={styles.fieldError}>
                            {fieldErrors[`reason_${itemId}`]}
                          </span>
                        )}
                        <div style={{ marginTop: '8px' }}>
                          <label
                            htmlFor={`comments-${itemId}`}
                            style={{ ...styles.label, fontSize: '12px' }}
                          >
                            Additional comments (optional)
                          </label>
                          <textarea
                            id={`comments-${itemId}`}
                            value={comments[itemId] || ''}
                            onChange={e => setItemComments(itemId, e.target.value)}
                            placeholder="Describe the issue in more detail…"
                            style={{ ...styles.textarea, minHeight: '64px', fontSize: '14px' }}
                            maxLength={1000}
                            onFocus={e => { e.currentTarget.style.borderColor = '#4c6ef5'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(76,110,245,0.15)'; }}
                            onBlur={e => { e.currentTarget.style.borderColor = '#868e96'; e.currentTarget.style.boxShadow = 'none'; }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {ineligibleItems.length > 0 && eligibleItems.length > 0 && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e9ecef' }}>
                <p style={{ ...styles.sectionLabel, marginBottom: '8px' }}>Already returned</p>
                {ineligibleItems.map(item => {
                  const itemId = item.id || item.order_item_id;
                  const itemName = item.product_name || item.productName || item.name || 'Item';
                  return (
                    <p key={itemId} style={{ ...styles.itemMeta, margin: '0 0 4px 0' }}>
                      {itemName}
                      <span style={styles.returnedBadge}>Return requested</span>
                    </p>
                  );
                })}
              </div>
            )}

            {fieldErrors.items && (
              <span role="alert" style={{ ...styles.fieldError, display: 'block', marginTop: '12px' }}>
                {fieldErrors.items}
              </span>
            )}
          </div>

          {/* Return reason */}
          {eligibleItems.length > 0 && (
            <div style={styles.card}>
              <p style={styles.sectionLabel}>Return details</p>

              {/* Toggle per-item reasons */}
              {selectedItemIds.size > 1 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={styles.checkboxWrapper}>
                    <input
                      type="checkbox"
                      id="per-item-toggle"
                      checked={usePerItem}
                      onChange={e => {
                        setUsePerItem(e.target.checked);
                        setFieldErrors({});
                      }}
                      style={styles.checkbox}
                    />
                    <label htmlFor="per-item-toggle" style={styles.checkboxLabel}>
                      Provide a separate reason for each item
                    </label>
                  </div>
                </div>
              )}

              {!usePerItem && (
                <>
                  <div style={styles.formGroup}>
                    <label htmlFor="globalReason" style={styles.label}>
                      Reason for return
                      <span aria-hidden="true" style={{ color: '#f03e3e', marginLeft: '2px' }}>*</span>
                    </label>
                    <select
                      id="globalReason"
                      value={globalReason}
                      onChange={e => {
                        setGlobalReason(e.target.value);
                        if (fieldErrors.globalReason) setFieldErrors(prev => ({ ...prev, globalReason: undefined }));
                      }}
                      style={{
                        ...styles.select,
                        ...(fieldErrors.globalReason ? { borderColor: '#f03e3e' } : {}),
                      }}
                      aria-invalid={fieldErrors.globalReason ? 'true' : 'false'}
                      aria-describedby={fieldErrors.globalReason ? 'globalReason-error' : 'globalReason-hint'}
                      onFocus={e => { e.currentTarget.style.borderColor = '#4c6ef5'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(76,110,245,0.15)'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = fieldErrors.globalReason ? '#f03e3e' : '#868e96'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      {RETURN_REASONS.map(r => (
                        <option key={r} value={r} disabled={r === ''}>
                          {r === '' ? 'Select a reason…' : r}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.globalReason ? (
                      <span id="globalReason-error" role="alert" style={styles.fieldError}>
                        {fieldErrors.globalReason}
                      </span>
                    ) : (
                      <span id="globalReason-hint" style={styles.hint}>
                        This reason will apply to all selected items.
                      </span>
                    )}
                  </div>

                  <div style={styles.formGroup}>
                    <label htmlFor="globalComments" style={styles.label}>
                      Additional comments (optional)
                    </label>
                    <textarea
                      id="globalComments"
                      value={globalComments}
                      onChange={e => setGlobalComments(e.target.value)}
                      placeholder="Describe the issue in more detail, include any relevant photos or order information…"
                      style={styles.textarea}
                      maxLength={1000}
                      aria-describedby="globalComments-hint"
                      onFocus={e => { e.currentTarget.style.borderColor = '#4c6ef5'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(76,110,245,0.15)'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = '#868e96'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                    <span id="globalComments-hint" style={styles.hint}>
                      Maximum 1000 characters.
                    </span>
                  </div>
                </>
              )}

              <div style={styles.btnRow}>
                <button
                  type="submit"
                  disabled={submitting || eligibleItems.length === 0}
                  style={{
                    ...styles.btnPrimary,
                    ...((submitting || eligibleItems.length === 0) ? { backgroundColor: '#adb5bd', cursor: 'not-allowed' } : {}),
                  }}
                  onMouseEnter={e => { if (!submitting && eligibleItems.length > 0) e.currentTarget.style.backgroundColor = '#3b5bdb'; }}
                  onMouseLeave={e => { if (!submitting && eligibleItems.length > 0) e.currentTarget.style.backgroundColor = '#4c6ef5'; }}
                  onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
                  onBlur={e => { e.currentTarget.style.outline = 'none'; }}
                >
                  {submitting ? 'Submitting…' : 'Submit return request'}
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  style={{
                    ...styles.btnGhost,
                    ...(submitting ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
                  }}
                  onClick={() => navigate(`/account/orders/${orderId}`)}
                  onMouseEnter={e => { if (!submitting) e.currentTarget.style.backgroundColor = '#f1f3ff'; }}
                  onMouseLeave={e => { if (!submitting) e.currentTarget.style.backgroundColor = 'transparent'; }}
                  onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
                  onBlur={e => { e.currentTarget.style.outline = 'none'; }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
