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
  categoryName: {
    fontWeight: '500',
    color: '#212529',
    fontSize: '14px',
    lineHeight: '20px',
  },
  categorySlug: {
    fontSize: '12px',
    color: '#495057',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    marginTop: '2px',
  },
  parentChip: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#e8ecfd',
    color: '#3b5bdb',
    borderRadius: '9999px',
    padding: '2px 10px',
    fontSize: '12px',
    fontWeight: '500',
  },
  depthBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '9999px',
    backgroundColor: '#e9ecef',
    color: '#495057',
    fontSize: '12px',
    fontWeight: '600',
  },
  indentBlock: {
    display: 'inline-block',
    width: '20px',
    flexShrink: 0,
  },
  categoryCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  actionsCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    justifyContent: 'flex-end',
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
  skeletonRow: {
    backgroundColor: '#f8f9fa',
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
  treeToggle: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    padding: 0,
    color: '#495057',
    fontSize: '12px',
    flexShrink: 0,
  },
  treeLeafSpacer: {
    display: 'inline-block',
    width: '20px',
    flexShrink: 0,
  },
  countBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '20px',
    height: '20px',
    borderRadius: '9999px',
    backgroundColor: '#e9ecef',
    color: '#495057',
    fontSize: '11px',
    fontWeight: '600',
    padding: '0 6px',
  },
};

function buildTree(categories) {
  const map = {};
  const roots = [];

  categories.forEach((cat) => {
    const id = cat.categoryId ?? cat.id;
    map[id] = { ...cat, children: [] };
  });

  categories.forEach((cat) => {
    const id = cat.categoryId ?? cat.id;
    const parentId = cat.parentId ?? cat.parentCategoryId ?? null;
    if (parentId && map[parentId]) {
      map[parentId].children.push(map[id]);
    } else {
      roots.push(map[id]);
    }
  });

  return roots;
}

function flattenTree(nodes, depth = 0) {
  const result = [];
  nodes.forEach((node) => {
    result.push({ ...node, _depth: depth });
    if (node.children && node.children.length > 0) {
      result.push(...flattenTree(node.children, depth + 1));
    }
  });
  return result;
}

function filterTree(nodes, search) {
  if (!search) return nodes;
  const lower = search.toLowerCase();
  return nodes.filter(
    (node) =>
      (node.name && node.name.toLowerCase().includes(lower)) ||
      (node.slug && node.slug.toLowerCase().includes(lower))
  );
}

function SkeletonRow() {
  return (
    <tr style={styles.skeletonRow}>
      {[140, 100, 80, 60, 80].map((w, i) => (
        <td key={i} style={styles.td}>
          <span style={{ ...styles.skeletonCell, width: w }} />
        </td>
      ))}
    </tr>
  );
}

