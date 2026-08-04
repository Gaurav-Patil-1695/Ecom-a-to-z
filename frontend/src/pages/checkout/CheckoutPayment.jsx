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
  testModeBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#fff4e6',
    border: '1px solid #fd7e14',
    borderRadius: '6px',
    padding: '10px 14px',
    marginBottom: '20px',
    fontSize: '13px',
    color: '#495057',
    lineHeight: '20px',
  },
  testModeBadge: {
    display: 'inline-block',
    backgroundColor: '#fd7e14',
    color: '#ffffff',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    padding: '2px 8px',
    borderRadius: '3px',
    flexShrink: 0,
  },
  methodList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px',
  },
  methodCard: (selected) => ({
    border: `2px solid ${selected ? '#4c6ef5' : '#868e96'}`,
    borderRadius: '10px',
    padding: '16px',
    cursor: 'pointer',
    backgroundColor: selected ? '#e8ecfd' : '#ffffff',
    transition: 'border-color 0.15s, background-color 0.15s',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  }),
  radio: {
    accentColor: '#4c6ef5',
    width: '16px',
    height: '16px',
    flexShrink: 0,
  },
  methodLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
  },
  methodDesc: {
    fontSize: '13px',
    color: '#495057',
    marginTop: '2px',
    lineHeight: '18px',
  },
  methodBody: {
    flex: 1,
  },
  formGroup: {
    marginBottom: '16px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
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
  monoInput: (hasError) => ({
    width: '100%',
    padding: '10px 12px',
    fontSize: '15px',
    lineHeight: '24px',
    color: '#212529',
    backgroundColor: '#ffffff',
    border: `1px solid ${hasError ? '#f03e3e' : '#868e96'}`,
    borderRadius: '6px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    letterSpacing: '0.08em',
    transition: 'border-color 0.15s',
  }),
  errorText: {
    fontSize: '12px',
    color: '#f03e3e',
    marginTop: '4px',
    lineHeight: '16px',
  },
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
  alertBox: (type) => ({
    padding: '12px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    lineHeight: '20px',
    marginBottom: '16px',
    backgroundColor: type === 'error' ? '#ffe3e3' : '#d3f9d8',
    color: type === 'error' ? '#f03e3e' : '#37b24d',
  }),
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
  loadingText: {
    color: '#495057',
    fontSize: '14px',
  },
  mockCardHint: {
    backgroundColor: '#e8ecfd',
    borderRadius: '6px',
    padding: '10px 14px',
    fontSize: '13px',
    color: '#3b5bdb',
    lineHeight: '20px',
    marginBottom: '16px',
  },
  upiHint: {
    backgroundColor: '#e8ecfd',
    borderRadius: '6px',
    padding: '10px 14px',
    fontSize: '13px',
    color: '#3b5bdb',
    lineHeight: '20px',
    marginBottom: '16px',
  },
  netbankingSelect: (hasError) => ({
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
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23868e96' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    paddingRight: '36px',
  }),
  divider: {
    height: '1px',
    backgroundColor: '#e9ecef',
    margin: '20px 0',
  },
  walletRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  walletOption: (selected) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    border: `1px solid ${selected ? '#4c6ef5' : '#868e96'}`,
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: selected ? '#e8ecfd' : '#ffffff',
    transition: 'border-color 0.15s, background-color 0.15s',
  }),
  walletLabel: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#212529',
  },
};

const STEPS = [
  { label: 'Address', path: '/checkout/address' },
  { label: 'Payment', path: '/checkout/payment' },
  { label: 'Review', path: '/checkout/review' },
];

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, Rupay and more' },
  { id: 'upi', label: 'UPI', desc: 'Pay via any UPI app using your VPA' },
  { id: 'netbanking', label: 'Net Banking', desc: 'All major banks supported' },
  { id: 'wallet', label: 'Wallet', desc: 'Paytm, PhonePe, Amazon Pay' },
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
];

