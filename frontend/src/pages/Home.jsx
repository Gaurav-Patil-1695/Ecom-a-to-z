import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoSvg from '@/assets/images/logo.svg';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import searchIcon from '@/assets/icons/search.svg';
import cartIcon from '@/assets/icons/cart.svg';
import userIcon from '@/assets/icons/user.svg';
import bellIcon from '@/assets/icons/bell.svg';
import heartIcon from '@/assets/icons/heart.svg';
import starIcon from '@/assets/icons/star.svg';
import chevronRightIcon from '@/assets/icons/chevron-right.svg';
import menuIcon from '@/assets/icons/menu.svg';
import closeIcon from '@/assets/icons/close.svg';

const CATEGORIES = [
  { id: 'electronics', label: 'Electronics', emoji: '📱' },
  { id: 'fashion', label: 'Fashion', emoji: '👗' },
  { id: 'home-living', label: 'Home & Living', emoji: '🏠' },
  { id: 'sports', label: 'Sports', emoji: '⚽' },
  { id: 'beauty', label: 'Beauty', emoji: '💄' },
  { id: 'books', label: 'Books', emoji: '📚' },
];

const FEATURED_PRODUCTS = [
  { id: '1', name: 'Wireless Earbuds Pro', price: 1299, originalPrice: 2499, rating: 4.5, reviews: 1280, badge: '48% off' },
  { id: '2', name: 'Running Shoes Ultra', price: 2199, originalPrice: 3999, rating: 4.3, reviews: 876, badge: '45% off' },
  { id: '3', name: 'Smart Watch Series X', price: 4999, originalPrice: 8999, rating: 4.7, reviews: 2341, badge: '44% off' },
  { id: '4', name: 'Cotton Casual T-Shirt', price: 399, originalPrice: 799, rating: 4.1, reviews: 512, badge: '50% off' },
];

const PROMO_BANNERS = [
  {
    id: 1,
    headline: 'Up to 60% off on Electronics',
    subline: 'Shop the latest gadgets at unbeatable prices',
    cta: 'Shop Electronics',
    categoryId: 'electronics',
    bg: 'linear-gradient(135deg, #4c6ef5 0%, #3b5bdb 100%)',
    color: '#ffffff',
  },
  {
    id: 2,
    headline: 'Fashion Sale — Up to 50% off',
    subline: 'Trending styles for every occasion',
    cta: 'Explore Fashion',
    categoryId: 'fashion',
    bg: 'linear-gradient(135deg, #fd7e14 0%, #e8590c 100%)',
    color: '#ffffff',
  },
  {
    id: 3,
    headline: 'Home Essentials at Best Prices',
    subline: 'Transform your living space today',
    cta: 'Shop Home & Living',
    categoryId: 'home-living',
    bg: 'linear-gradient(135deg, #37b24d 0%, #2f9e44 100%)',
    color: '#ffffff',
  },
];

function StarRating({ rating }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <img
          key={star}
          src={starIcon}
          alt=""
          aria-hidden="true"
          style={{
            width: '12px',
            height: '12px',
            opacity: star <= Math.round(rating) ? 1 : 0.3,
          }}
        />
      ))}
      <span
        style={{
          fontSize: '12px',
          color: '#495057',
          marginLeft: '4px',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        {rating}
      </span>
    </span>
  );
}

