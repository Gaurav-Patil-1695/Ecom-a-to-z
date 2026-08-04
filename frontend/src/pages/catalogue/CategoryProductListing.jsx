import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const SORT_OPTIONS = [
  { value: '', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Top Rated' },
];

const PAGE_SIZE_OPTIONS = [12, 24, 48];

const PRICE_RANGES = [
  { label: 'Under \u20b9500', min: 0, max: 500 },
  { label: '\u20b9500 \u2013 \u20b91,000', min: 500, max: 1000 },
  { label: '\u20b91,000 \u2013 \u20b92,500', min: 1000, max: 2500 },
  { label: '\u20b92,500 \u2013 \u20b95,000', min: 2500, max: 5000 },
  { label: 'Above \u20b95,000', min: 5000, max: null },
];

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
  header: {
    marginBottom: '24px',
  },
  breadcrumb: {
    fontSize: '14px',
    color: '#495057',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  breadcrumbLink: {
    color: '#4c6ef5',
    textDecoration: 'none',
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '32px',
    letterSpacing: '-0.01em',
    color: '#212529',
    margin: '0 0 4px 0',
  },
  categoryDescription: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: '20px',
    marginBottom: '4px',
  },
  resultCount: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: '20px',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '240px 1fr',
    gap: '24px',
    alignItems: 'start',
  },
  sidebar: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '20px',
    border: '1px solid #e9ecef',
    position: 'sticky',
    top: '16px',
  },
  filterSection: {
    marginBottom: '20px',
    borderBottom: '1px solid #e9ecef',
    paddingBottom: '20px',
  },
  filterSectionLast: {
    marginBottom: '0',
    borderBottom: 'none',
    paddingBottom: '0',
  },
  filterTitle: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#212529',
    marginBottom: '12px',
    margin: '0 0 12px 0',
  },
  filterList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  filterItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#343a40',
    lineHeight: '20px',
  },
  checkbox: {
    accentColor: '#4c6ef5',
    width: '16px',
    height: '16px',
    cursor: 'pointer',
    flexShrink: 0,
  },
  clearFiltersBtn: {
    background: 'none',
    border: 'none',
    color: '#4c6ef5',
    fontSize: '12px',
    cursor: 'pointer',
    padding: '0',
    fontFamily: 'inherit',
    textDecoration: 'underline',
    marginBottom: '16px',
  },
  mainContent: {},
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    gap: '12px',
    flexWrap: 'wrap',
  },
  toolbarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  toolbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  select: {
    fontSize: '14px',
    color: '#212529',
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '6px',
    padding: '8px 12px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    minHeight: '44px',
    outline: 'none',
  },
  viewToggle: {
    display: 'flex',
    gap: '4px',
  },
  viewBtn: {
    width: '36px',
    height: '36px',
    border: '1px solid #868e96',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    color: '#495057',
    transition: 'background-color 0.15s, color 0.15s',
  },
  viewBtnActive: {
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: '1px solid #4c6ef5',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
  productList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
    overflow: 'hidden',
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    transition: 'box-shadow 0.2s',
  },
  productCardList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImageWrap: {
    position: 'relative',
    backgroundColor: '#f8f9fa',
    aspectRatio: '1',
    overflow: 'hidden',
    flexShrink: 0,
  },
  productImageWrapList: {
    width: '120px',
    aspectRatio: '1',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  outOfStockBadge: {
    position: 'absolute',
    top: '8px',
    left: '8px',
    backgroundColor: '#868e96',
    color: '#ffffff',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.04em',
    padding: '2px 8px',
    borderRadius: '3px',
    textTransform: 'uppercase',
  },
  productBody: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },
  productBrand: {
    fontSize: '12px',
    color: '#495057',
    fontWeight: '500',
    letterSpacing: '0.02em',
  },
  productName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
    lineHeight: '20px',
    margin: 0,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  productPriceRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '6px',
    marginTop: '4px',
  },
  productPrice: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#212529',
  },
  productPriceMrp: {
    fontSize: '13px',
    color: '#868e96',
    textDecoration: 'line-through',
  },
  productDiscount: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#37b24d',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginTop: '2px',
  },
  ratingStars: {
    color: '#fd7e14',
    fontSize: '12px',
    display: 'flex',
    gap: '1px',
  },
  ratingCount: {
    fontSize: '12px',
    color: '#495057',
  },
  skeleton: {
    backgroundColor: '#e9ecef',
    borderRadius: '10px',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  skeletonImg: {
    aspectRatio: '1',
    backgroundColor: '#e9ecef',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '64px 24px',
    textAlign: 'center',
  },
  emptyStateImg: {
    width: '120px',
    marginBottom: '24px',
    opacity: 0.6,
  },
  emptyStateTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '8px',
  },
  emptyStateText: {
    fontSize: '14px',
    color: '#495057',
    maxWidth: '400px',
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    marginTop: '32px',
  },
  pageBtn: {
    minWidth: '44px',
    height: '44px',
    border: '1px solid #868e96',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    color: '#212529',
    fontSize: '14px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 8px',
    transition: 'background-color 0.15s',
  },
  pageBtnActive: {
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: '1px solid #4c6ef5',
    fontWeight: '600',
  },
  pageBtnDisabled: {
    backgroundColor: '#e9ecef',
    color: '#adb5bd',
    cursor: 'not-allowed',
    border: '1px solid #e9ecef',
  },
  activeFiltersBar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '16px',
  },
  activeFilterChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: '#e8ecfd',
    color: '#3b5bdb',
    fontSize: '12px',
    fontWeight: '500',
    padding: '4px 10px',
    borderRadius: '9999px',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  errorBox: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    border: '1px solid #f03e3e',
    borderRadius: '10px',
    padding: '16px 20px',
    fontSize: '14px',
    marginBottom: '16px',
  },
  subCategoriesSection: {
    marginBottom: '20px',
    borderBottom: '1px solid #e9ecef',
    paddingBottom: '20px',
  },
  subCategoryList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  subCategoryLink: {
    display: 'block',
    padding: '6px 8px',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#343a40',
    textDecoration: 'none',
    transition: 'background-color 0.15s',
  },
  subCategoryLinkActive: {
    backgroundColor: '#e8ecfd',
    color: '#3b5bdb',
    fontWeight: '600',
  },
};

