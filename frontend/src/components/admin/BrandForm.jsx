import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const EMPTY_BRAND = {
  name: '',
  slug: '',
  description: '',
  website_url: '',
  logo_url: '',
  is_active: true,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const slugify = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

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

const validate = (brand) => {
  const errors = {};

  if (!brand.name.trim()) {
    errors.name = 'Brand name is required.';
  }

  if (!brand.slug.trim()) {
    errors.slug = 'Slug is required.';
  } else if (!/^[a-z0-9-]+$/.test(brand.slug.trim())) {
    errors.slug = 'Slug may only contain lowercase letters, numbers and hyphens.';
  }

  if (brand.website_url && brand.website_url.trim()) {
    try {
      new URL(brand.website_url.trim());
    } catch (_) {
      errors.website_url = 'Please enter a valid URL (e.g. https://example.com).';
    }
  }

  if (brand.logo_url && brand.logo_url.trim()) {
    try {
      new URL(brand.logo_url.trim());
    } catch (_) {
      errors.logo_url = 'Please enter a valid URL for the logo.';
    }
  }

  return errors;
};

// ---------------------------------------------------------------------------
// BrandForm
// ---------------------------------------------------------------------------

const BrandForm = ({
  initialBrand,
  onSubmit,
  onCancel,
  loading,
  submitLabel,
  serverError,
}) => {
  const [brand, setBrand] = useState(() => ({
    ...EMPTY_BRAND,
    ...initialBrand,
  }));

  const [errors, setErrors] = useState({});
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(
    Boolean(initialBrand?.slug)
  );

  // Auto-generate slug from name unless manually edited
  useEffect(() => {
    if (!slugManuallyEdited && brand.name) {
      setBrand((prev) => ({ ...prev, slug: slugify(brand.name) }));
    }
  }, [brand.name, slugManuallyEdited]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setBrand((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleSlugChange = useCallback((e) => {
    setSlugManuallyEdited(true);
    setBrand((prev) => ({ ...prev, slug: e.target.value }));
    setErrors((prev) => ({ ...prev, slug: undefined }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(brand);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      name: brand.name.trim(),
      slug: brand.slug.trim(),
      description: brand.description.trim(),
      website_url: brand.website_url.trim() || null,
      logo_url: brand.logo_url.trim() || null,
      is_active: brand.is_active,
    };

    try {
      await onSubmit(payload);
    } catch (_err) {
      // server error displayed via serverError prop
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {/* ------------------------------------------------------------------ */}
      {/* Section: Brand Details */}
      {/* ------------------------------------------------------------------ */}
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Brand Details</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Name */}
          <FormField
            label="Brand Name"
            htmlFor="brand-name"
            required
            error={errors.name}
          >
            <input
              id="brand-name"
              name="name"
              type="text"
              value={brand.name}
              onChange={handleChange}
              placeholder="e.g. Nike"
              className={errors.name ? errorInputCls : inputCls}
            />
          </FormField>

          {/* Slug */}
          <FormField
            label="Slug"
            htmlFor="brand-slug"
            required
            error={errors.slug}
            hint="URL-friendly identifier (auto-generated from name)."
          >
            <input
              id="brand-slug"
              name="slug"
              type="text"
              value={brand.slug}
              onChange={handleSlugChange}
              placeholder="e.g. nike"
              className={errors.slug ? errorInputCls : inputCls}
            />
          </FormField>

          {/* Website URL */}
          <FormField
            label="Website URL"
            htmlFor="brand-website-url"
            error={errors.website_url}
            hint="Official brand website (optional)."
          >
            <input
              id="brand-website-url"
              name="website_url"
              type="url"
              value={brand.website_url}
              onChange={handleChange}
              placeholder="https://example.com"
              className={errors.website_url ? errorInputCls : inputCls}
            />
          </FormField>

          {/* Logo URL */}
          <FormField
            label="Logo URL"
            htmlFor="brand-logo-url"
            error={errors.logo_url}
            hint="Direct URL to brand logo image (optional)."
          >
            <input
              id="brand-logo-url"
              name="logo_url"
              type="url"
              value={brand.logo_url}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
              className={errors.logo_url ? errorInputCls : inputCls}
            />
          </FormField>

          {/* Logo Preview */}
          {brand.logo_url && !errors.logo_url && (
            <div className="sm:col-span-2">
              <p className="mb-1.5 text-xs font-medium text-gray-500">Logo Preview</p>
              <div className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-3">
                <img
                  src={brand.logo_url}
                  alt="Brand logo preview"
                  className="h-16 w-auto max-w-xs object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div className="sm:col-span-2">
            <FormField
              label="Description"
              htmlFor="brand-description"
            >
              <textarea
                id="brand-description"
                name="description"
                rows={3}
                value={brand.description}
                onChange={handleChange}
                placeholder="Describe the brand…"
                className={inputCls + ' resize-y'}
              />
            </FormField>
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3 sm:col-span-2">
            <input
              id="brand-active"
              name="is_active"
              type="checkbox"
              checked={brand.is_active}
              onChange={handleChange}
              className="h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="brand-active"
              className="cursor-pointer text-sm font-medium text-gray-700"
            >
              Active (visible to customers)
            </label>
          </div>
        </div>
      </section>

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
          {loading ? 'Saving…' : submitLabel || 'Save Brand'}
        </button>
      </div>
    </form>
  );
};

BrandForm.propTypes = {
  initialBrand: PropTypes.shape({
    name: PropTypes.string,
    slug: PropTypes.string,
    description: PropTypes.string,
    website_url: PropTypes.string,
    logo_url: PropTypes.string,
    is_active: PropTypes.bool,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  loading: PropTypes.bool,
  submitLabel: PropTypes.string,
  serverError: PropTypes.string,
};

BrandForm.defaultProps = {
  initialBrand: {},
  onCancel: null,
  loading: false,
  submitLabel: 'Save Brand',
  serverError: null,
};

export default BrandForm;
