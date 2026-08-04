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
  skeletonField: {
    width: '100%',
    height: '44px',
    backgroundColor: '#e9ecef',
    borderRadius: '6px',
  },
  skeletonText: {
    height: '20px',
    backgroundColor: '#e9ecef',
    borderRadius: '4px',
    marginBottom: '12px',
  },
  logoPreviewWrap: {
    marginTop: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoPreviewImg: {
    width: '80px',
    height: '80px',
    objectFit: 'contain',
    borderRadius: '6px',
    border: '1px solid #e9ecef',
    backgroundColor: '#f8f9fa',
  },
  logoRemoveBtn: {
    padding: '6px 12px',
    fontSize: '13px',
    fontWeight: '500',
    border: '1px solid #f03e3e',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    color: '#f03e3e',
    cursor: 'pointer',
    minHeight: '36px',
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
  metaInfo: {
    fontSize: '13px',
    color: '#495057',
    lineHeight: '1.6',
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '8px',
    marginBottom: '8px',
    fontSize: '13px',
  },
  metaLabel: {
    color: '#868e96',
    fontWeight: '500',
    flexShrink: 0,
  },
  metaValue: {
    color: '#212529',
    textAlign: 'right',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '12px',
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

const INITIAL_FORM = {
  name: '',
  slug: '',
  description: '',
  logoUrl: '',
  isActive: true,
};

export default function AdminBrandEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [originalSlug, setOriginalSlug] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [loadingBrand, setLoadingBrand] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [brandName, setBrandName] = useState('');

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('updated') === '1') {
      setToast('Brand updated successfully.');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const fetchBrand = useCallback(async () => {
    setLoadingBrand(true);
    setLoadError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/brands/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.status === 404) {
        setLoadError('Brand not found.');
        return;
      }
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data = await res.json();
      const brand = data.brand ?? data;
      const loaded = {
        name: brand.name ?? '',
        slug: brand.slug ?? '',
        description: brand.description ?? '',
        logoUrl: brand.logoUrl ?? '',
        isActive: brand.isActive !== undefined ? brand.isActive : brand.status === 'active' ? true : brand.status === 'inactive' ? false : true,
      };
      setForm(loaded);
      setOriginalSlug(brand.slug ?? '');
      setBrandName(brand.name ?? '');
    } catch {
      setLoadError('Could not load brand — please try again.');
    } finally {
      setLoadingBrand(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBrand();
  }, [fetchBrand]);

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

  const handleLogoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    const url = URL.createObjectURL(file);
    setLogoPreview(url);
    e.target.value = '';
  };

  const handleRemoveLogo = () => {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoFile(null);
    setLogoPreview(null);
    setForm((prev) => ({ ...prev, logoUrl: '' }));
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Brand name is required.';
    if (!form.slug.trim()) errors.slug = 'Slug is required.';
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
        logoUrl: form.logoUrl.trim() || undefined,
        isActive: form.isActive,
      };

      const res = await fetch(`${API_BASE}/brands/${id}`, {
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
          setFieldErrors({ slug: 'A brand with this slug already exists.' });
          setSubmitError('Brand could not be saved.');
          return;
        }
        const serverErrors = {};
        if (errData.errors && typeof errData.errors === 'object') {
          Object.assign(serverErrors, errData.errors);
        }
        if (Object.keys(serverErrors).length > 0) {
          setFieldErrors(serverErrors);
        }
        setSubmitError('Brand could not be saved.');
        return;
      }

      navigate(`/admin/catalogue/brands/${id}/edit?updated=1`);
    } catch {
      setSubmitError('Brand could not be saved.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingBrand) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <nav style={styles.breadcrumb} aria-label="Breadcrumb">
            <Link to="/admin" style={styles.breadcrumbLink}>Admin</Link>
            <span style={styles.breadcrumbSep}>›</span>
            <Link to="/admin/catalogue/brands" style={styles.breadcrumbLink}>Brands</Link>
            <span style={styles.breadcrumbSep}>›</span>
            <span>Edit Brand</span>
          </nav>
          <div style={styles.layout}>
            <div>
              <div style={styles.card}>
                <div style={{ ...styles.skeletonText, width: '40%', marginBottom: '20px' }} />
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ ...styles.skeletonText, width: '30%', height: '14px', marginBottom: '6px' }} />
                  <div style={styles.skeletonField} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ ...styles.skeletonText, width: '20%', height: '14px', marginBottom: '6px' }} />
                  <div style={styles.skeletonField} />
                </div>
                <div>
                  <div style={{ ...styles.skeletonText, width: '25%', height: '14px', marginBottom: '6px' }} />
                  <div style={{ ...styles.skeletonField, height: '100px' }} />
                </div>
              </div>
            </div>
            <div>
              <div style={styles.card}>
                <div style={{ ...styles.skeletonText, width: '40%', marginBottom: '20px' }} />
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
            <Link to="/admin/catalogue/brands" style={styles.breadcrumbLink}>Brands</Link>
            <span style={styles.breadcrumbSep}>›</span>
            <span>Edit Brand</span>
          </nav>
          <div
            style={styles.errorBanner}
            role="alert"
          >
            <strong>{loadError}</strong>
            {loadError !== 'Brand not found.' && (
              <button
                style={{
                  marginLeft: '12px',
                  background: 'none',
                  border: 'none',
                  color: '#4c6ef5',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '14px',
                  fontWeight: '500',
                  padding: 0,
                }}
                onClick={fetchBrand}
              >
                Retry
              </button>
            )}
          </div>
          <Link to="/admin/catalogue/brands" style={styles.btnSecondary}>
            ← Back to Brands
          </Link>
        </div>
      </div>
    );
  }

  const displayLogo = logoPreview || form.logoUrl || null;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Breadcrumb */}
        <nav style={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/admin" style={styles.breadcrumbLink}>Admin</Link>
          <span style={styles.breadcrumbSep}>›</span>
          <Link to="/admin/catalogue/brands" style={styles.breadcrumbLink}>Brands</Link>
          <span style={styles.breadcrumbSep}>›</span>
          <span>Edit Brand</span>
        </nav>

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Edit Brand: {brandName}</h1>
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
                    Brand Name <span style={styles.labelRequired}>*</span>
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
                    placeholder="e.g. Nike"
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
                    Slug <span style={styles.labelRequired}>*</span>
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
                      aria-required="true"
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
                      URL-friendly identifier used in API and links.
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
                    placeholder="Describe the brand…"
                    rows={4}
                  />
                </div>
              </div>

              {/* Logo */}
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Brand Logo</h2>

                <div style={styles.formGroup}>
                  <label htmlFor="logoUrl" style={styles.label}>
                    Logo URL
                  </label>
                  <input
                    id="logoUrl"
                    name="logoUrl"
                    type="url"
                    value={form.logoUrl}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      ...(fieldErrors.logoUrl ? styles.inputError : {}),
                    }}
                    placeholder="https://example.com/logo.png"
                    aria-describedby="logoUrl-hint"
                    autoComplete="off"
                  />
                  {fieldErrors.logoUrl ? (
                    <span style={styles.fieldError} role="alert">
                      {fieldErrors.logoUrl}
                    </span>
                  ) : (
                    <span id="logoUrl-hint" style={styles.fieldHint}>
                      Publicly accessible URL to the brand logo image.
                    </span>
                  )}
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label
                    htmlFor="logo-upload"
                    style={styles.imageUploadArea}
                  >
                    <img
                      src="/src/assets/icons/plus.svg"
                      alt=""
                      style={{ width: 24, height: 24, opacity: 0.5 }}
                    />
                    <span>Or upload a logo file</span>
                    <span style={{ fontSize: '12px', color: '#868e96' }}>PNG, JPG, WEBP, SVG up to 2MB</span>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                {displayLogo && (
                  <div style={styles.logoPreviewWrap}>
                    <img
                      src={displayLogo}
                      alt="Brand logo preview"
                      style={styles.logoPreviewImg}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <button
                      type="button"
                      style={styles.logoRemoveBtn}
                      onClick={handleRemoveLogo}
                    >
                      Remove logo
                    </button>
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
                        ? 'Brand is visible to customers.'
                        : 'Brand is hidden from customers.'}
                    </div>
                  </div>
                  <button
                    type="button"
                    style={styles.toggleTrack(form.isActive)}
                    onClick={handleToggleActive}
                    role="switch"
                    aria-checked={form.isActive}
                    aria-label="Toggle brand active status"
                  >
                    <span style={styles.toggleThumb(form.isActive)} />
                  </button>
                </div>
              </div>

              {/* Metadata */}
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Metadata</h2>
                <div style={styles.metaInfo}>
                  <div style={styles.metaRow}>
                    <span style={styles.metaLabel}>Brand ID</span>
                    <span style={styles.metaValue}>{id}</span>
                  </div>
                  {originalSlug && (
                    <div style={styles.metaRow}>
                      <span style={styles.metaLabel}>Original Slug</span>
                      <span style={styles.metaValue}>{originalSlug}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Form actions */}
              <div style={styles.formActions}>
                <Link
                  to="/admin/catalogue/brands"
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
