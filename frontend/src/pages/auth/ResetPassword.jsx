import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 2px 16px rgba(33,37,41,0.08)',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '32px',
    letterSpacing: '-0.01em',
    color: '#212529',
    textAlign: 'center',
    marginBottom: '8px',
    marginTop: '0',
  },
  subtext: {
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
    color: '#495057',
    textAlign: 'center',
    marginBottom: '32px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
    color: '#212529',
    marginBottom: '6px',
  },
  input: {
    display: 'block',
    width: '100%',
    boxSizing: 'border-box',
    padding: '12px',
    fontSize: '16px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    lineHeight: '24px',
    color: '#212529',
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    minHeight: '44px',
  },
  inputError: {
    borderColor: '#f03e3e',
  },
  fieldError: {
    display: 'block',
    marginTop: '4px',
    fontSize: '12px',
    lineHeight: '16px',
    color: '#f03e3e',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    backgroundColor: '#ffe3e3',
    border: '1px solid #f03e3e',
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '16px',
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
    color: '#f03e3e',
  },
  errorIcon: {
    flexShrink: 0,
    width: '16px',
    height: '16px',
    marginTop: '2px',
  },
  submitBtn: {
    display: 'block',
    width: '100%',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    lineHeight: '24px',
    color: '#ffffff',
    backgroundColor: '#4c6ef5',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    minHeight: '44px',
    transition: 'background-color 0.15s',
    marginBottom: '20px',
  },
  submitBtnDisabled: {
    backgroundColor: '#e9ecef',
    color: '#adb5bd',
    cursor: 'not-allowed',
  },
  divider: {
    borderTop: '1px solid #e9ecef',
    margin: '20px 0',
  },
  bottomRow: {
    textAlign: 'center',
    fontSize: '14px',
    lineHeight: '20px',
    color: '#495057',
  },
  link: {
    color: '#4c6ef5',
    fontWeight: '500',
    textDecoration: 'none',
  },
  showPasswordBtn: {
    background: 'none',
    border: 'none',
    padding: '4px 0',
    marginTop: '4px',
    fontSize: '12px',
    lineHeight: '16px',
    color: '#4c6ef5',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  successPanel: {
    textAlign: 'center',
  },
  successIconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '64px',
    height: '64px',
    borderRadius: '9999px',
    backgroundColor: '#d3f9d8',
    margin: '0 auto 24px',
  },
  successIcon: {
    fontSize: '32px',
    lineHeight: '1',
    color: '#37b24d',
  },
  successHeading: {
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '32px',
    letterSpacing: '-0.01em',
    color: '#212529',
    marginBottom: '12px',
    marginTop: '0',
  },
  successNote: {
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
    color: '#495057',
    marginBottom: '32px',
  },
  successBtn: {
    display: 'block',
    width: '100%',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    lineHeight: '24px',
    color: '#ffffff',
    backgroundColor: '#4c6ef5',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    minHeight: '44px',
    transition: 'background-color 0.15s',
    textDecoration: 'none',
    textAlign: 'center',
    boxSizing: 'border-box',
  },
  invalidTokenPanel: {
    textAlign: 'center',
  },
  invalidTokenHeading: {
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '32px',
    letterSpacing: '-0.01em',
    color: '#212529',
    marginBottom: '12px',
    marginTop: '0',
  },
  invalidTokenNote: {
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
    color: '#495057',
    marginBottom: '32px',
  },
};

function validatePassword(value) {
  if (!value || value.length < 8) return 'Password must be at least 8 characters.';
  return null;
}

