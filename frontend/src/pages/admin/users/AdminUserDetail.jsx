import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const AVAILABLE_ROLES = ['admin', 'customer', 'guest'];

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
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    color: '#4c6ef5',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '24px',
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
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
    padding: '24px',
  },
  cardFullWidth: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
    padding: '24px',
    gridColumn: '1 / -1',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '20px',
    marginTop: 0,
    paddingBottom: '12px',
    borderBottom: '1px solid #e9ecef',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  fieldRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  fieldLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
  },
  fieldValue: {
    fontSize: '14px',
    color: '#343a40',
  },
  fieldValueMono: {
    fontSize: '14px',
    color: '#343a40',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
  },
  roleBadge: (role) => {
    const map = {
      admin: { bg: '#e8ecfd', color: '#3b5bdb' },
      customer: { bg: '#d3f9d8', color: '#2f9e44' },
      guest: { bg: '#fff3e6', color: '#e8590c' },
    };
    const s = map[role?.toLowerCase()] || { bg: '#e9ecef', color: '#495057' };
    return {
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: '9999px',
      backgroundColor: s.bg,
      color: s.color,
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
    };
  },
  roleAssignSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  roleCheckboxGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
  },
  roleCheckboxLabel: (checked) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '9999px',
    border: checked ? '1px solid #4c6ef5' : '1px solid #868e96',
    backgroundColor: checked ? '#e8ecfd' : '#ffffff',
    color: checked ? '#3b5bdb' : '#343a40',
    fontSize: '14px',
    fontWeight: checked ? '600' : '400',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'all 0.15s ease',
  }),
  checkbox: {
    width: '16px',
    height: '16px',
    accentColor: '#4c6ef5',
    cursor: 'pointer',
  },
  buttonRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  btnPrimary: {
    padding: '10px 20px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
    transition: 'background-color 0.15s ease',
  },
  btnSecondary: {
    padding: '10px 20px',
    borderRadius: '6px',
    border: '1px solid #868e96',
    backgroundColor: '#ffffff',
    color: '#343a40',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    minHeight: '44px',
    transition: 'all 0.15s ease',
  },
  btnDisabled: {
    padding: '10px 20px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#e9ecef',
    color: '#adb5bd',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'not-allowed',
    minHeight: '44px',
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    color: '#c92a2a',
    border: '1px solid #ffa8a8',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  successBanner: {
    backgroundColor: '#d3f9d8',
    color: '#2f9e44',
    border: '1px solid #8ce99a',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  loadingText: {
    textAlign: 'center',
    padding: '64px 24px',
    color: '#495057',
    fontSize: '16px',
  },
  divider: {
    height: '1px',
    backgroundColor: '#e9ecef',
    margin: '20px 0',
  },
  statusDot: (active) => ({
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '9999px',
    backgroundColor: active ? '#37b24d' : '#adb5bd',
    marginRight: '6px',
  }),
  orderTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  orderTh: {
    padding: '10px 12px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    borderBottom: '2px solid #e9ecef',
    backgroundColor: '#f8f9fa',
  },
  orderTd: {
    padding: '10px 12px',
    fontSize: '14px',
    color: '#343a40',
    borderBottom: '1px solid #e9ecef',
    verticalAlign: 'middle',
  },
  orderTdMono: {
    padding: '10px 12px',
    fontSize: '14px',
    color: '#343a40',
    borderBottom: '1px solid #e9ecef',
    verticalAlign: 'middle',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
  },
  orderStatusBadge: (status) => {
    const map = {
      delivered: { bg: '#d3f9d8', color: '#2f9e44' },
      pending: { bg: '#fff3e6', color: '#e8590c' },
      cancelled: { bg: '#ffe3e3', color: '#c92a2a' },
      processing: { bg: '#e8ecfd', color: '#3b5bdb' },
      shipped: { bg: '#e3f2fd', color: '#1565c0' },
    };
    const s = map[status?.toLowerCase()] || { bg: '#e9ecef', color: '#495057' };
    return {
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: '9999px',
      backgroundColor: s.bg,
      color: s.color,
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
  },
  emptyText: {
    textAlign: 'center',
    padding: '32px',
    color: '#495057',
    fontSize: '14px',
  },
};

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState(null);
  const [roleError, setRoleError] = useState(null);
  const [roleSuccess, setRoleSuccess] = useState(null);
  const [savingRoles, setSavingRoles] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const fetchUser = useCallback(async () => {
    setLoadingUser(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Request failed with status ${res.status}`);
      }
      const data = await res.json();
      const userData = data.user || data;
      setUser(userData);
      const roles = userData.roles
        ? userData.roles.map((r) => (typeof r === 'string' ? r : r.name))
        : userData.role
        ? [userData.role]
        : [];
      setSelectedRoles(roles);
    } catch (err) {
      setError(err.message || 'Failed to load user.');
    } finally {
      setLoadingUser(false);
    }
  }, [id]);

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch(`/api/admin/users/${id}/orders`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        setOrders([]);
        return;
      }
      const data = await res.json();
      setOrders(data.orders || data.data || []);
    } catch {
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
    fetchOrders();
  }, [fetchUser, fetchOrders]);

  const toggleRole = (role) => {
    setRoleError(null);
    setRoleSuccess(null);
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSaveRoles = async () => {
    if (selectedRoles.length === 0) {
      setRoleError('A user must have at least one role.');
      return;
    }
    setSavingRoles(true);
    setRoleError(null);
    setRoleSuccess(null);
    try {
      const res = await fetch(`/api/admin/users/${id}/roles`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ roles: selectedRoles }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Request failed with status ${res.status}`);
      }
      setRoleSuccess('Roles updated successfully.');
      fetchUser();
    } catch (err) {
      setRoleError(err.message || 'Failed to update roles.');
    } finally {
      setSavingRoles(false);
    }
  };

  const handleCancelRoles = () => {
    setRoleError(null);
    setRoleSuccess(null);
    if (user) {
      const roles = user.roles
        ? user.roles.map((r) => (typeof r === 'string' ? r : r.name))
        : user.role
        ? [user.role]
        : [];
      setSelectedRoles(roles);
    }
  };

  if (loadingUser) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loadingText}>Loading user details…</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <Link to="/admin/users" style={styles.backLink}>
            ← Back to Users
          </Link>
          <div style={styles.errorBanner} role="alert">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const fullName =
    `${user.first_name || user.firstName || ''} ${user.last_name || user.lastName || ''}`.trim() ||
    '—';
  const joinedDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—';
  const lastLogin = user.last_login_at || user.lastLoginAt;
  const lastLoginDate = lastLogin
    ? new Date(lastLogin).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

  const currentRoles = user.roles
    ? user.roles.map((r) => (typeof r === 'string' ? r : r.name))
    : user.role
    ? [user.role]
    : [];

  const isActive = user.is_active !== undefined ? user.is_active : user.active !== undefined ? user.active : true;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/admin/users" style={styles.backLink}>
          ← Back to Users
        </Link>

        <div style={styles.header}>
          <h1 style={styles.title}>User Detail</h1>
        </div>

        <div style={styles.grid}>
          {/* Profile Information */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Profile Information</h2>
            <div style={styles.fieldGroup}>
              <div style={styles.fieldRow}>
                <span style={styles.fieldLabel}>User ID</span>
                <span style={styles.fieldValueMono}>{user.id}</span>
              </div>
              <div style={styles.fieldRow}>
                <span style={styles.fieldLabel}>Full Name</span>
                <span style={styles.fieldValue}>{fullName}</span>
              </div>
              <div style={styles.fieldRow}>
                <span style={styles.fieldLabel}>Email</span>
                <span style={styles.fieldValue}>{user.email || '—'}</span>
              </div>
              <div style={styles.fieldRow}>
                <span style={styles.fieldLabel}>Phone</span>
                <span style={styles.fieldValue}>{user.phone || user.phone_number || '—'}</span>
              </div>
              <div style={styles.fieldRow}>
                <span style={styles.fieldLabel}>Status</span>
                <span style={styles.fieldValue}>
                  <span style={styles.statusDot(isActive)} />
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div style={styles.fieldRow}>
                <span style={styles.fieldLabel}>Current Role(s)</span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {currentRoles.length > 0
                    ? currentRoles.map((role) => (
                        <span key={role} style={styles.roleBadge(role)}>
                          {role}
                        </span>
                      ))
                    : <span style={styles.fieldValue}>—</span>}
                </div>
              </div>
              <div style={styles.fieldRow}>
                <span style={styles.fieldLabel}>Joined</span>
                <span style={styles.fieldValue}>{joinedDate}</span>
              </div>
              <div style={styles.fieldRow}>
                <span style={styles.fieldLabel}>Last Login</span>
                <span style={styles.fieldValue}>{lastLoginDate}</span>
              </div>
            </div>
          </div>

          {/* Role Assignment */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Role Assignment</h2>
            {roleError && (
              <div style={styles.errorBanner} role="alert">
                {roleError}
              </div>
            )}
            {roleSuccess && (
              <div style={styles.successBanner} role="status">
                {roleSuccess}
              </div>
            )}
            <div style={styles.roleAssignSection}>
              <p style={{ fontSize: '14px', color: '#495057', margin: '0 0 4px 0' }}>
                Select one or more roles to assign to this user.
              </p>
              <div style={styles.roleCheckboxGroup}>
                {AVAILABLE_ROLES.map((role) => {
                  const checked = selectedRoles.includes(role);
                  return (
                    <label key={role} style={styles.roleCheckboxLabel(checked)}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleRole(role)}
                        style={styles.checkbox}
                        aria-label={`Assign role ${role}`}
                      />
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </label>
                  );
                })}
              </div>
              <div style={styles.buttonRow}>
                <button
                  style={savingRoles ? styles.btnDisabled : styles.btnPrimary}
                  onClick={handleSaveRoles}
                  disabled={savingRoles}
                  aria-busy={savingRoles}
                >
                  {savingRoles ? 'Saving…' : 'Save Roles'}
                </button>
                <button
                  style={styles.btnSecondary}
                  onClick={handleCancelRoles}
                  disabled={savingRoles}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Order History */}
          <div style={styles.cardFullWidth}>
            <h2 style={styles.cardTitle}>Order History</h2>
            {loadingOrders ? (
              <div style={styles.emptyText}>Loading orders…</div>
            ) : orders.length === 0 ? (
              <div style={styles.emptyText}>No orders found for this user.</div>
            ) : (
              <table style={styles.orderTable} aria-label="User orders table">
                <thead>
                  <tr>
                    <th style={styles.orderTh}>Order ID</th>
                    <th style={styles.orderTh}>Date</th>
                    <th style={styles.orderTh}>Items</th>
                    <th style={styles.orderTh}>Total</th>
                    <th style={styles.orderTh}>Status</th>
                    <th style={styles.orderTh}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td style={styles.orderTdMono}>{order.id}</td>
                      <td style={styles.orderTd}>
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td style={styles.orderTd}>
                        {order.item_count ||
                          (order.items ? order.items.length : '—')}
                      </td>
                      <td style={styles.orderTd}>
                        {order.total !== undefined && order.total !== null
                          ? `₹${Number(order.total).toLocaleString('en-IN', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`
                          : '—'}
                      </td>
                      <td style={styles.orderTd}>
                        <span style={styles.orderStatusBadge(order.status)}>
                          {order.status || '—'}
                        </span>
                      </td>
                      <td style={styles.orderTd}>
                        <Link
                          to={`/admin/orders/${order.id}`}
                          style={styles.actionLink}
                          aria-label={`View order ${order.id}`}
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