export default function AdminCategoryList() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [collapsedIds, setCollapsedIds] = useState(new Set());

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const [toast, setToast] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('created') === '1' || params.get('updated') === '1') {
      const msg =
        params.get('updated') === '1'
          ? 'Category updated successfully.'
          : 'Category created successfully.';
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
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/categories`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      const list = Array.isArray(data.categories)
        ? data.categories
        : Array.isArray(data)
        ? data
        : [];
      setCategories(list);
    } catch {
      setError('Could not load categories — please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const treeRoots = buildTree(categories);

  const filteredFlat = debouncedSearch
    ? filterTree(flattenTree(treeRoots), debouncedSearch)
    : null;

  const visibleRows = debouncedSearch
    ? filteredFlat
    : (() => {
        const allFlat = flattenTree(treeRoots);
        return allFlat.filter((row) => {
          if (row._depth === 0) return true;
          const parent = categories.find((c) => {
            const id = c.categoryId ?? c.id;
            const parentId = row.parentId ?? row.parentCategoryId ?? null;
            return id === parentId;
          });
          if (!parent) return true;
          const parentId = parent.categoryId ?? parent.id;
          return !collapsedIds.has(parentId);
        });
      })();

  const hasChildren = (node) => node.children && node.children.length > 0;

  const toggleCollapse = (id) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/categories/${deleteTarget.categoryId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      setDeleteTarget(null);
      setToast('Category deleted successfully.');
      fetchCategories();
    } catch {
      setDeleteError('Could not delete category. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getParentName = (cat) => {
    const parentId = cat.parentId ?? cat.parentCategoryId ?? null;
    if (!parentId) return null;
    const parent = categories.find((c) => (c.categoryId ?? c.id) === parentId);
    return parent ? parent.name : null;
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Categories</h1>
          <Link to="/admin/catalogue/categories/new" style={styles.btnPrimary}>
            <img src="/src/assets/icons/plus.svg" alt="" style={{ width: 16, height: 16 }} />
            New Category
          </Link>
        </div>

        {/* Filter row */}
        <div style={styles.filterRow}>
          <div style={styles.searchWrapper}>
            <img src="/src/assets/icons/search.svg" alt="" style={styles.searchIcon} />
            <input
              type="search"
              placeholder="Search categories…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
              aria-label="Search categories"
            />
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div style={styles.errorBanner} role="alert">
            <span>{error}</span>
            <button style={styles.retryLink} onClick={fetchCategories}>
              Retry
            </button>
          </div>
        )}

        {/* Table */}
        <div style={styles.card}>
          <table style={styles.table} aria-label="Categories">
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Slug</th>
                <th style={styles.th}>Parent</th>
                <th style={styles.th}>Children</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
              ) : visibleRows.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div style={styles.emptyState}>
                      <img
                        src="/src/assets/images/empty-state.svg"
                        alt=""
                        style={styles.emptyImg}
                      />
                      <div style={styles.emptyTitle}>No categories found</div>
                      <div style={styles.emptyText}>
                        {debouncedSearch
                          ? 'Try adjusting your search.'
                          : 'Get started by creating your first category.'}
                      </div>
                      {!debouncedSearch && (
                        <Link
                          to="/admin/catalogue/categories/new"
                          style={styles.btnPrimary}
                        >
                          New Category
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                visibleRows.map((row) => {
                  const id = row.categoryId ?? row.id;
                  const isHovered = hoveredRow === id;
                  const nodeHasChildren = hasChildren(row);
                  const isCollapsed = collapsedIds.has(id);
                  const parentName = getParentName(row);
                  const depth = row._depth ?? 0;

                  return (
                    <tr
                      key={id}
                      style={isHovered ? styles.trHover : {}}
                      onMouseEnter={() => setHoveredRow(id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      {/* Name cell with tree indent */}
                      <td style={styles.td}>
                        <div style={styles.categoryCell}>
                          {/* Depth indent */}
                          {depth > 0 && (
                            Array.from({ length: depth }).map((_, di) => (
                              <span key={di} style={styles.indentBlock} aria-hidden="true" />
                            ))
                          )}
                          {/* Collapse toggle or leaf spacer */}
                          {nodeHasChildren && !debouncedSearch ? (
                            <button
                              type="button"
                              style={styles.treeToggle}
                              onClick={() => toggleCollapse(id)}
                              aria-label={isCollapsed ? `Expand ${row.name}` : `Collapse ${row.name}`}
                              aria-expanded={!isCollapsed}
                            >
                              {isCollapsed ? '▶' : '▼'}
                            </button>
                          ) : (
                            <span style={styles.treeLeafSpacer} aria-hidden="true" />
                          )}
                          <div>
                            <div style={styles.categoryName}>{row.name}</div>
                          </div>
                        </div>
                      </td>

                      {/* Slug */}
                      <td style={styles.td}>
                        {row.slug ? (
                          <span style={styles.categorySlug}>{row.slug}</span>
                        ) : (
                          <span style={{ color: '#868e96' }}>—</span>
                        )}
                      </td>

                      {/* Parent */}
                      <td style={styles.td}>
                        {parentName ? (
                          <span style={styles.parentChip}>{parentName}</span>
                        ) : (
                          <span style={{ color: '#868e96', fontSize: '13px' }}>Root</span>
                        )}
                      </td>

                      {/* Children count */}
                      <td style={styles.td}>
                        {nodeHasChildren ? (
                          <span style={styles.countBadge}>
                            {row.children.length}
                          </span>
                        ) : (
                          <span style={{ color: '#868e96', fontSize: '13px' }}>—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ ...styles.td, textAlign: 'right' }}>
                        <div style={styles.actionsCell}>
                          <Link
                            to={`/admin/catalogue/categories/${id}/edit`}
                            style={styles.actionLink}
                            aria-label={`Edit ${row.name}`}
                          >
                            <img
                              src="/src/assets/icons/edit.svg"
                              alt=""
                              style={{ width: 14, height: 14 }}
                            />
                            Edit
                          </Link>
                          <button
                            style={styles.btnDanger}
                            aria-label={`Delete ${row.name}`}
                            onClick={() =>
                              setDeleteTarget({ categoryId: id, name: row.name })
                            }
                          >
                            <img
                              src="/src/assets/icons/trash.svg"
                              alt=""
                              style={{ width: 14, height: 14 }}
                            />
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

          {/* Summary row */}
          {!loading && categories.length > 0 && (
            <div
              style={{
                padding: '14px 20px',
                borderTop: '1px solid #e9ecef',
                fontSize: '14px',
                color: '#495057',
              }}
            >
              {categories.length} {categories.length === 1 ? 'category' : 'categories'} total
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div
          style={styles.confirmOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          <div style={styles.confirmModal}>
            <h2 id="confirm-title" style={styles.confirmTitle}>
              Delete Category
            </h2>
            <p style={styles.confirmText}>
              Are you sure you want to delete{' '}
              <strong>{deleteTarget.name}</strong>? This action cannot be undone.
              Child categories may be affected.
            </p>
            {deleteError && (
              <div
                style={{ ...styles.errorBanner, marginBottom: '16px' }}
                role="alert"
              >
                {deleteError}
              </div>
            )}
            <div style={styles.confirmBtns}>
              <button
                style={styles.btnSecondary}
                onClick={() => {
                  setDeleteTarget(null);
                  setDeleteError(null);
                }}
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
          <img
            src="/src/assets/icons/check.svg"
            alt=""
            style={{ width: 16, height: 16 }}
          />
          {toast}
        </div>
      )}
    </div>
  );
}
