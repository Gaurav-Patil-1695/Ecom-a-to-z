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
  },
  skeletonInput: {
    width: '100%',
    height: '44px',
    backgroundColor: '#e9ecef',
    borderRadius: '6px',
    marginBottom: '4px',
  },
  skeletonTextarea: {
    width: '100%',
    height: '100px',
    backgroundColor: '#e9ecef',
    borderRadius: '6px',
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
  btnDanger: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#ffffff',
    color: '#f03e3e',
    border: '1px solid #f03e3e',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    minHeight: '36px',
  },
  btnSmall: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: '#ffffff',
    color: '#212529',
    border: '1px solid #868e96',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    minHeight: '36px',
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
  skuTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '16px',
  },
  skuTh: {
    padding: '10px 12px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #e9ecef',
    whiteSpace: 'nowrap',
  },
  skuTd: {
    padding: '12px',
    fontSize: '14px',
    color: '#212529',
    borderBottom: '1px solid #e9ecef',
    verticalAlign: 'middle',
  },
  skuInput: {
    width: '100%',
    padding: '6px 10px',
    fontSize: '13px',
    border: '1px solid #868e96',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    color: '#212529',
    outline: 'none',
    minHeight: '36px',
    boxSizing: 'border-box',
  },
  skuInputError: {
    borderColor: '#f03e3e',
    backgroundColor: '#fff5f5',
  },
  skuCodeInput: {
    width: '100%',
    padding: '6px 10px',
    fontSize: '13px',
    border: '1px solid #868e96',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    color: '#212529',
    outline: 'none',
    minHeight: '36px',
    boxSizing: 'border-box',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
  },
  addSkuRow: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginTop: '8px',
  },
  pageLoadingWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  confirmOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(33,37,41,0.48)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  confirmModal: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '420px',
    width: '90%',
    boxShadow: '0 8px 32px rgba(0,0,0,0.16)',
  },
  confirmTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '12px',
    marginTop: 0,
  },
  confirmText: {
    fontSize: '14px',
    color: '#495057',
    marginBottom: '24px',
    lineHeight: '1.5',
  },
  confirmBtns: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  btnConfirmDelete: {
    backgroundColor: '#f03e3e',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '9999px',
    padding: '2px 10px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  badgeActive: {
    backgroundColor: '#d3f9d8',
    color: '#2f9e44',
  },
  badgeInactive: {
    backgroundColor: '#e9ecef',
    color: '#495057',
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

const EMPTY_SKU = () => ({
  _tempId: Math.random().toString(36).slice(2),
  skuId: null,
  skuCode: '',
  attributes: '',
  price: '',
  stock: '',
  isNew: true,
});

export default function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Page-level loading / error
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  // Product form
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    categoryId: '',
    brandId: '',
    basePrice: '',
    taxRate: '',
    isActive: true,
  });
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

  // Images
  const [existingImages, setExistingImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [deleteImageIds, setDeleteImageIds] = useState([]);

  // SKUs
  const [skus, setSkus] = useState([]);
  const [skuErrors, setSkuErrors] = useState({});
  const [skuSubmitting, setSkuSubmitting] = useState(false);

  // Delete SKU confirm
  const [deleteSkuTarget, setDeleteSkuTarget] = useState(null);
  const [deleteSkuLoading, setDeleteSkuLoading] = useState(false);
  const [deleteSkuError, setDeleteSkuError] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Check for success query param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('created') === '1') {
      setToast('Product created successfully.');
      window.history.replaceState({}, '', window.location.pathname);
    } else if (params.get('updated') === '1') {
      setToast('Product updated successfully.');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    setCategoriesError(null);
    try {
      const res = await fetch(`${API_BASE}/categories`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data = await res.json();
      setCategories(Array.isArray(data.categories) ? data.categories : Array.isArray(data) ? data : []);
    } catch {
      setCategoriesError('Could not load options — retry');
    } finally {
      setCategoriesLoading(false);
    }
  }, [getAuthHeaders]);

  const fetchBrands = useCallback(async () => {
    setBrandsLoading(true);
    setBrandsError(null);
    try {
      const res = await fetch(`${API_BASE}/brands`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data = await res.json();
      setBrands(Array.isArray(data.brands) ? data.brands : Array.isArray(data) ? data : []);
    } catch {
      setBrandsError('Could not load options — retry');
    } finally {
      setBrandsLoading(false);
    }
  }, [getAuthHeaders]);

  const fetchProduct = useCallback(async () => {
    setPageLoading(true);
    setPageError(null);
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data = await res.json();
      const p = data.product ?? data;
      setForm({
        name: p.name ?? '',
        slug: p.slug ?? '',
        description: p.description ?? '',
        categoryId: p.categoryId != null ? String(p.categoryId) : '',
        brandId: p.brandId != null ? String(p.brandId) : '',
        basePrice: p.basePrice != null ? String(p.basePrice) : '',
        taxRate: p.taxRate != null ? String(p.taxRate) : '',
        isActive: p.isActive ?? p.status === 'active' ?? true,
      });
    } catch {
      setPageError('Could not load product — please try again.');
    } finally {
      setPageLoading(false);
    }
  }, [id, getAuthHeaders]);

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/products/${id}/images`, { headers: getAuthHeaders() });
      if (!res.ok) return;
      const data = await res.json();
      setExistingImages(Array.isArray(data.images) ? data.images : Array.isArray(data) ? data : []);
    } catch {
      // non-fatal
    }
  }, [id, getAuthHeaders]);

  const fetchSkus = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/products/${id}/skus`, { headers: getAuthHeaders() });
      if (!res.ok) return;
      const data = await res.json();
      const raw = Array.isArray(data.skus) ? data.skus : Array.isArray(data) ? data : [];
      setSkus(
        raw.map((s) => ({
          _tempId: s.skuId ?? s.id ?? Math.random().toString(36).slice(2),
          skuId: s.skuId ?? s.id,
          skuCode: s.skuCode ?? s.sku ?? '',
          attributes: s.attributes
            ? typeof s.attributes === 'string'
              ? s.attributes
              : JSON.stringify(s.attributes)
            : '',
          price: s.price != null ? String(s.price) : '',
          stock: s.stock != null ? String(s.stock) : s.quantityAvailable != null ? String(s.quantityAvailable) : '',
          isNew: false,
        }))
      );
    } catch {
      // non-fatal
    }
  }, [id, getAuthHeaders]);

  useEffect(() => {
    fetchProduct();
    fetchCategories();
    fetchBrands();
    fetchImages();
    fetchSkus();
  }, [fetchProduct, fetchCategories, fetchBrands, fetchImages, fetchSkus]);

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

  const handleRemoveNewImage = (index) => {
    setImageFiles((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].previewUrl);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleRemoveExistingImage = (imgId) => {
    setDeleteImageIds((prev) => [...prev, imgId]);
    setExistingImages((prev) => prev.filter((img) => (img.imageId ?? img.id) !== imgId));
  };

  // SKU management
  const handleAddSku = () => {
    setSkus((prev) => [...prev, EMPTY_SKU()]);
  };

  const handleSkuChange = (tempId, field, value) => {
    setSkus((prev) =>
      prev.map((s) => (s._tempId === tempId ? { ...s, [field]: value } : s))
    );
    setSkuErrors((prev) => {
      const next = { ...prev };
      if (next[tempId]) {
        next[tempId] = { ...next[tempId], [field]: undefined };
      }
      return next;
    });
  };

  const handleDeleteSkuClick = (sku) => {
    if (sku.isNew) {
      setSkus((prev) => prev.filter((s) => s._tempId !== sku._tempId));
    } else {
      setDeleteSkuTarget(sku);
      setDeleteSkuError(null);
    }
  };

  const handleDeleteSkuConfirm = async () => {
    if (!deleteSkuTarget) return;
    setDeleteSkuLoading(true);
    setDeleteSkuError(null);
    try {
      const res = await fetch(
        `${API_BASE}/products/${id}/skus/${deleteSkuTarget.skuId}`,
        { method: 'DELETE', headers: getAuthHeaders() }
      );
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      setSkus((prev) => prev.filter((s) => s._tempId !== deleteSkuTarget._tempId));
      setDeleteSkuTarget(null);
      setToast('SKU deleted successfully.');
    } catch {
      setDeleteSkuError('Could not delete SKU. Please try again.');
    } finally {
      setDeleteSkuLoading(false);
    }
  };

  const validateProduct = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Product name is required.';
    if (!form.basePrice || isNaN(Number(form.basePrice)) || Number(form.basePrice) < 0)
      errors.basePrice = 'Base price is required and must be a non-negative number.';
    if (
      form.taxRate !== '' &&
      (isNaN(Number(form.taxRate)) || Number(form.taxRate) < 0 || Number(form.taxRate) > 100)
    )
      errors.taxRate = 'Tax rate must be between 0 and 100.';
    return errors;
  };

  const validateSkus = () => {
    const errors = {};
    skus.forEach((sku) => {
      const skuErr = {};
      if (!sku.skuCode.trim()) skuErr.skuCode = 'SKU code is required.';
      if (sku.price !== '' && (isNaN(Number(sku.price)) || Number(sku.price) < 0))
        skuErr.price = 'Price must be a non-negative number.';
      if (sku.stock !== '' && (isNaN(Number(sku.stock)) || !Number.isInteger(Number(sku.stock)) || Number(sku.stock) < 0))
        skuErr.stock = 'Stock must be a non-negative integer.';
      if (Object.keys(skuErr).length > 0) errors[sku._tempId] = skuErr;
    });
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setFieldErrors({});
    setSkuErrors({});

    const productErrors = validateProduct();
    const skuValidationErrors = validateSkus();

    if (Object.keys(productErrors).length > 0) {
      setFieldErrors(productErrors);
      setSubmitError('Product could not be saved.');
      return;
    }

    if (Object.keys(skuValidationErrors).length > 0) {
      setSkuErrors(skuValidationErrors);
      setSubmitError('Product could not be saved.');
      return;
    }

    setSubmitting(true);
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
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

      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
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

      // Save new SKUs
      const newSkus = skus.filter((s) => s.isNew);
      for (const sku of newSkus) {
        try {
          await fetch(`${API_BASE}/products/${id}/skus`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              skuCode: sku.skuCode.trim(),
              attributes: sku.attributes.trim() || undefined,
              price: sku.price !== '' ? Number(sku.price) : undefined,
              stock: sku.stock !== '' ? Number(sku.stock) : undefined,
            }),
          });
        } catch {
          // non-fatal per SKU
        }
      }

      // Update existing SKUs
      const existingSkus = skus.filter((s) => !s.isNew && s.skuId);
      for (const sku of existingSkus) {
        try {
          await fetch(`${API_BASE}/products/${id}/skus/${sku.skuId}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({
              skuCode: sku.skuCode.trim(),
              attributes: sku.attributes.trim() || undefined,
              price: sku.price !== '' ? Number(sku.price) : undefined,
              stock: sku.stock !== '' ? Number(sku.stock) : undefined,
            }),
          });
        } catch {
          // non-fatal
        }
      }

      // Upload new images
      const authHeaders = getAuthHeaders();
      for (const imgItem of imageFiles) {
        try {
          const formData = new FormData();
          formData.append('image', imgItem.file);
          await fetch(`${API_BASE}/products/${id}/images`, {
            method: 'POST',
            headers: authHeaders,
            body: formData,
          });
        } catch {
          // non-fatal
        }
      }

      navigate(`/admin/catalogue/products/${id}/edit?updated=1`);
    } catch {
      setSubmitError('Product could not be saved.');
    } finally {
      setSubmitting(false);
    }
  };

  if (pageLoading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.pageLoadingWrapper}>
            <div style={{ ...styles.skeletonInput, width: '200px', height: '20px' }} />
            <div style={{ ...styles.skeletonInput, width: '280px', height: '32px' }} />
            <div style={styles.layout}>
              <div>
                <div style={styles.card}>
                  <div style={{ ...styles.skeletonInput, marginBottom: '16px' }} />
                  <div style={{ ...styles.skeletonInput, marginBottom: '16px' }} />
                  <div style={styles.skeletonTextarea} />
                </div>
                <div style={styles.card}>
                  <div style={styles.skeletonInput} />
                </div>
              </div>
              <div>
                <div style={styles.card}>
                  <div style={styles.skeletonSelect} />
                </div>
                <div style={styles.card}>
                  <div style={{ ...styles.skeletonSelect, marginBottom: '12px' }} />
                  <div style={styles.skeletonSelect} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <nav style={styles.breadcrumb} aria-label="Breadcrumb">
            <Link to="/admin" style={styles.breadcrumbLink}>Admin</Link>
            <span style={styles.breadcrumbSep}>›</span>
            <Link to="/admin/catalogue/products" style={styles.breadcrumbLink}>Products</Link>
            <span style={styles.breadcrumbSep}>›</span>
            <span>Edit Product</span>
          </nav>
          <div style={styles.errorBanner} role="alert">
            <strong>{pageError}</strong>
            <button style={styles.retryLink} onClick={fetchProduct}>Retry</button>
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
          <Link to="/admin/catalogue/products" style={styles.breadcrumbLink}>Products</Link>
          <span style={styles.breadcrumbSep}>›</span>
          <span>Edit Product</span>
        </nav>

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>{form.name || 'Edit Product'}</h1>
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

              {/* SKUs */}
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>SKUs</h2>
                {skus.length > 0 ? (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={styles.skuTable} aria-label="SKUs">
                      <thead>
                        <tr>
                          <th style={styles.skuTh}>SKU Code</th>
                          <th style={styles.skuTh}>Attributes</th>
                          <th style={styles.skuTh}>Price (₹)</th>
                          <th style={styles.skuTh}>Stock</th>
                          <th style={{ ...styles.skuTh, textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {skus.map((sku) => {
                          const err = skuErrors[sku._tempId] || {};
                          return (
                            <tr key={sku._tempId}>
                              <td style={styles.skuTd}>
                                <input
                                  type="text"
                                  value={sku.skuCode}
                                  onChange={(e) => handleSkuChange(sku._tempId, 'skuCode', e.target.value)}
                                  style={{
                                    ...styles.skuCodeInput,
                                    ...(err.skuCode ? styles.skuInputError : {}),
                                  }}
                                  placeholder="e.g. SKU-001"
                                  aria-label="SKU code"
                                />
                                {err.skuCode && (
                                  <span style={styles.fieldError} role="alert">{err.skuCode}</span>
                                )}
                              </td>
                              <td style={styles.skuTd}>
                                <input
                                  type="text"
                                  value={sku.attributes}
                                  onChange={(e) => handleSkuChange(sku._tempId, 'attributes', e.target.value)}
                                  style={styles.skuInput}
                                  placeholder='e.g. {"color":"red"}'
                                  aria-label="Attributes"
                                />
                              </td>
                              <td style={styles.skuTd}>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={sku.price}
                                  onChange={(e) => handleSkuChange(sku._tempId, 'price', e.target.value)}
                                  style={{
                                    ...styles.skuInput,
                                    ...(err.price ? styles.skuInputError : {}),
                                  }}
                                  placeholder="0.00"
                                  aria-label="Price"
                                />
                                {err.price && (
                                  <span style={styles.fieldError} role="alert">{err.price}</span>
                                )}
                              </td>
                              <td style={styles.skuTd}>
                                <input
                                  type="number"
                                  min="0"
                                  step="1"
                                  value={sku.stock}
                                  onChange={(e) => handleSkuChange(sku._tempId, 'stock', e.target.value)}
                                  style={{
                                    ...styles.skuInput,
                                    ...(err.stock ? styles.skuInputError : {}),
                                  }}
                                  placeholder="0"
                                  aria-label="Stock"
                                />
                                {err.stock && (
                                  <span style={styles.fieldError} role="alert">{err.stock}</span>
                                )}
                              </td>
                              <td style={{ ...styles.skuTd, textAlign: 'right' }}>
                                <button
                                  type="button"
                                  style={styles.btnDanger}
                                  onClick={() => handleDeleteSkuClick(sku)}
                                  aria-label={`Delete SKU ${sku.skuCode || '(new)'}`}
                                >
                                  <img src="/src/assets/icons/trash.svg" alt="" style={{ width: 13, height: 13 }} />
                                  Delete
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={{ fontSize: '14px', color: '#495057', marginBottom: '16px' }}>
                    No SKUs yet. Add your first SKU below.
                  </p>
                )}
                <div style={styles.addSkuRow}>
                  <button type="button" style={styles.btnSmall} onClick={handleAddSku}>
                    <img src="/src/assets/icons/plus.svg" alt="" style={{ width: 14, height: 14 }} />
                    Add SKU
                  </button>
                </div>
              </div>

              {/* Images */}
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Product Images</h2>
                {existingImages.length > 0 && (
                  <div style={styles.imagePreviewGrid}>
                    {existingImages.map((img) => {
                      const imgId = img.imageId ?? img.id;
                      return (
                        <div key={imgId} style={styles.imagePreview}>
                          <img
                            src={img.url ?? img.imageUrl ?? '/src/assets/images/placeholder-product.svg'}
                            alt="Product"
                            style={styles.imagePreviewImg}
                            onError={(e) => { e.currentTarget.src = '/src/assets/images/placeholder-product.svg'; }}
                          />
                          <button
                            type="button"
                            style={styles.imageRemoveBtn}
                            onClick={() => handleRemoveExistingImage(imgId)}
                            aria-label="Remove existing image"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
                <label
                  htmlFor="image-upload"
                  style={{ ...styles.imageUploadArea, marginTop: existingImages.length > 0 ? '12px' : '0' }}
                >
                  <img
                    src="/src/assets/icons/plus.svg"
                    alt=""
                    style={{ width: 24, height: 24, opacity: 0.5 }}
                  />
                  <span>Click to upload more images</span>
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
                          alt={`New image ${idx + 1}`}
                          style={styles.imagePreviewImg}
                        />
                        <button
                          type="button"
                          style={styles.imageRemoveBtn}
                          onClick={() => handleRemoveNewImage(idx)}
                          aria-label={`Remove new image ${idx + 1}`}
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
                  {submitting ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Delete SKU confirmation modal */}
      {deleteSkuTarget && (
        <div style={styles.confirmOverlay} role="dialog" aria-modal="true" aria-labelledby="confirm-sku-title">
          <div style={styles.confirmModal}>
            <h2 id="confirm-sku-title" style={styles.confirmTitle}>Delete SKU</h2>
            <p style={styles.confirmText}>
              Are you sure you want to delete SKU <strong>{deleteSkuTarget.skuCode}</strong>? This action cannot be undone.
            </p>
            {deleteSkuError && (
              <div style={{ ...styles.errorBanner, marginBottom: '16px' }} role="alert">
                {deleteSkuError}
              </div>
            )}
            <div style={styles.confirmBtns}>
              <button
                style={styles.btnSecondary}
                type="button"
                onClick={() => { setDeleteSkuTarget(null); setDeleteSkuError(null); }}
                disabled={deleteSkuLoading}
              >
                Cancel
              </button>
              <button
                style={styles.btnConfirmDelete}
                type="button"
                onClick={handleDeleteSkuConfirm}
                disabled={deleteSkuLoading}
              >
                {deleteSkuLoading ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

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
