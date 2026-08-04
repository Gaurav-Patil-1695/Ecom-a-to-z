import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'completed', label: 'Completed' },
];

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

export default function AdminReturnList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });

  const statusFilter = searchParams.get('status') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const fetchReturns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      params.set('page', String(pageParam));
      params.set('limit', '20');

      const token = localStorage.getItem('token');
      const res = await fetch(`/return-requests?${params.toString()}`, {
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
      setReturns(data.data || data.returnRequests || []);
      setPagination({
        page: data.pagination?.page || pageParam,
        limit: data.pagination?.limit || 20,
        total: data.pagination?.total || 0,
        totalPages: data.pagination?.totalPages || 1,
      });
    } catch (err) {
      setError(err.message || 'Failed to load return requests.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, pageParam]);

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns]);

  function handleStatusChange(e) {
    const next = new URLSearchParams(searchParams);
    if (e.target.value) {
      next.set('status', e.target.value);
    } else {
      next.delete('status');
    }
    next.set('page', '1');
    setSearchParams(next);
  }

  function handlePageChange(newPage) {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(newPage));
    setSearchParams(next);
  }

  function handleRowClick(id) {
    navigate(`/admin/returns/${id}`);
  }

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
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px',
      flexWrap: 'wrap',
      gap: '16px',
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      letterSpacing: '-0.01em',
      lineHeight: '32px',
      margin: 0,
      color: '#212529',
    },
    filterRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flexWrap: 'wrap',
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#495057',
    },
    select: {
      fontSize: '14px',
      color: '#212529',
      background: '#ffffff',
      border: '1px solid #868e96',
      borderRadius: '6px',
      padding: '8px 12px',
      minHeight: '44px',
      cursor: 'pointer',
      outline: 'none',
    },
    card: {
      background: '#ffffff',
      borderRadius: '10px',
      boxShadow: '0 1px 4px rgba(33,37,41,0.08)',
      overflow: 'hidden',
    },
    tableWrapper: {
      overflowX: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '14px',
    },
    th: {
      textAlign: 'left',
      padding: '12px 16px',
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
      padding: '14px 16px',
      borderBottom: '1px solid #e9ecef',
      verticalAlign: 'middle',
      color: '#343a40',
    },
    trHover: {
      cursor: 'pointer',
    },
    mono: {
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      fontSize: '13px',
      color: '#212529',
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      color: '#495057',
      gap: '12px',
    },
    emptyImg: {
      width: '80px',
      height: '80px',
      opacity: 0.5,
    },
    emptyText: {
      fontSize: '16px',
      fontWeight: '600',
      margin: 0,
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
    pagination: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px',
      borderTop: '1px solid #e9ecef',
      flexWrap: 'wrap',
      gap: '12px',
    },
    paginationInfo: {
      fontSize: '14px',
      color: '#495057',
    },
    paginationControls: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    pageBtn: (active, disabled) => ({
      minWidth: '44px',
      minHeight: '44px',
      padding: '0 12px',
      borderRadius: '6px',
      border: '1px solid',
      borderColor: active ? '#4c6ef5' : '#868e96',
      background: active ? '#4c6ef5' : disabled ? '#e9ecef' : '#ffffff',
      color: active ? '#ffffff' : disabled ? '#adb5bd' : '#212529',
      fontSize: '14px',
      fontWeight: active ? '600' : '400',
      cursor: disabled ? 'not-allowed' : 'pointer',
      lineHeight: '1',
    }),
  };

  const startItem = returns.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const endItem = Math.min(pagination.page * pagination.limit, pagination.total);

  const pageNumbers = [];
  for (let i = 1; i <= pagination.totalPages; i++) {
    if (
      i === 1 ||
      i === pagination.totalPages ||
      (i >= pagination.page - 1 && i <= pagination.page + 1)
    ) {
      pageNumbers.push(i);
    } else if (
      pageNumbers[pageNumbers.length - 1] !== '...'
    ) {
      pageNumbers.push('...');
    }
  }

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .return-row:hover {
          background: #f8f9fa !important;
        }
        .return-row:focus {
          outline: 2px solid #4c6ef5;
          outline-offset: -2px;
        }
        .page-btn:focus {
          outline: 2px solid #4c6ef5;
          outline-offset: 2px;
        }
        .filter-select:focus {
          outline: 2px solid #4c6ef5;
          outline-offset: 2px;
          border-color: #4c6ef5;
        }
        .retry-btn:hover {
          background: #f03e3e;
          color: #fff;
        }
        .retry-btn:focus {
          outline: 2px solid #f03e3e;
          outline-offset: 2px;
        }
      `}</style>
      <div style={styles.inner}>
        <div style={styles.header}>
          <h1 style={styles.title}>Return Requests</h1>
          <div style={styles.filterRow}>
            <label htmlFor="status-filter" style={styles.label}>
              Filter by status:
            </label>
            <select
              id="status-filter"
              className="filter-select"
              style={styles.select}
              value={statusFilter}
              onChange={handleStatusChange}
              aria-label="Filter return requests by status"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div style={styles.errorBox} role="alert">
            <span>{error}</span>
            <button
              className="retry-btn"
              onClick={fetchReturns}
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
        )}

        <div style={styles.card}>
          {loading ? (
            <Spinner />
          ) : returns.length === 0 && !error ? (
            <div style={styles.emptyState}>
              <img
                src="/src/assets/images/empty-state.svg"
                alt="No return requests"
                style={styles.emptyImg}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <p style={styles.emptyText}>No return requests found</p>
              <p style={{ fontSize: '14px', color: '#495057', margin: 0 }}>
                {statusFilter
                  ? `There are no return requests with status "${statusFilter}".`
                  : 'Return requests will appear here once customers submit them.'}
              </p>
            </div>
          ) : (
            <>
              <div style={styles.tableWrapper}>
                <table style={styles.table} aria-label="Return requests">
                  <thead>
                    <tr>
                      <th style={styles.th}>Request ID</th>
                      <th style={styles.th}>Order ID</th>
                      <th style={styles.th}>Customer</th>
                      <th style={styles.th}>Reason</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Submitted</th>
                      <th style={styles.th}>Refund Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {returns.map((r) => (
                      <tr
                        key={r.id}
                        className="return-row"
                        style={{ ...styles.trHover, background: '#ffffff' }}
                        onClick={() => handleRowClick(r.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleRowClick(r.id);
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label={`View return request ${r.id}`}
                      >
                        <td style={styles.td}>
                          <span style={styles.mono}>#{r.id}</span>
                        </td>
                        <td style={styles.td}>
                          <span style={styles.mono}>#{r.orderId || r.order_id || '—'}</span>
                        </td>
                        <td style={styles.td}>
                          {r.customerName ||
                            (r.user ? `${r.user.firstName || ''} ${r.user.lastName || ''}`.trim() : '—')}
                        </td>
                        <td
                          style={{
                            ...styles.td,
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={r.reason || ''}
                        >
                          {r.reason || '—'}
                        </td>
                        <td style={styles.td}>
                          <StatusBadge status={r.status || 'pending'} />
                        </td>
                        <td style={{ ...styles.td, whiteSpace: 'nowrap' }}>
                          {r.createdAt || r.created_at
                            ? new Date(r.createdAt || r.created_at).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })
                            : '—'}
                        </td>
                        <td style={{ ...styles.td, whiteSpace: 'nowrap' }}>
                          {r.refundAmount != null || r.refund_amount != null
                            ? `₹${Number(r.refundAmount ?? r.refund_amount).toLocaleString('en-IN', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}`
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pagination.totalPages > 1 && (
                <div style={styles.pagination}>
                  <span style={styles.paginationInfo}>
                    {pagination.total > 0
                      ? `Showing ${startItem}–${endItem} of ${pagination.total} requests`
                      : 'No requests'}
                  </span>
                  <nav
                    style={styles.paginationControls}
                    aria-label="Return requests pagination"
                  >
                    <button
                      className="page-btn"
                      style={styles.pageBtn(false, pagination.page === 1)}
                      disabled={pagination.page === 1}
                      onClick={() => handlePageChange(pagination.page - 1)}
                      aria-label="Previous page"
                    >
                      ‹
                    </button>
                    {pageNumbers.map((p, idx) =>
                      p === '...' ? (
                        <span
                          key={`ellipsis-${idx}`}
                          style={{ padding: '0 4px', color: '#495057', fontSize: '14px' }}
                          aria-hidden="true"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={p}
                          className="page-btn"
                          style={styles.pageBtn(p === pagination.page, false)}
                          onClick={() => handlePageChange(p)}
                          aria-label={`Page ${p}`}
                          aria-current={p === pagination.page ? 'page' : undefined}
                        >
                          {p}
                        </button>
                      )
                    )}
                    <button
                      className="page-btn"
                      style={styles.pageBtn(false, pagination.page === pagination.totalPages)}
                      disabled={pagination.page === pagination.totalPages}
                      onClick={() => handlePageChange(pagination.page + 1)}
                      aria-label="Next page"
                    >
                      ›
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
