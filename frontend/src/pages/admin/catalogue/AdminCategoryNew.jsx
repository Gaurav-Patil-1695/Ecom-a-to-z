import { useState } from 'react';
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
  imagePreviewWrap: {
    marginTop: '12px',
    position: 'relative',
    display: 'inline-block',
  },
  imagePreviewImg: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid #e9ecef',
    display: 'block',
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
  isActive: true,
};

export default function AdminCategoryNew() {
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [imageFile, setImageFile] = useState(null); // { file, previewUrl }

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
    if (imageFile) {
      URL.revokeObjectURL(imageFile.previewUrl);
    }
    setImageFile({ file, previewUrl: URL.createObjectURL(file) });
    e.target.value = '';
  };

  const handleRemoveImage = () => {
    if (imageFile) {
      URL.revokeObjectURL(imageFile.previewUrl);
    }
    setImageFile(null);
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
        isActive: form.isActive,
      };

      const res = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
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

      const created = await res.json();
      const newId = created.categoryId ?? created.id;

      // Upload image if present
      if (imageFile && newId) {
        try {
          const formData = new FormData();
          formData.append('image', imageFile.file);
          await fetch(`${API_BASE}/categories/${newId}/image`, {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData,
          });
        } catch {
          // Non-fatal
        }
      }

      if (newId) {
        navigate(`/admin/catalogue/categories/${newId}/edit?created=1`);
      } else {
        navigate('/admin/catalogue/categories?created=1');
      }
    } catch {
      setSubmitError('Category could not be saved.');
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
          <Link to="/admin/catalogue/categories" style={styles.breadcrumbLink}>Categories</Link>
          <span style={styles.breadcrumbSep}>›</span>
          <span>New Category</span>
        </nav>

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>New Category</h1>
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

              {/* Category Image */}
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Category Image</h2>
                {imageFile ? (
                  <div style={styles.imagePreviewWrap}>
                    <img
                      src={imageFile.previewUrl}
                      alt="Category image preview"
                      style={styles.imagePreviewImg}
                    />
                    <button
                      type="button"
                      style={styles.imageRemoveBtn}
                      onClick={handleRemoveImage}
                      aria-label="Remove category image"
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
                    <span>Click to upload an image</span>
                    <span style={{ fontSize: '12px', color: '#868e96' }}>
                      PNG, JPG, WEBP up to 5MB
                    </span>
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
                <Link to="/admin/catalogue/categories" style={styles.btnSecondary}>
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
                  {submitting ? 'Saving…' : 'Create Category'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