function ProductCard({ product }) {
  const navigate = useNavigate();
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      style={{
        background: '#ffffff',
        borderRadius: '10px',
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid #e9ecef',
        transition: 'box-shadow 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(76,110,245,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
      role="article"
      aria-label={product.name}
    >
      <div style={{ position: 'relative' }}>
        <img
          src={placeholderProduct}
          alt={product.name}
          style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block', background: '#f8f9fa' }}
        />
        {product.badge && (
          <span
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              background: '#f03e3e',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '0.04em',
              padding: '2px 8px',
              borderRadius: '3px',
              fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            }}
          >
            {product.badge}
          </span>
        )}
        <button
          aria-label={`Add ${product.name} to wishlist`}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'rgba(255,255,255,0.9)',
            border: 'none',
            borderRadius: '9999px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: '0',
          }}
        >
          <img src={heartIcon} alt="" aria-hidden="true" style={{ width: '16px', height: '16px' }} />
        </button>
      </div>
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p
          style={{
            margin: 0,
            fontSize: '14px',
            fontWeight: '500',
            color: '#212529',
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            lineHeight: '20px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.name}
        </p>
        <StarRating rating={product.rating} />
        <p
          style={{
            margin: 0,
            fontSize: '11px',
            color: '#495057',
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          }}
        >
          {product.reviews.toLocaleString()} reviews
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: 'auto' }}>
          <span
            style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#212529',
              fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            }}
          >
            ₹{product.price.toLocaleString()}
          </span>
          <span
            style={{
              fontSize: '13px',
              color: '#868e96',
              textDecoration: 'line-through',
              fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            }}
          >
            ₹{product.originalPrice.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

function HeroBanner({ banner, onCtaClick }) {
  return (
    <div
      style={{
        background: banner.bg,
        borderRadius: '16px',
        padding: '48px 40px',
        color: banner.color,
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        minHeight: '240px',
        justifyContent: 'center',
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: '32px',
          fontWeight: '700',
          letterSpacing: '-0.02em',
          lineHeight: '40px',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          color: banner.color,
        }}
      >
        {banner.headline}
      </h2>
      <p
        style={{
          margin: 0,
          fontSize: '16px',
          fontWeight: '400',
          lineHeight: '24px',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          color: banner.color,
          opacity: 0.9,
        }}
      >
        {banner.subline}
      </p>
      <button
        onClick={() => onCtaClick(banner.categoryId)}
        style={{
          alignSelf: 'flex-start',
          background: 'rgba(255,255,255,0.2)',
          color: banner.color,
          border: '2px solid rgba(255,255,255,0.6)',
          borderRadius: '9999px',
          padding: '10px 24px',
          fontSize: '14px',
          fontWeight: '600',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          cursor: 'pointer',
          minHeight: '44px',
          transition: 'background 0.2s ease',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.35)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
        }}
      >
        {banner.cta}
      </button>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % PROMO_BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/categories/${categoryId}/products`);
  };

  const handleBannerCta = (categoryId) => {
    navigate(`/categories/${categoryId}/products`);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8f9fa',
        fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {/* Header / Navbar */}
      <header
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e9ecef',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 1px 4px rgba(33,37,41,0.06)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            height: '64px',
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              flexShrink: 0,
            }}
            aria-label="ShopMini Home"
          >
            <img src={logoSvg} alt="ShopMini" style={{ height: '32px', width: 'auto' }} />
            <span
              style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#4c6ef5',
                letterSpacing: '-0.01em',
                whiteSpace: 'nowrap',
              }}
            >
              ShopMini
            </span>
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            style={{ flex: 1, maxWidth: '560px', display: 'flex', position: 'relative' }}
            role="search"
          >
            <label htmlFor="home-search" style={{ position: 'absolute', left: '-9999px' }}>
              Search products
            </label>
            <input
              id="home-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products, brands and more…"
              style={{
                flex: 1,
                height: '44px',
                border: '1.5px solid #868e96',
                borderRight: 'none',
                borderRadius: '6px 0 0 6px',
                padding: '0 16px',
                fontSize: '14px',
                color: '#212529',
                background: '#ffffff',
                outline: 'none',
                fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#4c6ef5';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(76,110,245,0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#868e96';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            <button
              type="submit"
              aria-label="Search"
              style={{
                height: '44px',
                padding: '0 16px',
                background: '#4c6ef5',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0 6px 6px 0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#3b5bdb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#4c6ef5';
              }}
            >
              <img src={searchIcon} alt="" aria-hidden="true" style={{ width: '18px', height: '18px', filter: 'invert(1)' }} />
            </button>
          </form>

          {/* Nav Actions */}
          <nav
            aria-label="Primary navigation"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}
          >
            <Link
              to="/notifications"
              aria-label="Notifications"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                color: '#495057',
                textDecoration: 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e8ecfd';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <img src={bellIcon} alt="" aria-hidden="true" style={{ width: '22px', height: '22px' }} />
            </Link>
            <Link
              to="/cart"
              aria-label="Cart"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                color: '#495057',
                textDecoration: 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e8ecfd';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <img src={cartIcon} alt="" aria-hidden="true" style={{ width: '22px', height: '22px' }} />
            </Link>
            <Link
              to="/account"
              aria-label="My Account"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                color: '#495057',
                textDecoration: 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e8ecfd';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <img src={userIcon} alt="" aria-hidden="true" style={{ width: '22px', height: '22px' }} />
            </Link>
            <button
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileMenuOpen((v) => !v)}
              style={{
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '10px',
              }}
              className="mobile-menu-btn"
            >
              <img
                src={mobileMenuOpen ? closeIcon : menuIcon}
                alt=""
                aria-hidden="true"
                style={{ width: '22px', height: '22px' }}
              />
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px 64px' }}>

          {/* Hero Banners */}
          <section aria-label="Promotional banners" style={{ marginBottom: '48px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
              }}
            >
              {PROMO_BANNERS.map((banner, index) => (
                <div
                  key={banner.id}
                  style={{
                    opacity: 1,
                    transform: index === activeBannerIndex ? 'scale(1.01)' : 'scale(1)',
                    transition: 'transform 0.4s ease',
                  }}
                >
                  <HeroBanner banner={banner} onCtaClick={handleBannerCta} />
                </div>
              ))}
            </div>

            {/* Banner dots */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '16px',
              }}
              role="tablist"
              aria-label="Banner navigation"
            >
              {PROMO_BANNERS.map((banner, index) => (
                <button
                  key={banner.id}
                  role="tab"
                  aria-selected={index === activeBannerIndex}
                  aria-label={`View banner ${index + 1}`}
                  onClick={() => setActiveBannerIndex(index)}
                  style={{
                    width: index === activeBannerIndex ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '9999px',
                    background: index === activeBannerIndex ? '#4c6ef5' : '#adb5bd',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </div>
          </section>

          {/* Category Strip */}
          <section aria-labelledby="categories-heading" style={{ marginBottom: '48px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
              }}
            >
              <h2
                id="categories-heading"
                style={{
                  margin: 0,
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#212529',
                  letterSpacing: '-0.01em',
                  lineHeight: '32px',
                }}
              >
                Shop by Category
              </h2>
              <Link
                to="/products"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '14px',
                  color: '#4c6ef5',
                  textDecoration: 'none',
                  fontWeight: '500',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#3b5bdb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#4c6ef5';
                }}
              >
                View all
                <img src={chevronRightIcon} alt="" aria-hidden="true" style={{ width: '14px', height: '14px' }} />
              </Link>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '16px',
              }}
              role="list"
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  role="listitem"
                  onClick={() => handleCategoryClick(cat.id)}
                  aria-label={`Browse ${cat.label}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '20px 16px',
                    background: '#ffffff',
                    border: '1px solid #e9ecef',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    minHeight: '44px',
                    transition: 'all 0.2s ease',
                    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#4c6ef5';
                    e.currentTarget.style.background = '#e8ecfd';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e9ecef';
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span style={{ fontSize: '32px', lineHeight: 1 }} aria-hidden="true">
                    {cat.emoji}
                  </span>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#343a40',
                      textAlign: 'center',
                      lineHeight: '18px',
                    }}
                  >
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Featured Products */}
          <section aria-labelledby="featured-heading" style={{ marginBottom: '48px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
              }}
            >
              <h2
                id="featured-heading"
                style={{
                  margin: 0,
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#212529',
                  letterSpacing: '-0.01em',
                  lineHeight: '32px',
                }}
              >
                Featured Products
              </h2>
              <Link
                to="/products"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '14px',
                  color: '#4c6ef5',
                  textDecoration: 'none',
                  fontWeight: '500',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#3b5bdb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#4c6ef5';
                }}
              >
                View all
                <img src={chevronRightIcon} alt="" aria-hidden="true" style={{ width: '14px', height: '14px' }} />
              </Link>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '20px',
              }}
            >
              {FEATURED_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          {/* Promo Strip */}
          <section
            aria-label="Promotional offer"
            style={{
              background: '#fff3e6',
              borderRadius: '16px',
              padding: '32px 40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
              flexWrap: 'wrap',
              marginBottom: '48px',
            }}
          >
            <div style={{ flex: 1, minWidth: '240px' }}>
              <p
                style={{
                  margin: '0 0 4px',
                  fontSize: '12px',
                  fontWeight: '600',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#fd7e14',
                  fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                }}
              >
                Limited Time Offer
              </p>
              <h3
                style={{
                  margin: '0 0 8px',
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#212529',
                  lineHeight: '28px',
                  fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                }}
              >
                Use code <code
                  style={{
                    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#fd7e14',
                    background: 'rgba(253,126,20,0.12)',
                    padding: '2px 8px',
                    borderRadius: '3px',
                  }}
                >
                  SAVE20
                </code> for extra 20% off
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  color: '#495057',
                  fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                }}
              >
                Valid on orders above ₹999. New users only.
              </p>
            </div>
            <button
              onClick={() => navigate('/products')}
              style={{
                background: '#fd7e14',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                padding: '12px 28px',
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                cursor: 'pointer',
                minHeight: '44px',
                whiteSpace: 'nowrap',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e8590c';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fd7e14';
              }}
            >
              Shop Now
            </button>
          </section>

          {/* Why ShopMini */}
          <section aria-labelledby="why-heading" style={{ marginBottom: '48px' }}>
            <h2
              id="why-heading"
              style={{
                margin: '0 0 24px',
                fontSize: '24px',
                fontWeight: '700',
                color: '#212529',
                letterSpacing: '-0.01em',
                lineHeight: '32px',
                textAlign: 'center',
              }}
            >
              Why ShopMini?
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
              }}
            >
              {[
                { icon: '🚚', title: 'Free Delivery', desc: 'On orders above ₹499' },
                { icon: '🔄', title: 'Easy Returns', desc: '15-day hassle-free returns' },
                { icon: '🔒', title: 'Secure Payments', desc: 'SSL encrypted & safe' },
                { icon: '🎧', title: '24/7 Support', desc: 'Always here to help you' },
              ].map((feature) => (
                <div
                  key={feature.title}
                  style={{
                    background: '#ffffff',
                    borderRadius: '10px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    textAlign: 'center',
                    border: '1px solid #e9ecef',
                  }}
                >
                  <span style={{ fontSize: '36px', lineHeight: 1 }} aria-hidden="true">
                    {feature.icon}
                  </span>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#212529',
                      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '14px',
                      color: '#495057',
                      lineHeight: '20px',
                      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                    }}
                  >
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          background: '#212529',
          color: '#adb5bd',
          padding: '48px 24px 32px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '32px',
          }}
        >
          <div>
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                marginBottom: '12px',
              }}
              aria-label="ShopMini Home"
            >
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#4c6ef5',
                  letterSpacing: '-0.01em',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                ShopMini
              </span>
            </Link>
            <p
              style={{
                margin: 0,
                fontSize: '14px',
                lineHeight: '20px',
                fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              }}
            >
              Your one-stop shop for electronics, fashion & home essentials.
            </p>
          </div>
          <div>
            <h4
              style={{
                margin: '0 0 12px',
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#ffffff',
                fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              }}
            >
              Quick Links
            </h4>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'Home', to: '/' },
                { label: 'All Products', to: '/products' },
                { label: 'My Orders', to: '/orders' },
                { label: 'My Account', to: '/account' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    style={{
                      color: '#adb5bd',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#4c6ef5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#adb5bd';
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4
              style={{
                margin: '0 0 12px',
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#ffffff',
                fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              }}
            >
              Categories
            </h4>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategoryClick(cat.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: '#adb5bd',
                      fontSize: '14px',
                      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#4c6ef5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#adb5bd';
                    }}
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4
              style={{
                margin: '0 0 12px',
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#ffffff',
                fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              }}
            >
              Support
            </h4>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'Contact Us', to: '/contact' },
                { label: 'Return Policy', to: '/returns' },
                { label: 'Shipping Info', to: '/shipping' },
                { label: 'Privacy Policy', to: '/privacy' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    style={{
                      color: '#adb5bd',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#4c6ef5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#adb5bd';
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div
          style={{
            maxWidth: '1200px',
            margin: '32px auto 0',
            paddingTop: '24px',
            borderTop: '1px solid #343a40',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '12px',
              color: '#868e96',
              fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            }}
          >
            © ShopMini. All rights reserved.
          </p>
          <p
            style={{
              margin: 0,
              fontSize: '12px',
              color: '#868e96',
              fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            }}
          >
            Made with ♥ in India
          </p>
        </div>
      </footer>
    </div>
  );
}
