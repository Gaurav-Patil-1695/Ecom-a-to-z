import React, { useState, useEffect, useCallback } from 'react';

const SERVICEABILITY_DEBOUNCE_MS = 600;

const FIELD_LABELS = {
  fullName: 'Full Name',
  phone: 'Phone Number',
  addressLine1: 'Address Line 1',
  addressLine2: 'Address Line 2 (Optional)',
  city: 'City',
  state: 'State',
  pinCode: 'PIN Code',
};

const INITIAL_STATE = {
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pinCode: '',
};

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

function AddressForm({
  initialValues = {},
  onSubmit,
  onChange,
  submitLabel = 'Continue',
  loading = false,
  serverErrors = {},
}) {
  const [values, setValues] = useState({ ...INITIAL_STATE, ...initialValues });
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [serviceability, setServiceability] = useState(null);
  const [serviceabilityLoading, setServiceabilityLoading] = useState(false);

  const debouncedPinCode = useDebounce(values.pinCode, SERVICEABILITY_DEBOUNCE_MS);

  useEffect(() => {
    if (!debouncedPinCode || debouncedPinCode.length !== 6 || !/^\d{6}$/.test(debouncedPinCode)) {
      setServiceability(null);
      return;
    }

    let cancelled = false;
    setServiceabilityLoading(true);
    setServiceability(null);

    fetch(`/serviceability?pinCode=${encodeURIComponent(debouncedPinCode)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setServiceability(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setServiceability({ serviceable: false, message: 'Unable to check serviceability.' });
        }
      })
      .finally(() => {
        if (!cancelled) setServiceabilityLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedPinCode]);

  const validate = useCallback((name, value) => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required.';
        if (value.trim().length < 2) return 'Full name must be at least 2 characters.';
        return '';
      case 'phone':
        if (!value.trim()) return 'Phone number is required.';
        if (!/^[6-9]\d{9}$/.test(value.trim())) return 'Enter a valid 10-digit Indian mobile number.';
        return '';
      case 'addressLine1':
        if (!value.trim()) return 'Address line 1 is required.';
        return '';
      case 'city':
        if (!value.trim()) return 'City is required.';
        return '';
      case 'state':
        if (!value.trim()) return 'State is required.';
        return '';
      case 'pinCode':
        if (!value.trim()) return 'PIN code is required.';
        if (!/^\d{6}$/.test(value.trim())) return 'Enter a valid 6-digit PIN code.';
        return '';
      default:
        return '';
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...values, [name]: value };
    setValues(updated);

    if (touched[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
    }

    if (onChange) onChange(updated);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setFieldErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'pinCode'];
    const allTouched = {};
    const errors = {};
    requiredFields.forEach((field) => {
      allTouched[field] = true;
      errors[field] = validate(field, values[field]);
    });

    setTouched(allTouched);
    setFieldErrors(errors);

    const hasErrors = requiredFields.some((field) => errors[field]);
    if (hasErrors) return;

    if (serviceability && serviceability.serviceable === false) return;

    if (onSubmit) onSubmit(values);
  };

  const getError = (name) => fieldErrors[name] || serverErrors[name] || '';

  const inputClass = (name) =>
    `address-form__input${getError(name) ? ' address-form__input--error' : ''}`;

  return (
    <form
      className="address-form"
      onSubmit={handleSubmit}
      noValidate
      aria-label="Delivery address form"
    >
      <div className="address-form__row">
        <div className="address-form__field">
          <label className="address-form__label" htmlFor="af-fullName">
            {FIELD_LABELS.fullName}
            <span className="address-form__required" aria-hidden="true">
              {' '}*
            </span>
          </label>
          <input
            id="af-fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            className={inputClass('fullName')}
            value={values.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-required="true"
            aria-describedby={getError('fullName') ? 'af-fullName-error' : undefined}
            disabled={loading}
          />
          {getError('fullName') && (
            <span id="af-fullName-error" className="address-form__error" role="alert">
              {getError('fullName')}
            </span>
          )}
        </div>

        <div className="address-form__field">
          <label className="address-form__label" htmlFor="af-phone">
            {FIELD_LABELS.phone}
            <span className="address-form__required" aria-hidden="true">
              {' '}*
            </span>
          </label>
          <input
            id="af-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className={inputClass('phone')}
            value={values.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-required="true"
            aria-describedby={getError('phone') ? 'af-phone-error' : undefined}
            disabled={loading}
            maxLength={10}
          />
          {getError('phone') && (
            <span id="af-phone-error" className="address-form__error" role="alert">
              {getError('phone')}
            </span>
          )}
        </div>
      </div>

      <div className="address-form__field">
        <label className="address-form__label" htmlFor="af-addressLine1">
          {FIELD_LABELS.addressLine1}
          <span className="address-form__required" aria-hidden="true">
            {' '}*
          </span>
        </label>
        <input
          id="af-addressLine1"
          name="addressLine1"
          type="text"
          autoComplete="address-line1"
          className={inputClass('addressLine1')}
          value={values.addressLine1}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-required="true"
          aria-describedby={getError('addressLine1') ? 'af-addressLine1-error' : undefined}
          disabled={loading}
        />
        {getError('addressLine1') && (
          <span id="af-addressLine1-error" className="address-form__error" role="alert">
            {getError('addressLine1')}
          </span>
        )}
      </div>

      <div className="address-form__field">
        <label className="address-form__label" htmlFor="af-addressLine2">
          {FIELD_LABELS.addressLine2}
        </label>
        <input
          id="af-addressLine2"
          name="addressLine2"
          type="text"
          autoComplete="address-line2"
          className="address-form__input"
          value={values.addressLine2}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading}
        />
      </div>

      <div className="address-form__row">
        <div className="address-form__field">
          <label className="address-form__label" htmlFor="af-city">
            {FIELD_LABELS.city}
            <span className="address-form__required" aria-hidden="true">
              {' '}*
            </span>
          </label>
          <input
            id="af-city"
            name="city"
            type="text"
            autoComplete="address-level2"
            className={inputClass('city')}
            value={values.city}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-required="true"
            aria-describedby={getError('city') ? 'af-city-error' : undefined}
            disabled={loading}
          />
          {getError('city') && (
            <span id="af-city-error" className="address-form__error" role="alert">
              {getError('city')}
            </span>
          )}
        </div>

        <div className="address-form__field">
          <label className="address-form__label" htmlFor="af-state">
            {FIELD_LABELS.state}
            <span className="address-form__required" aria-hidden="true">
              {' '}*
            </span>
          </label>
          <input
            id="af-state"
            name="state"
            type="text"
            autoComplete="address-level1"
            className={inputClass('state')}
            value={values.state}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-required="true"
            aria-describedby={getError('state') ? 'af-state-error' : undefined}
            disabled={loading}
          />
          {getError('state') && (
            <span id="af-state-error" className="address-form__error" role="alert">
              {getError('state')}
            </span>
          )}
        </div>
      </div>

      <div className="address-form__field address-form__field--pin">
        <label className="address-form__label" htmlFor="af-pinCode">
          {FIELD_LABELS.pinCode}
          <span className="address-form__required" aria-hidden="true">
            {' '}*
          </span>
        </label>
        <div className="address-form__pin-wrapper">
          <input
            id="af-pinCode"
            name="pinCode"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            className={inputClass('pinCode')}
            value={values.pinCode}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-required="true"
            aria-describedby={
              [
                getError('pinCode') ? 'af-pinCode-error' : '',
                serviceability ? 'af-pinCode-serviceability' : '',
              ]
                .filter(Boolean)
                .join(' ') || undefined
            }
            disabled={loading}
            maxLength={6}
          />
          {serviceabilityLoading && (
            <span className="address-form__pin-checking" aria-live="polite">
              Checking serviceability…
            </span>
          )}
        </div>
        {getError('pinCode') && (
          <span id="af-pinCode-error" className="address-form__error" role="alert">
            {getError('pinCode')}
          </span>
        )}
        {!serviceabilityLoading && serviceability !== null && (
          <span
            id="af-pinCode-serviceability"
            className={`address-form__serviceability address-form__serviceability--${
              serviceability.serviceable ? 'ok' : 'fail'
            }`}
            role="status"
            aria-live="polite"
          >
            {serviceability.serviceable ? (
              <>
                <svg
                  className="address-form__serviceability-icon"
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  focusable="false"
                >
                  <polyline
                    points="2,9 6,13 14,4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {serviceability.message || 'Delivery available to this PIN code.'}
              </>
            ) : (
              <>
                <svg
                  className="address-form__serviceability-icon"
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  focusable="false"
                >
                  <line
                    x1="3"
                    y1="3"
                    x2="13"
                    y2="13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="13"
                    y1="3"
                    x2="3"
                    y2="13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                {serviceability.message || 'Delivery not available to this PIN code.'}
              </>
            )}
          </span>
        )}
      </div>

      <div className="address-form__actions">
        <button
          type="submit"
          className="address-form__submit"
          disabled={
            loading ||
            serviceabilityLoading ||
            (serviceability !== null && serviceability.serviceable === false)
          }
        >
          {loading ? 'Saving…' : submitLabel}
        </button>
      </div>

      <style>{`
        .address-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .address-form__row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 480px) {
          .address-form__row {
            grid-template-columns: 1fr;
          }
        }

        .address-form__field {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }

        .address-form__label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }

        .address-form__required {
          color: #dc2626;
        }

        .address-form__input {
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

        .address-form__input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        .address-form__input--error {
          border-color: #dc2626;
        }

        .address-form__input--error:focus {
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15);
        }

        .address-form__input:disabled {
          background-color: #f9fafb;
          color: #6b7280;
          cursor: not-allowed;
        }

        .address-form__error {
          font-size: 0.8125rem;
          color: #dc2626;
          margin-top: 0.125rem;
        }

        .address-form__pin-wrapper {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .address-form__pin-wrapper .address-form__input {
          max-width: 12rem;
        }

        .address-form__pin-checking {
          font-size: 0.8125rem;
          color: #6b7280;
          font-style: italic;
        }

        .address-form__serviceability {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.8125rem;
          font-weight: 500;
          margin-top: 0.25rem;
        }

        .address-form__serviceability--ok {
          color: #16a34a;
        }

        .address-form__serviceability--fail {
          color: #dc2626;
        }

        .address-form__serviceability-icon {
          flex-shrink: 0;
        }

        .address-form__actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 0.5rem;
        }

        .address-form__submit {
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

        .address-form__submit:hover:not(:disabled) {
          background-color: #1d4ed8;
        }

        .address-form__submit:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
      `}</style>
    </form>
  );
}

export default AddressForm;
