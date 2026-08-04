import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#212529',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px 16px',
  },
  breadcrumb: {
    fontSize: '14px',
    color: '#495057',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexWrap: 'wrap',
  },
  breadcrumbLink: {
    color: '#4c6ef5',
    textDecoration: 'none',
  },
  breadcrumbSep: {
    color: '#868e96',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    alignItems: 'start',
  },
  imageSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  mainImageWrap: {
    position: 'relative',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
    overflow: 'hidden',
    aspectRatio: '1',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    display: 'block',
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: '#868e96',
    color: '#ffffff',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    padding: '4px 10px',
    borderRadius: '3px',
  },
  thumbnailRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  thumbnail: {
    width: '72px',
    height: '72px',
    borderRadius: '6px',
    border: '2px solid #e9ecef',
    overflow: 'hidden',
    cursor: 'pointer',
    backgroundColor: '#ffffff',
    flexShrink: 0,
    padding: '0',
    transition: 'border-color 0.15s',
  },
  thumbnailActive: {
    border: '2px solid #4c6ef5',
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    display: 'block',
  },
  infoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  brandName: {
    fontSize: '12px',
    fontWeight: '500',
    letterSpacing: '0.02em',
    color: '#495057',
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '32px',
    letterSpacing: '-0.01em',
    color: '#212529',
    margin: '0',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  ratingStars: {
    display: 'flex',
    gap: '2px',
  },
  ratingValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
  },
  ratingCount: {
    fontSize: '14px',
    color: '#495057',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #e9ecef',
    margin: '0',
  },
  priceBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '10px',
    flexWrap: 'wrap',
  },
  price: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#212529',
    lineHeight: '36px',
  },
  priceMrp: {
    fontSize: '16px',
    color: '#868e96',
    textDecoration: 'line-through',
    fontWeight: '400',
  },
  priceDiscount: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#37b24d',
  },
  taxNote: {
    fontSize: '12px',
    color: '#495057',
    lineHeight: '16px',
  },
  variantSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  variantGroupLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '8px',
  },
  variantOptions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  variantBtn: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid #868e96',
    backgroundColor: '#ffffff',
    color: '#212529',
    fontSize: '14px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    minHeight: '44px',
    minWidth: '44px',
    transition: 'border-color 0.15s, background-color 0.15s',
    fontWeight: '400',
  },
  variantBtnActive: {
    border: '2px solid #4c6ef5',
    backgroundColor: '#e8ecfd',
    color: '#3b5bdb',
    fontWeight: '600',
  },
  variantBtnDisabled: {
    backgroundColor: '#e9ecef',
    color: '#adb5bd',
    cursor: 'not-allowed',
    border: '1px solid #e9ecef',
    textDecoration: 'line-through',
  },
  quantityRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  quantityLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #868e96',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  quantityBtn: {
    width: '44px',
    height: '44px',
    border: 'none',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    fontSize: '18px',
    color: '#212529',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'inherit',
    transition: 'background-color 0.15s',
  },
  quantityBtnDisabled: {
    color: '#adb5bd',
    cursor: 'not-allowed',
  },
  quantityValue: {
    width: '48px',
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    borderLeft: '1px solid #e9ecef',
    borderRight: '1px solid #e9ecef',
    height: '44px',
    lineHeight: '44px',
    userSelect: 'none',
  },
  addToCartBtn: {
    width: '100%',
    padding: '14px 24px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'inherit',
    minHeight: '44px',
    transition: 'background-color 0.15s',
    letterSpacing: '0em',
  },
  addToCartBtnDisabled: {
    backgroundColor: '#e9ecef',
    color: '#adb5bd',
    cursor: 'not-allowed',
  },
  addToCartBtnLoading: {
    backgroundColor: '#748ffc',
    cursor: 'wait',
  },
  stockStatus: {
    fontSize: '14px',
    fontWeight: '500',
  },
  stockIn: {
    color: '#37b24d',
  },
  stockOut: {
    color: '#f03e3e',
  },
  stockLow: {
    color: '#fd7e14',
  },
  successMsg: {
    backgroundColor: '#d3f9d8',
    color: '#37b24d',
    border: '1px solid #37b24d',
    borderRadius: '6px',
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: '500',
  },
  errorMsg: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    border: '1px solid #f03e3e',
    borderRadius: '6px',
    padding: '10px 16px',
    fontSize: '14px',
  },
  tabBar: {
    display: 'flex',
    gap: '0',
    borderBottom: '2px solid #e9ecef',
    marginTop: '40px',
    marginBottom: '0',
  },
  tabBtn: {
    padding: '12px 20px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#495057',
    fontFamily: 'inherit',
    borderBottom: '2px solid transparent',
    marginBottom: '-2px',
    transition: 'color 0.15s, border-color 0.15s',
    minHeight: '44px',
  },
  tabBtnActive: {
    color: '#4c6ef5',
    fontWeight: '600',
    borderBottom: '2px solid #4c6ef5',
  },
  tabContent: {
    backgroundColor: '#ffffff',
    borderRadius: '0 0 10px 10px',
    border: '1px solid #e9ecef',
    borderTop: 'none',
    padding: '24px',
    minHeight: '120px',
  },
  descriptionText: {
    fontSize: '16px',
    lineHeight: '1.625',
    color: '#343a40',
    margin: 0,
    whiteSpace: 'pre-wrap',
  },
  specsTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  specRow: {
    borderBottom: '1px solid #e9ecef',
  },
  specKey: {
    padding: '10px 16px 10px 0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
    width: '35%',
    verticalAlign: 'top',
  },
  specVal: {
    padding: '10px 0',
    fontSize: '14px',
    color: '#343a40',
    verticalAlign: 'top',
  },
  reviewsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  reviewCard: {
    borderBottom: '1px solid #e9ecef',
    paddingBottom: '16px',
  },
  reviewAuthor: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '4px',
  },
  reviewDate: {
    fontSize: '12px',
    color: '#495057',
    marginBottom: '6px',
  },
  reviewBody: {
    fontSize: '14px',
    color: '#343a40',
    lineHeight: '1.5',
  },
  skuCode: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '12px',
    color: '#495057',
    backgroundColor: '#f8f9fa',
    padding: '2px 6px',
    borderRadius: '3px',
    border: '1px solid #e9ecef',
    display: 'inline-block',
  },
  skuRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: '#495057',
  },
  errorPage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 24px',
    textAlign: 'center',
  },
  errorPageTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '8px',
  },
  errorPageText: {
    fontSize: '14px',
    color: '#495057',
    marginBottom: '24px',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 24px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'inherit',
    textDecoration: 'none',
    minHeight: '44px',
  },
  skeletonBlock: {
    backgroundColor: '#e9ecef',
    borderRadius: '6px',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
};

