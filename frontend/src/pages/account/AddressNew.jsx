import { useState } from 'react';
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
  hint: {
    fontSize: '12px',
    color: '#495057',
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
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '24px',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    accentColor: '#4c6ef5',
    cursor: 'pointer',
    flexShrink: 0,
  },
  checkboxLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#212529',
    cursor: 'pointer',
    lineHeight: '1.5',
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
};

const INITIAL_FORM = {
  label: '',
  first_name: '',
  last_name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postal_code: '',
  country: '',
  is_default: false,
};

function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  hint,
  autoComplete,
  required,
  placeholder,
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={styles.formGroup}>
      <label htmlFor={id} style={styles.label}>
        {label}
        {required && (
          <span aria-hidden="true" style={{ color: '#f03e3e', marginLeft: '2px' }}>*</span>
        )}
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
          ...(focused
            ? { borderColor: '#4c6ef5', boxShadow: '0 0 0 3px rgba(76,110,245,0.15)' }
            : {}),
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

function validate(form) {
  const errs = {};
  if (!form.first_name.trim()) errs.first_name = 'First name is required.';
  if (!form.last_name.trim()) errs.last_name = 'Last name is required.';
  if (!form.line1.trim()) errs.line1 = 'Address line 1 is required.';
  if (!form.city.trim()) errs.city = 'City is required.';
  if (!form.state.trim()) errs.state = 'State / province is required.';
  if (!form.postal_code.trim()) errs.postal_code = 'Postal code is required.';
  if (!form.country.trim()) errs.country = 'Country is required.';
  return errs;
}

