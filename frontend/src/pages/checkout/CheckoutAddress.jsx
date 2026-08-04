import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#212529',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 16px',
  },
  stepper: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '32px',
    gap: '8px',
  },
  stepItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  stepCircle: (active, done) => ({
    width: '28px',
    height: '28px',
    borderRadius: '9999px',
    backgroundColor: done ? '#37b24d' : active ? '#4c6ef5' : '#e9ecef',
    color: done || active ? '#ffffff' : '#adb5bd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '600',
    flexShrink: 0,
  }),
  stepLabel: (active) => ({
    fontSize: '14px',
    fontWeight: active ? '600' : '400',
    color: active ? '#212529' : '#495057',
  }),
  stepDivider: {
    flex: 1,
    height: '1px',
    backgroundColor: '#868e96',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 360px',
    gap: '24px',
    alignItems: 'start',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 4px rgba(33,37,41,0.08)',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '28px',
    color: '#212529',
    marginBottom: '20px',
  },
  savedAddressesTitle: {
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '24px',
    color: '#212529',
    marginBottom: '12px',
  },
  addressCard: (selected) => ({
    border: `2px solid ${selected ? '#4c6ef5' : '#868e96'}`,
    borderRadius: '10px',
    padding: '16px',
    marginBottom: '12px',
    cursor: 'pointer',
    backgroundColor: selected ? '#e8ecfd' : '#ffffff',
    transition: 'border-color 0.15s, background-color 0.15s',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  }),
  radio: {
    marginTop: '2px',
    accentColor: '#4c6ef5',
    width: '16px',
    height: '16px',
    flexShrink: 0,
  },
  addressInfo: {
    flex: 1,
  },
  addressName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '2px',
  },
  addressLine: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: '20px',
  },
  dividerText: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#495057',
    margin: '20px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: '#868e96',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  formFieldFull: {
    gridColumn: '1 / -1',
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
  pinRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-start',
  },
  pinInputWrap: {
    flex: 1,
  },
  checkBtn: {
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#4c6ef5',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    minHeight: '44px',
    lineHeight: '20px',
    flexShrink: 0,
    transition: 'background-color 0.15s',
  },
  serviceabilityBadge: (serviceable) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    fontWeight: '600',
    padding: '2px 8px',
    borderRadius: '3px',
    backgroundColor: serviceable ? '#d3f9d8' : '#ffe3e3',
    color: serviceable ? '#37b24d' : '#f03e3e',
    marginTop: '6px',
  }),
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
    justifyContent: 'flex-end',
  },
  btnPrimary: {
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
  },
  btnSecondary: {
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
  },
  summarySidebar: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 4px rgba(33,37,41,0.08)',
  },
  summaryTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '16px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
    color: '#495057',
    marginBottom: '8px',
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    borderTop: '1px solid #868e96',
    paddingTop: '12px',
    marginTop: '4px',
  },
  alertBox: (type) => ({
    padding: '12px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    lineHeight: '20px',
    marginBottom: '16px',
    backgroundColor: type === 'error' ? '#ffe3e3' : '#d3f9d8',
    color: type === 'error' ? '#f03e3e' : '#37b24d',
  }),
  loadingText: {
    color: '#495057',
    fontSize: '14px',
  },
  mapPinIcon: {
    width: '16px',
    height: '16px',
    marginRight: '4px',
    verticalAlign: 'middle',
  },
};

const STEPS = [
  { label: 'Address', path: '/checkout/address' },
  { label: 'Payment', path: '/checkout/payment' },
  { label: 'Review', path: '/checkout/review' },
];

const INITIAL_FORM = {
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pinCode: '',
  country: 'India',
};

const FIELD_LABELS = {
  fullName: 'Full Name',
  phone: 'Phone Number',
  addressLine1: 'Address Line 1',
  addressLine2: 'Address Line 2',
  city: 'City',
  state: 'State',
  pinCode: 'PIN Code',
  country: 'Country',
};

