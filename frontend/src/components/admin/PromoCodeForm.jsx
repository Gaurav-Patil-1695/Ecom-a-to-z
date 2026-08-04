import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const PROMO_TYPES = [
  { value: 'percentage', label: 'Percentage (%)' },
  { value: 'flat', label: 'Flat Amount (₹)' },
];

const EMPTY_PROMO_CODE = {
  code: '',
  type: 'percentage',
  value: '',
  expiry_date: '',
  min_order_value: '',
  max_uses: '',
  is_active: true,
  description: '',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const toUpperCode = (str) => str.toUpperCase().replace(/[^A-Z0-9_-]/g, '');

const getTodayString = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const FormField = ({ label, htmlFor, required, error, children, hint }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
      {label}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
    {children}
    {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
    {error && (
      <p className="text-xs font-medium text-red-600" role="alert">
        {error}
      </p>
    )}
  </div>
);

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  htmlFor: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
  children: PropTypes.node.isRequired,
  hint: PropTypes.string,
};

FormField.defaultProps = {
  htmlFor: undefined,
  required: false,
  error: null,
  hint: null,
};

const inputCls =
  'block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm ' +
  'placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ' +
  'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400';

const errorInputCls =
  'block w-full rounded-lg border border-red-400 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm ' +
  'placeholder:text-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 ' +
  'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400';

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const validate = (promo) => {
  const errors = {};

  if (!promo.code.trim()) {
    errors.code = 'Promo code is required.';
  } else if (!/^[A-Z0-9_-]+$/.test(promo.code.trim())) {
    errors.code = 'Promo code may only contain uppercase letters, numbers, hyphens and underscores.';
  }

  if (!promo.type) {
    errors.type = 'Discount type is required.';
  }

  const val = parseFloat(promo.value);
  if (promo.value === '' || isNaN(val) || val <= 0) {
    errors.value = 'Discount value must be greater than 0.';
  } else if (promo.type === 'percentage' && val > 100) {
    errors.value = 'Percentage discount cannot exceed 100.';
  }

  if (!promo.expiry_date) {
    errors.expiry_date = 'Expiry date is required.';
  } else if (promo.expiry_date < getTodayString()) {
    errors.expiry_date = 'Expiry date must be today or in the future.';
  }

  if (promo.min_order_value !== '' && promo.min_order_value !== null && promo.min_order_value !== undefined) {
    const mov = parseFloat(promo.min_order_value);
    if (isNaN(mov) || mov < 0) {
      errors.min_order_value = 'Minimum order value must be 0 or greater.';
    }
  }

  if (promo.max_uses !== '' && promo.max_uses !== null && promo.max_uses !== undefined) {
    const mu = parseInt(promo.max_uses, 10);
    if (isNaN(mu) || mu < 1) {
      errors.max_uses = 'Maximum uses must be at least 1.';
    }
  }

  return errors;
};

// ---------------------------------------------------------------------------
// PromoCodeForm
// ---------------------------------------------------------------------------

const PromoCodeForm = ({
  initialPromoCode,
  onSubmit,
  onCancel,
  loading,
  submitLabel,
  serverError,
}) => {
  const [promo, setPromo] = useState(() => ({
    ...EMPTY_PROMO_CODE,
    ...initialPromoCode,
    code: initialPromoCode?.code
      ? initialPromoCode.code.toUpperCase()
      : '',
    value:
      initialPromoCode?.value !== undefined && initialPromoCode?.value !== null
        ? String(initialPromoCode.value)
        : '',
    min_order_value:
      initialPromoCode?.min_order_value !== undefined &&
      initialPromoCode?.min_order_value !== null
        ? String(initialPromoCode.min_order_value)
        : '',
    max_uses:
      initialPromoCode?.max_uses !== undefined &&
      initialPromoCode?.max_uses !== null
        ? String(initialPromoCode.max_uses)
        : '',
    expiry_date: initialPromoCode?.expiry_date
      ? initialPromoCode.expiry_date.slice(0, 10)
      : '',
  }));

  const [errors, setErrors] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setPromo((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleCodeChange = useCallback((e) => {
    const cleaned = toUpperCode(e.target.value);
    setPromo((prev) => ({ ...prev, code: cleaned }));
    setErrors((prev) => ({ ...prev, code: undefined }));
  }, []);

  const handleTypeChange = useCallback((e) => {
    const newType = e.target.value;
    setPromo((prev) => {
      // If switching to percentage and current value > 100, clear it
      const currentVal = parseFloat(prev.value);
      const shouldClearValue =
        newType === 'percentage' && !isNaN(currentVal) && currentVal > 100;
      return {
        ...prev,
        type: newType,
        value: shouldClearValue ? '' : prev.value,
      };
    });
    setErrors((prev) => ({ ...prev, type: undefined, value: undefined }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(promo);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      code: promo.code.trim(),
      type: promo.type,
      value: parseFloat(promo.value),
      expiry_date: promo.expiry_date,
      min_order_value:
        promo.min_order_value !== '' ? parseFloat(promo.min_order_value) : null,
      max_uses:
        promo.max_uses !== '' ? parseInt(promo.max_uses, 10) : null,
      is_active: promo.is_active,
      description: promo.description.trim() || null,
    };

    try {
      await onSubmit(payload);
    } catch (_err) {
      // server error displayed via serverError prop
    }
  };

  const today = getTodayString();

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {/* ------------------------------------------------------------------ */}
      {/* Section: Promo Code Details */}
      {/* ------------------------------------------------------------------ */}
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Promo Code Details</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Code */}
          <FormField
            label="Promo Code"
            htmlFor="promo-code"
            required
            error={errors.code}
            hint="Uppercase letters, numbers, hyphens and underscores only."
          >
            <input
              id="promo-code"
              name="code"
              type="text"
              value={promo.code}
              onChange={handleCodeChange}
              placeholder="e.g. SUMMER20"
              maxLength={64}
              className={errors.code ? errorInputCls : inputCls}
              autoComplete="off"
              spellCheck={false}
            />
          </FormField>

          {/* Expiry Date */}
          <FormField
            label="Expiry Date"
            htmlFor="promo-expiry-date"
            required
            error={errors.expiry_date}
          >
            <input
              id="promo-expiry-date"
              name="expiry_date"
              type="date"
              value={promo.expiry_date}
              onChange={handleChange}
              min={today}
              className={errors.expiry_date ? errorInputCls : inputCls}
            />
          </FormField>

          {/* Discount Type */}
          <FormField
            label="Discount Type"
            htmlFor="promo-type"
            required
            error={errors.type}
          >
            <div className="flex gap-4 pt-1">
              {PROMO_TYPES.map((opt) => (
                <label
                  key={opt.value}
                  htmlFor={`promo-type-${opt.value}`}
                  className="inline-flex cursor-pointer items-center gap-2"
                >
                  <input
                    id={`promo-type-${opt.value}`}
                    name="type"
                    type="radio"
                    value={opt.value}
                    checked={promo.type === opt.value}
                    onChange={handleTypeChange}
                    className="h-4 w-4 cursor-pointer border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>
          </FormField>

          {/* Discount Value */}
          <FormField
            label={
              promo.type === 'percentage'
                ? 'Discount Value (%)'
                : 'Discount Value (₹)'
            }
            htmlFor="promo-value"
            required
            error={errors.value}
            hint={
              promo.type === 'percentage'
                ? 'Enter a percentage between 1 and 100.'
                : 'Enter the flat rupee amount to discount.'
            }
          >
            <div className="relative">
              <span
                className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-gray-400"
                aria-hidden="true"
              >
                {promo.type === 'percentage' ? '%' : '₹'}
              </span>
              <input
                id="promo-value"
                name="value"
                type="number"
                min="0.01"
                max={promo.type === 'percentage' ? 100 : undefined}
                step={promo.type === 'percentage' ? '0.01' : '0.01'}
                value={promo.value}
                onChange={handleChange}
                placeholder={promo.type === 'percentage' ? '10' : '100'}
                className={
                  (errors.value ? errorInputCls : inputCls) + ' pl-8'
                }
              />
            </div>
          </FormField>

          {/* Minimum Order Value */}
          <FormField
            label="Minimum Order Value (₹)"
            htmlFor="promo-min-order-value"
            error={errors.min_order_value}
            hint="Optional. Leave blank for no minimum."
          >
            <div className="relative">
              <span
                className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-gray-400"
                aria-hidden="true"
              >
                ₹
              </span>
              <input
                id="promo-min-order-value"
                name="min_order_value"
                type="number"
                min="0"
                step="0.01"
                value={promo.min_order_value}
                onChange={handleChange}
                placeholder="e.g. 500"
                className={
                  (errors.min_order_value ? errorInputCls : inputCls) + ' pl-8'
                }
              />
            </div>
          </FormField>

          {/* Max Uses */}
          <FormField
            label="Maximum Uses"
            htmlFor="promo-max-uses"
            error={errors.max_uses}
            hint="Optional. Leave blank for unlimited uses."
          >
            <input
              id="promo-max-uses"
              name="max_uses"
              type="number"
              min="1"
              step="1"
              value={promo.max_uses}
              onChange={handleChange}
              placeholder="e.g. 100"
              className={errors.max_uses ? errorInputCls : inputCls}
            />
          </FormField>

          {/* Description */}
          <div className="sm:col-span-2">
            <FormField
              label="Description"
              htmlFor="promo-description"
              hint="Optional internal note about this promo code."
            >
              <textarea
                id="promo-description"
                name="description"
                rows={3}
                value={promo.description}
                onChange={handleChange}
                placeholder="e.g. Summer sale discount for new users…"
                className={inputCls + ' resize-y'}
              />
            </FormField>
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3 sm:col-span-2">
            <input
              id="promo-active"
              name="is_active"
              type="checkbox"
              checked={promo.is_active}
              onChange={handleChange}
              className="h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="promo-active"
              className="cursor-pointer text-sm font-medium text-gray-700"
            >
              Active (code can be applied by customers)
            </label>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Preview */}
      {/* ------------------------------------------------------------------ */}
      {promo.code && promo.value && !errors.code && !errors.value && (
        <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-400">
            Preview
          </p>
          <p className="mt-1 text-sm text-indigo-800">
            Code{' '}
            <span className="rounded bg-indigo-100 px-1.5 py-0.5 font-mono font-semibold">
              {promo.code}
            </span>{' '}
            gives{' '}
            <span className="font-semibold">
              {promo.type === 'percentage'
                ? `${promo.value}% off`
                : `₹${promo.value} off`}
            </span>
            {promo.min_order_value
              ? ` on orders above ₹${promo.min_order_value}`
              : ''}
            {promo.expiry_date ? `, expires ${promo.expiry_date}` : ''}
            {promo.max_uses ? `, up to ${promo.max_uses} uses` : ''}.
          </p>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Server error */}
      {/* ------------------------------------------------------------------ */}
      {serverError && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {serverError}
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Actions */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex items-center justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:text-gray-400"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          {loading && (
            <svg
              className="-ml-1 h-4 w-4 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
              />
            </svg>
          )}
          {loading ? 'Saving…' : submitLabel || 'Save Promo Code'}
        </button>
      </div>
    </form>
  );
};

PromoCodeForm.propTypes = {
  initialPromoCode: PropTypes.shape({
    code: PropTypes.string,
    type: PropTypes.oneOf(['percentage', 'flat']),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    expiry_date: PropTypes.string,
    min_order_value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    max_uses: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    is_active: PropTypes.bool,
    description: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  loading: PropTypes.bool,
  submitLabel: PropTypes.string,
  serverError: PropTypes.string,
};

PromoCodeForm.defaultProps = {
  initialPromoCode: {},
  onCancel: null,
  loading: false,
  submitLabel: 'Save Promo Code',
  serverError: null,
};

export default PromoCodeForm;
