import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
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
  forgotLink: {
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
    color: '#4c6ef5',
    textDecoration: 'none',
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
  registerRow: {
    textAlign: 'center',
    fontSize: '14px',
    lineHeight: '20px',
    color: '#495057',
  },
  registerLink: {
    color: '#4c6ef5',
    fontWeight: '500',
    textDecoration: 'none',
  },
};

function validateEmail(value) {
  if (!value) return 'Enter a valid email address.';
  if (value.length > 320) return 'Enter a valid email address.';
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(value)) return 'Enter a valid email address.';
  return null;
}

function validatePassword(value) {
  if (!value || value.length < 1) return 'Password is required.';
  return null;
}

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorBanner, setErrorBanner] = useState(null);
  const [touched, setTouched] = useState({ email: false, password: false });

  const emailError = touched.email ? validateEmail(email) : null;
  const passwordError = touched.password ? validatePassword(password) : null;

  const handleEmailBlur = () => setTouched((t) => ({ ...t, email: true }));
  const handlePasswordBlur = () => setTouched((t) => ({ ...t, password: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    if (eErr || pErr) return;

    setSubmitting(true);
    setErrorBanner(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.status === 429) {
        setErrorBanner('rate-limit');
        return;
      }

      if (res.status === 401 || res.status === 400) {
        setErrorBanner('credentials');
        return;
      }

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json();
      if (data && data.token) {
        localStorage.setItem('authToken', data.token);
      }

      navigate('/');
    } catch {
      // Toast for network/API errors — preserve form data
      if (window.__showToast) {
        window.__showToast('Something went wrong. Please try again.', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isFormDisabled = submitting;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Welcome back</h1>
        <p style={styles.subtext}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.registerLink}>
            Register
          </Link>
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.formGroup}>
            <label htmlFor="login-email" style={styles.label}>
              Email address
            </label>
            <input
              id="login-email"
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
              aria-describedby={emailError ? 'login-email-error' : undefined}
            />
            {emailError && (
              <span
                id="login-email-error"
                role="alert"
                style={{
                  display: 'block',
                  marginTop: '4px',
                  fontSize: '12px',
                  lineHeight: '16px',
                  color: '#f03e3e',
                }}
              >
                {emailError}
              </span>
            )}
          </div>

          <div style={styles.formGroup}>
            <div style={styles.labelRow}>
              <label htmlFor="login-password" style={{ ...styles.label, marginBottom: 0 }}>
                Password
              </label>
              <Link to="/forgot-password" style={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={handlePasswordBlur}
              disabled={isFormDisabled}
              style={{
                ...styles.input,
                ...(passwordError ? styles.inputError : {}),
                marginTop: '6px',
              }}
              aria-invalid={!!passwordError}
              aria-describedby={passwordError ? 'login-password-error' : undefined}
            />
            {passwordError && (
              <span
                id="login-password-error"
                role="alert"
                style={{
                  display: 'block',
                  marginTop: '4px',
                  fontSize: '12px',
                  lineHeight: '16px',
                  color: '#f03e3e',
                }}
              >
                {passwordError}
              </span>
            )}
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px 0',
                marginTop: '4px',
                fontSize: '12px',
                lineHeight: '16px',
                color: '#4c6ef5',
                cursor: 'pointer',
                fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide password' : 'Show password'}
            </button>
          </div>

          {errorBanner === 'credentials' && (
            <div role="alert" style={styles.errorBanner}>
              <span style={styles.errorIcon} aria-hidden="true">⚠</span>
              <span>Incorrect email or password.</span>
            </div>
          )}
          {errorBanner === 'rate-limit' && (
            <div role="alert" style={styles.errorBanner}>
              <span style={styles.errorIcon} aria-hidden="true">⚠</span>
              <span>Too many login attempts. Please try again later.</span>
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
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <hr style={styles.divider} />

        <p style={styles.registerRow}>
          New here?{' '}
          <Link
            to="/register"
            style={styles.registerLink}
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
