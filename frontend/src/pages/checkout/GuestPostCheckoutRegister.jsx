import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '@/api';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#212529',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '48px 16px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '40px',
    boxShadow: '0 1px 4px rgba(33,37,41,0.08)',
    width: '100%',
    maxWidth: '480px',
  },
  logoWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  logo: {
    height: '40px',
    width: 'auto',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '32px',
    color: '#212529',
    letterSpacing: '-0.01em',
    marginBottom: '8px',
    textAlign: 'center',
  },
  subheading: {
    fontSize: '14px',
    lineHeight: '20px',
    color: '#495057',
    textAlign: 'center',
    marginBottom: '28px',
  },
  benefitsList: {
    listStyle: 'none',
    padding: '0',
    margin: '0 0 28px 0',
    backgroundColor: '#e8ecfd',
    borderRadius: '6px',
    padding: '16px 20px',
  },
  benefitItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    color: '#212529',
    lineHeight: '20px',
    marginBottom: '10px',
  },
  benefitItemLast: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    color: '#212529',
    lineHeight: '20px',
    marginBottom: '0',
  },
  benefitIcon: {
    width: '16px',
    height: '16px',
    flexShrink: 0,
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    marginBottom: '6px',
  },
  input: (hasError) => ({
    width: '100%',
    padding: '10px 12px',
    fontSize: '16px',
    lineHeight: '24px',
    color: '#212529',
    backgroundColor: '#ffffff',
    border: `1px solid ${hasError ? '#f03e3e' : '#868e96'}`,
    borderRadius: '6px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    transition: 'border-color 0.15s',
  }),
  errorText: {
    fontSize: '12px',
    color: '#f03e3e',
    marginTop: '4px',
    lineHeight: '16px',
  },
  passwordHint: {
    fontSize: '12px',
    color: '#495057',
    marginTop: '4px',
    lineHeight: '16px',
  },
  alertBox: (type) => ({
    padding: '12px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    lineHeight: '20px',
    marginBottom: '16px',
    backgroundColor:
      type === 'error' ? '#ffe3e3' : type === 'success' ? '#d3f9d8' : '#fff4e6',
    color:
      type === 'error' ? '#f03e3e' : type === 'success' ? '#37b24d' : '#fd7e14',
  }),
  btnPrimary: {
    display: 'block',
    width: '100%',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#4c6ef5',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    minHeight: '44px',
    lineHeight: '24px',
    transition: 'background-color 0.15s',
    textAlign: 'center',
    marginBottom: '12px',
    boxSizing: 'border-box',
  },
  btnSecondary: {
    display: 'block',
    width: '100%',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#4c6ef5',
    backgroundColor: 'transparent',
    border: '1px solid #4c6ef5',
    borderRadius: '10px',
    cursor: 'pointer',
    minHeight: '44px',
    lineHeight: '24px',
    transition: 'background-color 0.15s',
    textAlign: 'center',
    boxSizing: 'border-box',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '20px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: '#868e96',
  },
  dividerText: {
    fontSize: '14px',
    color: '#495057',
    whiteSpace: 'nowrap',
  },
  successCard: {
    textAlign: 'center',
    padding: '24px 0 8px',
  },
  successIconWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  successIconCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '9999px',
    backgroundColor: '#d3f9d8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIcon: {
    width: '32px',
    height: '32px',
  },
  successHeading: {
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '28px',
    color: '#212529',
    marginBottom: '8px',
  },
  successText: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: '20px',
    marginBottom: '24px',
  },
  footerText: {
    fontSize: '14px',
    color: '#495057',
    textAlign: 'center',
    marginTop: '20px',
    lineHeight: '20px',
  },
  footerLink: {
    color: '#4c6ef5',
    fontWeight: '600',
    textDecoration: 'none',
  },
  orderIdText: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '14px',
    color: '#212529',
    backgroundColor: '#e8ecfd',
    borderRadius: '3px',
    padding: '2px 8px',
    display: 'inline-block',
    letterSpacing: '0.04em',
    marginBottom: '16px',
  },
};

const BENEFITS = [
  'Track your orders and view order history',
  'Save addresses for faster checkout',
  'Receive exclusive offers and promotions',
  'Manage returns and refunds easily',
];

const INITIAL_FORM = {
  password: '',
  confirmPassword: '',
};

