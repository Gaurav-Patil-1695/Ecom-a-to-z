import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

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
  pageLoadError: {
    backgroundColor: '#ffe3e3',
    color: '#c92a2a',
    border: '1px solid #ffa8a8',
    borderRadius: '10px',
    padding: '24px',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
  retryLink: {
    color: '#4c6ef5',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: '14px',
    fontWeight: '500',
    padding: 0,
  },
  skeletonField: {
    width: '100%',
    height: '44px',
    backgroundColor: '#e9ecef',
    borderRadius: '6px',
  },
  skeletonTextarea: {
    width: '100%',
    height: '100px',
    backgroundColor: '#e9ecef',
    borderRadius: '6px',
  },
  skeletonLabel: {
    height: '14px',
    width: '120px',
    backgroundColor: '#e9ecef',
    borderRadius: '4px',
    marginBottom: '6px',
    display: 'block',
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
  imagePreview: {
    position: 'relative',
    width: '80px',
    height: '80px',
    marginTop: '12px',
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

function SkeletonForm() {
  return (
    <div>
      <div style={styles.card}>
        <div style={{ ...styles.skeletonLabel, width: '160px', height: '16px', marginBottom: '20px' }} />
        {[1, 2, 3].map((i) => (
          <div key={i} style={styles.formGroup}>
            <span style={styles.skeletonLabel} />
            <div style={i === 3 ? styles.skeletonTextarea : styles.skeletonField} />
          </div>
        ))}
      </div>
    </div>
  );
}

const INITIAL_FORM = {
  name: '',
  slug: '',
  description: '',
  imageUrl: '',
  isActive: true,
};

export default function AdminCategoryEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState(INITIAL_FORM);
  const [originalName, setOriginalName] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [loadingCategory, setLoadingCategory] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [newImageFile, setNewImageFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);

  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const fetchCategory = useCallback(async () => {
    setLoadingCategory(true);
    setLoadError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/categories/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.status === 404) {
        setLoadError('Category not found.');
        return;
      }
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      const cat = data.category ?? data;
      setOriginalName(cat.name ?? '');
      setForm({
        name: cat.name ?? '',
        slug: cat.slug ?? '',
        description: cat.description ?? '',
        imageUrl: cat.imageUrl ?? '',
        isActive: cat.isActive !== undefined ? Boolean(cat.isActive) : true,
      });
    } catch {
      setLoadError('Could not load category — please try again.');
    } finally {
      setLoadingCategory(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('updated') === '1') {
      setToast('Category updated successfully.');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

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
      slug:
        prev.slug === '' || prev.slug === slugify(prev.name)
          ? slugify(value)
          : prev.slug,
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
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (newImagePreview) URL.revokeObjectURL(newImagePreview);
    setNewImageFile(file);
    setNewImagePreview(URL.createObjectURL(file));
    e.target.value = '';
  };

  const handleRemoveNewImage = () => {
    if (newImagePreview) URL.revokeObjectURL(newImagePreview);
    setNewImageFile(null);
    setNewImagePreview(null);
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Category name is required.';
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
        imageUrl: form.imageUrl.trim() || undefined,
        isActive: form.isActive,
      };

      const res = await fetch(`${API_BASE}/categories/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (
          res.status === 409 ||
          (errData.message && errData.message.toLowerCase().includes('slug'))
        ) {
          setFieldErrors({ slug: 'A category with this slug already exists.' });
          setSubmitError('Category could not be saved.');
          return;
        }
        const serverErrors = {};
        if (errData.errors && typeof errData.errors === 'object') {
          Object.assign(serverErrors, errData.errors);
        }
        if (Object.keys(serverErrors).length > 0) {
          setFieldErrors(serverErrors);
        }
        setSubmitError('Category could not be saved.');
        return;
      }

      navigate(`/admin/catalogue/categories/${id}/edit?updated=1`);
    } catch {
      setSubmitError('Category could not be saved.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCategory) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <nav style={styles.breadcrumb} aria-label="Breadcrumb">
            <Link to="/admin" style={styles.breadcrumbLink}>Admin</Link>
            <span style={styles.breadcrumbSep}>›</span>
            <Link to="/admin/catalogue/categories" style={styles.breadcrumbLink}>Categories</Link>
            <span style={styles.breadcrumbSep}>›</span>
            <span>Edit Category</span>
          </nav>
          <div style={styles.header}>
            <h1 style={styles.title}>Edit Category</h1>
          </div>
          <div style={styles.layout}>
            <div>
              <SkeletonForm />
            </div>
            <div>
              <div style={styles.card}>
                <div style={{ ...styles.skeletonLabel, width: '80px', height: '16px', marginBottom: '20px' }} />
                <div style={styles.skeletonField} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <nav style={styles.breadcrumb} aria-label="Breadcrumb">
            <Link to="/admin" style={styles.breadcrumbLink}>Admin</Link>
            <span style={styles.breadcrumbSep}>›</span>
            <Link to="/admin/catalogue/categories" style={styles.breadcrumbLink}>Categories</Link>
            <span style={styles.breadcrumbSep}>›</span>
            <span>Edit Category</span>
          </nav>
          <div style={styles.pageLoadError} role="alert">
            <span>{loadError}</span>
            <button style={styles.retryLink} onClick={fetchCategory} type="button">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Breadcrumb */}
        <nav style={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/admin" style={styles.breadcrumbLink}>Admin</Link>
          <span style={styles.breadcrumbSep}>›</span>
          <Link to="/admin/catalogue/categories" style={styles.breadcrumbLink}>Categories</Link>
          <span style={styles.breadcrumbSep}>›</span>
          <span>{originalName || 'Edit Category'}</span>
        </nav>

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>{originalName ? `Edit: ${originalName}` : 'Edit Category'}</h1>
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
                    Category Name <span style={styles.labelRequired}>*</span>
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
                    placeholder="e.g. Running Shoes"
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
                    placeholder="Describe the category…"
                    rows={4}
                  />
                </div>
              </div>

              {/* Image */}
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Category Image</h2>

                <div style={styles.formGroup}>
                  <label htmlFor="imageUrl" style={styles.label}>
                    Image URL
                  </label>
                  <input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    value={form.imageUrl}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      ...(fieldErrors.imageUrl ? styles.inputError : {}),
                    }}
                    placeholder="https://…"
                    aria-describedby={fieldErrors.imageUrl ? 'imageUrl-error' : 'imageUrl-hint'}
                    autoComplete="off"
                  />
                  {fieldErrors.imageUrl ? (
                    <span id="imageUrl-error" style={styles.fieldError} role="alert">
                      {fieldErrors.imageUrl}
                    </span>
                  ) : (
                    <span id="imageUrl-hint" style={styles.fieldHint}>
                      Optional. External URL for the category image.
                    </span>
                  )}
                </div>

                <div>
                  <label style={styles.label}>Or Upload New Image</label>
                  {newImagePreview ? (
                    <div style={styles.imagePreview}>
                      <img
                        src={newImagePreview}
                        alt="Preview"
                        style={styles.imagePreviewImg}
                      />
                      <button
                        type="button"
                        style={styles.imageRemoveBtn}
                        onClick={handleRemoveNewImage}
                        aria-label="Remove uploaded image"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="image-upload" style={styles.imageUploadArea}>
                      <img
                        src="/src/assets/icons/plus.svg"
                        alt=""
                        style={{ width: 24, height: 24, opacity: 0.5 }}
                      />
                      <span>Click to upload image</span>
                      <span style={{ fontSize: '12px', color: '#868e96' }}>PNG, JPG, WEBP up to 5MB</span>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                      />
                    </label>
                  )}
                </div>

                {form.imageUrl && !newImagePreview && (
                  <div style={{ marginTop: '16px' }}>
                    <div style={styles.fieldHint}>Current image:</div>
                    <img
                      src={form.imageUrl}
                      alt="Current category"
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        border: '1px solid #e9ecef',
                        marginTop: '6px',
                      }}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
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
                      {form.isActive
                        ? 'Category is visible to customers.'
                        : 'Category is hidden from customers.'}
                    </div>
                  </div>
                  <button
                    type="button"
                    style={styles.toggleTrack(form.isActive)}
                    onClick={handleToggleActive}
                    role="switch"
                    aria-checked={form.isActive}
                    aria-label="Toggle category active status"
                  >
                    <span style={styles.toggleThumb(form.isActive)} />
                  </button>
                </div>
              </div>

              {/* Form actions */}
              <div style={styles.formActions}>
                <Link
                  to="/admin/catalogue/categories"
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
                  {submitting ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Toast */}
      {toast && (
        <div style={styles.successToast} role="status" aria-live="polite">
          <img src="/src/assets/icons/check.svg" alt="" style={{ width: 16, height: 16 }} />
          {toast}
        </div>
      )}
    </div>
  );
}
