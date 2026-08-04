import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
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

export default function AdminOrderList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const statusFilter = searchParams.get('status') || '';
  const searchQuery = searchParams.get('q') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = 20;

  const [localSearch, setLocalSearch] = useState(searchQuery);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('accessToken');
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (searchQuery) params.set('q', searchQuery);
      params.set('page', String(currentPage));
      params.set('limit', String(pageSize));

      const res = await fetch(`/api/admin/orders?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Error ${res.status}`);
      }

      const data = await res.json();
      setOrders(data.orders || data.data || []);
      setTotalCount(data.total || data.totalCount || 0);
      setTotalPages(data.totalPages || Math.ceil((data.total || 0) / pageSize) || 1);
    } catch (err) {
      setError(err.message || 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery, currentPage]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

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

  function handleSearchSubmit(e) {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (localSearch.trim()) {
      next.set('q', localSearch.trim());
    } else {
      next.delete('q');
    }
    next.set('page', '1');
    setSearchParams(next);
  }

  function handleSearchClear() {
    setLocalSearch('');
    const next = new URLSearchParams(searchParams);
    next.delete('q');
    next.set('page', '1');
    setSearchParams(next);
  }

  function handlePageChange(page) {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(page));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleRowClick(orderId) {
    navigate(`/admin/orders/${orderId}`);
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
    header: {
      marginBottom: '24px',
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      lineHeight: '32px',
      letterSpacing: '-0.01em',
      color: '#212529',
      margin: '0 0 4px 0',
    },
    subtitle: {
      fontSize: '14px',
      color: '#495057',
      margin: 0,
    },
    toolbar: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
      alignItems: 'center',
      marginBottom: '20px',
    },
    searchForm: {
      display: 'flex',
      gap: '8px',
      flex: '1 1 280px',
      minWidth: '220px',
      maxWidth: '400px',
    },
    searchInput: {
      flex: 1,
      padding: '10px 12px',
      border: '1px solid #868e96',
      borderRadius: '6px',
      fontSize: '14px',
      color: '#212529',
      backgroundColor: '#ffffff',
      outline: 'none',
      minHeight: '44px',
    },
    searchBtn: {
      padding: '0 16px',
      backgroundColor: '#4c6ef5',
      color: '#ffffff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      minHeight: '44px',
      minWidth: '44px',
    },
    clearBtn: {
      padding: '0 12px',
      backgroundColor: 'transparent',
      color: '#495057',
      border: '1px solid #868e96',
      borderRadius: '6px',
      fontSize: '14px',
      cursor: 'pointer',
      minHeight: '44px',
    },
    filterSelect: {
      padding: '10px 12px',
      border: '1px solid #868e96',
      borderRadius: '6px',
      fontSize: '14px',
      color: '#212529',
      backgroundColor: '#ffffff',
      minHeight: '44px',
      cursor: 'pointer',
    },
    countText: {
      fontSize: '14px',
      color: '#495057',
      marginLeft: 'auto',
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      border: '1px solid #e9ecef',
      overflow: 'hidden',
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
    },
    tr: {
      borderBottom: '1px solid #e9ecef',
      cursor: 'pointer',
      transition: 'background-color 0.15s',
    },
    td: {
      padding: '14px 16px',
      fontSize: '14px',
      color: '#343a40',
      verticalAlign: 'middle',
    },
    orderId: {
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      fontSize: '13px',
      color: '#4c6ef5',
      fontWeight: '500',
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 24px',
    },
    emptyImg: {
      width: '80px',
      height: '80px',
      marginBottom: '16px',
      opacity: 0.5,
    },
    emptyText: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#343a40',
      margin: '0 0 8px 0',
    },
    emptyHint: {
      fontSize: '14px',
      color: '#495057',
      margin: 0,
    },
    errorBanner: {
      backgroundColor: '#ffe3e3',
      border: '1px solid #f03e3e',
      borderRadius: '6px',
      padding: '12px 16px',
      color: '#f03e3e',
      fontSize: '14px',
      marginBottom: '20px',
    },
    pagination: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '20px 16px',
      borderTop: '1px solid #e9ecef',
      flexWrap: 'wrap',
    },
    pageBtn: (active, disabled) => ({
      padding: '8px 14px',
      border: active ? '2px solid #4c6ef5' : '1px solid #868e96',
      borderRadius: '6px',
      backgroundColor: active ? '#4c6ef5' : '#ffffff',
      color: active ? '#ffffff' : disabled ? '#adb5bd' : '#343a40',
      fontSize: '14px',
      fontWeight: active ? '600' : '400',
      cursor: disabled ? 'not-allowed' : 'pointer',
      minHeight: '36px',
      minWidth: '36px',
      pointerEvents: disabled ? 'none' : 'auto',
    }),
    loadingOverlay: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 24px',
      fontSize: '14px',
      color: '#495057',
    },
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    const delta = 2;
    const left = Math.max(1, currentPage - delta);
    const right = Math.min(totalPages, currentPage + delta);

    if (left > 1) {
      pages.push(1);
      if (left > 2) pages.push('...');
    }
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages) {
      if (right < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return (
      <div style={styles.pagination}>
        <button
          style={styles.pageBtn(false, currentPage === 1)}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          ‹
        </button>
        {pages.map((p, idx) =>
          p === '...' ? (
            <span key={`ellipsis-${idx}`} style={{ padding: '0 4px', color: '#868e96' }}>…</span>
          ) : (
            <button
              key={p}
              style={styles.pageBtn(p === currentPage, false)}
              onClick={() => handlePageChange(p)}
              aria-label={`Page ${p}`}
              aria-current={p === currentPage ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}
        <button
          style={styles.pageBtn(false, currentPage === totalPages)}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          ›
        </button>
      </div>
    );
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Orders</h1>
          <p style={styles.subtitle}>Manage and review all customer orders.</p>
        </div>

        {error && (
          <div style={styles.errorBanner} role="alert">
            {error}
          </div>
        )}

        <div style={styles.toolbar}>
          <form style={styles.searchForm} onSubmit={handleSearchSubmit} role="search">
            <input
              type="search"
              style={styles.searchInput}
              placeholder="Search by order ID or customer…"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              aria-label="Search orders"
            />
            {localSearch && (
              <button
                type="button"
                style={styles.clearBtn}
                onClick={handleSearchClear}
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
            <button type="submit" style={styles.searchBtn} aria-label="Submit search">
              Search
            </button>
          </form>

          <select
            style={styles.filterSelect}
            value={statusFilter}
            onChange={handleStatusChange}
            aria-label="Filter by status"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {!loading && totalCount > 0 && (
            <span style={styles.countText}>
              {totalCount} order{totalCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div style={styles.card}>
          {loading ? (
            <div style={styles.loadingOverlay} aria-live="polite" aria-busy="true">
              Loading orders…
            </div>
          ) : orders.length === 0 ? (
            <div style={styles.emptyState}>
              <img
                src="/src/assets/images/empty-state.svg"
                alt=""
                style={styles.emptyImg}
                aria-hidden="true"
              />
              <p style={styles.emptyText}>No orders found</p>
              <p style={styles.emptyHint}>
                {statusFilter || searchQuery
                  ? 'Try adjusting your filters or search query.'
                  : 'Orders will appear here once customers start placing them.'}
              </p>
            </div>
          ) : (
            <>
              <div style={styles.tableWrapper}>
                <table style={styles.table} aria-label="Orders table">
                  <thead style={styles.thead}>
                    <tr>
                      <th style={styles.th} scope="col">Order ID</th>
                      <th style={styles.th} scope="col">Customer</th>
                      <th style={styles.th} scope="col">Date</th>
                      <th style={styles.th} scope="col">Items</th>
                      <th style={styles.th} scope="col">Total</th>
                      <th style={styles.th} scope="col">Status</th>
                      <th style={styles.th} scope="col">Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        style={styles.tr}
                        onClick={() => handleRowClick(order.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleRowClick(order.id);
                          }
                        }}
                        tabIndex={0}
                        role="row"
                        aria-label={`Order ${order.id}`}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '';
                        }}
                      >
                        <td style={styles.td}>
                          <span style={styles.orderId}>
                            #{String(order.id).slice(0, 8).toUpperCase()}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <div style={{ fontWeight: '500', color: '#212529' }}>
                            {order.customerName ||
                              (order.user
                                ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim()
                                : '—')}
                          </div>
                          {(order.customerEmail || order.user?.email) && (
                            <div style={{ fontSize: '12px', color: '#495057', marginTop: '2px' }}>
                              {order.customerEmail || order.user?.email}
                            </div>
                          )}
                        </td>
                        <td style={styles.td}>
                          <span style={{ whiteSpace: 'nowrap' }}>
                            {formatDate(order.createdAt || order.created_at)}
                          </span>
                        </td>
                        <td style={styles.td}>
                          {order.itemCount ?? order.items?.length ?? '—'}
                        </td>
                        <td style={styles.td}>
                          <span style={{ fontWeight: '500' }}>
                            {formatCurrency(order.totalAmount || order.total_amount)}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <StatusBadge status={order.status} />
                        </td>
                        <td style={styles.td}>
                          {order.paymentStatus || order.payment_status ? (
                            <span
                              style={{
                                fontSize: '12px',
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
                              {(order.paymentStatus || order.payment_status).replace(/_/g, ' ')}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {renderPagination()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
