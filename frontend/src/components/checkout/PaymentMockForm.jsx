import React, { useState } from 'react';

const OUTCOMES = [
  {
    id: 'success',
    label: 'Success',
    description: 'Payment completes immediately.',
    color: '#16a34a',
    bg: '#f0fdf4',
    border: '#bbf7d0',
  },
  {
    id: 'failure',
    label: 'Failure',
    description: 'Payment is declined by the gateway.',
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fecaca',
  },
  {
    id: 'pending',
    label: 'Pending',
    description: 'Payment is queued and awaiting confirmation.',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
  },
];

const OUTCOME_ICONS = {
  success: (
    <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.15" />
      <polyline
        points="4,9 7,12 12,5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  failure: (
    <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.15" />
      <line x1="5" y1="5" x2="11" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="11" y1="5" x2="5" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  pending: (
    <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.15" />
      <line x1="8" y1="4" x2="8" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="8" x2="11" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

function PaymentMockForm({
  onSubmit,
  loading = false,
  submitLabel = 'Pay Now',
  defaultOutcome = 'success',
}) {
  const [selectedOutcome, setSelectedOutcome] = useState(defaultOutcome);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  const validate = (name, value) => {
    switch (name) {
      case 'cardName':
        if (!value.trim()) return 'Name on card is required.';
        if (value.trim().length < 2) return 'Enter the full name as on the card.';
        return '';
      case 'cardNumber': {
        const digits = value.replace(/\s/g, '');
        if (!digits) return 'Card number is required.';
        if (!/^\d{16}$/.test(digits)) return 'Enter a valid 16-digit card number.';
        return '';
      }
      case 'expiry': {
        if (!value) return 'Expiry date is required.';
        const match = value.match(/^(\d{2})\/(\d{2})$/);
        if (!match) return 'Enter expiry as MM/YY.';
        const month = parseInt(match[1], 10);
        if (month < 1 || month > 12) return 'Enter a valid month (01–12).';
        return '';
      }
      case 'cvv':
        if (!value) return 'CVV is required.';
        if (!/^\d{3,4}$/.test(value)) return 'Enter a valid 3 or 4 digit CVV.';
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (name, value) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleChange = (name, value) => {
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fields = { cardName, cardNumber, expiry, cvv };
    const newTouched = { cardName: true, cardNumber: true, expiry: true, cvv: true };
    const newErrors = {};
    Object.keys(fields).forEach((k) => {
      newErrors[k] = validate(k, fields[k]);
    });

    setTouched(newTouched);
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors) return;

    if (onSubmit) {
      onSubmit({
        outcome: selectedOutcome,
        cardName: cardName.trim(),
        cardNumberLast4: cardNumber.replace(/\s/g, '').slice(-4),
        expiry,
      });
    }
  };

  const inputClass = (name) =>
    `pmf__input${errors[name] && touched[name] ? ' pmf__input--error' : ''}`;

  const getError = (name) => (touched[name] && errors[name]) || '';

  return (
    <div className="pmf">
      <div className="pmf__test-banner" role="note" aria-label="Test mode active">
        <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path
            d="M8 1L10 6H15L11 9.5L12.5 14.5L8 11.5L3.5 14.5L5 9.5L1 6H6L8 1Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
        <span>Test mode — no real charges will be made</span>
      </div>

      <form
        className="pmf__form"
        onSubmit={handleSubmit}
        noValidate
        aria-label="Mock payment form"
      >
        <fieldset className="pmf__outcome-fieldset">
          <legend className="pmf__outcome-legend">Simulate payment outcome</legend>
          <div className="pmf__outcome-options" role="radiogroup" aria-label="Payment outcome">
            {OUTCOMES.map((outcome) => {
              const isSelected = selectedOutcome === outcome.id;
              return (
                <label
                  key={outcome.id}
                  className={`pmf__outcome-option${isSelected ? ' pmf__outcome-option--selected' : ''}`}
                  style={isSelected ? { borderColor: outcome.border, backgroundColor: outcome.bg } : {}}
                >
                  <input
                    type="radio"
                    name="payment-outcome"
                    value={outcome.id}
                    checked={isSelected}
                    onChange={() => setSelectedOutcome(outcome.id)}
                    disabled={loading}
                    className="pmf__outcome-radio"
                    aria-describedby={`pmf-outcome-desc-${outcome.id}`}
                  />
                  <span
                    className="pmf__outcome-icon"
                    style={{ color: outcome.color }}
                  >
                    {OUTCOME_ICONS[outcome.id]}
                  </span>
                  <span className="pmf__outcome-text">
                    <span
                      className="pmf__outcome-label"
                      style={isSelected ? { color: outcome.color } : {}}
                    >
                      {outcome.label}
                    </span>
                    <span
                      id={`pmf-outcome-desc-${outcome.id}`}
                      className="pmf__outcome-description"
                    >
                      {outcome.description}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="pmf__divider" aria-hidden="true" />

        <div className="pmf__card-section">
          <div className="pmf__card-header">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
              <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.75" />
              <line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="1.75" />
              <rect x="5" y="13" width="4" height="2" rx="0.5" fill="currentColor" />
            </svg>
            <span className="pmf__card-header-label">Card details</span>
            <span className="pmf__card-chips" aria-label="Accepted cards: Visa, Mastercard, Rupay">
              <span className="pmf__card-chip">VISA</span>
              <span className="pmf__card-chip">MC</span>
              <span className="pmf__card-chip">RuPay</span>
            </span>
          </div>

          <div className="pmf__field">
            <label className="pmf__label" htmlFor="pmf-cardName">
              Name on Card
              <span className="pmf__required" aria-hidden="true"> *</span>
            </label>
            <input
              id="pmf-cardName"
              name="cardName"
              type="text"
              autoComplete="cc-name"
              className={inputClass('cardName')}
              value={cardName}
              onChange={(e) => {
                setCardName(e.target.value);
                handleChange('cardName', e.target.value);
              }}
              onBlur={(e) => handleBlur('cardName', e.target.value)}
              aria-required="true"
              aria-describedby={getError('cardName') ? 'pmf-cardName-error' : undefined}
              disabled={loading}
              placeholder="As printed on card"
            />
            {getError('cardName') && (
              <span id="pmf-cardName-error" className="pmf__error" role="alert">
                {getError('cardName')}
              </span>
            )}
          </div>

          <div className="pmf__field">
            <label className="pmf__label" htmlFor="pmf-cardNumber">
              Card Number
              <span className="pmf__required" aria-hidden="true"> *</span>
            </label>
            <input
              id="pmf-cardNumber"
              name="cardNumber"
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              className={inputClass('cardNumber')}
              value={cardNumber}
              onChange={(e) => {
                const formatted = formatCardNumber(e.target.value);
                setCardNumber(formatted);
                handleChange('cardNumber', formatted);
              }}
              onBlur={(e) => handleBlur('cardNumber', e.target.value)}
              aria-required="true"
              aria-describedby={getError('cardNumber') ? 'pmf-cardNumber-error' : undefined}
              disabled={loading}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
            />
            {getError('cardNumber') && (
              <span id="pmf-cardNumber-error" className="pmf__error" role="alert">
                {getError('cardNumber')}
              </span>
            )}
          </div>

          <div className="pmf__row">
            <div className="pmf__field">
              <label className="pmf__label" htmlFor="pmf-expiry">
                Expiry (MM/YY)
                <span className="pmf__required" aria-hidden="true"> *</span>
              </label>
              <input
                id="pmf-expiry"
                name="expiry"
                type="text"
                inputMode="numeric"
                autoComplete="cc-exp"
                className={inputClass('expiry')}
                value={expiry}
                onChange={(e) => {
                  const formatted = formatExpiry(e.target.value);
                  setExpiry(formatted);
                  handleChange('expiry', formatted);
                }}
                onBlur={(e) => handleBlur('expiry', e.target.value)}
                aria-required="true"
                aria-describedby={getError('expiry') ? 'pmf-expiry-error' : undefined}
                disabled={loading}
                placeholder="MM/YY"
                maxLength={5}
              />
              {getError('expiry') && (
                <span id="pmf-expiry-error" className="pmf__error" role="alert">
                  {getError('expiry')}
                </span>
              )}
            </div>

            <div className="pmf__field">
              <label className="pmf__label" htmlFor="pmf-cvv">
                CVV
                <span className="pmf__required" aria-hidden="true"> *</span>
              </label>
              <div className="pmf__cvv-wrapper">
                <input
                  id="pmf-cvv"
                  name="cvv"
                  type="password"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  className={inputClass('cvv')}
                  value={cvv}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setCvv(val);
                    handleChange('cvv', val);
                  }}
                  onBlur={(e) => handleBlur('cvv', e.target.value)}
                  aria-required="true"
                  aria-describedby={getError('cvv') ? 'pmf-cvv-error' : 'pmf-cvv-hint'}
                  disabled={loading}
                  placeholder="•••"
                  maxLength={4}
                />
                <span id="pmf-cvv-hint" className="pmf__cvv-hint" aria-label="3 or 4 digits on back of card">
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                    <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="8" y1="7" x2="8" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="8" cy="5" r="0.75" fill="currentColor" />
                  </svg>
                </span>
              </div>
              {getError('cvv') && (
                <span id="pmf-cvv-error" className="pmf__error" role="alert">
                  {getError('cvv')}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="pmf__hint-row">
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <rect x="3" y="7" width="10" height="8" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M5 7V5a3 3 0 016 0v2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>Use any test card number — transactions are simulated only</span>
        </div>

        <div className="pmf__actions">
          <button
            type="submit"
            className="pmf__submit"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <span className="pmf__spinner" aria-hidden="true" />
                Processing…
              </>
            ) : (
              submitLabel
            )}
          </button>
        </div>
      </form>

      <style>{`
        .pmf {
          display: flex;
          flex-direction: column;
          gap: 0;
          font-size: 0.9375rem;
          color: #111827;
        }

        .pmf__test-banner {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #fefce8;
          border: 1px solid #fde047;
          border-radius: 0.375rem;
          padding: 0.5rem 0.875rem;
          font-size: 0.8125rem;
          font-weight: 500;
          color: #854d0e;
          margin-bottom: 1.25rem;
        }

        .pmf__form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .pmf__outcome-fieldset {
          border: none;
          margin: 0;
          padding: 0;
        }

        .pmf__outcome-legend {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.75rem;
          padding: 0;
        }

        .pmf__outcome-options {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }

        .pmf__outcome-option {
          display: flex;
          align-items: flex-start;
          gap: 0.625rem;
          padding: 0.75rem 1rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: border-color 0.15s, background-color 0.15s;
          background-color: #ffffff;
        }

        .pmf__outcome-option:hover:not(:has(input:disabled)) {
          border-color: #d1d5db;
          background-color: #f9fafb;
        }

        .pmf__outcome-radio {
          margin-top: 0.125rem;
          flex-shrink: 0;
          accent-color: #2563eb;
          width: 1rem;
          height: 1rem;
          cursor: pointer;
        }

        .pmf__outcome-radio:disabled {
          cursor: not-allowed;
        }

        .pmf__outcome-icon {
          flex-shrink: 0;
          margin-top: 0.0625rem;
          display: flex;
          align-items: center;
        }

        .pmf__outcome-text {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .pmf__outcome-label {
          font-size: 0.9375rem;
          font-weight: 600;
          color: #374151;
          line-height: 1.3;
        }

        .pmf__outcome-description {
          font-size: 0.8125rem;
          color: #6b7280;
          line-height: 1.4;
        }

        .pmf__divider {
          height: 1px;
          background-color: #e5e7eb;
          margin: 0;
        }

        .pmf__card-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .pmf__card-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #374151;
        }

        .pmf__card-header-label {
          font-size: 0.9375rem;
          font-weight: 600;
          color: #374151;
          flex: 1;
        }

        .pmf__card-chips {
          display: flex;
          gap: 0.375rem;
        }

        .pmf__card-chip {
          display: inline-flex;
          align-items: center;
          padding: 0.125rem 0.4375rem;
          background-color: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 0.25rem;
          font-size: 0.6875rem;
          font-weight: 700;
          color: #374151;
          letter-spacing: 0.02em;
        }

        .pmf__field {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }

        .pmf__label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }

        .pmf__required {
          color: #dc2626;
        }

        .pmf__input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          font-size: 0.9375rem;
          color: #111827;
          background-color: #ffffff;
          border: 1.5px solid #d1d5db;
          border-radius: 0.375rem;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          box-sizing: border-box;
        }

        .pmf__input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        .pmf__input--error {
          border-color: #dc2626;
        }

        .pmf__input--error:focus {
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15);
        }

        .pmf__input:disabled {
          background-color: #f9fafb;
          color: #6b7280;
          cursor: not-allowed;
        }

        .pmf__input::placeholder {
          color: #9ca3af;
        }

        .pmf__error {
          font-size: 0.8125rem;
          color: #dc2626;
          margin-top: 0.125rem;
        }

        .pmf__row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 400px) {
          .pmf__row {
            grid-template-columns: 1fr;
          }
        }

        .pmf__cvv-wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .pmf__cvv-wrapper .pmf__input {
          flex: 1;
        }

        .pmf__cvv-hint {
          color: #9ca3af;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          cursor: help;
        }

        .pmf__hint-row {
          display: flex;
          align-items: center;
          gap: 0.4375rem;
          font-size: 0.8125rem;
          color: #6b7280;
        }

        .pmf__actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 0.25rem;
        }

        .pmf__submit {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1.75rem;
          font-size: 0.9375rem;
          font-weight: 600;
          color: #ffffff;
          background-color: #2563eb;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: background-color 0.15s, opacity 0.15s;
        }

        .pmf__submit:hover:not(:disabled) {
          background-color: #1d4ed8;
        }

        .pmf__submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .pmf__spinner {
          display: inline-block;
          width: 1rem;
          height: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.35);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: pmf-spin 0.7s linear infinite;
          flex-shrink: 0;
        }

        @keyframes pmf-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default PaymentMockForm;
