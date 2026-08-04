import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE = '/api';

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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '32px',
    letterSpacing: '-0.01em',
    color: '#212529',
    margin: 0,
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    minHeight: '44px',
    lineHeight: '20px',
  },
  btnSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#ffffff',
    color: '#212529',
    border: '1px solid #868e96',
    borderRadius: '10px',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    textDecoration: 'none',
    minHeight: '44px',
  },
  btnDanger: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#ffffff',
    color: '#f03e3e',
    border: '1px solid #f03e3e',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    textDecoration: 'none',
    minHeight: '36px',
  },
  filterRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  searchWrapper: {
    position: 'relative',
    flex: '1',
    minWidth: '200px',
    maxWidth: '360px',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '16px',
    height: '16px',
    opacity: 0.5,
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    paddingLeft: '36px',
    paddingRight: '12px',
    paddingTop: '10px',
    paddingBottom: '10px',
    fontSize: '14px',
    border: '1px solid #868e96',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    color: '#212529',
    outline: 'none',
    minHeight: '44px',
    boxSizing: 'border-box',
  },
  select: {
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #868e96',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    color: '#212529',
    minHeight: '44px',
    cursor: 'pointer',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #e9ecef',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#212529',
    borderBottom: '1px solid #e9ecef',
    verticalAlign: 'middle',
  },
  trHover: {
    backgroundColor: '#f8f9fa',
  },
  productThumb: {
    width: '48px',
    height: '48px',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid #e9ecef',
    flexShrink: 0,
  },
  productCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  productName: {
    fontWeight: '500',
    color: '#212529',
    fontSize: '14px',
    lineHeight: '20px',
  },
  productSlug: {
    fontSize: '12px',
    color: '#495057',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    marginTop: '2px',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '9999px',
    padding: '2px 10px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  badgeActive: {
    backgroundColor: '#d3f9d8',
    color: '#2f9e44',
  },
  badgeInactive: {
    backgroundColor: '#e9ecef',
    color: '#495057',
  },
  actionsCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  actionLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#4c6ef5',
    textDecoration: 'none',
    padding: '6px 10px',
    borderRadius: '6px',
    border: '1px solid transparent',
    minHeight: '36px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '64px 24px',
    color: '#495057',
  },
  emptyImg: {
    width: '80px',
    height: '80px',
    opacity: 0.5,
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: '14px',
    color: '#495057',
    marginBottom: '20px',
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    color: '#c92a2a',
    border: '1px solid #ffa8a8',
    borderRadius: '10px',
    padding: '14px 20px',
    marginBottom: '20px',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
  successToast: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    backgroundColor: '#37b24d',
    color: '#ffffff',
    borderRadius: '10px',
    padding: '14px 20px',
    fontSize: '14px',
    fontWeight: '500',
    zIndex: 9999,
    boxShadow: '0 4px 16px rgba(0,0,0,0.16)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  paginationRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 20px',
    borderTop: '1px solid #e9ecef',
    flexWrap: 'wrap',
    gap: '12px',
  },
  paginationInfo: {
    fontSize: '14px',
    color: '#495057',
  },
  paginationBtns: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  paginationBtn: {
    padding: '6px 14px',
    fontSize: '13px',
    fontWeight: '500',
    border: '1px solid #868e96',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    color: '#212529',
    cursor: 'pointer',
    minHeight: '36px',
  },
  paginationBtnDisabled: {
    opacity: 0.45,
    cursor: 'not-allowed',
  },
  skeletonRow: {
    backgroundColor: '#f8f9fa',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  skeletonCell: {
    height: '16px',
    backgroundColor: '#e9ecef',
    borderRadius: '4px',
    display: 'inline-block',
  },
  confirmOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(33,37,41,0.48)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  confirmModal: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '420px',
    width: '90%',
    boxShadow: '0 8px 32px rgba(0,0,0,0.16)',
  },
  confirmTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '12px',
    marginTop: 0,
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
  btnConfirmDelete: {
    backgroundColor: '#f03e3e',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
  },
  retryLink: {
    color: '#4c6ef5',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: '14px',
    fontWeight: '500',
    padding: 0,
  },
};

const PAGE_SIZE = 20;

function SkeletonRow() {
  return (
    <tr>
      {[120, 80, 70, 60, 60, 80].map((w, i) => (
        <td key={i} style={styles.td}>
          <span style={{ ...styles.skeletonCell, width: w }} />
        </td>
      ))}
    </tr>
  );
}

