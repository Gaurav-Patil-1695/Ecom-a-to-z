import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const EMPTY_CATEGORY = {
  name: '',
  slug: '',
  description: '',
  parent_id: '',
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

const validate = (category) => {
  const errors = {};

  if (!category.name.trim()) {
    errors.name = 'Category name is required.';
  }

  if (!category.slug.trim()) {
    errors.slug = 'Slug is required.';
  } else if (!/^[a-z0-9-]+$/.test(category.slug.trim())) {
    errors.slug = 'Slug may only contain lowercase letters, numbers and hyphens.';
  }

  return errors;
};

// ---------------------------------------------------------------------------
// CategoryForm
// ---------------------------------------------------------------------------

const CategoryForm = ({
  initialCategory,
  categories,
  editingCategoryId,
  onSubmit,
  onCancel,
  loading,
  submitLabel,
  serverError,
}) => {
  const [category, setCategory] = useState(() => ({
    ...EMPTY_CATEGORY,
    ...initialCategory,
  }));

  const [errors, setErrors] = useState({});
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(
    Boolean(initialCategory?.slug)
  );

  // Auto-generate slug from name unless manually edited
  useEffect(() => {
    if (!slugManuallyEdited && category.name) {
      setCategory((prev) => ({ ...prev, slug: slugify(category.name) }));
    }
  }, [category.name, slugManuallyEdited]);

  // Build the filtered parent list: exclude the category being edited and
  // any descendants to prevent cycles. When editingCategoryId is null/undefined
  // all categories are valid parents.
  const parentOptions = categories.filter((cat) => {
    if (!editingCategoryId) return true;
    return String(cat.id) !== String(editingCategoryId);
  });

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setCategory((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleSlugChange = useCallback((e) => {
    setSlugManuallyEdited(true);
    setCategory((prev) => ({ ...prev, slug: e.target.value }));
    setErrors((prev) => ({ ...prev, slug: undefined }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(category);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      name: category.name.trim(),
      slug: category.slug.trim(),
      description: category.description.trim(),
      parent_id: category.parent_id || null,
      is_active: category.is_active,
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
      {/* Section: Category Details */}
      {/* ------------------------------------------------------------------ */}
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Category Details</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Name */}
          <FormField
            label="Category Name"
            htmlFor="category-name"
            required
            error={errors.name}
          >
            <input
              id="category-name"
              name="name"
              type="text"
              value={category.name}
              onChange={handleChange}
              placeholder="e.g. Footwear"
              className={errors.name ? errorInputCls : inputCls}
            />
          </FormField>

          {/* Slug */}
          <FormField
            label="Slug"
            htmlFor="category-slug"
            required
            error={errors.slug}
            hint="URL-friendly identifier (auto-generated from name)."
          >
            <input
              id="category-slug"
              name="slug"
              type="text"
              value={category.slug}
              onChange={handleSlugChange}
              placeholder="e.g. footwear"
              className={errors.slug ? errorInputCls : inputCls}
            />
          </FormField>

          {/* Parent Category */}
          <div className="sm:col-span-2">
            <FormField
              label="Parent Category"
              htmlFor="category-parent"
              hint="Leave empty to create a top-level category."
            >
              <select
                id="category-parent"
                name="parent_id"
                value={category.parent_id || ''}
                onChange={handleChange}
                className={inputCls}
              >
                <option value="">— None (top-level) —</option>
                {parentOptions.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <FormField
              label="Description"
              htmlFor="category-description"
            >
              <textarea
                id="category-description"
                name="description"
                rows={3}
                value={category.description}
                onChange={handleChange}
                placeholder="Describe the category…"
                className={inputCls + ' resize-y'}
              />
            </FormField>
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3 sm:col-span-2">
            <input
              id="category-active"
              name="is_active"
              type="checkbox"
              checked={category.is_active}
              onChange={handleChange}
              className="h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="category-active"
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
          {loading ? 'Saving…' : submitLabel || 'Save Category'}
        </button>
      </div>
    </form>
  );
};

CategoryForm.propTypes = {
  initialCategory: PropTypes.shape({
    name: PropTypes.string,
    slug: PropTypes.string,
    description: PropTypes.string,
    parent_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    is_active: PropTypes.bool,
  }),
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  editingCategoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  loading: PropTypes.bool,
  submitLabel: PropTypes.string,
  serverError: PropTypes.string,
};

CategoryForm.defaultProps = {
  initialCategory: {},
  categories: [],
  editingCategoryId: null,
  onCancel: null,
  loading: false,
  submitLabel: 'Save Category',
  serverError: null,
};

export default CategoryForm;
