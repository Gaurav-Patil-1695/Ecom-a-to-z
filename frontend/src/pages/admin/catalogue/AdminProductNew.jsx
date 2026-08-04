import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE = '/api';

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#212529',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 24px',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '24px',
    fontSize: '14px',
    color: '#495057',
  },
  breadcrumbLink: {
    color: '#4c6ef5',
    textDecoration: 'none',
    fontWeight: '500',
  },
  breadcrumbSep: {
    color: '#868e96',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '32px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '32px',
    letterSpacing: '-0.01em',
    color: '#212529',
    margin: 0,
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 320px',
    gap: '24px',
    alignItems: 'start',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
    padding: '24px',
    marginBottom: '24px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '24px',
    color: '#212529',
    marginTop: 0,
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e9ecef',
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
  labelRequired: {
    color: '#f03e3e',
    marginLeft: '4px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #868e96',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    color: '#212529',
    outline: 'none',
    minHeight: '44px',
    boxSizing: 'border-box',
    lineHeight: '20px',
  },
  inputError: {
    borderColor: '#f03e3e',
    backgroundColor: '#fff5f5',
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #868e96',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    color: '#212529',
    outline: 'none',
    minHeight: '100px',
    boxSizing: 'border-box',
    lineHeight: '1.5',
    resize: 'vertical',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #868e96',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    color: '#212529',
    minHeight: '44px',
    cursor: 'pointer',
    boxSizing: 'border-box',
    outline: 'none',
  },
  selectDisabled: {
    backgroundColor: '#e9ecef',
    color: '#adb5bd',
    cursor: 'not-allowed',
  },
  fieldError: {
    fontSize: '12px',
    color: '#f03e3e',
    marginTop: '4px',
    display: 'block',
  },
  fieldHint: {
    fontSize: '12px',
    color: '#495057',
    marginTop: '4px',
    display: 'block',
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    color: '#c92a2a',
    border: '1px solid #ffa8a8',
    borderRadius: '10px',
    padding: '14px 20px',
    marginBottom: '24px',
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: '1.5',
  },
  retryLink: {
    color: '#4c6ef5',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: '12px',
    fontWeight: '500',
    padding: 0,
    marginLeft: '6px',
  },
  refDataError: {
    fontSize: '13px',
    color: '#c92a2a',
    padding: '10px 12px',
    border: '1px solid #ffa8a8',
    borderRadius: '6px',
    backgroundColor: '#ffe3e3',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    minHeight: '44px',
    boxSizing: 'border-box',
  },
  skeletonSelect: {
    width: '100%',
    height: '44px',
    backgroundColor: '#e9ecef',
    borderRadius: '6px',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  row2col: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
    lineHeight: '20px',
  },
  btnPrimaryDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  btnSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#ffffff',
    color: '#212529',
    border: '1px solid #868e96',
    borderRadius: '10px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    textDecoration: 'none',
    minHeight: '44px',
  },
  formActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    justifyContent: 'flex-end',
    paddingTop: '8px',
  },
  toggleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
  toggleLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#212529',
  },
  toggleSubLabel: {
    fontSize: '12px',
    color: '#495057',
    marginTop: '2px',
  },
  toggleTrack: (active) => ({
    position: 'relative',
    width: '44px',
    height: '24px',
    borderRadius: '9999px',
    backgroundColor: active ? '#4c6ef5' : '#868e96',
    cursor: 'pointer',
    border: 'none',
    padding: 0,
    flexShrink: 0,
    transition: 'background-color 0.2s',
  }),
  toggleThumb: (active) => ({
    position: 'absolute',
    top: '2px',
    left: active ? '22px' : '2px',
    width: '20px',
    height: '20px',
    borderRadius: '9999px',
    backgroundColor: '#ffffff',
    transition: 'left 0.2s',
    pointerEvents: 'none',
  }),
  slugRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  slugInput: {
    flex: 1,
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #868e96',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    color: '#212529',
    outline: 'none',
    minHeight: '44px',
    boxSizing: 'border-box',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
  },
  btnSlug: {
    padding: '8px 12px',
    fontSize: '12px',
    fontWeight: '500',
    border: '1px solid #868e96',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    color: '#495057',
    cursor: 'pointer',
    minHeight: '44px',
    whiteSpace: 'nowrap',
  },
  successToast: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    backgroundColor: '#37b24d',
    color: '#ffffff',
    borderRadius: '10px',
    padding: '14px 20px',
    fontSize: '14px',
    fontWeight: '500',
    zIndex: 9999,
    boxShadow: '0 4px 16px rgba(0,0,0,0.16)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  imageUploadArea: {
    border: '2px dashed #868e96',
    borderRadius: '6px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: '#f8f9fa',
    fontSize: '14px',
    color: '#495057',
    minHeight: '80px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  imagePreviewGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '12px',
  },
  imagePreview: {
    position: 'relative',
    width: '80px',
    height: '80px',
  },
  imagePreviewImg: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid #e9ecef',
  },
  imageRemoveBtn: {
    position: 'absolute',
    top: '-6px',
    right: '-6px',
    width: '20px',
    height: '20px',
    borderRadius: '9999px',
    backgroundColor: '#f03e3e',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
    padding: 0,
  },
};

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function SkeletonSelectField() {
  return <div style={styles.skeletonSelect} aria-hidden="true" />;
}