export default function AddressNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  function handleChange(field) {
    return function (e) {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setForm(prev => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError(null);
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const payload = {
        label: form.label.trim() || undefined,
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        phone: form.phone.trim() || undefined,
        line1: form.line1.trim(),
        line2: form.line2.trim() || undefined,
        city: form.city.trim(),
        state: form.state.trim(),
        postal_code: form.postal_code.trim(),
        country: form.country.trim(),
        is_default: form.is_default,
      };
      const res = await fetch('/api/users/me/addresses', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to save address. Please try again.');
      }
      navigate('/account/addresses');
    } catch (err) {
      setSubmitError(err.message || 'Failed to save address. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Back link */}
        <button
          style={styles.backLink}
          onClick={() => navigate('/account/addresses')}
          onMouseEnter={e => { e.currentTarget.style.color = '#3b5bdb'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#4c6ef5'; }}
          onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
          onBlur={e => { e.currentTarget.style.outline = 'none'; }}
          aria-label="Back to saved addresses"
        >
          <img
            src="/src/assets/icons/chevron-left.svg"
            alt=""
            aria-hidden="true"
            style={{ width: '16px', height: '16px' }}
          />
          Back to addresses
        </button>

        <h1 style={styles.pageTitle}>Add new address</h1>
        <p style={styles.pageSub}>Enter the details for your new delivery address.</p>

        {submitError && (
          <div style={styles.errorBanner} role="alert">
            <span style={{ fontSize: '18px' }}>⚠️</span>
            <span>{submitError}</span>
          </div>
        )}

        <div style={styles.card}>
          <p style={styles.sectionLabel}>Address details</p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Label */}
            <FormField
              id="label"
              label="Address label"
              value={form.label}
              onChange={handleChange('label')}
              error={errors.label}
              hint="e.g. Home, Work, Parents — optional"
              autoComplete="off"
              placeholder="e.g. Home"
            />

            {/* Name row */}
            <div style={styles.row}>
              <div style={styles.rowItem}>
                <FormField
                  id="first_name"
                  label="First name"
                  value={form.first_name}
                  onChange={handleChange('first_name')}
                  error={errors.first_name}
                  autoComplete="given-name"
                  required
                  placeholder="First name"
                />
              </div>
              <div style={styles.rowItem}>
                <FormField
                  id="last_name"
                  label="Last name"
                  value={form.last_name}
                  onChange={handleChange('last_name')}
                  error={errors.last_name}
                  autoComplete="family-name"
                  required
                  placeholder="Last name"
                />
              </div>
            </div>

            {/* Phone */}
            <FormField
              id="phone"
              label="Phone number"
              type="tel"
              value={form.phone}
              onChange={handleChange('phone')}
              error={errors.phone}
              hint="Optional — used for delivery contact"
              autoComplete="tel"
              placeholder="+1 555 000 0000"
            />

            {/* Line 1 */}
            <FormField
              id="line1"
              label="Address line 1"
              value={form.line1}
              onChange={handleChange('line1')}
              error={errors.line1}
              autoComplete="address-line1"
              required
              placeholder="Street address, P.O. box"
            />

            {/* Line 2 */}
            <FormField
              id="line2"
              label="Address line 2"
              value={form.line2}
              onChange={handleChange('line2')}
              error={errors.line2}
              hint="Apartment, suite, unit, building — optional"
              autoComplete="address-line2"
              placeholder="Apt, suite, unit (optional)"
            />

            {/* City + State row */}
            <div style={styles.row}>
              <div style={styles.rowItem}>
                <FormField
                  id="city"
                  label="City"
                  value={form.city}
                  onChange={handleChange('city')}
                  error={errors.city}
                  autoComplete="address-level2"
                  required
                  placeholder="City"
                />
              </div>
              <div style={styles.rowItem}>
                <FormField
                  id="state"
                  label="State / Province"
                  value={form.state}
                  onChange={handleChange('state')}
                  error={errors.state}
                  autoComplete="address-level1"
                  required
                  placeholder="State / Province"
                />
              </div>
            </div>

            {/* Postal code + Country row */}
            <div style={styles.row}>
              <div style={styles.rowItem}>
                <FormField
                  id="postal_code"
                  label="Postal code"
                  value={form.postal_code}
                  onChange={handleChange('postal_code')}
                  error={errors.postal_code}
                  autoComplete="postal-code"
                  required
                  placeholder="Postal code"
                />
              </div>
              <div style={styles.rowItem}>
                <FormField
                  id="country"
                  label="Country"
                  value={form.country}
                  onChange={handleChange('country')}
                  error={errors.country}
                  autoComplete="country-name"
                  required
                  placeholder="Country"
                />
              </div>
            </div>

            {/* Default checkbox */}
            <div style={styles.checkboxGroup}>
              <input
                id="is_default"
                name="is_default"
                type="checkbox"
                checked={form.is_default}
                onChange={handleChange('is_default')}
                style={styles.checkbox}
              />
              <label htmlFor="is_default" style={styles.checkboxLabel}>
                Set as default address
              </label>
            </div>

            {/* Actions */}
            <div style={styles.btnRow}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  ...styles.btnPrimary,
                  ...(submitting ? { backgroundColor: '#adb5bd', cursor: 'not-allowed' } : {}),
                }}
                onMouseEnter={e => { if (!submitting) e.currentTarget.style.backgroundColor = '#3b5bdb'; }}
                onMouseLeave={e => { if (!submitting) e.currentTarget.style.backgroundColor = '#4c6ef5'; }}
                onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
                onBlur={e => { e.currentTarget.style.outline = 'none'; }}
              >
                {submitting ? 'Saving…' : 'Save address'}
              </button>
              <button
                type="button"
                disabled={submitting}
                style={{
                  ...styles.btnGhost,
                  ...(submitting ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
                }}
                onClick={() => navigate('/account/addresses')}
                onMouseEnter={e => { if (!submitting) e.currentTarget.style.backgroundColor = '#f1f3ff'; }}
                onMouseLeave={e => { if (!submitting) e.currentTarget.style.backgroundColor = 'transparent'; }}
                onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
                onBlur={e => { e.currentTarget.style.outline = 'none'; }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