export default function AdminProductList() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const [toast, setToast] = useState(null);

  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('created') === '1' || params.get('updated') === '1') {
      const msg = params.get('updated') === '1' ? 'Product updated successfully.' : 'Product created successfully.';
      setToast(msg);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(PAGE_SIZE));
      if (debouncedSearch) params.set('q', debouncedSearch);
      if (filterStatus) params.set('status', filterStatus);

      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/products?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      setProducts(Array.isArray(data.products) ? data.products : Array.isArray(data.data) ? data.data : []);
      setTotal(data.total ?? data.count ?? 0);
    } catch (err) {
      setError('Could not load products — please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, filterStatus]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/products/${deleteTarget.productId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      setDeleteTarget(null);
      setToast('Product deleted successfully.');
      fetchProducts();
    } catch (err) {
      setDeleteError('Could not delete product. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatPrice = (value) => {
    if (value == null) return '—';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Products</h1>
          <Link to="/admin/catalogue/products/new" style={styles.btnPrimary}>
            <img src="/src/assets/icons/plus.svg" alt="" style={{ width: 16, height: 16 }} />
            New Product
          </Link>
        </div>

        {/* Filters */}
        <div style={styles.filterRow}>
          <div style={styles.searchWrapper}>
            <img src="/src/assets/icons/search.svg" alt="" style={styles.searchIcon} />
            <input
              type="search"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
              aria-label="Search products"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            style={styles.select}
            aria-label="Filter by status"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Error banner */}
        {error && (
          <div style={styles.errorBanner} role="alert">
            <span>{error}</span>
            <button style={styles.retryLink} onClick={fetchProducts}>Retry</button>
          </div>
        )}

        {/* Table */}
        <div style={styles.card}>
          <table style={styles.table} aria-label="Products">
            <thead>
              <tr>
                <th style={styles.th}>Product</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Brand</th>
                <th style={styles.th}>Base Price</th>
                <th style={styles.th}>Status</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div style={styles.emptyState}>
                      <img src="/src/assets/images/empty-state.svg" alt="" style={styles.emptyImg} />
                      <div style={styles.emptyTitle}>No products found</div>
                      <div style={styles.emptyText}>
                        {debouncedSearch || filterStatus
                          ? 'Try adjusting your filters.'
                          : 'Get started by creating your first product.'}
                      </div>
                      {!debouncedSearch && !filterStatus && (
                        <Link to="/admin/catalogue/products/new" style={styles.btnPrimary}>
                          New Product
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const id = product.productId ?? product.id;
                  const isHovered = hoveredRow === id;
                  const isActive = product.status === 'active' || product.isActive === true;
                  return (
                    <tr
                      key={id}
                      style={isHovered ? { ...styles.trHover } : {}}
                      onMouseEnter={() => setHoveredRow(id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td style={styles.td}>
                        <div style={styles.productCell}>
                          <img
                            src={product.thumbnailUrl ?? product.imageUrl ?? '/src/assets/images/placeholder-product.svg'}
                            alt={product.name}
                            style={styles.productThumb}
                            onError={(e) => { e.currentTarget.src = '/src/assets/images/placeholder-product.svg'; }}
                          />
                          <div>
                            <div style={styles.productName}>{product.name}</div>
                            {product.slug && (
                              <div style={styles.productSlug}>{product.slug}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={styles.td}>{product.categoryName ?? product.category?.name ?? '—'}</td>
                      <td style={styles.td}>{product.brandName ?? product.brand?.name ?? '—'}</td>
                      <td style={styles.td}>{formatPrice(product.basePrice)}</td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.badge,
                            ...(isActive ? styles.badgeActive : styles.badgeInactive),
                          }}
                        >
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right' }}>
                        <div style={{ ...styles.actionsCell, justifyContent: 'flex-end' }}>
                          <Link
                            to={`/admin/catalogue/products/${id}/edit`}
                            style={styles.actionLink}
                            aria-label={`Edit ${product.name}`}
                          >
                            <img src="/src/assets/icons/edit.svg" alt="" style={{ width: 14, height: 14 }} />
                            Edit
                          </Link>
                          <button
                            style={styles.btnDanger}
                            aria-label={`Delete ${product.name}`}
                            onClick={() => setDeleteTarget({ productId: id, name: product.name })}
                          >
                            <img src="/src/assets/icons/trash.svg" alt="" style={{ width: 14, height: 14 }} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {!loading && products.length > 0 && (
            <div style={styles.paginationRow}>
              <span style={styles.paginationInfo}>
                Showing {Math.min((page - 1) * PAGE_SIZE + 1, total)}–{Math.min(page * PAGE_SIZE, total)} of {total} products
              </span>
              <div style={styles.paginationBtns}>
                <button
                  style={{
                    ...styles.paginationBtn,
                    ...(page <= 1 ? styles.paginationBtnDisabled : {}),
                  }}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  aria-label="Previous page"
                >
                  ← Prev
                </button>
                <span style={{ fontSize: '14px', color: '#495057' }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  style={{
                    ...styles.paginationBtn,
                    ...(page >= totalPages ? styles.paginationBtnDisabled : {}),
                  }}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  aria-label="Next page"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div style={styles.confirmOverlay} role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <div style={styles.confirmModal}>
            <h2 id="confirm-title" style={styles.confirmTitle}>Delete Product</h2>
            <p style={styles.confirmText}>
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.
            </p>
            {deleteError && (
              <div style={{ ...styles.errorBanner, marginBottom: '16px' }} role="alert">
                {deleteError}
              </div>
            )}
            <div style={styles.confirmBtns}>
              <button
                style={styles.btnSecondary}
                onClick={() => { setDeleteTarget(null); setDeleteError(null); }}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                style={styles.btnConfirmDelete}
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={styles.successToast} role="status" aria-live="polite">
          <img src="/src/assets/icons/check.svg" alt="" style={{ width: 16, height: 16 }} />
          {toast}
        </div>
      )}
    </div>
  );
}
