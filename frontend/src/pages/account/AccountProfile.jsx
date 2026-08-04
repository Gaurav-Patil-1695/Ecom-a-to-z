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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(33,37,41,0.08)',
    marginBottom: '24px',
  },
  sectionLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    marginBottom: '20px',
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
  input: {
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
  },
  inputError: {
    borderColor: '#f03e3e',
  },
  fieldError: {
    fontSize: '12px',
    color: '#f03e3e',
    marginTop: '4px',
    display: 'block',
  },
  row: {
    display: 'flex',
    gap: '16px',
  },
  rowItem: {
    flex: 1,
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #e9ecef',
    margin: '24px 0',
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
  hint: {
    fontSize: '12px',
    color: '#495057',
    marginTop: '4px',
    display: 'block',
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

function FormField({ id, label, type = 'text', value, onChange, error, hint, autoComplete, required, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={styles.formGroup}>
      <label htmlFor={id} style={styles.label}>
        {label}{required && <span aria-hidden="true" style={{ color: '#f03e3e', marginLeft: '2px' }}>*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        aria-invalid={error ? 'true' : 'false'}
        required={required}
        style={{
          ...styles.input,
          ...(error ? styles.inputError : {}),
          ...(focused ? { borderColor: '#4c6ef5', boxShadow: '0 0 0 3px rgba(76,110,245,0.15)' } : {}),
        }}
      />
      {hint && !error && (
        <span id={`${id}-hint`} style={styles.hint}>{hint}</span>
      )}
      {error && (
        <span id={`${id}-error`} role="alert" style={styles.fieldError}>{error}</span>
      )}
    </div>
  );
}

const PROFILE_SUCCESS_MSG = 'Profile updated successfully.';
const PASSWORD_SUCCESS_MSG = 'Password changed successfully.';

export default function AccountProfile() {
  const navigate = useNavigate();

  // Load state
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Profile form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [profileErrors, setProfileErrors] = useState({});
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState(null);

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      setLoadError(null);
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch('/api/users/me', { headers });
        if (!res.ok) throw new Error('Failed to load profile data.');
        const data = await res.json();
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setEmail(data.email || '');
      } catch (err) {
        setLoadError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  function validateProfile() {
    const errs = {};
    if (!firstName.trim()) errs.firstName = 'First name is required.';
    if (!lastName.trim()) errs.lastName = 'Last name is required.';
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    return errs;
  }

  async function handleProfileSubmit(e) {
    e.preventDefault();
    setProfileSuccess(null);
    setProfileError(null);
    const errs = validateProfile();
    if (Object.keys(errs).length > 0) {
      setProfileErrors(errs);
      return;
    }
    setProfileErrors({});
    setProfileSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to update profile. Please try again.');
      }
      setProfileSuccess(PROFILE_SUCCESS_MSG);
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setProfileSubmitting(false);
    }
  }

  function validatePassword() {
    const errs = {};
    if (!currentPassword) errs.currentPassword = 'Current password is required.';
    if (!newPassword) {
      errs.newPassword = 'New password is required.';
    } else if (newPassword.length < 8) {
      errs.newPassword = 'Password must be at least 8 characters.';
    }
    if (!confirmPassword) {
      errs.confirmPassword = 'Please confirm your new password.';
    } else if (newPassword && confirmPassword !== newPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }
    return errs;
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPasswordSuccess(null);
    setPasswordError(null);
    const errs = validatePassword();
    if (Object.keys(errs).length > 0) {
      setPasswordErrors(errs);
      return;
    }
    setPasswordErrors({});
    setPasswordSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const res = await fetch('/api/users/me/change-password', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to change password. Please try again.');
      }
      setPasswordSuccess(PASSWORD_SUCCESS_MSG);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password. Please try again.');
    } finally {
      setPasswordSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <SkeletonLine width="80px" height="16px" style={{ marginBottom: '24px' }} />
          <SkeletonLine width="260px" height="40px" style={{ marginBottom: '8px' }} />
          <SkeletonLine width="320px" height="16px" style={{ marginBottom: '32px' }} />
          <div style={styles.card}>
            <SkeletonLine width="120px" height="12px" style={{ marginBottom: '20px' }} />
            <div style={styles.row}>
              <div style={styles.rowItem}>
                <SkeletonLine width="80px" height="14px" style={{ marginBottom: '6px' }} />
                <SkeletonLine width="100%" height="40px" style={{ borderRadius: '6px' }} />
              </div>
              <div style={styles.rowItem}>
                <SkeletonLine width="80px" height="14px" style={{ marginBottom: '6px' }} />
                <SkeletonLine width="100%" height="40px" style={{ borderRadius: '6px' }} />
              </div>
            </div>
            <SkeletonLine width="60px" height="14px" style={{ marginBottom: '6px', marginTop: '20px' }} />
            <SkeletonLine width="100%" height="40px" style={{ borderRadius: '6px' }} />
            <SkeletonLine width="120px" height="44px" style={{ borderRadius: '10px', marginTop: '24px' }} />
          </div>
          <div style={styles.card}>
            <SkeletonLine width="140px" height="12px" style={{ marginBottom: '20px' }} />
            <SkeletonLine width="100%" height="40px" style={{ borderRadius: '6px', marginBottom: '20px' }} />
            <SkeletonLine width="100%" height="40px" style={{ borderRadius: '6px', marginBottom: '20px' }} />
            <SkeletonLine width="100%" height="40px" style={{ borderRadius: '6px' }} />
            <SkeletonLine width="160px" height="44px" style={{ borderRadius: '10px', marginTop: '24px' }} />
          </div>
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

        <h1 style={styles.pageTitle}>Account profile</h1>
        <p style={styles.pageSub}>Update your personal information and change your password.</p>

        {loadError && (
          <div style={styles.errorBanner} role="alert">
            <span style={{ fontSize: '18px' }}>⚠️</span>
            <span>{loadError}</span>
          </div>
        )}

        {/* Profile details section */}
        <div style={styles.card}>
          <p style={styles.sectionLabel}>Personal information</p>

          {profileSuccess && (
            <div style={styles.successBanner} role="status">
              <span style={{ fontSize: '18px' }}>✓</span>
              <span>{profileSuccess}</span>
            </div>
          )}
          {profileError && (
            <div style={styles.errorBanner} role="alert">
              <span style={{ fontSize: '18px' }}>⚠️</span>
              <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} noValidate>
            <div style={styles.row}>
              <div style={styles.rowItem}>
                <FormField
                  id="firstName"
                  label="First name"
                  value={firstName}
                  onChange={e => {
                    setFirstName(e.target.value);
                    if (profileErrors.firstName) setProfileErrors(prev => ({ ...prev, firstName: undefined }));
                  }}
                  error={profileErrors.firstName}
                  autoComplete="given-name"
                  required
                  placeholder="First name"
                />
              </div>
              <div style={styles.rowItem}>
                <FormField
                  id="lastName"
                  label="Last name"
                  value={lastName}
                  onChange={e => {
                    setLastName(e.target.value);
                    if (profileErrors.lastName) setProfileErrors(prev => ({ ...prev, lastName: undefined }));
                  }}
                  error={profileErrors.lastName}
                  autoComplete="family-name"
                  required
                  placeholder="Last name"
                />
              </div>
            </div>

            <FormField
              id="email"
              label="Email address"
              type="email"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                if (profileErrors.email) setProfileErrors(prev => ({ ...prev, email: undefined }));
              }}
              error={profileErrors.email}
              autoComplete="email"
              required
              placeholder="you@example.com"
            />

            <div style={styles.btnRow}>
              <button
                type="submit"
                disabled={profileSubmitting}
                style={{
                  ...styles.btnPrimary,
                  ...(profileSubmitting ? { backgroundColor: '#adb5bd', cursor: 'not-allowed' } : {}),
                }}
                onMouseEnter={e => { if (!profileSubmitting) e.currentTarget.style.backgroundColor = '#3b5bdb'; }}
                onMouseLeave={e => { if (!profileSubmitting) e.currentTarget.style.backgroundColor = '#4c6ef5'; }}
                onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
                onBlur={e => { e.currentTarget.style.outline = 'none'; }}
              >
                {profileSubmitting ? 'Saving…' : 'Save changes'}
              </button>
              <button
                type="button"
                disabled={profileSubmitting}
                style={{
                  ...styles.btnGhost,
                  ...(profileSubmitting ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
                }}
                onClick={() => navigate('/account')}
                onMouseEnter={e => { if (!profileSubmitting) e.currentTarget.style.backgroundColor = '#f1f3ff'; }}
                onMouseLeave={e => { if (!profileSubmitting) e.currentTarget.style.backgroundColor = 'transparent'; }}
                onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
                onBlur={e => { e.currentTarget.style.outline = 'none'; }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Change password section */}
        <div style={styles.card}>
          <p style={styles.sectionLabel}>Change password</p>

          {passwordSuccess && (
            <div style={styles.successBanner} role="status">
              <span style={{ fontSize: '18px' }}>✓</span>
              <span>{passwordSuccess}</span>
            </div>
          )}
          {passwordError && (
            <div style={styles.errorBanner} role="alert">
              <span style={{ fontSize: '18px' }}>⚠️</span>
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} noValidate>
            <FormField
              id="currentPassword"
              label="Current password"
              type="password"
              value={currentPassword}
              onChange={e => {
                setCurrentPassword(e.target.value);
                if (passwordErrors.currentPassword) setPasswordErrors(prev => ({ ...prev, currentPassword: undefined }));
              }}
              error={passwordErrors.currentPassword}
              autoComplete="current-password"
              required
              placeholder="Enter your current password"
            />

            <FormField
              id="newPassword"
              label="New password"
              type="password"
              value={newPassword}
              onChange={e => {
                setNewPassword(e.target.value);
                if (passwordErrors.newPassword) setPasswordErrors(prev => ({ ...prev, newPassword: undefined }));
              }}
              error={passwordErrors.newPassword}
              hint="Must be at least 8 characters."
              autoComplete="new-password"
              required
              placeholder="Enter a new password"
            />

            <FormField
              id="confirmPassword"
              label="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={e => {
                setConfirmPassword(e.target.value);
                if (passwordErrors.confirmPassword) setPasswordErrors(prev => ({ ...prev, confirmPassword: undefined }));
              }}
              error={passwordErrors.confirmPassword}
              autoComplete="new-password"
              required
              placeholder="Re-enter your new password"
            />

            <div style={styles.btnRow}>
              <button
                type="submit"
                disabled={passwordSubmitting}
                style={{
                  ...styles.btnPrimary,
                  ...(passwordSubmitting ? { backgroundColor: '#adb5bd', cursor: 'not-allowed' } : {}),
                }}
                onMouseEnter={e => { if (!passwordSubmitting) e.currentTarget.style.backgroundColor = '#3b5bdb'; }}
                onMouseLeave={e => { if (!passwordSubmitting) e.currentTarget.style.backgroundColor = '#4c6ef5'; }}
                onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
                onBlur={e => { e.currentTarget.style.outline = 'none'; }}
              >
                {passwordSubmitting ? 'Updating…' : 'Update password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
