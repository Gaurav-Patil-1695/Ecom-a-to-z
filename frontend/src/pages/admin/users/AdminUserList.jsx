import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const ROLES = ['all', 'admin', 'customer', 'guest'];

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
    letterSpacing: '-0.01em',
    lineHeight: '32px',
    color: '#212529',
    margin: 0,
  },
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  filterLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
  },
  filterButton: (active) => ({
    padding: '6px 16px',
    borderRadius: '9999px',
    border: active ? '1px solid #4c6ef5' : '1px solid #868e96',
    backgroundColor: active ? '#e8ecfd' : '#ffffff',
    color: active ? '#3b5bdb' : '#343a40',
    fontSize: '14px',
    fontWeight: active ? '600' : '400',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    outline: 'none',
  }),
  searchWrapper: {
    position: 'relative',
    marginBottom: '20px',
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
  },
  searchInput: {
    width: '100%',
    paddingLeft: '36px',
    paddingRight: '12px',
    paddingTop: '10px',
    paddingBottom: '10px',
    borderRadius: '6px',
    border: '1px solid #868e96',
    fontSize: '14px',
    color: '#212529',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
    outline: 'none',
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
  tr: (index) => ({
    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
    borderBottom: '1px solid #e9ecef',
  }),
  td: {
    padding: '12px 16px',
    fontSize: '14px',
    color: '#343a40',
    verticalAlign: 'middle',
  },
  tdMono: {
    padding: '12px 16px',
    fontSize: '14px',
    color: '#343a40',
    verticalAlign: 'middle',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
  },
  roleBadge: (role) => {
    const map = {
      admin: { bg: '#e8ecfd', color: '#3b5bdb' },
      customer: { bg: '#d3f9d8', color: '#2f9e44' },
      guest: { bg: '#fff3e6', color: '#e8590c' },
    };
    const style = map[role?.toLowerCase()] || { bg: '#e9ecef', color: '#495057' };
    return {
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: '9999px',
      backgroundColor: style.bg,
      color: style.color,
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
    };
  },
  actionLink: {
    color: '#4c6ef5',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    marginRight: '12px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '64px 24px',
    color: '#495057',
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
    marginBottom: '8px',
    color: '#212529',
  },
  emptySubText: {
    fontSize: '14px',
    color: '#495057',
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderTop: '1px solid #e9ecef',
    backgroundColor: '#ffffff',
  },
  paginationInfo: {
    fontSize: '14px',
    color: '#495057',
  },
  paginationButtons: {
    display: 'flex',
    gap: '8px',
  },
  pageBtn: (disabled) => ({
    padding: '6px 14px',
    borderRadius: '6px',
    border: '1px solid #868e96',
    backgroundColor: disabled ? '#e9ecef' : '#ffffff',
    color: disabled ? '#adb5bd' : '#343a40',
    fontSize: '14px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    minHeight: '44px',
  }),
  errorBanner: {
    backgroundColor: '#ffe3e3',
    color: '#c92a2a',
    border: '1px solid #ffa8a8',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  loadingRow: {
    textAlign: 'center',
    padding: '48px',
    color: '#495057',
    fontSize: '14px',
  },
};

const PAGE_SIZE = 20;

export default function AdminUserList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const roleFilter = searchParams.get('role') || 'all';
  const searchQuery = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [inputValue, setInputValue] = useState(searchQuery);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (roleFilter !== 'all') params.set('role', roleFilter);
      if (searchQuery) params.set('q', searchQuery);
      params.set('page', String(page));
      params.set('limit', String(PAGE_SIZE));

      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/users?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Request failed with status ${res.status}`);
      }
      const data = await res.json();
      setUsers(data.users || data.data || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [roleFilter, searchQuery, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set('page', '1');
    setSearchParams(next);
  };

  const handleRoleFilter = (role) => {
    const next = new URLSearchParams(searchParams);
    if (role === 'all') {
      next.delete('role');
    } else {
      next.set('role', role);
    }
    next.set('page', '1');
    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setParam('q', inputValue.trim());
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handlePrev = () => {
    if (page <= 1) return;
    const next = new URLSearchParams(searchParams);
    next.set('page', String(page - 1));
    setSearchParams(next);
  };

  const handleNext = () => {
    if (page >= totalPages) return;
    const next = new URLSearchParams(searchParams);
    next.set('page', String(page + 1));
    setSearchParams(next);
  };

  const startItem = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(page * PAGE_SIZE, total);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Users</h1>
        </div>

        {error && (
          <div style={styles.errorBanner} role="alert">
            {error}
          </div>
        )}

        <div style={styles.filterBar}>
          <span style={styles.filterLabel}>Role:</span>
          {ROLES.map((role) => (
            <button
              key={role}
              style={styles.filterButton(roleFilter === role)}
              onClick={() => handleRoleFilter(role)}
              aria-pressed={roleFilter === role}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} style={styles.searchWrapper}>
          <img
            src="/src/assets/icons/search.svg"
            alt=""
            style={styles.searchIcon}
            aria-hidden="true"
          />
          <input
            type="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search by name or email…"
            style={styles.searchInput}
            aria-label="Search users"
          />
        </form>

        <div style={styles.card}>
          <table style={styles.table} aria-label="Users table">
            <thead style={styles.thead}>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Joined</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={styles.loadingRow}>
                    Loading users…
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div style={styles.emptyState}>
                      <img
                        src="/src/assets/images/empty-state.svg"
                        alt="No users"
                        style={styles.emptyImg}
                      />
                      <div style={styles.emptyText}>No users found</div>
                      <div style={styles.emptySubText}>
                        Try adjusting your filters or search query.
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user.id} style={styles.tr(index)}>
                    <td style={styles.tdMono}>{user.id}</td>
                    <td style={styles.td}>
                      {user.first_name || user.firstName || ''}{' '}
                      {user.last_name || user.lastName || ''}
                    </td>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>
                      <span style={styles.roleBadge(user.role || user.roles?.[0] || 'customer')}>
                        {user.role || user.roles?.[0] || 'customer'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td style={styles.td}>
                      <Link
                        to={`/admin/users/${user.id}`}
                        style={styles.actionLink}
                        aria-label={`View details for user ${user.id}`}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {!loading && users.length > 0 && (
            <div style={styles.pagination}>
              <span style={styles.paginationInfo}>
                {total > 0
                  ? `Showing ${startItem}–${endItem} of ${total} users`
                  : 'No users'}
              </span>
              <div style={styles.paginationButtons}>
                <button
                  style={styles.pageBtn(page <= 1)}
                  onClick={handlePrev}
                  disabled={page <= 1}
                  aria-label="Previous page"
                >
                  ← Prev
                </button>
                <button
                  style={styles.pageBtn(page >= totalPages)}
                  onClick={handleNext}
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
    </div>
  );
}