const BANKS = [
  { value: '', label: 'Select your bank' },
  { value: 'HDFC', label: 'HDFC Bank' },
  { value: 'ICICI', label: 'ICICI Bank' },
  { value: 'SBI', label: 'State Bank of India' },
  { value: 'AXIS', label: 'Axis Bank' },
  { value: 'KOTAK', label: 'Kotak Mahindra Bank' },
  { value: 'YES', label: 'Yes Bank' },
  { value: 'INDUS', label: 'IndusInd Bank' },
  { value: 'PUNJAB', label: 'Punjab National Bank' },
];

const WALLETS = [
  { id: 'paytm', label: 'Paytm' },
  { id: 'phonepe', label: 'PhonePe' },
  { id: 'amazonpay', label: 'Amazon Pay' },
];

const INITIAL_CARD = {
  cardNumber: '',
  nameOnCard: '',
  expiry: '',
  cvv: '',
};

function formatCardNumber(val) {
  return val
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(val) {
  const digits = val.replace(/\D/g, '').slice(0, 4);
  if (digits.length > 2) {
    return digits.slice(0, 2) + '/' + digits.slice(2);
  }
  return digits;
}

export default function CheckoutPayment() {
  const navigate = useNavigate();

  const [selectedMethod, setSelectedMethod] = useState('card');

  // Card fields
  const [card, setCard] = useState(INITIAL_CARD);
  const [cardErrors, setCardErrors] = useState({});

  // UPI
  const [upiId, setUpiId] = useState('');
  const [upiError, setUpiError] = useState('');

  // Net banking
  const [selectedBank, setSelectedBank] = useState('');
  const [bankError, setBankError] = useState('');

  // Wallet
  const [selectedWallet, setSelectedWallet] = useState('');
  const [walletError, setWalletError] = useState('');

  // Cart summary
  const [cartSummary, setCartSummary] = useState(null);
  const [loadingCart, setLoadingCart] = useState(true);

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    fetchCartSummary();
  }, []);

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

  function handleMethodSelect(methodId) {
    setSelectedMethod(methodId);
    setSubmitError('');
    setCardErrors({});
    setUpiError('');
    setBankError('');
    setWalletError('');
  }

  function handleCardChange(e) {
    const { name, value } = e.target;
    let formatted = value;
    if (name === 'cardNumber') {
      formatted = formatCardNumber(value);
    } else if (name === 'expiry') {
      formatted = formatExpiry(value);
    } else if (name === 'cvv') {
      formatted = value.replace(/\D/g, '').slice(0, 4);
    }
    setCard((prev) => ({ ...prev, [name]: formatted }));
    setCardErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function validateCard() {
    const errors = {};
    const rawNumber = card.cardNumber.replace(/\s/g, '');
    if (!rawNumber) {
      errors.cardNumber = 'Card number is required.';
    } else if (!/^\d{16}$/.test(rawNumber)) {
      errors.cardNumber = 'Enter a valid 16-digit card number.';
    }
    if (!card.nameOnCard.trim()) {
      errors.nameOnCard = 'Name on card is required.';
    }
    if (!card.expiry) {
      errors.expiry = 'Expiry date is required.';
    } else {
      const parts = card.expiry.split('/');
      const month = parseInt(parts[0], 10);
      const year = parseInt('20' + (parts[1] || ''), 10);
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      if (!parts[1] || parts[1].length !== 2 || month < 1 || month > 12) {
        errors.expiry = 'Enter a valid expiry date (MM/YY).';
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        errors.expiry = 'Your card has expired.';
      }
    }
    if (!card.cvv) {
      errors.cvv = 'CVV is required.';
    } else if (!/^\d{3,4}$/.test(card.cvv)) {
      errors.cvv = 'Enter a valid 3 or 4 digit CVV.';
    }
    return errors;
  }

  function validateMethod() {
    if (selectedMethod === 'card') {
      const errors = validateCard();
      if (Object.keys(errors).length > 0) {
        setCardErrors(errors);
        return false;
      }
    } else if (selectedMethod === 'upi') {
      if (!upiId.trim()) {
        setUpiError('UPI ID is required.');
        return false;
      }
      if (!/^[\w.+-]+@[\w]+$/.test(upiId.trim())) {
        setUpiError('Enter a valid UPI ID (e.g. name@upi).');
        return false;
      }
    } else if (selectedMethod === 'netbanking') {
      if (!selectedBank) {
        setBankError('Please select your bank.');
        return false;
      }
    } else if (selectedMethod === 'wallet') {
      if (!selectedWallet) {
        setWalletError('Please select a wallet.');
        return false;
      }
    }
    return true;
  }

  function buildPaymentPayload() {
    if (selectedMethod === 'card') {
      return {
        method: 'card',
        card: {
          number: card.cardNumber.replace(/\s/g, ''),
          nameOnCard: card.nameOnCard.trim(),
          expiry: card.expiry,
          cvv: card.cvv,
        },
      };
    }
    if (selectedMethod === 'upi') {
      return { method: 'upi', upiId: upiId.trim() };
    }
    if (selectedMethod === 'netbanking') {
      return { method: 'netbanking', bank: selectedBank };
    }
    if (selectedMethod === 'wallet') {
      return { method: 'wallet', wallet: selectedWallet };
    }
    if (selectedMethod === 'cod') {
      return { method: 'cod' };
    }
    return { method: selectedMethod };
  }

  async function handleContinue() {
    setSubmitError('');
    if (!validateMethod()) return;

    setSubmitting(true);
    try {
      const payload = buildPaymentPayload();
      await api.post('/payments/initiate', payload);
      navigate('/checkout/review');
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Failed to process payment details. Please try again.';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Stepper */}
        <nav style={styles.stepper} aria-label="Checkout steps">
          {STEPS.map((step, index) => (
            <div
              key={step.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                flex: index < STEPS.length - 1 ? 1 : 'none',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={styles.stepCircle(index === 1, index === 0)}
                  aria-current={index === 1 ? 'step' : undefined}
                >
                  {index === 0 ? '✓' : index + 1}
                </div>
                <span style={styles.stepLabel(index === 1)}>{step.label}</span>
              </div>
              {index < STEPS.length - 1 && <div style={styles.stepDivider} />}
            </div>
          ))}
        </nav>

        <div style={styles.layout}>
          {/* Main payment form */}
          <main>
            <div style={styles.card}>
              <h1 style={styles.sectionTitle}>Payment</h1>

              {/* Test mode banner */}
              <div style={styles.testModeBanner} role="note">
                <span style={styles.testModeBadge}>TEST MODE</span>
                <span>
                  This is a simulated payment environment. No real charges will be made. Use the mock
                  card details shown below to complete your order.
                </span>
              </div>

              {submitError && (
                <div style={styles.alertBox('error')} role="alert">
                  {submitError}
                </div>
              )}

              {/* Payment method selection */}
              <div style={styles.methodList} role="radiogroup" aria-label="Payment method">
                {PAYMENT_METHODS.map((method) => (
                  <div
                    key={method.id}
                    style={styles.methodCard(selectedMethod === method.id)}
                    onClick={() => handleMethodSelect(method.id)}
                    role="radio"
                    aria-checked={selectedMethod === method.id}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') handleMethodSelect(method.id);
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      style={styles.radio}
                      checked={selectedMethod === method.id}
                      onChange={() => handleMethodSelect(method.id)}
                      aria-label={`Pay with ${method.label}`}
                      tabIndex={-1}
                    />
                    <div style={styles.methodBody}>
                      <div style={styles.methodLabel}>{method.label}</div>
                      <div style={styles.methodDesc}>{method.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Card form */}
              {selectedMethod === 'card' && (
                <form
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleContinue();
                  }}
                  aria-label="Card payment form"
                >
                  <div style={styles.mockCardHint} role="note">
                    <strong>Test card details:</strong> Card number: 4111 1111 1111 1111 &nbsp;|&nbsp;
                    Expiry: 12/26 &nbsp;|&nbsp; CVV: 123
                  </div>

                  <div style={styles.formGroup}>
                    <label htmlFor="cardNumber" style={styles.label}>
                      Card Number *
                    </label>
                    <input
                      id="cardNumber"
                      name="cardNumber"
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      style={styles.monoInput(!!cardErrors.cardNumber)}
                      value={card.cardNumber}
                      onChange={handleCardChange}
                      aria-invalid={!!cardErrors.cardNumber}
                      aria-describedby={cardErrors.cardNumber ? 'cardNumber-error' : undefined}
                    />
                    {cardErrors.cardNumber && (
                      <p id="cardNumber-error" style={styles.errorText}>
                        {cardErrors.cardNumber}
                      </p>
                    )}
                  </div>

                  <div style={styles.formGroup}>
                    <label htmlFor="nameOnCard" style={styles.label}>
                      Name on Card *
                    </label>
                    <input
                      id="nameOnCard"
                      name="nameOnCard"
                      type="text"
                      autoComplete="cc-name"
                      placeholder="As printed on card"
                      style={styles.input(!!cardErrors.nameOnCard)}
                      value={card.nameOnCard}
                      onChange={handleCardChange}
                      aria-invalid={!!cardErrors.nameOnCard}
                      aria-describedby={cardErrors.nameOnCard ? 'nameOnCard-error' : undefined}
                    />
                    {cardErrors.nameOnCard && (
                      <p id="nameOnCard-error" style={styles.errorText}>
                        {cardErrors.nameOnCard}
                      </p>
                    )}
                  </div>

                  <div style={styles.formGrid}>
                    <div>
                      <label htmlFor="expiry" style={styles.label}>
                        Expiry Date *
                      </label>
                      <input
                        id="expiry"
                        name="expiry"
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        placeholder="MM/YY"
                        maxLength={5}
                        style={styles.monoInput(!!cardErrors.expiry)}
                        value={card.expiry}
                        onChange={handleCardChange}
                        aria-invalid={!!cardErrors.expiry}
                        aria-describedby={cardErrors.expiry ? 'expiry-error' : undefined}
                      />
                      {cardErrors.expiry && (
                        <p id="expiry-error" style={styles.errorText}>
                          {cardErrors.expiry}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="cvv" style={styles.label}>
                        CVV *
                      </label>
                      <input
                        id="cvv"
                        name="cvv"
                        type="password"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        placeholder="•••"
                        maxLength={4}
                        style={styles.monoInput(!!cardErrors.cvv)}
                        value={card.cvv}
                        onChange={handleCardChange}
                        aria-invalid={!!cardErrors.cvv}
                        aria-describedby={cardErrors.cvv ? 'cvv-error' : undefined}
                      />
                      {cardErrors.cvv && (
                        <p id="cvv-error" style={styles.errorText}>
                          {cardErrors.cvv}
                        </p>
                      )}
                    </div>
                  </div>
                </form>
              )}

              {/* UPI form */}
              {selectedMethod === 'upi' && (
                <div aria-label="UPI payment form">
                  <div style={styles.upiHint} role="note">
                    <strong>Test UPI ID:</strong> success@upi &nbsp;(Use <code>failure@upi</code> to
                    simulate a payment failure)
                  </div>
                  <div style={styles.formGroup}>
                    <label htmlFor="upiId" style={styles.label}>
                      UPI ID *
                    </label>
                    <input
                      id="upiId"
                      name="upiId"
                      type="text"
                      inputMode="email"
                      autoComplete="off"
                      placeholder="yourname@upi"
                      style={styles.monoInput(!!upiError)}
                      value={upiId}
                      onChange={(e) => {
                        setUpiId(e.target.value);
                        setUpiError('');
                      }}
                      aria-invalid={!!upiError}
                      aria-describedby={upiError ? 'upiId-error' : undefined}
                    />
                    {upiError && (
                      <p id="upiId-error" style={styles.errorText}>
                        {upiError}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Net banking form */}
              {selectedMethod === 'netbanking' && (
                <div aria-label="Net banking payment form">
                  <div style={styles.formGroup}>
                    <label htmlFor="bank" style={styles.label}>
                      Select Bank *
                    </label>
                    <select
                      id="bank"
                      name="bank"
                      style={styles.netbankingSelect(!!bankError)}
                      value={selectedBank}
                      onChange={(e) => {
                        setSelectedBank(e.target.value);
                        setBankError('');
                      }}
                      aria-invalid={!!bankError}
                      aria-describedby={bankError ? 'bank-error' : undefined}
                    >
                      {BANKS.map((bank) => (
                        <option key={bank.value} value={bank.value}>
                          {bank.label}
                        </option>
                      ))}
                    </select>
                    {bankError && (
                      <p id="bank-error" style={styles.errorText}>
                        {bankError}
                      </p>
                    )}
                  </div>
                  <div
                    style={{
                      backgroundColor: '#fff4e6',
                      borderRadius: '6px',
                      padding: '10px 14px',
                      fontSize: '13px',
                      color: '#495057',
                      lineHeight: '20px',
                    }}
                    role="note"
                  >
                    In test mode, selecting any bank will simulate a successful net banking payment.
                  </div>
                </div>
              )}

              {/* Wallet form */}
              {selectedMethod === 'wallet' && (
                <div aria-label="Wallet payment form">
                  <div style={styles.walletRow} role="radiogroup" aria-label="Select wallet">
                    {WALLETS.map((wallet) => (
                      <div
                        key={wallet.id}
                        style={styles.walletOption(selectedWallet === wallet.id)}
                        onClick={() => {
                          setSelectedWallet(wallet.id);
                          setWalletError('');
                        }}
                        role="radio"
                        aria-checked={selectedWallet === wallet.id}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setSelectedWallet(wallet.id);
                            setWalletError('');
                          }
                        }}
                      >
                        <input
                          type="radio"
                          name="wallet"
                          style={styles.radio}
                          checked={selectedWallet === wallet.id}
                          onChange={() => {
                            setSelectedWallet(wallet.id);
                            setWalletError('');
                          }}
                          aria-label={`Pay with ${wallet.label}`}
                          tabIndex={-1}
                        />
                        <span style={styles.walletLabel}>{wallet.label}</span>
                      </div>
                    ))}
                  </div>
                  {walletError && (
                    <p style={{ ...styles.errorText, marginTop: '8px' }}>{walletError}</p>
                  )}
                  <div
                    style={{
                      backgroundColor: '#fff4e6',
                      borderRadius: '6px',
                      padding: '10px 14px',
                      fontSize: '13px',
                      color: '#495057',
                      lineHeight: '20px',
                      marginTop: '12px',
                    }}
                    role="note"
                  >
                    In test mode, all wallet payments are automatically simulated as successful.
                  </div>
                </div>
              )}

              {/* COD notice */}
              {selectedMethod === 'cod' && (
                <div
                  style={{
                    backgroundColor: '#d3f9d8',
                    borderRadius: '6px',
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#37b24d',
                    lineHeight: '20px',
                  }}
                  role="note"
                >
                  <strong>Cash on Delivery selected.</strong> You will pay when your order is
                  delivered. Additional COD charges may apply.
                </div>
              )}

              {/* Actions */}
              <div style={styles.actions}>
                <button
                  type="button"
                  style={styles.btnSecondary}
                  onClick={() => navigate('/checkout/address')}
                >
                  Back
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
                  {submitting ? 'Processing…' : 'Continue to Review'}
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
                      <span>
                        {cartSummary.shipping === 0
                          ? 'Free'
                          : formatCurrency(cartSummary.shipping)}
                      </span>
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
