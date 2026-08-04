import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const STATUS_STYLES = {
  pending: { background: '#fff4e6', color: '#fd7e14' },
  approved: { background: '#d3f9d8', color: '#37b24d' },
  rejected: { background: '#ffe3e3', color: '#f03e3e' },
  completed: { background: '#e8ecfd', color: '#4c6ef5' },
};

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || { background: '#e9ecef', color: '#495057' };
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '600',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        lineHeight: '16px',
        background: style.background,
        color: style.color,
      }}
    >
      {status}
    </span>
  );
}

function Spinner() {
  return (
    <div
      role="status"
      aria-label="Loading"
      style={{
        width: '36px',
        height: '36px',
        border: '4px solid #e8ecfd',
        borderTop: '4px solid #4c6ef5',
        borderRadius: '50%',
        animation: 'spin 0.75s linear infinite',
        margin: '48px auto',
      }}
    />
  );
}

function DetailRow({ label, value, mono }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}
    >
      <span
        style={{
          fontSize: '12px',
          fontWeight: '600',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: '#495057',
          lineHeight: '16px',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: '14px',
          color: '#212529',
          lineHeight: '20px',
          fontFamily: mono
            ? "'JetBrains Mono', 'Fira Code', 'Courier New', monospace"
            : "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        {value || '—'}
      </span>
    </div>
  );
}