function StarRating({ rating, size = 14 }) {
  const stars = Math.round(rating || 0);
  return (
    <span style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          style={{
            color: s <= stars ? '#fd7e14' : '#dee2e6',
            fontSize: `${size}px`,
            lineHeight: 1,
          }}
        >
          ★
        </span>
      ))}
    </span>
  );
}

function SkeletonDetailPage() {
  return (
    <div style={styles.layout}>
      <div style={styles.imageSection}>
        <div style={{ ...styles.skeletonBlock, aspectRatio: '1', borderRadius: '10px' }} />
        <div style={{ display: 'flex', gap: '8px' }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ ...styles.skeletonBlock, width: '72px', height: '72px', borderRadius: '6px' }} />
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ ...styles.skeletonBlock, height: '14px', width: '80px' }} />
        <div style={{ ...styles.skeletonBlock, height: '32px', width: '80%' }} />
        <div style={{ ...styles.skeletonBlock, height: '16px', width: '40%' }} />
        <hr style={styles.divider} />
        <div style={{ ...styles.skeletonBlock, height: '36px', width: '50%' }} />
        <div style={{ ...styles.skeletonBlock, height: '12px', width: '30%' }} />
        <hr style={styles.divider} />
        <div style={{ ...styles.skeletonBlock, height: '44px', width: '100%', borderRadius: '10px' }} />
        <div style={{ ...styles.skeletonBlock, height: '52px', width: '100%', borderRadius: '10px' }} />
      </div>
    </div>
  );
}

const TABS = [
  { key: 'description', label: 'Description' },
  { key: 'specifications', label: 'Specifications' },
  { key: 'reviews', label: 'Reviews' },
];

function getCartId() {
  let cartId = localStorage.getItem('cart_id');
  return cartId || null;
}

function setCartId(id) {
  localStorage.setItem('cart_id', id);
}

