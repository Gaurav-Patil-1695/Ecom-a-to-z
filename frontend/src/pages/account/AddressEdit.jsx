import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    accentColor: '#4c6ef5',
    cursor: 'pointer',
  },
  checkboxLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#212529',
    cursor: 'pointer',
    userSelect: 'none',
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
    marginTop: '8px',
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
  maxLength,
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
        maxLength={maxLength}
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

const COUNTRIES = [
  'Australia',
  'Canada',
  'India',
  'United Kingdom',
  'United States',
];

export default function AddressEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  useEffect(() => {
    async function fetchAddress() {
      setLoading(true);
      setLoadError(null);
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`/api/users/me/addresses/${id}`, { headers });
        if (!res.ok) {
          if (res.status === 404) throw new Error('Address not found.');
          throw new Error('Failed to load address.');
        }
        const data = await res.json();
        const addr = data.data || data.address || data;
        setFirstName(addr.first_name || '');
        setLastName(addr.last_name || '');
        setPhone(addr.phone || '');
        setLine1(addr.line1 || '');
        setLine2(addr.line2 || '');
        setCity(addr.city || '');
        setState(addr.state || '');
        setPostalCode(addr.postal_code || '');
        setCountry(addr.country || '');
        setIsDefault(addr.is_default || false);
      } catch (err) {
        setLoadError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    }
    fetchAddress();
  }, [id]);

  function validate() {
    const errs = {};
    if (!firstName.trim()) errs.firstName = 'First name is required.';
    if (!lastName.trim()) errs.lastName = 'Last name is required.';
    if (!line1.trim()) errs.line1 = 'Address line 1 is required.';
    if (!city.trim()) errs.city = 'City is required.';
    if (!postalCode.trim()) errs.postalCode = 'Postal code is required.';
    if (!country.trim()) errs.country = 'Country is required.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitSuccess(null);
    setSubmitError(null);
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const payload = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
        line1: line1.trim(),
        line2: line2.trim(),
        city: city.trim(),
        state: state.trim(),
        postal_code: postalCode.trim(),
        country: country.trim(),
        is_default: isDefault,
      };
      const res = await fetch(`/api/users/me/addresses/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to update address. Please try again.');
      }
      setSubmitSuccess('Address updated successfully.');
      setTimeout(() => {
        navigate('/account/addresses');
      }, 1200);
    } catch (err) {
      setSubmitError(err.message || 'Failed to update address. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function clearFieldError(field) {
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <SkeletonLine width="80px" height="16px" style={{ marginBottom: '24px' }} />
          <SkeletonLine width="280px" height="40px" style={{ marginBottom: '8px' }} />
          <SkeletonLine width="320px" height="16px" style={{ marginBottom: '32px' }} />
          <div style={styles.card}>
            <SkeletonLine width="140px" height="12px" style={{ marginBottom: '20px' }} />
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
            <SkeletonLine width="100%" height="40px" style={{ borderRadius: '6px', marginBottom: '20px' }} />
            <SkeletonLine width="100%" height="40px" style={{ borderRadius: '6px', marginBottom: '20px' }} />
            <SkeletonLine width="100%" height="40px" style={{ borderRadius: '6px', marginBottom: '20px' }} />
            <div style={styles.row}>
              <div style={styles.rowItem}>
                <SkeletonLine width="60px" height="14px" style={{ marginBottom: '6px' }} />
                <SkeletonLine width="100%" height="40px" style={{ borderRadius: '6px' }} />
              </div>
              <div style={styles.rowItem}>
                <SkeletonLine width="80px" height="14px" style={{ marginBottom: '6px' }} />
                <SkeletonLine width="100%" height="40px" style={{ borderRadius: '6px' }} />
              </div>
            </div>
            <SkeletonLine width="100%" height="40px" style={{ borderRadius: '6px', marginTop: '20px', marginBottom: '20px' }} />
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <SkeletonLine width="140px" height="44px" style={{ borderRadius: '10px' }} />
              <SkeletonLine width="100px" height="44px" style={{ borderRadius: '10px' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <button
            style={styles.backLink}
            onClick={() => navigate('/account/addresses')}
            onMouseEnter={e => { e.currentTarget.style.color = '#3b5bdb'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#4c6ef5'; }}
            onFocus={e => { e.currentTarget.style.outline = '2px solid #4c6ef5'; e.currentTarget.style.outlineOffset = '2px'; }}
            onBlur={e => { e.currentTarget.style.outline = 'none'; }}
            aria-label="Back to addresses"
          >
            <img
              src="/src/assets/icons/chevron-left.svg"
              alt=""
              aria-hidden="true"
              style={{ width: '16px', height: '16px' }}
            />
            Back to addresses
          </button>
          <div style={styles.errorBanner} role="alert">
            <span style={{ fontSize: '18px' }}>⚠️</span>
            <span>{loadError}</span>
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

        <h1 style={styles.pageTitle}>Edit address</h1>
        <p style={styles.pageSub}>Update your saved delivery address.</p>

        {submitSuccess && (
          <div style={styles.successBanner} role="status">
            <span style={{ fontSize: '18px' }}>✓</span>
            <span>{submitSuccess}</span>
          </div>
        )}

        {submitError && (
          <div style={styles.errorBanner} role="alert">
            <span style={{ fontSize: '18px' }}>⚠️</span>
            <span>{submitError}</span>
          </div>
        )}

        <div style={styles.card}>
          <p style={styles.sectionLabel}>Address details</p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Name row */}
            <div style={styles.row}>
              <div style={styles.rowItem}>
                <FormField
                  id="firstName"
                  label="First name"
                  value={firstName}
                  onChange={e => { setFirstName(e.target.value); clearFieldError('firstName'); }}
                  error={fieldErrors.firstName}
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
                  onChange={e => { setLastName(e.target.value); clearFieldError('lastName'); }}
                  error={fieldErrors.lastName}
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
              value={phone}
              onChange={e => { setPhone(e.target.value); clearFieldError('phone'); }}
              error={fieldErrors.phone}
              autoComplete="tel"
              placeholder="+1 555 000 0000"
              hint="Optional — used for delivery updates."
            />

            {/* Address lines */}
            <FormField
              id="line1"
              label="Address line 1"
              value={line1}
              onChange={e => { setLine1(e.target.value); clearFieldError('line1'); }}
              error={fieldErrors.line1}
              autoComplete="address-line1"
              required
              placeholder="Street address, P.O. box"
            />

            <FormField
              id="line2"
              label="Address line 2"
              value={line2}
              onChange={e => { setLine2(e.target.value); clearFieldError('line2'); }}
              error={fieldErrors.line2}
              autoComplete="address-line2"
              placeholder="Apartment, suite, unit, floor (optional)"
            />

            {/* City and state row */}
            <div style={styles.row}>
              <div style={styles.rowItem}>
                <FormField
                  id="city"
                  label="City"
                  value={city}
                  onChange={e => { setCity(e.target.value); clearFieldError('city'); }}
                  error={fieldErrors.city}
                  autoComplete="address-level2"
                  required
                  placeholder="City"
                />
              </div>
              <div style={styles.rowItem}>
                <FormField
                  id="state"
                  label="State / Province"
                  value={state}
                  onChange={e => { setState(e.target.value); clearFieldError('state'); }}
                  error={fieldErrors.state}
                  autoComplete="address-level1"
                  placeholder="State or province"
                />
              </div>
            </div>

            {/* Postal code and country row */}
            <div style={styles.row}>
              <div style={styles.rowItem}>
                <FormField
                  id="postalCode"
                  label="Postal code"
                  value={postalCode}
                  onChange={e => { setPostalCode(e.target.value); clearFieldError('postalCode'); }}
                  error={fieldErrors.postalCode}
                  autoComplete="postal-code"
                  required
                  placeholder="Postal code"
                  maxLength={20}
                />
              </div>
              <div style={styles.rowItem}>
                <div style={styles.formGroup}>
                  <label htmlFor="country" style={styles.label}>
                    Country
                    <span aria-hidden="true" style={{ color: '#f03e3e', marginLeft: '2px' }}>*</span>
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={country}
                    onChange={e => { setCountry(e.target.value); clearFieldError('country'); }}
                    autoComplete="country-name"
                    aria-invalid={fieldErrors.country ? 'true' : 'false'}
                    aria-describedby={fieldErrors.country ? 'country-error' : undefined}
                    required
                    style={{
                      ...styles.input,
                      ...(fieldErrors.country ? styles.inputError : {}),
                      appearance: 'auto',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="">Select country…</option>
                    {COUNTRIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {fieldErrors.country && (
                    <span id="country-error" role="alert" style={styles.fieldError}>
                      {fieldErrors.country}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Default checkbox */}
            <div style={styles.checkboxGroup}>
              <input
                id="isDefault"
                name="isDefault"
                type="checkbox"
                checked={isDefault}
                onChange={e => setIsDefault(e.target.checked)}
                style={styles.checkbox}
              />
              <label htmlFor="isDefault" style={styles.checkboxLabel}>
                Set as default address
              </label>
            </div>

            {/* Action buttons */}
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
                {submitting ? 'Saving…' : 'Save changes'}
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
