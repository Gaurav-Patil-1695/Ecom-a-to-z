import { useState } from 'react';
import { Link } from 'react-router-dom';

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
};

function validateEmail(value) {
  if (!value) return 'Enter a valid email address.';
  if (value.length > 320) return 'Enter a valid email address.';
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(value)) return 'Enter a valid email address.';
  return null;
}

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState({ email: false });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const emailError = touched.email ? validateEmail(email) : null;

  const handleEmailBlur = () => setTouched((t) => ({ ...t, email: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true });
    const eErr = validateEmail(email);
    if (eErr) return;

    setSubmitting(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      // Always show success to prevent email enumeration
      if (res.ok || res.status === 404) {
        setSubmitted(true);
        return;
      }

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      setSubmitted(true);
    } catch {
      // Show success anyway to prevent enumeration; surface network errors as toast
      if (window.__showToast) {
        window.__showToast('Something went wrong. Please try again.', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isFormDisabled = submitting;

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.successPanel}>
            <div style={styles.successIconWrapper} aria-hidden="true">
              <span style={styles.successIcon}>✓</span>
            </div>
            <h1 style={styles.successHeading}>Check your inbox</h1>
            <p style={styles.successNote}>
              If that address is registered, a reset link is on its way. Check your email and
              follow the link to reset your password.
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
        <h1 style={styles.heading}>Forgot password</h1>
        <p style={styles.subtext}>
          Enter the email address associated with your account and we'll send you a link to reset
          your password.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.formGroup}>
            <label htmlFor="forgot-email" style={styles.label}>
              Email address
            </label>
            <input
              id="forgot-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleEmailBlur}
              disabled={isFormDisabled}
              style={{
                ...styles.input,
                ...(emailError ? styles.inputError : {}),
              }}
              aria-invalid={!!emailError}
              aria-describedby={emailError ? 'forgot-email-error' : undefined}
            />
            {emailError && (
              <span
                id="forgot-email-error"
                role="alert"
                style={styles.fieldError}
              >
                {emailError}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isFormDisabled}
            style={{
              ...styles.submitBtn,
              ...(isFormDisabled ? styles.submitBtnDisabled : {}),
            }}
          >
            {submitting ? 'Sending…' : 'Send reset link'}
          </button>
        </form>

        <hr style={styles.divider} />

        <p style={styles.bottomRow}>
          Remember your password?{' '}
          <Link to="/login" style={styles.link}>
            Sign in
          </Link>
        </p>
        <p style={{ ...styles.bottomRow, marginTop: '8px' }}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