function RefDataErrorField({ message, onRetry }) {
  return (
    <div style={styles.refDataError} role="alert">
      <span>{message}</span>
      <button style={styles.retryLink} onClick={onRetry} type="button">
        Retry
      </button>
    </div>
  );
}

const INITIAL_FORM = {
  name: '',
  slug: '',
  description: '',
  categoryId: '',
  brandId: '',
  basePrice: '',
  taxRate: '',
  isActive: true,
};

export default function AdminProductNew() {
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Reference data
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  const [brands, setBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [brandsError, setBrandsError] = useState(null);

  const [imageFiles, setImageFiles] = useState([]); // { file, previewUrl }

  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    setCategoriesError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/categories`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data = await res.json();
      setCategories(Array.isArray(data.categories) ? data.categories : Array.isArray(data) ? data : []);
    } catch {
      setCategoriesError('Could not load options — retry');
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  const fetchBrands = useCallback(async () => {
    setBrandsLoading(true);
    setBrandsError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/brands`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data = await res.json();
      setBrands(Array.isArray(data.brands) ? data.brands : Array.isArray(data) ? data : []);
    } catch {
      setBrandsError('Could not load options — retry');
    } finally {
      setBrandsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, [fetchCategories, fetchBrands]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    setSubmitError(null);
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: prev.slug === '' || prev.slug === slugify(prev.name) ? slugify(value) : prev.slug,
    }));
    setFieldErrors((prev) => ({ ...prev, name: undefined, slug: undefined }));
    setSubmitError(null);
  };

  const handleGenerateSlug = () => {
    setForm((prev) => ({ ...prev, slug: slugify(prev.name) }));
    setFieldErrors((prev) => ({ ...prev, slug: undefined }));
  };

  const handleToggleActive = () => {
    setForm((prev) => ({ ...prev, isActive: !prev.isActive }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setImageFiles((prev) => [...prev, ...newImages]);
    e.target.value = '';
  };

  const handleRemoveImage = (index) => {
    setImageFiles((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].previewUrl);
      updated.splice(index, 1);
      return updated;
    });
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Product name is required.';
    if (!form.basePrice || isNaN(Number(form.basePrice)) || Number(form.basePrice) < 0)
      errors.basePrice = 'Base price is required and must be a non-negative number.';
    if (form.taxRate !== '' && (isNaN(Number(form.taxRate)) || Number(form.taxRate) < 0 || Number(form.taxRate) > 100))
      errors.taxRate = 'Tax rate must be between 0 and 100.';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setFieldErrors({});

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || slugify(form.name.trim()),
        description: form.description.trim() || undefined,
        categoryId: form.categoryId || undefined,
        brandId: form.brandId || undefined,
        basePrice: Number(form.basePrice),
        taxRate: form.taxRate !== '' ? Number(form.taxRate) : undefined,
        isActive: form.isActive,
      };

      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 409 || (errData.message && errData.message.toLowerCase().includes('slug'))) {
          setFieldErrors({ slug: 'A product with this slug already exists.' });
          setSubmitError('Product could not be saved.');
          return;
        }
        const serverErrors = {};
        if (errData.errors && typeof errData.errors === 'object') {
          Object.assign(serverErrors, errData.errors);
        }
        if (Object.keys(serverErrors).length > 0) {
          setFieldErrors(serverErrors);
        }
        setSubmitError('Product could not be saved.');
        return;
      }

      const created = await res.json();
      const newId = created.productId ?? created.id;

      // Upload images if any
      if (imageFiles.length > 0 && newId) {
        for (const imgItem of imageFiles) {
          try {
            const formData = new FormData();
            formData.append('image', imgItem.file);
            await fetch(`${API_BASE}/products/${newId}/images`, {
              method: 'POST',
              headers: token ? { Authorization: `Bearer ${token}` } : {},
              body: formData,
            });
          } catch {
            // Non-fatal: image upload failure should not block product creation
          }
        }
      }

      if (newId) {
        navigate(`/admin/catalogue/products/${newId}/edit?created=1`);
      } else {
        navigate('/admin/catalogue/products?created=1');
      }
    } catch {
      setSubmitError('Product could not be saved.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Breadcrumb */}
        <nav style={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/admin" style={styles.breadcrumbLink}>Admin</Link>
          <span style={styles.breadcrumbSep}>›</span>
          <Link to="/admin/catalogue/products" style={styles.breadcrumbLink}>Products</Link>
          <span style={styles.breadcrumbSep}>›</span>
          <span>New Product</span>
        </nav>

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>New Product</h1>
        </div>

        {/* Submit error banner */}
        {submitError && (
          <div style={styles.errorBanner} role="alert">
            <strong>{submitError}</strong>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.layout}>
            {/* Left column */}
            <div>
              {/* Basic Info */}
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Basic Information</h2>

                <div style={styles.formGroup}>
                  <label htmlFor="name" style={styles.label}>
                    Product Name <span style={styles.labelRequired}>*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleNameChange}
                    style={{
                      ...styles.input,
                      ...(fieldErrors.name ? styles.inputError : {}),
                    }}
                    placeholder="e.g. Running Shoes Pro"
                    aria-required="true"
                    aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                    autoComplete="off"
                  />
                  {fieldErrors.name && (
                    <span id="name-error" style={styles.fieldError} role="alert">
                      {fieldErrors.name}
                    </span>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="slug" style={styles.label}>
                    Slug
                  </label>
                  <div style={styles.slugRow}>
                    <input
                      id="slug"
                      name="slug"
                      type="text"
                      value={form.slug}
                      onChange={handleChange}
                      style={{
                        ...styles.slugInput,
                        ...(fieldErrors.slug ? styles.inputError : {}),
                      }}
                      placeholder="auto-generated-from-name"
                      aria-describedby={fieldErrors.slug ? 'slug-error' : 'slug-hint'}
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      style={styles.btnSlug}
                      onClick={handleGenerateSlug}
                      disabled={!form.name.trim()}
                    >
                      Auto-generate
                    </button>
                  </div>
                  {fieldErrors.slug ? (
                    <span id="slug-error" style={styles.fieldError} role="alert">
                      {fieldErrors.slug}
                    </span>
                  ) : (
                    <span id="slug-hint" style={styles.fieldHint}>
                      URL-friendly identifier. Leave blank to auto-generate from name.
                    </span>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="description" style={styles.label}>
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    style={styles.textarea}
                    placeholder="Describe the product…"
                    rows={4}
                  />
                </div>
              </div>

              {/* Pricing */}
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Pricing</h2>
                <div style={styles.row2col}>
                  <div style={styles.formGroup}>
                    <label htmlFor="basePrice" style={styles.label}>
                      Base Price (₹) <span style={styles.labelRequired}>*</span>
                    </label>
                    <input
                      id="basePrice"
                      name="basePrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.basePrice}
                      onChange={handleChange}
                      style={{
                        ...styles.input,
                        ...(fieldErrors.basePrice ? styles.inputError : {}),
                      }}
                      placeholder="0.00"
                      aria-required="true"
                      aria-describedby={fieldErrors.basePrice ? 'basePrice-error' : undefined}
                    />
                    {fieldErrors.basePrice && (
                      <span id="basePrice-error" style={styles.fieldError} role="alert">
                        {fieldErrors.basePrice}
                      </span>
                    )}
                  </div>

                  <div style={styles.formGroup}>
                    <label htmlFor="taxRate" style={styles.label}>
                      Tax Rate (%)
                    </label>
                    <input
                      id="taxRate"
                      name="taxRate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={form.taxRate}
                      onChange={handleChange}
                      style={{
                        ...styles.input,
                        ...(fieldErrors.taxRate ? styles.inputError : {}),
                      }}
                      placeholder="0.00"
                      aria-describedby={fieldErrors.taxRate ? 'taxRate-error' : 'taxRate-hint'}
                    />
                    {fieldErrors.taxRate ? (
                      <span id="taxRate-error" style={styles.fieldError} role="alert">
                        {fieldErrors.taxRate}
                      </span>
                    ) : (
                      <span id="taxRate-hint" style={styles.fieldHint}>
                        GST or applicable tax percentage.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Images */}
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Product Images</h2>
                <label
                  htmlFor="image-upload"
                  style={styles.imageUploadArea}
                >
                  <img
                    src="/src/assets/icons/plus.svg"
                    alt=""
                    style={{ width: 24, height: 24, opacity: 0.5 }}
                  />
                  <span>Click to upload images</span>
                  <span style={{ fontSize: '12px', color: '#868e96' }}>PNG, JPG, WEBP up to 5MB each</span>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </label>
                {imageFiles.length > 0 && (
                  <div style={styles.imagePreviewGrid}>
                    {imageFiles.map((img, idx) => (
                      <div key={idx} style={styles.imagePreview}>
                        <img
                          src={img.previewUrl}
                          alt={`Preview ${idx + 1}`}
                          style={styles.imagePreviewImg}
                        />
                        <button
                          type="button"
                          style={styles.imageRemoveBtn}
                          onClick={() => handleRemoveImage(idx)}
                          aria-label={`Remove image ${idx + 1}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right column */}
            <div>
              {/* Status */}
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Status</h2>
                <div style={styles.toggleRow}>
                  <div>
                    <div style={styles.toggleLabel}>Active</div>
                    <div style={styles.toggleSubLabel}>
                      {form.isActive ? 'Product is visible to customers.' : 'Product is hidden from customers.'}
                    </div>
                  </div>
                  <button
                    type="button"
                    style={styles.toggleTrack(form.isActive)}
                    onClick={handleToggleActive}
                    role="switch"
                    aria-checked={form.isActive}
                    aria-label="Toggle product active status"
                  >
                    <span style={styles.toggleThumb(form.isActive)} />
                  </button>
                </div>
              </div>

              {/* Organisation */}
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Organisation</h2>

                <div style={styles.formGroup}>
                  <label htmlFor="categoryId" style={styles.label}>
                    Category
                  </label>
                  {categoriesLoading ? (
                    <SkeletonSelectField />
                  ) : categoriesError ? (
                    <RefDataErrorField
                      message="Could not load options — retry"
                      onRetry={fetchCategories}
                    />
                  ) : (
                    <select
                      id="categoryId"
                      name="categoryId"
                      value={form.categoryId}
                      onChange={handleChange}
                      style={styles.select}
                    >
                      <option value="">— Select category —</option>
                      {categories.map((cat) => (
                        <option key={cat.categoryId ?? cat.id} value={cat.categoryId ?? cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="brandId" style={styles.label}>
                    Brand
                  </label>
                  {brandsLoading ? (
                    <SkeletonSelectField />
                  ) : brandsError ? (
                    <RefDataErrorField
                      message="Could not load options — retry"
                      onRetry={fetchBrands}
                    />
                  ) : (
                    <select
                      id="brandId"
                      name="brandId"
                      value={form.brandId}
                      onChange={handleChange}
                      style={styles.select}
                    >
                      <option value="">— Select brand —</option>
                      {brands.map((brand) => (
                        <option key={brand.brandId ?? brand.id} value={brand.brandId ?? brand.id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Form actions */}
              <div style={styles.formActions}>
                <Link
                  to="/admin/catalogue/products"
                  style={styles.btnSecondary}
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  style={{
                    ...styles.btnPrimary,
                    ...(submitting ? styles.btnPrimaryDisabled : {}),
                  }}
                  disabled={submitting}
                >
                  {submitting ? 'Saving…' : 'Create Product'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