export default function AdminReturnDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [returnRequest, setReturnRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reviewAction, setReviewAction] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const fetchReturnRequest = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/return-requests/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Request failed: ${res.status}`);
      }
      const data = await res.json();
      const rr = data.returnRequest || data.data || data;
      setReturnRequest(rr);
      if (rr.refundAmount != null || rr.refund_amount != null) {
        setRefundAmount(String(rr.refundAmount ?? rr.refund_amount));
      }
    } catch (err) {
      setError(err.message || 'Failed to load return request.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchReturnRequest();
  }, [fetchReturnRequest]);

  function validate() {
    const errors = {};
    if (!reviewAction) {
      errors.reviewAction = 'Please select an action (approve or reject).';
    }
    if (reviewAction === 'approved') {
      if (refundAmount === '' || refundAmount === null || refundAmount === undefined) {
        errors.refundAmount = 'Refund amount is required when approving.';
      } else if (isNaN(Number(refundAmount)) || Number(refundAmount) < 0) {
        errors.refundAmount = 'Refund amount must be a non-negative number.';
      }
    }
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const body = {
        action: reviewAction,
        adminNotes: adminNotes.trim() || undefined,
        ...(reviewAction === 'approved'
          ? { refundAmount: Number(refundAmount) }
          : {}),
      };
      const res = await fetch(`/return-requests/${id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Request failed: ${res.status}`);
      }
      const data = await res.json();
      const updated = data.returnRequest || data.data || data;
      setReturnRequest((prev) => ({ ...prev, ...updated }));
      setSubmitSuccess(
        reviewAction === 'approved'
          ? 'Return request approved successfully.'
          : 'Return request rejected successfully.'
      );
      setReviewAction('');
      setAdminNotes('');
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  }

  const isPending =
    returnRequest &&
    (returnRequest.status === 'pending' ||
      returnRequest.status === 'PENDING');

  const styles = {
    page: {
      minHeight: '100vh',
      background: '#f8f9fa',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      color: '#212529',
    },
    inner: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 24px',
    },
    backBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#4c6ef5',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '0',
      marginBottom: '20px',
      textDecoration: 'none',
      lineHeight: '20px',
    },
    header: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: '24px',
      flexWrap: 'wrap',
      gap: '16px',
    },
    titleGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      letterSpacing: '-0.01em',
      lineHeight: '32px',
      margin: 0,
      color: '#212529',
    },
    subtitle: {
      fontSize: '14px',
      color: '#495057',
      margin: 0,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '24px',
      marginBottom: '24px',
    },
    card: {
      background: '#ffffff',
      borderRadius: '10px',
      boxShadow: '0 1px 4px rgba(33,37,41,0.08)',
      padding: '24px',
    },
    cardTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#212529',
      margin: '0 0 20px 0',
      lineHeight: '24px',
      paddingBottom: '12px',
      borderBottom: '1px solid #e9ecef',
    },
    detailGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
    },
    detailGridFull: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '20px',
    },
    errorBox: {
      background: '#ffe3e3',
      color: '#f03e3e',
      borderRadius: '6px',
      padding: '12px 16px',
      fontSize: '14px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
    },
    successBox: {
      background: '#d3f9d8',
      color: '#37b24d',
      borderRadius: '6px',
      padding: '12px 16px',
      fontSize: '14px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      marginBottom: '16px',
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#495057',
      lineHeight: '20px',
    },
    select: {
      fontSize: '14px',
      color: '#212529',
      background: '#ffffff',
      border: '1px solid #868e96',
      borderRadius: '6px',
      padding: '10px 12px',
      minHeight: '44px',
      cursor: 'pointer',
      outline: 'none',
      width: '100%',
    },
    textarea: {
      fontSize: '14px',
      color: '#212529',
      background: '#ffffff',
      border: '1px solid #868e96',
      borderRadius: '6px',
      padding: '10px 12px',
      outline: 'none',
      width: '100%',
      resize: 'vertical',
      minHeight: '100px',
      lineHeight: '1.5',
      boxSizing: 'border-box',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    },
    input: {
      fontSize: '14px',
      color: '#212529',
      background: '#ffffff',
      border: '1px solid #868e96',
      borderRadius: '6px',
      padding: '10px 12px',
      minHeight: '44px',
      outline: 'none',
      width: '100%',
      boxSizing: 'border-box',
    },
    fieldError: {
      fontSize: '12px',
      color: '#f03e3e',
      lineHeight: '16px',
    },
    btnRow: {
      display: 'flex',
      gap: '12px',
      marginTop: '20px',
      flexWrap: 'wrap',
    },
    approveBtn: (disabled) => ({
      minHeight: '44px',
      padding: '0 24px',
      borderRadius: '6px',
      border: 'none',
      background: disabled ? '#e9ecef' : '#37b24d',
      color: disabled ? '#adb5bd' : '#ffffff',
      fontSize: '14px',
      fontWeight: '600',
      cursor: disabled ? 'not-allowed' : 'pointer',
      lineHeight: '1',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
    }),
    rejectBtn: (disabled) => ({
      minHeight: '44px',
      padding: '0 24px',
      borderRadius: '6px',
      border: '1px solid #f03e3e',
      background: disabled ? '#e9ecef' : '#ffffff',
      color: disabled ? '#adb5bd' : '#f03e3e',
      fontSize: '14px',
      fontWeight: '600',
      cursor: disabled ? 'not-allowed' : 'pointer',
      lineHeight: '1',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
    }),
    submitBtn: (disabled) => ({
      minHeight: '44px',
      padding: '0 28px',
      borderRadius: '6px',
      border: 'none',
      background: disabled ? '#e9ecef' : '#4c6ef5',
      color: disabled ? '#adb5bd' : '#ffffff',
      fontSize: '14px',
      fontWeight: '600',
      cursor: disabled ? 'not-allowed' : 'pointer',
      lineHeight: '1',
    }),
    itemsTable: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '14px',
    },
    th: {
      textAlign: 'left',
      padding: '10px 12px',
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: '#495057',
      background: '#f8f9fa',
      borderBottom: '1px solid #868e96',
      whiteSpace: 'nowrap',
    },
    td: {
      padding: '12px 12px',
      borderBottom: '1px solid #e9ecef',
      verticalAlign: 'middle',
      color: '#343a40',
    },
    mono: {
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      fontSize: '13px',
      color: '#212529',
    },
    reasonBox: {
      background: '#f8f9fa',
      borderRadius: '6px',
      padding: '12px 16px',
      fontSize: '14px',
      color: '#343a40',
      lineHeight: '1.5',
      border: '1px solid #e9ecef',
    },
    notApplicable: {
      background: '#e8ecfd',
      color: '#4c6ef5',
      borderRadius: '6px',
      padding: '12px 16px',
      fontSize: '14px',
      fontWeight: '500',
    },
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div style={styles.inner}>
          <Spinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.inner}>
          <button
            style={styles.backBtn}
            onClick={() => navigate('/admin/returns')}
            className="back-btn"
          >
            ← Back to Return Requests
          </button>
          <div style={styles.errorBox} role="alert">
            <span>{error}</span>
            <button
              onClick={fetchReturnRequest}
              style={{
                border: '1px solid #f03e3e',
                borderRadius: '6px',
                background: 'transparent',
                color: '#f03e3e',
                padding: '6px 14px',
                fontSize: '13px',
                cursor: 'pointer',
                fontWeight: '600',
                minHeight: '44px',
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!returnRequest) return null;

  const rr = returnRequest;
  const customerName =
    rr.customerName ||
    (rr.user
      ? `${rr.user.firstName || rr.user.first_name || ''} ${rr.user.lastName || rr.user.last_name || ''}`.trim()
      : '—');
  const customerEmail =
    rr.customerEmail || rr.user?.email || '—';
  const orderId = rr.orderId || rr.order_id || '—';
  const createdAt = rr.createdAt || rr.created_at;
  const updatedAt = rr.updatedAt || rr.updated_at;
  const items = rr.items || rr.returnItems || rr.return_items || [];
  const evidenceImages = rr.evidenceImages || rr.evidence_images || rr.images || [];

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .back-btn:hover {
          color: #3b5bdb;
          text-decoration: underline;
        }
        .back-btn:focus {
          outline: 2px solid #4c6ef5;
          outline-offset: 2px;
          border-radius: 3px;
        }
        .action-btn:focus {
          outline: 2px solid #4c6ef5;
          outline-offset: 2px;
        }
        .review-select:focus {
          outline: 2px solid #4c6ef5;
          outline-offset: 2px;
          border-color: #4c6ef5;
        }
        .review-textarea:focus {
          outline: 2px solid #4c6ef5;
          outline-offset: 2px;
          border-color: #4c6ef5;
        }
        .review-input:focus {
          outline: 2px solid #4c6ef5;
          outline-offset: 2px;
          border-color: #4c6ef5;
        }
        .submit-btn:hover:not(:disabled) {
          background: #3b5bdb;
        }
        .submit-btn:focus {
          outline: 2px solid #4c6ef5;
          outline-offset: 2px;
        }
        .evidence-img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid #e9ecef;
          cursor: pointer;
        }
        .evidence-img:hover {
          border-color: #4c6ef5;
        }
        @media (max-width: 768px) {
          .detail-grid {
            grid-template-columns: 1fr !important;
          }
          .main-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <div style={styles.inner}>
        <button
          style={styles.backBtn}
          onClick={() => navigate('/admin/returns')}
          className="back-btn"
          aria-label="Back to return requests list"
        >
          ← Back to Return Requests
        </button>

        <div style={styles.header}>
          <div style={styles.titleGroup}>
            <h1 style={styles.title}>Return Request Detail</h1>
            <p style={styles.subtitle}>#{rr.id}</p>
          </div>
          <StatusBadge status={rr.status || 'pending'} />
        </div>

        {submitSuccess && (
          <div style={styles.successBox} role="status">
            <span>✓</span>
            <span>{submitSuccess}</span>
          </div>
        )}

        {submitError && (
          <div style={styles.errorBox} role="alert">
            <span>{submitError}</span>
            <button
              onClick={() => setSubmitError(null)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#f03e3e',
                fontSize: '18px',
                lineHeight: '1',
                padding: '0 4px',
                minHeight: '44px',
                minWidth: '44px',
              }}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        <div
          className="main-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginBottom: '24px',
          }}
        >
          {/* Request Information */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Request Information</h2>
            <div
              className="detail-grid"
              style={styles.detailGrid}
            >
              <DetailRow label="Request ID" value={`#${rr.id}`} mono />
              <DetailRow label="Order ID" value={`#${orderId}`} mono />
              <DetailRow label="Status" value={null} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: '#495057',
                    lineHeight: '16px',
                  }}
                >
                  Status
                </span>
                <StatusBadge status={rr.status || 'pending'} />
              </div>
              <DetailRow
                label="Submitted"
                value={
                  createdAt
                    ? new Date(createdAt).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '—'
                }
              />
              <DetailRow
                label="Last Updated"
                value={
                  updatedAt
                    ? new Date(updatedAt).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '—'
                }
              />
              <DetailRow
                label="Refund Amount"
                value={
                  rr.refundAmount != null || rr.refund_amount != null
                    ? `₹${Number(rr.refundAmount ?? rr.refund_amount).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : '—'
                }
              />
              <DetailRow label="Return Type" value={rr.returnType || rr.return_type || '—'} />
            </div>
          </div>

          {/* Customer Information */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Customer Information</h2>
            <div
              className="detail-grid"
              style={styles.detailGrid}
            >
              <DetailRow label="Customer Name" value={customerName} />
              <DetailRow label="Email" value={customerEmail} />
              <DetailRow
                label="Customer ID"
                value={rr.userId || rr.user_id || rr.user?.id ? `#${rr.userId || rr.user_id || rr.user?.id}` : '—'}
                mono
              />
              <DetailRow
                label="Phone"
                value={rr.customerPhone || rr.user?.phone || rr.user?.phoneNumber || '—'}
              />
            </div>
          </div>
        </div>

        {/* Reason */}
        <div style={{ ...styles.card, marginBottom: '24px' }}>
          <h2 style={styles.cardTitle}>Return Reason</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#495057',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                Reason
              </span>
              <div style={styles.reasonBox}>{rr.reason || '—'}</div>
            </div>
            {(rr.description || rr.additionalComments || rr.additional_comments) && (
              <div>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: '#495057',
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  Additional Details
                </span>
                <div style={styles.reasonBox}>
                  {rr.description || rr.additionalComments || rr.additional_comments}
                </div>
              </div>
            )}
            {rr.adminNotes || rr.admin_notes ? (
              <div>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: '#495057',
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  Admin Notes
                </span>
                <div
                  style={{
                    ...styles.reasonBox,
                    background: '#e8ecfd',
                    borderColor: '#c5d0fa',
                  }}
                >
                  {rr.adminNotes || rr.admin_notes}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Evidence Images */}
        {evidenceImages.length > 0 && (
          <div style={{ ...styles.card, marginBottom: '24px' }}>
            <h2 style={styles.cardTitle}>Evidence Images</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {evidenceImages.map((img, idx) => (
                <a
                  key={idx}
                  href={typeof img === 'string' ? img : img.url || img.imageUrl || img.image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Evidence image ${idx + 1}`}
                >
                  <img
                    className="evidence-img"
                    src={typeof img === 'string' ? img : img.url || img.imageUrl || img.image_url}
                    alt={`Evidence ${idx + 1}`}
                    onError={(e) => {
                      e.currentTarget.src = '/src/assets/images/placeholder-product.svg';
                    }}
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Return Items */}
        {items.length > 0 && (
          <div style={{ ...styles.card, marginBottom: '24px' }}>
            <h2 style={styles.cardTitle}>Return Items</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.itemsTable} aria-label="Return items">
                <thead>
                  <tr>
                    <th style={styles.th}>SKU / Product</th>
                    <th style={styles.th}>Quantity</th>
                    <th style={styles.th}>Unit Price</th>
                    <th style={styles.th}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => {
                    const sku = item.sku || item.skuCode || item.sku_code || item.productSku || '—';
                    const name =
                      item.productName ||
                      item.product_name ||
                      item.name ||
                      item.sku?.productName ||
                      '—';
                    const qty = item.quantity || item.qty || 1;
                    const unitPrice =
                      item.unitPrice != null
                        ? item.unitPrice
                        : item.unit_price != null
                        ? item.unit_price
                        : item.price != null
                        ? item.price
                        : null;
                    const total =
                      item.total != null
                        ? item.total
                        : unitPrice != null
                        ? unitPrice * qty
                        : null;
                    return (
                      <tr key={item.id || idx}>
                        <td style={styles.td}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{ fontSize: '14px', color: '#212529', fontWeight: '500' }}>
                              {name}
                            </span>
                            <span style={styles.mono}>{sku}</span>
                          </div>
                        </td>
                        <td style={styles.td}>{qty}</td>
                        <td style={styles.td}>
                          {unitPrice != null
                            ? `₹${Number(unitPrice).toLocaleString('en-IN', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}`
                            : '—'}
                        </td>
                        <td style={styles.td}>
                          {total != null
                            ? `₹${Number(total).toLocaleString('en-IN', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}`
                            : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Review Actions */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Review Action</h2>
          {!isPending ? (
            <div style={styles.notApplicable}>
              This return request has already been reviewed and its status is{' '}
              <strong>{rr.status}</strong>. No further action is needed.
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div style={styles.formGroup}>
                <label
                  htmlFor="review-action"
                  style={styles.label}
                >
                  Action <span aria-hidden="true" style={{ color: '#f03e3e' }}>*</span>
                </label>
                <select
                  id="review-action"
                  className="review-select"
                  style={{
                    ...styles.select,
                    borderColor: fieldErrors.reviewAction ? '#f03e3e' : '#868e96',
                  }}
                  value={reviewAction}
                  onChange={(e) => {
                    setReviewAction(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, reviewAction: undefined }));
                  }}
                  aria-required="true"
                  aria-invalid={!!fieldErrors.reviewAction}
                  aria-describedby={fieldErrors.reviewAction ? 'review-action-error' : undefined}
                  disabled={submitting}
                >
                  <option value="">Select action…</option>
                  <option value="approved">Approve</option>
                  <option value="rejected">Reject</option>
                </select>
                {fieldErrors.reviewAction && (
                  <span id="review-action-error" style={styles.fieldError} role="alert">
                    {fieldErrors.reviewAction}
                  </span>
                )}
              </div>

              {reviewAction === 'approved' && (
                <div style={styles.formGroup}>
                  <label htmlFor="refund-amount" style={styles.label}>
                    Refund Amount (₹){' '}
                    <span aria-hidden="true" style={{ color: '#f03e3e' }}>*</span>
                  </label>
                  <input
                    id="refund-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    className="review-input"
                    style={{
                      ...styles.input,
                      borderColor: fieldErrors.refundAmount ? '#f03e3e' : '#868e96',
                    }}
                    value={refundAmount}
                    onChange={(e) => {
                      setRefundAmount(e.target.value);
                      setFieldErrors((prev) => ({ ...prev, refundAmount: undefined }));
                    }}
                    placeholder="Enter refund amount"
                    aria-required="true"
                    aria-invalid={!!fieldErrors.refundAmount}
                    aria-describedby={
                      fieldErrors.refundAmount ? 'refund-amount-error' : undefined
                    }
                    disabled={submitting}
                  />
                  {fieldErrors.refundAmount && (
                    <span id="refund-amount-error" style={styles.fieldError} role="alert">
                      {fieldErrors.refundAmount}
                    </span>
                  )}
                </div>
              )}

              <div style={styles.formGroup}>
                <label htmlFor="admin-notes" style={styles.label}>
                  Admin Notes
                </label>
                <textarea
                  id="admin-notes"
                  className="review-textarea"
                  style={styles.textarea}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Optional notes for internal record…"
                  disabled={submitting}
                  rows={4}
                />
              </div>

              <div style={styles.btnRow}>
                <button
                  type="submit"
                  className="submit-btn action-btn"
                  style={styles.submitBtn(submitting || !reviewAction)}
                  disabled={submitting || !reviewAction}
                  aria-label={
                    reviewAction === 'approved'
                      ? 'Approve return request'
                      : reviewAction === 'rejected'
                      ? 'Reject return request'
                      : 'Submit review'
                  }
                >
                  {submitting
                    ? 'Submitting…'
                    : reviewAction === 'approved'
                    ? 'Approve Request'
                    : reviewAction === 'rejected'
                    ? 'Reject Request'
                    : 'Submit Review'}
                </button>
                <button
                  type="button"
                  className="action-btn"
                  style={{
                    minHeight: '44px',
                    padding: '0 20px',
                    borderRadius: '6px',
                    border: '1px solid #868e96',
                    background: '#ffffff',
                    color: '#495057',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    lineHeight: '1',
                    opacity: submitting ? 0.6 : 1,
                  }}
                  disabled={submitting}
                  onClick={() => {
                    setReviewAction('');
                    setAdminNotes('');
                    setRefundAmount(
                      rr.refundAmount != null || rr.refund_amount != null
                        ? String(rr.refundAmount ?? rr.refund_amount)
                        : ''
                    );
                    setFieldErrors({});
                    setSubmitError(null);
                    setSubmitSuccess(null);
                  }}
                >
                  Reset
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
