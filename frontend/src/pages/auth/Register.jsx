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
  loginRow: {
    textAlign: 'center',
    fontSize: '14px',
    lineHeight: '20px',
    color: '#495057',
  },
  loginLink: {
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
  optionalHint: {
    fontSize: '12px',
    color: '#495057',
    marginLeft: '4px',
  },
};

function validateFullName(value) {
  if (value && value.length > 255) return 'Full name must not exceed 255 characters.';
  return null;
}

function validateEmail(value) {
  if (!value) return 'Enter a valid email address.';
  if (value.length > 320) return 'Enter a valid email address.';
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(value)) return 'Enter a valid email address.';
  return null;
}

function validatePhone(value) {
  if (!value) return null;
  if (value.length > 30) return 'Enter a valid phone number.';
  return null;
}

function validatePassword(value) {
  if (!value || value.length < 8) return 'Password must be at least 8 characters.';
  return null;
}

function validateConfirm(value, password) {
  if (value !== password) return 'Passwords do not match.';
  return null;
}

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorBanner, setErrorBanner] = useState(null);
  const [touched, setTouched] = useState({
    full_name: false,
    email: false,
    phone: false,
    password: false,
    confirm: false,
  });

  const fullNameError = touched.full_name ? validateFullName(fullName) : null;
  const emailError = touched.email ? validateEmail(email) : null;
  const phoneError = touched.phone ? validatePhone(phone) : null;
  const passwordError = touched.password ? validatePassword(password) : null;
  const confirmError = touched.confirm ? validateConfirm(confirm, password) : null;

  const handleBlur = (field) => setTouched((t) => ({ ...t, [field]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      full_name: true,
      email: true,
      phone: true,
      password: true,
      confirm: true,
    });

    const fnErr = validateFullName(fullName);
    const eErr = validateEmail(email);
    const phErr = validatePhone(phone);
    const pErr = validatePassword(password);
    const cErr = validateConfirm(confirm, password);

    if (fnErr || eErr || phErr || pErr || cErr) return;

    setSubmitting(true);
    setErrorBanner(null);

    try {
      const body = { email, password };
      if (fullName) body.full_name = fullName;
      if (phone) body.phone = phone;

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.status === 429) {
        setErrorBanner('rate-limit');
        return;
      }

      if (res.status === 409) {
        setErrorBanner('email-exists');
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
        <h1 style={styles.heading}>Create your account</h1>
        <p style={styles.subtext}>
          Already have an account?{' '}
          <Link to="/login" style={styles.loginLink}>
            Log in
          </Link>
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.formGroup}>
            <label htmlFor="register-full-name" style={styles.label}>
              Full name
              <span style={styles.optionalHint}>(optional)</span>
            </label>
            <input
              id="register-full-name"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onBlur={() => handleBlur('full_name')}
              disabled={isFormDisabled}
              style={{
                ...styles.input,
                ...(fullNameError ? styles.inputError : {}),
              }}
              aria-invalid={!!fullNameError}
              aria-describedby={fullNameError ? 'register-full-name-error' : undefined}
            />
            {fullNameError && (
              <span
                id="register-full-name-error"
                role="alert"
                style={styles.fieldError}
              >
                {fullNameError}
              </span>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="register-email" style={styles.label}>
              Email address
            </label>
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur('email')}
              disabled={isFormDisabled}
              style={{
                ...styles.input,
                ...(emailError || errorBanner === 'email-exists' ? styles.inputError : {}),
              }}
              aria-invalid={!!(emailError || errorBanner === 'email-exists')}
              aria-describedby={
                emailError
                  ? 'register-email-error'
                  : errorBanner === 'email-exists'
                  ? 'register-email-exists-error'
                  : undefined
              }
            />
            {emailError && (
              <span
                id="register-email-error"
                role="alert"
                style={styles.fieldError}
              >
                {emailError}
              </span>
            )}
            {!emailError && errorBanner === 'email-exists' && (
              <span
                id="register-email-exists-error"
                role="alert"
                style={styles.fieldError}
              >
                An account with this email already exists.{' '}
                <Link to="/login" style={{ color: '#f03e3e', fontWeight: '500' }}>
                  Log in instead
                </Link>
              </span>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="register-phone" style={styles.label}>
              Phone number
              <span style={styles.optionalHint}>(optional)</span>
            </label>
            <input
              id="register-phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={() => handleBlur('phone')}
              disabled={isFormDisabled}
              style={{
                ...styles.input,
                ...(phoneError ? styles.inputError : {}),
              }}
              aria-invalid={!!phoneError}
              aria-describedby={phoneError ? 'register-phone-error' : undefined}
            />
            {phoneError && (
              <span
                id="register-phone-error"
                role="alert"
                style={styles.fieldError}
              >
                {phoneError}
              </span>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="register-password" style={styles.label}>
              Password
            </label>
            <input
              id="register-password"
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
              aria-describedby={passwordError ? 'register-password-error' : undefined}
            />
            {passwordError && (
              <span
                id="register-password-error"
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
            <label htmlFor="register-confirm" style={styles.label}>
              Confirm password
            </label>
            <input
              id="register-confirm"
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
              aria-describedby={confirmError ? 'register-confirm-error' : undefined}
            />
            {confirmError && (
              <span
                id="register-confirm-error"
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
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <hr style={styles.divider} />

        <p style={styles.loginRow}>
          Already have an account?{' '}
          <Link to="/login" style={styles.loginLink}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