export default function CheckoutAddress() {
  const navigate = useNavigate();

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);

  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});

  const [pinChecking, setPinChecking] = useState(false);
  const [pinServiceable, setPinServiceable] = useState(null);
  const [pinError, setPinError] = useState('');

  const [cartSummary, setCartSummary] = useState(null);
  const [loadingCart, setLoadingCart] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    fetchAddresses();
    fetchCartSummary();
  }, []);

  async function fetchAddresses() {
    setLoadingAddresses(true);
    try {
      const response = await api.get('/users/me/addresses');
      const data = response.data;
      const list = Array.isArray(data) ? data : (data.addresses || data.data || []);
      setSavedAddresses(list);
      if (list.length === 0) {
        setUseNewAddress(true);
      } else {
        setSelectedAddressId(list[0].id);
      }
    } catch {
      setUseNewAddress(true);
    } finally {
      setLoadingAddresses(false);
    }
  }

  async function fetchCartSummary() {
    setLoadingCart(true);
    try {
      const cartId = localStorage.getItem('cartId');
      if (!cartId) {
        setLoadingCart(false);
        return;
      }
      const response = await api.get(`/carts/${cartId}`);
      setCartSummary(response.data);
    } catch {
      // ignore
    } finally {
      setLoadingCart(false);
    }
  }

  function handleSelectSaved(id) {
    setSelectedAddressId(id);
    setUseNewAddress(false);
    setPinServiceable(null);
    setPinError('');
  }

  function handleUseNew() {
    setSelectedAddressId(null);
    setUseNewAddress(true);
    setPinServiceable(null);
    setPinError('');
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    if (name === 'pinCode') {
      setPinServiceable(null);
      setPinError('');
    }
  }

  async function handleCheckServiceability() {
    const pin = (useNewAddress ? form.pinCode : getSelectedAddress()?.pinCode) || form.pinCode;
    if (!pin || !/^\d{6}$/.test(pin)) {
      setPinError('Please enter a valid 6-digit PIN code.');
      return;
    }
    setPinChecking(true);
    setPinError('');
    setPinServiceable(null);
    try {
      const response = await api.get('/serviceability', { params: { pinCode: pin } });
      const data = response.data;
      setPinServiceable(data.serviceable === true || data.isServiceable === true);
    } catch {
      setPinError('Unable to check serviceability. Please try again.');
    } finally {
      setPinChecking(false);
    }
  }

  function getSelectedAddress() {
    return savedAddresses.find((a) => a.id === selectedAddressId) || null;
  }

  function validateNewAddressForm() {
    const errors = {};
    if (!form.fullName.trim()) errors.fullName = 'Full name is required.';
    if (!form.phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) {
      errors.phone = 'Enter a valid 10-digit phone number.';
    }
    if (!form.addressLine1.trim()) errors.addressLine1 = 'Address line 1 is required.';
    if (!form.city.trim()) errors.city = 'City is required.';
    if (!form.state.trim()) errors.state = 'State is required.';
    if (!form.pinCode.trim()) {
      errors.pinCode = 'PIN code is required.';
    } else if (!/^\d{6}$/.test(form.pinCode)) {
      errors.pinCode = 'Enter a valid 6-digit PIN code.';
    }
    return errors;
  }

  async function handleContinue() {
    setSubmitError('');

    if (useNewAddress) {
      const errors = validateNewAddressForm();
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }
      if (pinServiceable === false) {
        setSubmitError('Delivery is not available at the entered PIN code.');
        return;
      }
      if (pinServiceable === null) {
        setSubmitError('Please check PIN serviceability before continuing.');
        return;
      }
    } else {
      if (!selectedAddressId) {
        setSubmitError('Please select a delivery address.');
        return;
      }
      const addr = getSelectedAddress();
      if (pinServiceable === null && addr) {
        setSubmitError('Please check PIN serviceability before continuing.');
        return;
      }
      if (pinServiceable === false) {
        setSubmitError('Delivery is not available at the selected address PIN code.');
        return;
      }
    }

    setSubmitting(true);
    try {
      let payload;
      if (useNewAddress) {
        payload = {
          fullName: form.fullName,
          phone: form.phone,
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2 || undefined,
          city: form.city,
          state: form.state,
          pinCode: form.pinCode,
          country: form.country,
        };
      } else {
        const addr = getSelectedAddress();
        payload = {
          addressId: addr.id,
        };
      }
      await api.post('/checkout/address', payload);
      navigate('/checkout/payment');
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Failed to save address. Please try again.';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  }

  const effectivePinCode = useNewAddress ? form.pinCode : (getSelectedAddress()?.pinCode || '');

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Stepper */}
        <nav style={styles.stepper} aria-label="Checkout steps">
          {STEPS.map((step, index) => (
            <div key={step.path} style={{ display: 'flex', alignItems: 'center', flex: index < STEPS.length - 1 ? 1 : 'none', gap: '8px' }}>
              <div style={styles.stepItem}>
                <div style={styles.stepCircle(index === 0, false)} aria-current={index === 0 ? 'step' : undefined}>
                  {index === 0 ? '1' : index + 1}
                </div>
                <span style={styles.stepLabel(index === 0)}>{step.label}</span>
              </div>
              {index < STEPS.length - 1 && <div style={styles.stepDivider} />}
            </div>
          ))}
        </nav>

        <div style={styles.layout}>
          {/* Main form area */}
          <main>
            <div style={styles.card}>
              <h1 style={styles.sectionTitle}>Delivery Address</h1>

              {submitError && (
                <div style={styles.alertBox('error')} role="alert">
                  {submitError}
                </div>
              )}

              {/* Saved addresses */}
              {loadingAddresses ? (
                <p style={styles.loadingText}>Loading saved addresses…</p>
              ) : savedAddresses.length > 0 ? (
                <>
                  <p style={styles.savedAddressesTitle}>Saved Addresses</p>
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      style={styles.addressCard(!useNewAddress && selectedAddressId === addr.id)}
                      onClick={() => handleSelectSaved(addr.id)}
                      role="radio"
                      aria-checked={!useNewAddress && selectedAddressId === addr.id}
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectSaved(addr.id); }}
                    >
                      <input
                        type="radio"
                        name="savedAddress"
                        style={styles.radio}
                        checked={!useNewAddress && selectedAddressId === addr.id}
                        onChange={() => handleSelectSaved(addr.id)}
                        aria-label={`Select address: ${addr.fullName}`}
                        tabIndex={-1}
                      />
                      <div style={styles.addressInfo}>
                        <div style={styles.addressName}>{addr.fullName}</div>
                        <div style={styles.addressLine}>
                          {[addr.addressLine1, addr.addressLine2, addr.city, addr.state, addr.pinCode, addr.country]
                            .filter(Boolean)
                            .join(', ')}
                        </div>
                        {addr.phone && (
                          <div style={styles.addressLine}>Phone: {addr.phone}</div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* PIN serviceability for selected saved address */}
                  {!useNewAddress && selectedAddressId && (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={styles.pinRow}>
                        <div style={styles.pinInputWrap}>
                          <p style={{ ...styles.addressLine, marginBottom: '4px' }}>
                            <img src="/src/assets/icons/map-pin.svg" alt="" style={styles.mapPinIcon} />
                            PIN: <strong>{getSelectedAddress()?.pinCode}</strong>
                          </p>
                        </div>
                        <button
                          type="button"
                          style={styles.checkBtn}
                          onClick={handleCheckServiceability}
                          disabled={pinChecking}
                        >
                          {pinChecking ? 'Checking…' : 'Check Serviceability'}
                        </button>
                      </div>
                      {pinError && <p style={styles.errorText}>{pinError}</p>}
                      {pinServiceable !== null && (
                        <span style={styles.serviceabilityBadge(pinServiceable)}>
                          {pinServiceable ? '✓ Delivery available' : '✗ Delivery not available'}
                        </span>
                      )}
                    </div>
                  )}

                  <div style={styles.dividerText}>
                    <div style={styles.dividerLine} />
                    <span>or add a new address</span>
                    <div style={styles.dividerLine} />
                  </div>

                  <div
                    style={{ marginBottom: '16px' }}
                  >
                    <button
                      type="button"
                      style={{
                        ...styles.btnSecondary,
                        fontSize: '14px',
                        padding: '8px 16px',
                        minHeight: '40px',
                      }}
                      onClick={handleUseNew}
                    >
                      + Add New Address
                    </button>
                  </div>
                </>
              ) : null}

              {/* New address form */}
              {useNewAddress && (
                <form
                  noValidate
                  onSubmit={(e) => { e.preventDefault(); handleContinue(); }}
                  aria-label="New address form"
                >
                  <div style={styles.formGrid}>
                    {/* Full Name */}
                    <div>
                      <label htmlFor="fullName" style={styles.label}>Full Name *</label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        autoComplete="name"
                        style={styles.input(!!fieldErrors.fullName)}
                        value={form.fullName}
                        onChange={handleChange}
                        aria-invalid={!!fieldErrors.fullName}
                        aria-describedby={fieldErrors.fullName ? 'fullName-error' : undefined}
                      />
                      {fieldErrors.fullName && (
                        <p id="fullName-error" style={styles.errorText}>{fieldErrors.fullName}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" style={styles.label}>Phone Number *</label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        style={styles.input(!!fieldErrors.phone)}
                        value={form.phone}
                        onChange={handleChange}
                        aria-invalid={!!fieldErrors.phone}
                        aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
                      />
                      {fieldErrors.phone && (
                        <p id="phone-error" style={styles.errorText}>{fieldErrors.phone}</p>
                      )}
                    </div>

                    {/* Address Line 1 */}
                    <div style={styles.formFieldFull}>
                      <label htmlFor="addressLine1" style={styles.label}>Address Line 1 *</label>
                      <input
                        id="addressLine1"
                        name="addressLine1"
                        type="text"
                        autoComplete="address-line1"
                        style={styles.input(!!fieldErrors.addressLine1)}
                        value={form.addressLine1}
                        onChange={handleChange}
                        aria-invalid={!!fieldErrors.addressLine1}
                        aria-describedby={fieldErrors.addressLine1 ? 'addressLine1-error' : undefined}
                      />
                      {fieldErrors.addressLine1 && (
                        <p id="addressLine1-error" style={styles.errorText}>{fieldErrors.addressLine1}</p>
                      )}
                    </div>

                    {/* Address Line 2 */}
                    <div style={styles.formFieldFull}>
                      <label htmlFor="addressLine2" style={styles.label}>Address Line 2</label>
                      <input
                        id="addressLine2"
                        name="addressLine2"
                        type="text"
                        autoComplete="address-line2"
                        style={styles.input(false)}
                        value={form.addressLine2}
                        onChange={handleChange}
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label htmlFor="city" style={styles.label}>City *</label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        autoComplete="address-level2"
                        style={styles.input(!!fieldErrors.city)}
                        value={form.city}
                        onChange={handleChange}
                        aria-invalid={!!fieldErrors.city}
                        aria-describedby={fieldErrors.city ? 'city-error' : undefined}
                      />
                      {fieldErrors.city && (
                        <p id="city-error" style={styles.errorText}>{fieldErrors.city}</p>
                      )}
                    </div>

                    {/* State */}
                    <div>
                      <label htmlFor="state" style={styles.label}>State *</label>
                      <input
                        id="state"
                        name="state"
                        type="text"
                        autoComplete="address-level1"
                        style={styles.input(!!fieldErrors.state)}
                        value={form.state}
                        onChange={handleChange}
                        aria-invalid={!!fieldErrors.state}
                        aria-describedby={fieldErrors.state ? 'state-error' : undefined}
                      />
                      {fieldErrors.state && (
                        <p id="state-error" style={styles.errorText}>{fieldErrors.state}</p>
                      )}
                    </div>

                    {/* PIN Code with serviceability */}
                    <div>
                      <label htmlFor="pinCode" style={styles.label}>PIN Code *</label>
                      <div style={styles.pinRow}>
                        <div style={{ ...styles.pinInputWrap }}>
                          <input
                            id="pinCode"
                            name="pinCode"
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            autoComplete="postal-code"
                            style={styles.input(!!fieldErrors.pinCode || !!pinError)}
                            value={form.pinCode}
                            onChange={handleChange}
                            aria-invalid={!!fieldErrors.pinCode || pinServiceable === false}
                            aria-describedby="pinCode-feedback"
                          />
                        </div>
                        <button
                          type="button"
                          style={styles.checkBtn}
                          onClick={handleCheckServiceability}
                          disabled={pinChecking || !form.pinCode}
                          aria-label="Check serviceability for entered PIN code"
                        >
                          {pinChecking ? 'Checking…' : 'Check'}
                        </button>
                      </div>
                      <div id="pinCode-feedback">
                        {fieldErrors.pinCode && (
                          <p style={styles.errorText}>{fieldErrors.pinCode}</p>
                        )}
                        {pinError && (
                          <p style={styles.errorText}>{pinError}</p>
                        )}
                        {pinServiceable !== null && (
                          <span style={styles.serviceabilityBadge(pinServiceable)}>
                            {pinServiceable ? '✓ Delivery available at this PIN' : '✗ Delivery not available at this PIN'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Country */}
                    <div>
                      <label htmlFor="country" style={styles.label}>Country *</label>
                      <input
                        id="country"
                        name="country"
                        type="text"
                        autoComplete="country-name"
                        style={styles.input(false)}
                        value={form.country}
                        onChange={handleChange}
                        readOnly
                      />
                    </div>
                  </div>
                </form>
              )}

              {/* Actions */}
              <div style={styles.actions}>
                <button
                  type="button"
                  style={styles.btnSecondary}
                  onClick={() => navigate('/cart')}
                >
                  Back to Cart
                </button>
                <button
                  type="button"
                  style={{
                    ...styles.btnPrimary,
                    opacity: submitting ? 0.7 : 1,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                  }}
                  onClick={handleContinue}
                  disabled={submitting}
                  aria-busy={submitting}
                >
                  {submitting ? 'Saving…' : 'Continue to Payment'}
                </button>
              </div>
            </div>
          </main>

          {/* Order summary sidebar */}
          <aside>
            <div style={styles.summarySidebar}>
              <h2 style={styles.summaryTitle}>Order Summary</h2>
              {loadingCart ? (
                <p style={styles.loadingText}>Loading…</p>
              ) : cartSummary ? (
                <>
                  {(cartSummary.items || []).map((item) => (
                    <div key={item.id || item.skuId} style={styles.summaryRow}>
                      <span style={{ flex: 1, marginRight: '8px', color: '#212529' }}>
                        {item.productName || item.name}
                        <span style={{ color: '#495057' }}> × {item.quantity}</span>
                      </span>
                      <span style={{ fontWeight: '500' }}>
                        {formatCurrency((item.price || item.unitPrice || 0) * item.quantity)}
                      </span>
                    </div>
                  ))}
                  {cartSummary.subtotal != null && (
                    <div style={styles.summaryRow}>
                      <span>Subtotal</span>
                      <span>{formatCurrency(cartSummary.subtotal)}</span>
                    </div>
                  )}
                  {cartSummary.discount != null && cartSummary.discount > 0 && (
                    <div style={{ ...styles.summaryRow, color: '#37b24d' }}>
                      <span>Discount</span>
                      <span>-{formatCurrency(cartSummary.discount)}</span>
                    </div>
                  )}
                  {cartSummary.shipping != null && (
                    <div style={styles.summaryRow}>
                      <span>Shipping</span>
                      <span>{cartSummary.shipping === 0 ? 'Free' : formatCurrency(cartSummary.shipping)}</span>
                    </div>
                  )}
                  {cartSummary.total != null && (
                    <div style={styles.summaryTotal}>
                      <span>Total</span>
                      <span>{formatCurrency(cartSummary.total)}</span>
                    </div>
                  )}
                </>
              ) : (
                <p style={styles.loadingText}>No cart data available.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