function StarRating({ rating }) {
  const stars = Math.round(rating || 0);
  return (
    <span style={styles.ratingStars}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: s <= stars ? '#fd7e14' : '#dee2e6' }}>\u2605</span>
      ))}
    </span>
  );
}

function ProductCardSkeleton({ listView }) {
  if (listView) {
    return (
      <div style={{ ...styles.productCard, ...styles.productCardList, ...styles.skeleton, minHeight: '120px' }} />
    );
  }
  return (
    <div style={{ ...styles.productCard, ...styles.skeleton }}>
      <div style={{ ...styles.skeletonImg }} />
      <div style={{ height: '14px', backgroundColor: '#e9ecef', borderRadius: '3px', margin: '12px 12px 6px' }} />
      <div style={{ height: '12px', backgroundColor: '#e9ecef', borderRadius: '3px', margin: '0 12px 12px', width: '60%' }} />
    </div>
  );
}

function ProductCard({ product, listView }) {
  const imageUrl = product.image_url || product.thumbnail_url || null;
  const inStock = product.in_stock !== false;
  const discountPct = product.mrp && product.price && product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : null;

  const cardStyle = listView
    ? { ...styles.productCard, ...styles.productCardList }
    : styles.productCard;

  const imageWrapStyle = listView
    ? { ...styles.productImageWrap, ...styles.productImageWrapList }
    : styles.productImageWrap;

  return (
    <Link
      to={`/products/${product.slug || product.id}`}
      style={cardStyle}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(33,37,41,0.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={imageWrapStyle}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            style={styles.productImage}
            loading="lazy"
          />
        ) : (
          <img
            src="/src/assets/images/placeholder-product.svg"
            alt="Product placeholder"
            style={styles.productImage}
          />
        )}
        {!inStock && (
          <span style={styles.outOfStockBadge}>Out of Stock</span>
        )}
      </div>

      <div style={styles.productBody}>
        {product.brand_name && (
          <span style={styles.productBrand}>{product.brand_name}</span>
        )}
        <p style={styles.productName}>{product.name}</p>

        <div style={styles.productPriceRow}>
          <span style={styles.productPrice}>
            \u20b9{Number(product.price).toLocaleString('en-IN')}
          </span>
          {product.mrp && product.mrp > product.price && (
            <span style={styles.productPriceMrp}>
              \u20b9{Number(product.mrp).toLocaleString('en-IN')}
            </span>
          )}
          {discountPct && (
            <span style={styles.productDiscount}>{discountPct}% off</span>
          )}
        </div>

        {product.avg_rating != null && (
          <div style={styles.ratingRow}>
            <StarRating rating={product.avg_rating} />
            {product.review_count != null && (
              <span style={styles.ratingCount}>({product.review_count})</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <nav style={styles.pagination} aria-label="Product listing pagination">
      <button
        style={currentPage === 1 ? { ...styles.pageBtn, ...styles.pageBtnDisabled } : styles.pageBtn}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        \u2039
      </button>

      {getPageNumbers().map((page, idx) =>
        page === '...' ? (
          <span key={`ellipsis-${idx}`} style={{ padding: '0 4px', color: '#495057', lineHeight: '44px' }}>\u2026</span>
        ) : (
          <button
            key={page}
            style={page === currentPage ? { ...styles.pageBtn, ...styles.pageBtnActive } : styles.pageBtn}
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        style={currentPage === totalPages ? { ...styles.pageBtn, ...styles.pageBtnDisabled } : styles.pageBtn}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        \u203a
      </button>
    </nav>
  );
}

export default function CategoryProductListing() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const sortBy = searchParams.get('sort') || '';
  const pageSize = parseInt(searchParams.get('limit') || '12', 10);
  const selectedBrands = searchParams.getAll('brand');
  const selectedPriceRange = searchParams.get('price');

  const [category, setCategory] = useState(null);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryError, setCategoryError] = useState(null);

  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [brands, setBrands] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [viewMode, setViewMode] = useState('grid');

  const totalPages = Math.ceil(totalCount / pageSize);

  function priceRangeKey(range) {
    return `${range.min}-${range.max ?? 'up'}`;
  }

  const fetchCategory = useCallback(async () => {
    if (!slug) return;
    setCategoryLoading(true);
    setCategoryError(null);
    try {
      const res = await fetch(`${API_BASE}/api/categories?slug=${encodeURIComponent(slug)}`);
      if (!res.ok) throw new Error(`Failed to load category (${res.status})`);
      const data = await res.json();
      const cats = data.data || data.categories || data || [];
      const found = Array.isArray(cats)
        ? cats.find(c => c.slug === slug)
        : null;
      if (!found) {
        const directRes = await fetch(`${API_BASE}/api/categories/${encodeURIComponent(slug)}`);
        if (!directRes.ok) throw new Error(`Category not found`);
        const directData = await directRes.json();
        const cat = directData.data || directData;
        setCategory(cat);
        setSubCategories(cat.children || cat.sub_categories || []);
      } else {
        setCategory(found);
        setSubCategories(found.children || found.sub_categories || []);
      }
    } catch (err) {
      setCategoryError(err.message || 'Failed to load category.');
    } finally {
      setCategoryLoading(false);
    }
  }, [slug]);

  const fetchBrands = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/brands`);
      if (!res.ok) return;
      const data = await res.json();
      setBrands(data.data || data || []);
    } catch {
      // non-critical
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', String(currentPage));
      params.set('limit', String(pageSize));
      if (sortBy) params.set('sort', sortBy);
      selectedBrands.forEach(b => params.append('brand', b));
      if (selectedPriceRange) {
        const found = PRICE_RANGES.find(pr => priceRangeKey(pr) === selectedPriceRange);
        if (found) {
          params.set('price_min', String(found.min));
          if (found.max !== null) params.set('price_max', String(found.max));
        }
      }
      const categoryId = category?.id || slug;
      const res = await fetch(`${API_BASE}/api/categories/${encodeURIComponent(categoryId)}/products?${params.toString()}`);
      if (!res.ok) throw new Error(`Failed to load products (${res.status})`);
      const data = await res.json();
      setProducts(data.data || data.products || []);
      setTotalCount(data.total || data.totalCount || 0);
    } catch (err) {
      setError(err.message || 'Something went wrong loading products.');
    } finally {
      setLoading(false);
    }
  }, [slug, category?.id, currentPage, sortBy, pageSize, selectedBrands.join(','), selectedPriceRange]);

  useEffect(() => { fetchCategory(); }, [fetchCategory]);
  useEffect(() => { fetchBrands(); }, [fetchBrands]);
  useEffect(() => {
    if (!categoryLoading) {
      fetchProducts();
    }
  }, [fetchProducts, categoryLoading]);

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set('page', '1');
    setSearchParams(next);
  }

  function toggleBrand(brandId) {
    const next = new URLSearchParams(searchParams);
    const current = next.getAll('brand');
    next.delete('brand');
    if (current.includes(String(brandId))) {
      current.filter(b => b !== String(brandId)).forEach(b => next.append('brand', b));
    } else {
      [...current, String(brandId)].forEach(b => next.append('brand', b));
    }
    next.set('page', '1');
    setSearchParams(next);
  }

  function togglePriceRange(key) {
    const next = new URLSearchParams(searchParams);
    if (next.get('price') === key) {
      next.delete('price');
    } else {
      next.set('price', key);
    }
    next.set('page', '1');
    setSearchParams(next);
  }

  function clearAllFilters() {
    const next = new URLSearchParams();
    next.set('page', '1');
    if (sortBy) next.set('sort', sortBy);
    next.set('limit', String(pageSize));
    setSearchParams(next);
  }

  function removeBrandFilter(brandId) {
    const next = new URLSearchParams(searchParams);
    const current = next.getAll('brand').filter(b => b !== String(brandId));
    next.delete('brand');
    current.forEach(b => next.append('brand', b));
    next.set('page', '1');
    setSearchParams(next);
  }

  const hasActiveFilters = selectedBrands.length > 0 || !!selectedPriceRange;

  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  const activePriceRangeLabel = selectedPriceRange
    ? PRICE_RANGES.find(pr => priceRangeKey(pr) === selectedPriceRange)?.label
    : null;

  const activeBrandLabels = selectedBrands.map(bid => {
    const found = brands.find(b => String(b.id) === String(bid));
    return found ? found.name : bid;
  });

  const categoryName = category?.name || (categoryLoading ? '\u2026' : slug);
  const parentCategory = category?.parent || null;

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
        <header style={styles.header}>
          <nav style={styles.breadcrumb} aria-label="Breadcrumb">
            <Link to="/" style={styles.breadcrumbLink}>Home</Link>
            <span style={{ color: '#868e96' }}>\u203a</span>
            <Link to="/products" style={styles.breadcrumbLink}>Products</Link>
            {parentCategory && (
              <>
                <span style={{ color: '#868e96' }}>\u203a</span>
                <Link
                  to={`/categories/${parentCategory.slug || parentCategory.id}/products`}
                  style={styles.breadcrumbLink}
                >
                  {parentCategory.name}
                </Link>
              </>
            )}
            <span style={{ color: '#868e96' }}>\u203a</span>
            <span style={{ color: '#495057' }}>{categoryName}</span>
          </nav>

          {categoryError ? (
            <div style={styles.errorBox} role="alert">{categoryError}</div>
          ) : (
            <>
              <h1 style={styles.pageTitle}>{categoryName}</h1>
              {category?.description && (
                <p style={styles.categoryDescription}>{category.description}</p>
              )}
            </>
          )}

          {!loading && !error && (
            <p style={styles.resultCount}>
              {totalCount === 0
                ? 'No products found'
                : `Showing ${startItem}\u2013${endItem} of ${totalCount.toLocaleString('en-IN')} products`}
            </p>
          )}
        </header>

        <div style={styles.layout}>
          {/* Sidebar Filters */}
          <aside style={styles.sidebar} aria-label="Product filters">
            {hasActiveFilters && (
              <button
                style={styles.clearFiltersBtn}
                onClick={clearAllFilters}
                type="button"
              >
                Clear all filters
              </button>
            )}

            {/* Sub-categories */}
            {subCategories.length > 0 && (
              <div style={styles.subCategoriesSection}>
                <p style={styles.filterTitle}>Sub-categories</p>
                <ul style={styles.subCategoryList} role="list">
                  {subCategories.map((sub) => (
                    <li key={sub.id || sub.slug}>
                      <Link
                        to={`/categories/${sub.slug || sub.id}/products`}
                        style={styles.subCategoryLink}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f8f9fa'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Price Range */}
            <div style={styles.filterSection}>
              <p style={styles.filterTitle}>Price Range</p>
              <ul style={styles.filterList} role="group" aria-label="Filter by price range">
                {PRICE_RANGES.map((range) => {
                  const key = priceRangeKey(range);
                  const checked = selectedPriceRange === key;
                  return (
                    <li key={key}>
                      <label style={styles.filterItem}>
                        <input
                          type="radio"
                          name="price_range"
                          style={styles.checkbox}
                          checked={checked}
                          onChange={() => togglePriceRange(key)}
                        />
                        {range.label}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Brands */}
            {brands.length > 0 && (
              <div style={styles.filterSectionLast}>
                <p style={styles.filterTitle}>Brand</p>
                <ul style={styles.filterList} role="group" aria-label="Filter by brand">
                  {brands.map((brand) => (
                    <li key={brand.id}>
                      <label style={styles.filterItem}>
                        <input
                          type="checkbox"
                          style={styles.checkbox}
                          checked={selectedBrands.includes(String(brand.id))}
                          onChange={() => toggleBrand(brand.id)}
                        />
                        {brand.name}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>

          {/* Main Content */}
          <main style={styles.mainContent}>
            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <div style={styles.activeFiltersBar} aria-label="Active filters">
                {activePriceRangeLabel && (
                  <button
                    type="button"
                    style={styles.activeFilterChip}
                    onClick={() => { const n = new URLSearchParams(searchParams); n.delete('price'); n.set('page', '1'); setSearchParams(n); }}
                    aria-label={`Remove price filter: ${activePriceRangeLabel}`}
                  >
                    {activePriceRangeLabel} \u2715
                  </button>
                )}
                {activeBrandLabels.map((label, idx) => (
                  <button
                    key={selectedBrands[idx]}
                    type="button"
                    style={styles.activeFilterChip}
                    onClick={() => removeBrandFilter(selectedBrands[idx])}
                    aria-label={`Remove brand filter: ${label}`}
                  >
                    {label} \u2715
                  </button>
                ))}
              </div>
            )}

            {/* Toolbar */}
            <div style={styles.toolbar}>
              <div style={styles.toolbarLeft}>
                <label htmlFor="sort-select" style={{ fontSize: '14px', color: '#495057', whiteSpace: 'nowrap' }}>
                  Sort by:
                </label>
                <select
                  id="sort-select"
                  style={styles.select}
                  value={sortBy}
                  onChange={e => updateParam('sort', e.target.value)}
                  aria-label="Sort products"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div style={styles.toolbarRight}>
                <label htmlFor="page-size-select" style={{ fontSize: '14px', color: '#495057', whiteSpace: 'nowrap' }}>
                  Show:
                </label>
                <select
                  id="page-size-select"
                  style={styles.select}
                  value={pageSize}
                  onChange={e => updateParam('limit', e.target.value)}
                  aria-label="Products per page"
                >
                  {PAGE_SIZE_OPTIONS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                <div style={styles.viewToggle} role="group" aria-label="View mode">
                  <button
                    type="button"
                    style={viewMode === 'grid' ? { ...styles.viewBtn, ...styles.viewBtnActive } : styles.viewBtn}
                    onClick={() => setViewMode('grid')}
                    aria-label="Grid view"
                    aria-pressed={viewMode === 'grid'}
                  >
                    \u229e
                  </button>
                  <button
                    type="button"
                    style={viewMode === 'list' ? { ...styles.viewBtn, ...styles.viewBtnActive } : styles.viewBtn}
                    onClick={() => setViewMode('list')}
                    aria-label="List view"
                    aria-pressed={viewMode === 'list'}
                  >
                    \u2630
                  </button>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={styles.errorBox} role="alert">
                {error}
              </div>
            )}

            {/* Products */}
            {loading ? (
              <div style={viewMode === 'grid' ? styles.productGrid : styles.productList}>
                {Array.from({ length: pageSize }).map((_, i) => (
                  <ProductCardSkeleton key={i} listView={viewMode === 'list'} />
                ))}
              </div>
            ) : !error && products.length === 0 ? (
              <div style={styles.emptyState}>
                <img
                  src="/src/assets/images/empty-state.svg"
                  alt="No products found"
                  style={styles.emptyStateImg}
                />
                <h2 style={styles.emptyStateTitle}>No products found</h2>
                <p style={styles.emptyStateText}>
                  Try adjusting your filters or browse other categories.
                </p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    style={{
                      marginTop: '16px',
                      backgroundColor: '#4c6ef5',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '10px 24px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      minHeight: '44px',
                    }}
                    onClick={clearAllFilters}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div style={viewMode === 'grid' ? styles.productGrid : styles.productList}>
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    listView={viewMode === 'list'}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => updateParam('page', String(page))}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