function validateConfirm(value, password) {
  if (value !== password) return 'Passwords do not match.';
  return null;
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorBanner, setErrorBanner] = useState(null);
  const [touched, setTouched] = useState({ password: false, confirm: false });

  const passwordError = touched.password ? validatePassword(password) : null;
  const confirmError = touched.confirm ? validateConfirm(confirm, password) : null;

  const handleBlur = (field) => setTouched((t) => ({ ...t, [field]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ password: true, confirm: true });

    const pErr = validatePassword(password);
    const cErr = validateConfirm(confirm, password);
    if (pErr || cErr) return;

    if (!token) {
      setErrorBanner('invalid-token');
      return;
    }

    setSubmitting(true);
    setErrorBanner(null);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (res.status === 400 || res.status === 404) {
        setErrorBanner('invalid-token');
        return;
      }

      if (res.status === 410) {
        setErrorBanner('expired-token');
        return;
      }

      if (res.status === 429) {
        setErrorBanner('rate-limit');
        return;
      }

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      setSubmitted(true);
    } catch {
      if (window.__showToast) {
        window.__showToast('Something went wrong. Please try again.', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isFormDisabled = submitting;

  if (!token) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.invalidTokenPanel}>
            <h1 style={styles.invalidTokenHeading}>Invalid reset link</h1>
            <p style={styles.invalidTokenNote}>
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link to="/forgot-password" style={styles.successBtn}>
              Request new link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.successPanel}>
            <div style={styles.successIconWrapper} aria-hidden="true">
              <span style={styles.successIcon}>✓</span>
            </div>
            <h1 style={styles.successHeading}>Password reset successfully</h1>
            <p style={styles.successNote}>
              Your password has been updated. You can now sign in with your new password.
            </p>
            <Link to="/login" style={styles.successBtn}>
              Go to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Reset password</h1>
        <p style={styles.subtext}>
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.formGroup}>
            <label htmlFor="reset-password" style={styles.label}>
              New password
            </label>
            <input
              id="reset-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur('password')}
              disabled={isFormDisabled}
              style={{
                ...styles.input,
                ...(passwordError ? styles.inputError : {}),
              }}
              aria-invalid={!!passwordError}
              aria-describedby={passwordError ? 'reset-password-error' : undefined}
            />
            {passwordError && (
              <span
                id="reset-password-error"
                role="alert"
                style={styles.fieldError}
              >
                {passwordError}
              </span>
            )}
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              style={styles.showPasswordBtn}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide password' : 'Show password'}
            </button>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="reset-confirm" style={styles.label}>
              Confirm new password
            </label>
            <input
              id="reset-confirm"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onBlur={() => handleBlur('confirm')}
              disabled={isFormDisabled}
              style={{
                ...styles.input,
                ...(confirmError ? styles.inputError : {}),
              }}
              aria-invalid={!!confirmError}
              aria-describedby={confirmError ? 'reset-confirm-error' : undefined}
            />
            {confirmError && (
              <span
                id="reset-confirm-error"
                role="alert"
                style={styles.fieldError}
              >
                {confirmError}
              </span>
            )}
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              style={styles.showPasswordBtn}
              aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirm ? 'Hide password' : 'Show password'}
            </button>
          </div>

          {errorBanner === 'invalid-token' && (
            <div role="alert" style={styles.errorBanner}>
              <span style={styles.errorIcon} aria-hidden="true">⚠</span>
              <span>
                This reset link is invalid or has already been used.{' '}
                <Link to="/forgot-password" style={{ color: '#f03e3e', fontWeight: '500' }}>
                  Request a new one
                </Link>
                .
              </span>
            </div>
          )}

          {errorBanner === 'expired-token' && (
            <div role="alert" style={styles.errorBanner}>
              <span style={styles.errorIcon} aria-hidden="true">⚠</span>
              <span>
                This reset link has expired.{' '}
                <Link to="/forgot-password" style={{ color: '#f03e3e', fontWeight: '500' }}>
                  Request a new one
                </Link>
                .
              </span>
            </div>
          )}

          {errorBanner === 'rate-limit' && (
            <div role="alert" style={styles.errorBanner}>
              <span style={styles.errorIcon} aria-hidden="true">⚠</span>
              <span>Too many attempts. Please wait before trying again.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isFormDisabled}
            style={{
              ...styles.submitBtn,
              ...(isFormDisabled ? styles.submitBtnDisabled : {}),
            }}
          >
            {submitting ? 'Resetting password…' : 'Reset password'}
          </button>
        </form>

        <hr style={styles.divider} />

        <p style={styles.bottomRow}>
          Remember your password?{' '}
          <Link to="/login" style={styles.link}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
