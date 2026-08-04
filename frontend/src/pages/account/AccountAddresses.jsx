import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    marginBottom: '16px',
    position: 'relative',
  },
  addressName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    margin: '0 0 4px 0',
  },
  addressLine: {
    fontSize: '14px',
    color: '#495057',
    margin: '0 0 2px 0',
    lineHeight: '1.5',
  },
  addressActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '16px',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
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
    textDecoration: 'none',
  },
  btnGhost: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: '#4c6ef5',
    fontSize: '14px',
    fontWeight: '500',
    border: '1px solid #4c6ef5',
    borderRadius: '10px',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    minHeight: '44px',
    transition: 'background-color 0.15s',
  },
  btnDanger: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: '#f03e3e',
    fontSize: '14px',
    fontWeight: '500',
    border: '1px solid #f03e3e',
    borderRadius: '10px',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    minHeight: '44px',
    transition: 'background-color 0.15s',
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
  successBanner: {
    backgroundColor: '#d3f9d8',
    border: '1px solid #37b24d',
    borderRadius: '10px',
    padding: '16px 20px',
    color: '#37b24d',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
  },
  skeletonBase: {
    backgroundColor: '#e9ecef',
    borderRadius: '6px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 1px 3px rgba(33,37,41,0.08)',
    marginBottom: '24px',
    textAlign: 'center',
  },
  emptyIcon: {
    width: '48px',
    height: '48px',
    marginBottom: '16px',
    opacity: 0.4,
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#212529',
    margin: '0 0 8px 0',
  },
  emptyText: {
    fontSize: '14px',
    color: '#495057',
    margin: '0 0 24px 0',
  },
  defaultBadge: {
    display: 'inline-block',
    backgroundColor: '#e8ecfd',
    color: '#4c6ef5',
    borderRadius: '9999px',
    padding: '2px 10px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginLeft: '8px',
    verticalAlign: 'middle',
  },
  addAddressRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '24px',
  },
  modalOverlay: {
    position: 'fixed',
    inset: '0',
    backgroundColor: 'rgba(33,37,41,0.48)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '16px',
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    maxWidth: '400px',
    width: '100%',
    boxShadow: '0 8px 32px rgba(33,37,41,0.18)',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#212529',
    margin: '0 0 8px 0',
  },
  modalText: {
    fontSize: '14px',
    color: '#495057',
    margin: '0 0 24px 0',
    lineHeight: '1.5',
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
};

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

