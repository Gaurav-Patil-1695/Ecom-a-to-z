import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '@/api/client';

const DISCOUNT_TYPE_PERCENTAGE = 'percentage';
const DISCOUNT_TYPE_FIXED = 'fixed';

function FormField({ label, htmlFor, error, required, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function validate(form) {
  const errors = {};

  if (!form.code.trim()) {
    errors.code = 'Promo code is required.';
  } else if (!/^[A-Z0-9_-]{3,32}$/i.test(form.code.trim())) {
    errors.code = 'Code must be 3\u201332 characters (letters, numbers, hyphens, underscores).';
  }

  if (!form.discount_value && form.discount_value !== 0) {
    errors.discount_value = 'Discount value is required.';
  } else {
    const val = Number(form.discount_value);
    if (isNaN(val) || val <= 0) {
      errors.discount_value = 'Discount value must be a positive number.';
    } else if (form.discount_type === DISCOUNT_TYPE_PERCENTAGE && val > 100) {
      errors.discount_value = 'Percentage discount cannot exceed 100.';
    }
  }

  if (form.max_discount_amount !== '') {
    const val = Number(form.max_discount_amount);
    if (isNaN(val) || val <= 0) {
      errors.max_discount_amount = 'Max discount amount must be a positive number.';
    }
  }

  if (form.min_order_amount !== '') {
    const val = Number(form.min_order_amount);
    if (isNaN(val) || val < 0) {
      errors.min_order_amount = 'Minimum order amount must be zero or greater.';
    }
  }

  if (form.usage_limit !== '') {
    const val = Number(form.usage_limit);
    if (!Number.isInteger(val) || val <= 0) {
      errors.usage_limit = 'Usage limit must be a positive integer.';
    }
  }

  if (form.expires_at) {
    const expiry = new Date(form.expires_at);
    if (isNaN(expiry.getTime())) {
      errors.expires_at = 'Expiry date is invalid.';
    }
  }

  return errors;
}

function toLocalDatetimeValue(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminPromotionEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    api
      .get(`/promo-codes/${id}`)
      .then((res) => {
        if (cancelled) return;
        const p = res.data?.data ?? res.data;
        setForm({
          code: p.code ?? '',
          discount_type: p.discount_type ?? DISCOUNT_TYPE_PERCENTAGE,
          discount_value: p.discount_value != null ? String(p.discount_value) : '',
          max_discount_amount:
            p.max_discount_amount != null ? String(p.max_discount_amount) : '',
          min_order_amount:
            p.min_order_amount != null ? String(p.min_order_amount) : '',
          usage_limit: p.usage_limit != null ? String(p.usage_limit) : '',
          expires_at: toLocalDatetimeValue(p.expires_at),
          is_active: p.is_active ?? true,
        });
      })
      .catch(() => {
        if (cancelled) return;
        setLoadError('Failed to load promo code. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleDiscountTypeChange = (type) => {
    setForm((prev) => ({
      ...prev,
      discount_type: type,
      max_discount_amount: type === DISCOUNT_TYPE_FIXED ? '' : prev.max_discount_amount,
    }));
    setErrors((prev) => ({ ...prev, discount_type: undefined, max_discount_amount: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        discount_type: form.discount_type,
        discount_value: Number(form.discount_value),
        is_active: form.is_active,
      };
      if (form.discount_type === DISCOUNT_TYPE_PERCENTAGE && form.max_discount_amount !== '') {
        payload.max_discount_amount = Number(form.max_discount_amount);
      } else {
        payload.max_discount_amount = null;
      }
      payload.min_order_amount =
        form.min_order_amount !== '' ? Number(form.min_order_amount) : null;
      payload.usage_limit = form.usage_limit !== '' ? Number(form.usage_limit) : null;
      payload.expires_at = form.expires_at ? new Date(form.expires_at).toISOString() : null;

      await api.put(`/promo-codes/${id}`, payload);
      navigate('/admin/promotions');
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        'Failed to update promo code. Please try again.';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = (field) =>
    `w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-300'
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back link */}
        <div className="mb-6">
          <Link
            to="/admin/promotions"
            className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-900 font-medium"
          >
            <img
              src="/src/assets/icons/chevron-left.svg"
              alt=""
              className="w-4 h-4"
              aria-hidden="true"
            />
            Back to Promo Codes
          </Link>
        </div>

        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Promo Code</h1>
          <p className="mt-1 text-sm text-gray-500">
            Update the details for this promotional code.
          </p>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : loadError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700 font-medium">{loadError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          /* Form card */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {submitError && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-700 font-medium">{submitError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="space-y-6">
                {/* Code */}
                <FormField label="Promo Code" htmlFor="code" error={errors.code} required>
                  <input
                    id="code"
                    name="code"
                    type="text"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="e.g. SUMMER20"
                    autoComplete="off"
                    className={inputCls('code')}
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    3\u201332 characters; letters, numbers, hyphens and underscores allowed.
                  </p>
                </FormField>

                {/* Discount type */}
                <FormField
                  label="Discount Type"
                  htmlFor="discount_type"
                  error={errors.discount_type}
                  required
                >
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleDiscountTypeChange(DISCOUNT_TYPE_PERCENTAGE)}
                      className={`flex-1 py-2 px-4 border rounded-md text-sm font-medium transition-colors ${
                        form.discount_type === DISCOUNT_TYPE_PERCENTAGE
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Percentage (%)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDiscountTypeChange(DISCOUNT_TYPE_FIXED)}
                      className={`flex-1 py-2 px-4 border rounded-md text-sm font-medium transition-colors ${
                        form.discount_type === DISCOUNT_TYPE_FIXED
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Fixed Amount (\u20b9)
                    </button>
                  </div>
                </FormField>

                {/* Discount value */}
                <FormField
                  label={
                    form.discount_type === DISCOUNT_TYPE_PERCENTAGE
                      ? 'Discount Percentage'
                      : 'Discount Amount (\u20b9)'
                  }
                  htmlFor="discount_value"
                  error={errors.discount_value}
                  required
                >
                  <div className="relative">
                    {form.discount_type === DISCOUNT_TYPE_FIXED && (
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
                        \u20b9
                      </span>
                    )}
                    <input
                      id="discount_value"
                      name="discount_value"
                      type="number"
                      min="0"
                      max={
                        form.discount_type === DISCOUNT_TYPE_PERCENTAGE ? '100' : undefined
                      }
                      step="0.01"
                      value={form.discount_value}
                      onChange={handleChange}
                      placeholder={
                        form.discount_type === DISCOUNT_TYPE_PERCENTAGE ? '0\u2013100' : '0.00'
                      }
                      className={`${inputCls('discount_value')} ${
                        form.discount_type === DISCOUNT_TYPE_FIXED ? 'pl-7' : ''
                      }`}
                    />
                    {form.discount_type === DISCOUNT_TYPE_PERCENTAGE && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
                        %
                      </span>
                    )}
                  </div>
                </FormField>

                {/* Max discount (only for percentage) */}
                {form.discount_type === DISCOUNT_TYPE_PERCENTAGE && (
                  <FormField
                    label="Max Discount Amount (\u20b9)"
                    htmlFor="max_discount_amount"
                    error={errors.max_discount_amount}
                  >
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
                        \u20b9
                      </span>
                      <input
                        id="max_discount_amount"
                        name="max_discount_amount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.max_discount_amount}
                        onChange={handleChange}
                        placeholder="Optional cap on discount"
                        className={`${inputCls('max_discount_amount')} pl-7`}
                      />
                    </div>
                  </FormField>
                )}

                {/* Min order amount */}
                <FormField
                  label="Minimum Order Amount (\u20b9)"
                  htmlFor="min_order_amount"
                  error={errors.min_order_amount}
                >
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
                      \u20b9
                    </span>
                    <input
                      id="min_order_amount"
                      name="min_order_amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.min_order_amount}
                      onChange={handleChange}
                      placeholder="Optional minimum cart value"
                      className={`${inputCls('min_order_amount')} pl-7`}
                    />
                  </div>
                </FormField>

                {/* Usage limit */}
                <FormField
                  label="Usage Limit"
                  htmlFor="usage_limit"
                  error={errors.usage_limit}
                >
                  <input
                    id="usage_limit"
                    name="usage_limit"
                    type="number"
                    min="1"
                    step="1"
                    value={form.usage_limit}
                    onChange={handleChange}
                    placeholder="Leave blank for unlimited"
                    className={inputCls('usage_limit')}
                  />
                </FormField>

                {/* Expiry date */}
                <FormField
                  label="Expiry Date"
                  htmlFor="expires_at"
                  error={errors.expires_at}
                >
                  <input
                    id="expires_at"
                    name="expires_at"
                    type="datetime-local"
                    value={form.expires_at}
                    onChange={handleChange}
                    className={inputCls('expires_at')}
                  />
                  <p className="mt-1 text-xs text-gray-400">Leave blank for no expiry.</p>
                </FormField>

                {/* Active toggle */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={form.is_active}
                    onClick={() =>
                      setForm((prev) => ({ ...prev, is_active: !prev.is_active }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      form.is_active ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        form.is_active ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-sm font-medium text-gray-700">
                    {form.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                <Link
                  to="/admin/promotions"
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving\u2026
                    </>
                  ) : (
                    <>
                      <img
                        src="/src/assets/icons/check.svg"
                        alt=""
                        className="w-4 h-4"
                        aria-hidden="true"
                      />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