export default function GuestPostCheckoutRegister() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || '';
  const emailParam = searchParams.get('email') || '';

  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    setSubmitError('');
  }

  function validate() {
    const errors = {};
    if (!form.password) {
      errors.password = 'Password is required.';
    } else if (form.password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    }
    if (!form.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (form.password && form.confirmPassword !== form.password) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError('');

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/auth/guest-register', {
        password: form.password,
        orderId: orderId || undefined,
        email: emailParam || undefined,
      });
      setRegistered(true);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Registration failed. Please try again.';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  function handleSkip() {
    if (orderId) {
      navigate(`/checkout/confirmation?orderId=${orderId}`);
    } else {
      navigate('/');
    }
  }

  function handleContinueAfterRegister() {
    navigate('/');
  }

  if (registered) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.logoWrap}>
            <img src="/src/assets/images/logo.svg" alt="Logo" style={styles.logo} />
          </div>
          <div style={styles.successCard}>
            <div style={styles.successIconWrap}>
              <div style={styles.successIconCircle}>
                <img
                  src="/src/assets/icons/check.svg"
                  alt="Success"
                  style={styles.successIcon}
                />
              </div>
            </div>
            <h1 style={styles.successHeading}>Account Created!</h1>
            {orderId && (
              <div>
                <p style={{ ...styles.successText, marginBottom: '8px' }}>Your account is linked to order</p>
                <div style={styles.orderIdText}>#{orderId}</div>
              </div>
            )}
            <p style={styles.successText}>
              You can now track your orders, manage addresses, and enjoy a faster checkout
              experience.
            </p>
            <button
              type="button"
              style={styles.btnPrimary}
              onClick={handleContinueAfterRegister}
            >
              Continue Shopping
            </button>
            {orderId && (
              <Link
                to={`/orders/${orderId}`}
                style={{ ...styles.btnSecondary, display: 'block', textDecoration: 'none', lineHeight: '20px', paddingTop: '12px', paddingBottom: '12px' }}
              >
                View My Order
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <img src="/src/assets/images/logo.svg" alt="Logo" style={styles.logo} />
        </div>

        <h1 style={styles.heading}>Save your order details</h1>
        <p style={styles.subheading}>
          {emailParam
            ? `Create an account for ${emailParam} to track orders and checkout faster next time.`
            : 'Create an account to track your order and enjoy a faster checkout experience.'}
        </p>

        {/* Benefits */}
        <ul style={styles.benefitsList} aria-label="Account benefits">
          {BENEFITS.map((benefit, index) => (
            <li
              key={benefit}
              style={index === BENEFITS.length - 1 ? styles.benefitItemLast : styles.benefitItem}
            >
              <img
                src="/src/assets/icons/check.svg"
                alt=""
                style={styles.benefitIcon}
                aria-hidden="true"
              />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        {submitError && (
          <div style={styles.alertBox('error')} role="alert">
            {submitError}
          </div>
        )}

        <form noValidate onSubmit={handleSubmit} aria-label="Create account form">
          {/* Email display (read-only if provided) */}
          {emailParam && (
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                style={{
                  ...styles.input(false),
                  backgroundColor: '#e9ecef',
                  color: '#495057',
                  cursor: 'not-allowed',
                }}
                value={emailParam}
                readOnly
                aria-readonly="true"
              />
            </div>
          )}

          {/* Password */}
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Password *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              style={styles.input(!!fieldErrors.password)}
              value={form.password}
              onChange={handleChange}
              aria-invalid={!!fieldErrors.password}
              aria-describedby={
                fieldErrors.password
                  ? 'password-error'
                  : 'password-hint'
              }
            />
            {fieldErrors.password ? (
              <p id="password-error" style={styles.errorText}>
                {fieldErrors.password}
              </p>
            ) : (
              <p id="password-hint" style={styles.passwordHint}>
                Minimum 8 characters.
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div style={styles.formGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>
              Confirm Password *
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              style={styles.input(!!fieldErrors.confirmPassword)}
              value={form.confirmPassword}
              onChange={handleChange}
              aria-invalid={!!fieldErrors.confirmPassword}
              aria-describedby={
                fieldErrors.confirmPassword ? 'confirmPassword-error' : undefined
              }
            />
            {fieldErrors.confirmPassword && (
              <p id="confirmPassword-error" style={styles.errorText}>
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            style={{
              ...styles.btnPrimary,
              opacity: submitting ? 0.7 : 1,
              cursor: submitting ? 'not-allowed' : 'pointer',
              marginTop: '8px',
            }}
            disabled={submitting}
            aria-busy={submitting}
          >
            {submitting ? 'Creating Account…' : 'Create Account'}
          </button>
        </form>

        <div style={styles.divider} aria-hidden="true">
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>or</span>
          <div style={styles.dividerLine} />
        </div>

        <button
          type="button"
          style={styles.btnSecondary}
          onClick={handleSkip}
        >
          No Thanks, Continue as Guest
        </button>

        {orderId && (
          <p style={styles.footerText}>
            Want to view your order?{' '}
            <Link to={`/orders/${orderId}`} style={styles.footerLink}>
              View Order #{orderId}
            </Link>
          </p>
        )}

        <p style={styles.footerText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.footerLink}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