async function ensureCart() {
  let cartId = getCartId();
  if (cartId) return cartId;
  const res = await fetch(`${API_BASE}/api/carts`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
  if (!res.ok) throw new Error('Could not create cart');
  const data = await res.json();
  const id = data.data?.id || data.id;
  if (id) setCartId(id);
  return id;
}

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [skus, setSkus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedSku, setSelectedSku] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [addingToCart, setAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [cartError, setCartError] = useState(null);

  const [activeTab, setActiveTab] = useState('description');

  const fetchProduct = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/products/${encodeURIComponent(slug)}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error('Product not found.');
        throw new Error(`Failed to load product (${res.status})`);
      }
      const data = await res.json();
      const prod = data.data || data.product || data;
      setProduct(prod);

      const productId = prod.id;

      const [imagesRes, skusRes] = await Promise.allSettled([
        fetch(`${API_BASE}/api/products/${productId}/images`),
        fetch(`${API_BASE}/api/products/${productId}/skus`),
      ]);

      if (imagesRes.status === 'fulfilled' && imagesRes.value.ok) {
        const imgData = await imagesRes.value.json();
        const imgs = imgData.data || imgData.images || imgData || [];
        setImages(Array.isArray(imgs) ? imgs : []);
      } else {
        const fallback = prod.images || [];
        setImages(Array.isArray(fallback) ? fallback : []);
      }

      if (skusRes.status === 'fulfilled' && skusRes.value.ok) {
        const skuData = await skusRes.value.json();
        const skuList = skuData.data || skuData.skus || skuData || [];
        const list = Array.isArray(skuList) ? skuList : [];
        setSkus(list);
        if (list.length > 0) {
          const firstInStock = list.find(s => s.in_stock !== false && s.stock_quantity !== 0);
          setSelectedSku(firstInStock || list[0]);
        }
      } else {
        const fallbackSkus = prod.skus || [];
        const list = Array.isArray(fallbackSkus) ? fallbackSkus : [];
        setSkus(list);
        if (list.length > 0) {
          const firstInStock = list.find(s => s.in_stock !== false && s.stock_quantity !== 0);
          setSelectedSku(firstInStock || list[0]);
        }
      }

      setSelectedImageIdx(0);
    } catch (err) {
      setError(err.message || 'Something went wrong loading this product.');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  useEffect(() => {
    setCartSuccess(false);
    setCartError(null);
    setQuantity(1);
  }, [selectedSku]);

  const allImages = images.length > 0
    ? images
    : (product?.image_url || product?.thumbnail_url)
      ? [{ url: product.image_url || product.thumbnail_url, alt: product?.name }]
      : [];

  const displayImageUrl = allImages[selectedImageIdx]?.url
    || allImages[selectedImageIdx]?.image_url
    || null;

  const effectivePrice = selectedSku?.price ?? product?.price ?? null;
  const effectiveMrp = selectedSku?.mrp ?? product?.mrp ?? null;
  const effectiveStock = selectedSku?.stock_quantity ?? (selectedSku?.in_stock === false ? 0 : null);
  const isInStock = effectiveStock === null ? (product?.in_stock !== false) : effectiveStock > 0;
  const isLowStock = isInStock && effectiveStock !== null && effectiveStock <= 5;

  const discountPct = effectiveMrp && effectivePrice && effectiveMrp > effectivePrice
    ? Math.round(((effectiveMrp - effectivePrice) / effectiveMrp) * 100)
    : null;

  const maxQty = effectiveStock !== null ? Math.min(effectiveStock, 10) : 10;

  function groupVariants(skuList) {
    const groups = {};
    skuList.forEach(sku => {
      const attrs = sku.attributes || sku.variant_attributes || {};
      Object.entries(attrs).forEach(([key, val]) => {
        if (!groups[key]) groups[key] = new Set();
        groups[key].add(val);
      });
    });
    return groups;
  }

  function getSkuForAttributes(attrs) {
    return skus.find(sku => {
      const skuAttrs = sku.attributes || sku.variant_attributes || {};
      return Object.entries(attrs).every(([k, v]) => skuAttrs[k] === v);
    }) || null;
  }

  const selectedAttrs = selectedSku
    ? (selectedSku.attributes || selectedSku.variant_attributes || {})
    : {};

  const variantGroups = groupVariants(skus);

  function selectVariantValue(groupKey, value) {
    const newAttrs = { ...selectedAttrs, [groupKey]: value };
    const matched = getSkuForAttributes(newAttrs);
    if (matched) {
      setSelectedSku(matched);
    } else {
      const partial = skus.find(sku => {
        const skuAttrs = sku.attributes || sku.variant_attributes || {};
        return skuAttrs[groupKey] === value;
      });
      if (partial) setSelectedSku(partial);
    }
  }

  function isVariantValueAvailable(groupKey, value) {
    const testAttrs = { ...selectedAttrs, [groupKey]: value };
    return skus.some(sku => {
      const skuAttrs = sku.attributes || sku.variant_attributes || {};
      return skuAttrs[groupKey] === value &&
        (sku.in_stock !== false) &&
        (sku.stock_quantity === undefined || sku.stock_quantity === null || sku.stock_quantity > 0);
    });
  }

  async function handleAddToCart() {
    if (!isInStock) return;
    setAddingToCart(true);
    setCartSuccess(false);
    setCartError(null);
    try {
      const cartId = await ensureCart();
      const body = {
        sku_id: selectedSku?.id || null,
        product_id: product?.id,
        quantity,
      };
      const res = await fetch(`${API_BASE}/api/carts/${cartId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || errData.error || `Failed to add to cart (${res.status})`);
      }
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 3000);
    } catch (err) {
      setCartError(err.message || 'Could not add item to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  }

  const specifications = product?.specifications || product?.specs || {};
  const hasSpecs = Object.keys(specifications).length > 0;

  const reviews = product?.reviews || [];

  if (loading) {
    return (
      <div style={styles.page}>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          *:focus-visible {
            outline: 2px solid #4c6ef5;
            outline-offset: 2px;
          }
        `}</style>
        <div style={styles.container}>
          <div style={{ ...styles.skeletonBlock, height: '20px', width: '300px', marginBottom: '24px' }} />
          <SkeletonDetailPage />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <style>{`
          *:focus-visible {
            outline: 2px solid #4c6ef5;
            outline-offset: 2px;
          }
        `}</style>
        <div style={styles.container}>
          <div style={styles.errorPage}>
            <img
              src="/src/assets/images/empty-state.svg"
              alt="Error"
              style={{ width: '100px', marginBottom: '24px', opacity: 0.6 }}
            />
            <h1 style={styles.errorPageTitle}>Product Not Found</h1>
            <p style={styles.errorPageText}>{error}</p>
            <Link to="/products" style={styles.backBtn}>Browse Products</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        *:focus-visible {
          outline: 2px solid #4c6ef5;
          outline-offset: 2px;
        }
        .add-to-cart-btn:hover:not(:disabled) {
          background-color: #3b5bdb !important;
        }
        .qty-btn:hover:not(:disabled) {
          background-color: #f8f9fa !important;
        }
        .tab-btn:hover {
          color: #4c6ef5 !important;
        }
        .variant-btn:hover:not(:disabled) {
          border-color: #4c6ef5 !important;
        }
      `}</style>

      <div style={styles.container}>
        {/* Breadcrumb */}
        <nav style={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/" style={styles.breadcrumbLink}>Home</Link>
          <span style={styles.breadcrumbSep}>›</span>
          <Link to="/products" style={styles.breadcrumbLink}>Products</Link>
          {product.category_name && (
            <>
              <span style={styles.breadcrumbSep}>›</span>
              <Link
                to={`/categories/${product.category_slug || product.category_id}/products`}
                style={styles.breadcrumbLink}
              >
                {product.category_name}
              </Link>
            </>
          )}
          <span style={styles.breadcrumbSep}>›</span>
          <span style={{ color: '#495057' }}>{product.name}</span>
        </nav>

        {/* Main Layout */}
        <div style={styles.layout}>
          {/* Image Section */}
          <div style={styles.imageSection}>
            <div style={styles.mainImageWrap}>
              {displayImageUrl ? (
                <img
                  src={displayImageUrl}
                  alt={allImages[selectedImageIdx]?.alt || product.name}
                  style={styles.mainImage}
                />
              ) : (
                <img
                  src="/src/assets/images/placeholder-product.svg"
                  alt="Product placeholder"
                  style={styles.mainImage}
                />
              )}
              {!isInStock && (
                <span style={styles.outOfStockOverlay}>Out of Stock</span>
              )}
            </div>

            {allImages.length > 1 && (
              <div style={styles.thumbnailRow} role="list" aria-label="Product image thumbnails">
                {allImages.map((img, idx) => {
                  const thumbUrl = img.url || img.image_url || img.thumbnail_url || null;
                  return (
                    <button
                      key={idx}
                      type="button"
                      role="listitem"
                      style={idx === selectedImageIdx
                        ? { ...styles.thumbnail, ...styles.thumbnailActive }
                        : styles.thumbnail
                      }
                      onClick={() => setSelectedImageIdx(idx)}
                      aria-label={`View image ${idx + 1}`}
                      aria-pressed={idx === selectedImageIdx}
                    >
                      {thumbUrl ? (
                        <img
                          src={thumbUrl}
                          alt={img.alt || product.name}
                          style={styles.thumbnailImg}
                          loading="lazy"
                        />
                      ) : (
                        <img
                          src="/src/assets/images/placeholder-product.svg"
                          alt="Placeholder"
                          style={styles.thumbnailImg}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div style={styles.infoSection}>
            {product.brand_name && (
              <span style={styles.brandName}>{product.brand_name}</span>
            )}

            <h1 style={styles.productName}>{product.name}</h1>

            {product.avg_rating != null && (
              <div style={styles.ratingRow}>
                <StarRating rating={product.avg_rating} size={16} />
                <span style={styles.ratingValue}>{Number(product.avg_rating).toFixed(1)}</span>
                {product.review_count != null && (
                  <span style={styles.ratingCount}>({product.review_count} reviews)</span>
                )}
              </div>
            )}

            {selectedSku?.sku_code || product.sku_code ? (
              <div style={styles.skuRow}>
                <span>SKU:</span>
                <span style={styles.skuCode}>{selectedSku?.sku_code || product.sku_code}</span>
              </div>
            ) : null}

            <hr style={styles.divider} />

            {/* Price */}
            {effectivePrice !== null && (
              <div style={styles.priceBlock}>
                <div style={styles.priceRow}>
                  <span style={styles.price}>
                    ₹{Number(effectivePrice).toLocaleString('en-IN')}
                  </span>
                  {effectiveMrp && effectiveMrp > effectivePrice && (
                    <span style={styles.priceMrp}>
                      ₹{Number(effectiveMrp).toLocaleString('en-IN')}
                    </span>
                  )}
                  {discountPct && (
                    <span style={styles.priceDiscount}>{discountPct}% off</span>
                  )}
                </div>
                <span style={styles.taxNote}>Inclusive of all taxes</span>
              </div>
            )}

            {/* Stock Status */}
            <div>
              {isLowStock ? (
                <span style={{ ...styles.stockStatus, ...styles.stockLow }}>
                  Only {effectiveStock} left in stock — order soon
                </span>
              ) : isInStock ? (
                <span style={{ ...styles.stockStatus, ...styles.stockIn }}>In Stock</span>
              ) : (
                <span style={{ ...styles.stockStatus, ...styles.stockOut }}>Out of Stock</span>
              )}
            </div>

            <hr style={styles.divider} />

            {/* Variant Picker */}
            {Object.keys(variantGroups).length > 0 && (
              <div style={styles.variantSection}>
                {Object.entries(variantGroups).map(([groupKey, valSet]) => {
                  const values = Array.from(valSet);
                  return (
                    <div key={groupKey}>
                      <p style={styles.variantGroupLabel}>
                        {groupKey.charAt(0).toUpperCase() + groupKey.slice(1)}:
                        {selectedAttrs[groupKey] && (
                          <span style={{ fontWeight: '400', color: '#495057', marginLeft: '6px' }}>
                            {selectedAttrs[groupKey]}
                          </span>
                        )}
                      </p>
                      <div style={styles.variantOptions} role="group" aria-label={`Select ${groupKey}`}>
                        {values.map((val) => {
                          const isSelected = selectedAttrs[groupKey] === val;
                          const available = isVariantValueAvailable(groupKey, val);
                          let btnStyle = styles.variantBtn;
                          if (!available) {
                            btnStyle = { ...styles.variantBtn, ...styles.variantBtnDisabled };
                          } else if (isSelected) {
                            btnStyle = { ...styles.variantBtn, ...styles.variantBtnActive };
                          }
                          return (
                            <button
                              key={val}
                              type="button"
                              className="variant-btn"
                              style={btnStyle}
                              onClick={() => available && selectVariantValue(groupKey, val)}
                              disabled={!available}
                              aria-pressed={isSelected}
                              aria-label={`${groupKey}: ${val}${!available ? ' (unavailable)' : ''}`}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quantity */}
            {isInStock && (
              <div style={styles.quantityRow}>
                <span style={styles.quantityLabel}>Quantity:</span>
                <div style={styles.quantityControl}>
                  <button
                    type="button"
                    className="qty-btn"
                    style={quantity <= 1
                      ? { ...styles.quantityBtn, ...styles.quantityBtnDisabled }
                      : styles.quantityBtn
                    }
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span style={styles.quantityValue} aria-live="polite" aria-label={`Quantity: ${quantity}`}>
                    {quantity}
                  </span>
                  <button
                    type="button"
                    className="qty-btn"
                    style={quantity >= maxQty
                      ? { ...styles.quantityBtn, ...styles.quantityBtnDisabled }
                      : styles.quantityBtn
                    }
                    onClick={() => setQuantity(q => Math.min(maxQty, q + 1))}
                    disabled={quantity >= maxQty}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Cart Feedback */}
            {cartSuccess && (
              <div style={styles.successMsg} role="status" aria-live="polite">
                Item added to cart successfully!
              </div>
            )}
            {cartError && (
              <div style={styles.errorMsg} role="alert">
                {cartError}
              </div>
            )}

            {/* Add to Cart */}
            <button
              type="button"
              className="add-to-cart-btn"
              style={
                !isInStock
                  ? { ...styles.addToCartBtn, ...styles.addToCartBtnDisabled }
                  : addingToCart
                  ? { ...styles.addToCartBtn, ...styles.addToCartBtnLoading }
                  : styles.addToCartBtn
              }
              onClick={handleAddToCart}
              disabled={!isInStock || addingToCart}
              aria-disabled={!isInStock || addingToCart}
            >
              {addingToCart
                ? 'Adding to Cart…'
                : !isInStock
                ? 'Out of Stock'
                : 'Add to Cart'
              }
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginTop: '40px' }}>
          <div style={styles.tabBar} role="tablist" aria-label="Product information">
            {TABS.map(tab => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                className="tab-btn"
                style={activeTab === tab.key
                  ? { ...styles.tabBtn, ...styles.tabBtnActive }
                  : styles.tabBtn
                }
                onClick={() => setActiveTab(tab.key)}
                aria-selected={activeTab === tab.key}
                aria-controls={`tabpanel-${tab.key}`}
                id={`tab-${tab.key}`}
              >
                {tab.label}
                {tab.key === 'reviews' && product.review_count != null && (
                  <span style={{ marginLeft: '6px', fontSize: '12px', color: '#868e96' }}>({product.review_count})</span>
                )}
              </button>
            ))}
          </div>

          <div
            style={styles.tabContent}
            role="tabpanel"
            id={`tabpanel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
          >
            {activeTab === 'description' && (
              <p style={styles.descriptionText}>
                {product.description || product.short_description || 'No description available for this product.'}
              </p>
            )}

            {activeTab === 'specifications' && (
              hasSpecs ? (
                <table style={styles.specsTable} aria-label="Product specifications">
                  <tbody>
                    {Object.entries(specifications).map(([key, val]) => (
                      <tr key={key} style={styles.specRow}>
                        <td style={styles.specKey}>{key}</td>
                        <td style={styles.specVal}>{String(val)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ fontSize: '14px', color: '#495057' }}>No specifications available.</p>
              )
            )}

            {activeTab === 'reviews' && (
              reviews.length > 0 ? (
                <div style={styles.reviewsList}>
                  {reviews.map((review, idx) => (
                    <div key={review.id || idx} style={styles.reviewCard}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <StarRating rating={review.rating} size={13} />
                        <span style={styles.reviewAuthor}>{review.author || review.user_name || 'Anonymous'}</span>
                      </div>
                      {review.created_at && (
                        <p style={styles.reviewDate}>
                          {new Date(review.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      )}
                      <p style={styles.reviewBody}>{review.body || review.comment || review.text || ''}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '14px', color: '#495057' }}>No reviews yet for this product.</p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