function AddressCard({ address, onEdit, onDelete }) {
  const lines = [
    address.line1,
    address.line2,
    [address.city, address.state, address.postal_code].filter(Boolean).join(', '),
    address.country,
  ].filter(Boolean);

  const displayName =
    address.label ||
    [address.first_name, address.last_name].filter(Boolean).join(' ') ||
    'Address';

  return (
    <div style={styles.card}>
      <p style={styles.addressName}>
        {displayName}
        {address.is_default && (
          <span style={styles.defaultBadge}>Default</span>
        )}
      </p>
      {address.phone && (
        <p style={styles.addressLine}>{address.phone}</p>
      )}
      {lines.map((line, i) => (
        <p key={i} style={styles.addressLine}>{line}</p>
      ))}
      <div style={styles.addressActions}>
        <button
          style={styles.btnGhost}
          onClick={() => onEdit(address)}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f1f3ff'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
          onBlur={e => { e.currentTarget.style.outline = 'none'; }}
          aria-label={`Edit address ${displayName}`}
        >
          <img src="/src/assets/icons/edit.svg" alt="" aria-hidden="true" style={{ width: '16px', height: '16px' }} />
          Edit
        </button>
        <button
          style={styles.btnDanger}
          onClick={() => onDelete(address)}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#ffe3e3'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          onFocus={e => { e.currentTarget.style.outline = '2px solid #f03e3e'; e.currentTarget.style.outlineOffset = '2px'; }}
          onBlur={e => { e.currentTarget.style.outline = 'none'; }}
          aria-label={`Delete address ${displayName}`}
        >
          <img src="/src/assets/icons/trash.svg" alt="" aria-hidden="true" style={{ width: '16px', height: '16px' }} />
          Delete
        </button>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ address, onConfirm, onCancel, deleting }) {
  const displayName =
    address.label ||
    [address.first_name, address.last_name].filter(Boolean).join(' ') ||
    'this address';

  return (
    <div
      style={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      onClick={e => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div style={styles.modal}>
        <p id="delete-modal-title" style={styles.modalTitle}>Delete address</p>
        <p style={styles.modalText}>
          Are you sure you want to delete <strong>{displayName}</strong>? This action cannot be undone.
        </p>
        <div style={styles.modalActions}>
          <button
            style={{
              ...styles.btnGhost,
              fontSize: '14px',
              padding: '8px 16px',
            }}
            onClick={onCancel}
            disabled={deleting}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f1f3ff'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
            onBlur={e => { e.currentTarget.style.outline = 'none'; }}
          >
            Cancel
          </button>
          <button
            style={{
              ...styles.btnDanger,
              backgroundColor: deleting ? '#adb5bd' : '#f03e3e',
              color: '#ffffff',
              border: 'none',
              cursor: deleting ? 'not-allowed' : 'pointer',
            }}
            onClick={onConfirm}
            disabled={deleting}
            onFocus={e => { e.currentTarget.style.outline = '2px solid #f03e3e'; e.currentTarget.style.outlineOffset = '2px'; }}
            onBlur={e => { e.currentTarget.style.outline = 'none'; }}
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AccountAddresses() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  async function fetchAddresses() {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch('/api/users/me/addresses', { headers });
      if (!res.ok) throw new Error('Failed to load addresses.');
      const data = await res.json();
      const list = data.data || data.addresses || data || [];
      setAddresses(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(address) {
    navigate(`/account/addresses/${address.id}/edit`);
  }

  function handleDeleteRequest(address) {
    setDeleteError(null);
    setDeleteTarget(address);
  }

  function handleDeleteCancel() {
    setDeleteTarget(null);
    setDeleteError(null);
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`/api/users/me/addresses/${deleteTarget.id}`, {
        method: 'DELETE',
        headers,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to delete address. Please try again.');
      }
      setAddresses(prev => prev.filter(a => a.id !== deleteTarget.id));
      setDeleteTarget(null);
      setSuccessMessage('Address deleted successfully.');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete address. Please try again.');
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <SkeletonLine width="80px" height="16px" style={{ marginBottom: '24px' }} />
          <SkeletonLine width="260px" height="40px" style={{ marginBottom: '8px' }} />
          <SkeletonLine width="320px" height="16px" style={{ marginBottom: '32px' }} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
            <SkeletonLine width="160px" height="44px" style={{ borderRadius: '10px' }} />
          </div>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ ...styles.card, marginBottom: '16px' }}>
              <SkeletonLine width="180px" height="20px" style={{ marginBottom: '8px' }} />
              <SkeletonLine width="240px" height="16px" style={{ marginBottom: '6px' }} />
              <SkeletonLine width="200px" height="16px" style={{ marginBottom: '6px' }} />
              <SkeletonLine width="160px" height="16px" style={{ marginBottom: '16px' }} />
              <div style={{ display: 'flex', gap: '8px' }}>
                <SkeletonLine width="80px" height="44px" style={{ borderRadius: '10px' }} />
                <SkeletonLine width="80px" height="44px" style={{ borderRadius: '10px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Back link */}
        <button
          style={styles.backLink}
          onClick={() => navigate('/account')}
          onMouseEnter={e => { e.currentTarget.style.color = '#3b5bdb'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#4c6ef5'; }}
          onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
          onBlur={e => { e.currentTarget.style.outline = 'none'; }}
          aria-label="Back to account overview"
        >
          <img
            src="/src/assets/icons/chevron-left.svg"
            alt=""
            aria-hidden="true"
            style={{ width: '16px', height: '16px' }}
          />
          Back to account
        </button>

        <h1 style={styles.pageTitle}>Saved addresses</h1>
        <p style={styles.pageSub}>Manage your saved delivery addresses for faster checkout.</p>

        {/* Error banner */}
        {error && (
          <div style={styles.errorBanner} role="alert">
            <span style={{ fontSize: '18px' }}>⚠️</span>
            <span>{error}</span>
            <button
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                color: '#f03e3e',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                padding: '0',
              }}
              onClick={fetchAddresses}
              onFocus={e => { e.currentTarget.style.outline = '2px solid #f03e3e'; e.currentTarget.style.outlineOffset = '2px'; }}
              onBlur={e => { e.currentTarget.style.outline = 'none'; }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Delete error banner */}
        {deleteError && (
          <div style={styles.errorBanner} role="alert">
            <span style={{ fontSize: '18px' }}>⚠️</span>
            <span>{deleteError}</span>
          </div>
        )}

        {/* Success banner */}
        {successMessage && (
          <div style={styles.successBanner} role="status">
            <span style={{ fontSize: '18px' }}>✓</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Add new address button */}
        <div style={styles.addAddressRow}>
          <button
            style={styles.btnPrimary}
            onClick={() => navigate('/account/addresses/new')}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#3b5bdb'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#4c6ef5'; }}
            onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
            onBlur={e => { e.currentTarget.style.outline = 'none'; }}
          >
            <img src="/src/assets/icons/plus.svg" alt="" aria-hidden="true" style={{ width: '18px', height: '18px' }} />
            Add new address
          </button>
        </div>

        {/* Address list */}
        {!error && addresses.length === 0 ? (
          <div style={styles.emptyState}>
            <img
              src="/src/assets/icons/map-pin.svg"
              alt=""
              aria-hidden="true"
              style={styles.emptyIcon}
            />
            <p style={styles.emptyTitle}>No addresses saved yet</p>
            <p style={styles.emptyText}>
              Add a delivery address to make checkout faster.
            </p>
            <button
              style={styles.btnPrimary}
              onClick={() => navigate('/account/addresses/new')}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#3b5bdb'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#4c6ef5'; }}
              onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
              onBlur={e => { e.currentTarget.style.outline = 'none'; }}
            >
              <img src="/src/assets/icons/plus.svg" alt="" aria-hidden="true" style={{ width: '18px', height: '18px' }} />
              Add new address
            </button>
          </div>
        ) : (
          <div>
            {addresses.length > 0 && (
              <p style={styles.sectionLabel}>
                {addresses.length} {addresses.length === 1 ? 'address' : 'addresses'}
              </p>
            )}
            {addresses.map(address => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={handleEdit}
                onDelete={handleDeleteRequest}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          address={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          deleting={deleting}
        />
      )}
    </div>
  );
}
