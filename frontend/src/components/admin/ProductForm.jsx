import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const EMPTY_SKU = {
  id: null,
  sku_code: '',
  price: '',
  mrp: '',
  stock: '',
  attributes: {},
  _key: Math.random().toString(36).slice(2),
};

const EMPTY_PRODUCT = {
  name: '',
  slug: '',
  description: '',
  category_id: '',
  brand_id: '',
  is_active: true,
  tags: '',
};

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------
const slugify = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const randomKey = () => Math.random().toString(36).slice(2);

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const FormField = ({ label, htmlFor, required, error, children, hint }) => (
  <div className="flex flex-col gap-1">
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium text-gray-700"
    >
      {label}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
    {children}
    {hint && !error && (
      <p className="text-xs text-gray-400">{hint}</p>
    )}
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
// SKU Row
// ---------------------------------------------------------------------------

const SkuRow = ({ sku, index, errors, onChange, onRemove, attributeKeys, canRemove }) => {
  const fieldId = (field) => `sku-${sku._key}-${field}`;
  const err = (field) => errors?.[`skus[${index}].${field}`];

  const handleAttrChange = (key, value) => {
    onChange(sku._key, 'attributes', { ...sku.attributes, [key]: value });
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">SKU #{index + 1}</span>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(sku._key)}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label={`Remove SKU ${index + 1}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-3.5 w-3.5"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193v-.443A2.75 2.75 0 0011.25 1h-2.5zm0 1.5h2.5c.69 0 1.25.56 1.25 1.25v.33a43.52 43.52 0 00-5 0v-.33c0-.69.56-1.25 1.25-1.25zM5.23 8.5l.812 10.148a1.25 1.25 0 001.247 1.102h4.421a1.25 1.25 0 001.247-1.102L13.77 8.5H5.23z"
                clipRule="evenodd"
              />
            </svg>
            Remove
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <FormField label="SKU Code" htmlFor={fieldId('sku_code')} required error={err('sku_code')}>
          <input
            id={fieldId('sku_code')}
            type="text"
            value={sku.sku_code}
            onChange={(e) => onChange(sku._key, 'sku_code', e.target.value)}
            placeholder="e.g. PROD-RED-M"
            className={err('sku_code') ? errorInputCls : inputCls}
          />
        </FormField>

        <FormField label="Price (₹)" htmlFor={fieldId('price')} required error={err('price')}>
          <input
            id={fieldId('price')}
            type="number"
            min="0"
            step="0.01"
            value={sku.price}
            onChange={(e) => onChange(sku._key, 'price', e.target.value)}
            placeholder="0.00"
            className={err('price') ? errorInputCls : inputCls}
          />
        </FormField>

        <FormField label="MRP (₹)" htmlFor={fieldId('mrp')} required error={err('mrp')}>
          <input
            id={fieldId('mrp')}
            type="number"
            min="0"
            step="0.01"
            value={sku.mrp}
            onChange={(e) => onChange(sku._key, 'mrp', e.target.value)}
            placeholder="0.00"
            className={err('mrp') ? errorInputCls : inputCls}
          />
        </FormField>

        <FormField label="Stock" htmlFor={fieldId('stock')} required error={err('stock')}>
          <input
            id={fieldId('stock')}
            type="number"
            min="0"
            step="1"
            value={sku.stock}
            onChange={(e) => onChange(sku._key, 'stock', e.target.value)}
            placeholder="0"
            className={err('stock') ? errorInputCls : inputCls}
          />
        </FormField>
      </div>

      {attributeKeys.length > 0 && (
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {attributeKeys.map((attrKey) => (
            <FormField key={attrKey} label={attrKey} htmlFor={fieldId(`attr-${attrKey}`)}>
              <input
                id={fieldId(`attr-${attrKey}`)}
                type="text"
                value={sku.attributes[attrKey] || ''}
                onChange={(e) => handleAttrChange(attrKey, e.target.value)}
                placeholder={`Enter ${attrKey}`}
                className={inputCls}
              />
            </FormField>
          ))}
        </div>
      )}
    </div>
  );
};

SkuRow.propTypes = {
  sku: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  errors: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  attributeKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  canRemove: PropTypes.bool.isRequired,
};

SkuRow.defaultProps = {
  errors: {},
};

// ---------------------------------------------------------------------------
// AttributeKeyManager
// ---------------------------------------------------------------------------

const AttributeKeyManager = ({ attributeKeys, onAdd, onRemove }) => {
  const [newKey, setNewKey] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    const trimmed = newKey.trim();
    if (!trimmed) {
      setError('Attribute name cannot be empty.');
      return;
    }
    if (attributeKeys.includes(trimmed)) {
      setError('Attribute already exists.');
      return;
    }
    onAdd(trimmed);
    setNewKey('');
    setError('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-4">
      <p className="mb-2 text-sm font-semibold text-gray-700">SKU Variant Attributes</p>
      <p className="mb-3 text-xs text-gray-400">
        Define attribute keys (e.g. Color, Size) that apply to all SKUs below.
      </p>

      {attributeKeys.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attributeKeys.map((key) => (
            <span
              key={key}
              className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700"
            >
              {key}
              <button
                type="button"
                onClick={() => onRemove(key)}
                className="ml-0.5 flex-shrink-0 text-indigo-400 hover:text-indigo-700 focus:outline-none"
                aria-label={`Remove attribute ${key}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={newKey}
          onChange={(e) => { setNewKey(e.target.value); setError(''); }}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Color"
          className={inputCls + ' flex-1'}
          aria-label="New attribute key"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          Add
        </button>
      </div>
      {error && (
        <p className="mt-1 text-xs font-medium text-red-600" role="alert">{error}</p>
      )}
    </div>
  );
};

AttributeKeyManager.propTypes = {
  attributeKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const validate = (product, skus) => {
  const errors = {};

  if (!product.name.trim()) {
    errors.name = 'Product name is required.';
  }
  if (!product.slug.trim()) {
    errors.slug = 'Slug is required.';
  } else if (!/^[a-z0-9-]+$/.test(product.slug.trim())) {
    errors.slug = 'Slug may only contain lowercase letters, numbers and hyphens.';
  }
  if (!product.category_id) {
    errors.category_id = 'Category is required.';
  }
  if (!product.brand_id) {
    errors.brand_id = 'Brand is required.';
  }

  skus.forEach((sku, index) => {
    if (!sku.sku_code.trim()) {
      errors[`skus[${index}].sku_code`] = 'SKU code is required.';
    }
    const price = parseFloat(sku.price);
    if (sku.price === '' || isNaN(price) || price < 0) {
      errors[`skus[${index}].price`] = 'Valid price is required.';
    }
    const mrp = parseFloat(sku.mrp);
    if (sku.mrp === '' || isNaN(mrp) || mrp < 0) {
      errors[`skus[${index}].mrp`] = 'Valid MRP is required.';
    }
    const stock = parseInt(sku.stock, 10);
    if (sku.stock === '' || isNaN(stock) || stock < 0) {
      errors[`skus[${index}].stock`] = 'Valid stock quantity is required.';
    }
  });

  return errors;
};

// ---------------------------------------------------------------------------
// ProductForm
// ---------------------------------------------------------------------------

const ProductForm = ({
  initialProduct,
  initialSkus,
  categories,
  brands,
  onSubmit,
  onCancel,
  loading,
  submitLabel,
  serverError,
}) => {
  const [product, setProduct] = useState(() => ({
    ...EMPTY_PRODUCT,
    ...initialProduct,
    tags:
      Array.isArray(initialProduct?.tags)
        ? initialProduct.tags.join(', ')
        : initialProduct?.tags || '',
  }));

  const [skus, setSkus] = useState(() => {
    if (initialSkus && initialSkus.length > 0) {
      return initialSkus.map((s) => ({ ...EMPTY_SKU, ...s, _key: randomKey() }));
    }
    return [{ ...EMPTY_SKU, _key: randomKey() }];
  });

  const [attributeKeys, setAttributeKeys] = useState(() => {
    if (initialSkus && initialSkus.length > 0) {
      const keys = new Set();
      initialSkus.forEach((s) => {
        if (s.attributes && typeof s.attributes === 'object') {
          Object.keys(s.attributes).forEach((k) => keys.add(k));
        }
      });
      return Array.from(keys);
    }
    return [];
  });

  const [errors, setErrors] = useState({});
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(
    Boolean(initialProduct?.slug)
  );

  // Auto-generate slug from name unless manually edited
  useEffect(() => {
    if (!slugManuallyEdited && product.name) {
      setProduct((prev) => ({ ...prev, slug: slugify(product.name) }));
    }
  }, [product.name, slugManuallyEdited]);

  const handleProductChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleSlugChange = useCallback((e) => {
    setSlugManuallyEdited(true);
    setProduct((prev) => ({ ...prev, slug: e.target.value }));
    setErrors((prev) => ({ ...prev, slug: undefined }));
  }, []);

  // SKU management
  const handleSkuChange = useCallback((key, field, value) => {
    setSkus((prev) =>
      prev.map((s) => (s._key === key ? { ...s, [field]: value } : s))
    );
  }, []);

  const handleAddSku = useCallback(() => {
    setSkus((prev) => [
      ...prev,
      { ...EMPTY_SKU, _key: randomKey(), attributes: {} },
    ]);
  }, []);

  const handleRemoveSku = useCallback((key) => {
    setSkus((prev) => prev.filter((s) => s._key !== key));
  }, []);

  // Attribute key management
  const handleAddAttributeKey = useCallback((key) => {
    setAttributeKeys((prev) => [...prev, key]);
  }, []);

  const handleRemoveAttributeKey = useCallback((key) => {
    setAttributeKeys((prev) => prev.filter((k) => k !== key));
    setSkus((prev) =>
      prev.map((s) => {
        const attrs = { ...s.attributes };
        delete attrs[key];
        return { ...s, attributes: attrs };
      })
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(product, skus);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      product: {
        name: product.name.trim(),
        slug: product.slug.trim(),
        description: product.description.trim(),
        category_id: product.category_id,
        brand_id: product.brand_id,
        is_active: product.is_active,
        tags: product.tags
          ? product.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
      },
      skus: skus.map(({ _key, ...rest }) => ({
        ...rest,
        price: parseFloat(rest.price),
        mrp: parseFloat(rest.mrp),
        stock: parseInt(rest.stock, 10),
        sku_code: rest.sku_code.trim(),
      })),
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
      {/* Section: Basic Information */}
      {/* ------------------------------------------------------------------ */}
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Basic Information</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Product Name" htmlFor="product-name" required error={errors.name}>
            <input
              id="product-name"
              name="name"
              type="text"
              value={product.name}
              onChange={handleProductChange}
              placeholder="e.g. Classic White Sneaker"
              className={errors.name ? errorInputCls : inputCls}
            />
          </FormField>

          <FormField
            label="Slug"
            htmlFor="product-slug"
            required
            error={errors.slug}
            hint="URL-friendly identifier (auto-generated from name)."
          >
            <input
              id="product-slug"
              name="slug"
              type="text"
              value={product.slug}
              onChange={handleSlugChange}
              placeholder="e.g. classic-white-sneaker"
              className={errors.slug ? errorInputCls : inputCls}
            />
          </FormField>

          <FormField label="Category" htmlFor="product-category" required error={errors.category_id}>
            <select
              id="product-category"
              name="category_id"
              value={product.category_id}
              onChange={handleProductChange}
              className={errors.category_id ? errorInputCls : inputCls}
            >
              <option value="">— Select category —</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Brand" htmlFor="product-brand" required error={errors.brand_id}>
            <select
              id="product-brand"
              name="brand_id"
              value={product.brand_id}
              onChange={handleProductChange}
              className={errors.brand_id ? errorInputCls : inputCls}
            >
              <option value="">— Select brand —</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </FormField>

          <div className="sm:col-span-2">
            <FormField label="Description" htmlFor="product-description">
              <textarea
                id="product-description"
                name="description"
                rows={4}
                value={product.description}
                onChange={handleProductChange}
                placeholder="Describe the product…"
                className={inputCls + ' resize-y'}
              />
            </FormField>
          </div>

          <FormField
            label="Tags"
            htmlFor="product-tags"
            hint="Comma-separated list of tags."
          >
            <input
              id="product-tags"
              name="tags"
              type="text"
              value={product.tags}
              onChange={handleProductChange}
              placeholder="e.g. summer, casual, sale"
              className={inputCls}
            />
          </FormField>

          <div className="flex items-center gap-3 self-end pb-2">
            <input
              id="product-active"
              name="is_active"
              type="checkbox"
              checked={product.is_active}
              onChange={handleProductChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <label
              htmlFor="product-active"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Active (visible to customers)
            </label>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Section: SKU Variant Management */}
      {/* ------------------------------------------------------------------ */}
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">SKU Variants</h2>
          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
            {skus.length} {skus.length === 1 ? 'variant' : 'variants'}
          </span>
        </div>

        <div className="mb-4">
          <AttributeKeyManager
            attributeKeys={attributeKeys}
            onAdd={handleAddAttributeKey}
            onRemove={handleRemoveAttributeKey}
          />
        </div>

        <div className="flex flex-col gap-3">
          {skus.map((sku, index) => (
            <SkuRow
              key={sku._key}
              sku={sku}
              index={index}
              errors={errors}
              onChange={handleSkuChange}
              onRemove={handleRemoveSku}
              attributeKeys={attributeKeys}
              canRemove={skus.length > 1}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddSku}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-dashed border-indigo-400 bg-indigo-50 px-4 py-2.5 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          Add SKU Variant
        </button>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Global errors / server error */}
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
          {loading ? 'Saving…' : (submitLabel || 'Save Product')}
        </button>
      </div>
    </form>
  );
};

ProductForm.propTypes = {
  initialProduct: PropTypes.shape({
    name: PropTypes.string,
    slug: PropTypes.string,
    description: PropTypes.string,
    category_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    brand_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    is_active: PropTypes.bool,
    tags: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  }),
  initialSkus: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      sku_code: PropTypes.string,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      mrp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      stock: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      attributes: PropTypes.object,
    })
  ),
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  brands: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  loading: PropTypes.bool,
  submitLabel: PropTypes.string,
  serverError: PropTypes.string,
};

ProductForm.defaultProps = {
  initialProduct: {},
  initialSkus: [],
  categories: [],
  brands: [],
  onCancel: null,
  loading: false,
  submitLabel: 'Save Product',
  serverError: null,
};

export default ProductForm;
