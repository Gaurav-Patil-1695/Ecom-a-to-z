import React from 'react';
import ProductCard from '@/components/catalogue/ProductCard';

const SkeletonCard = () => (
  <div
    className="product-card-skeleton"
    aria-hidden="true"
    style={{
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1px solid #e5e7eb',
      background: '#ffffff',
    }}
  >
    <div
      style={{
        width: '100%',
        paddingTop: '100%',
        background: '#f3f4f6',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
          backgroundSize: '200% 100%',
          animation: 'skeleton-shimmer 1.5s infinite',
        }}
      />
    </div>
    <div
      style={{
        padding: '10px 12px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <div
        style={{
          height: '10px',
          width: '40%',
          borderRadius: '4px',
          background: '#f3f4f6',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
            backgroundSize: '200% 100%',
            animation: 'skeleton-shimmer 1.5s infinite',
          }}
        />
      </div>
      <div
        style={{
          height: '14px',
          width: '85%',
          borderRadius: '4px',
          background: '#f3f4f6',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
            backgroundSize: '200% 100%',
            animation: 'skeleton-shimmer 1.5s infinite',
          }}
        />
      </div>
      <div
        style={{
          height: '14px',
          width: '60%',
          borderRadius: '4px',
          background: '#f3f4f6',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
            backgroundSize: '200% 100%',
            animation: 'skeleton-shimmer 1.5s infinite',
          }}
        />
      </div>
      <div
        style={{
          marginTop: '4px',
          height: '18px',
          width: '45%',
          borderRadius: '4px',
          background: '#f3f4f6',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
            backgroundSize: '200% 100%',
            animation: 'skeleton-shimmer 1.5s infinite',
          }}
        />
      </div>
    </div>
  </div>
);

const SKELETON_COUNT = 12;

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '12px',
  width: '100%',
};

const gridBreakpointStyle = `
  @keyframes skeleton-shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    width: 100%;
  }

  @media (min-width: 640px) {
    .product-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
  }

  @media (min-width: 1024px) {
    .product-grid {
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }
  }

  @media (min-width: 1280px) {
    .product-grid {
      grid-template-columns: repeat(5, 1fr);
    }
  }

  .product-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.10);
  }
`;

let styleInjected = false;
const injectGridStyles = () => {
  if (styleInjected || typeof document === 'undefined') return;
  const tag = document.createElement('style');
  tag.setAttribute('data-product-grid', '1');
  tag.textContent = gridBreakpointStyle;
  document.head.appendChild(tag);
  styleInjected = true;
};

const ProductGrid = ({ products, loading, skeletonCount }) => {
  injectGridStyles();

  const count =
    typeof skeletonCount === 'number' && skeletonCount > 0
      ? skeletonCount
      : SKELETON_COUNT;

  if (loading) {
    return (
      <div className="product-grid" role="status" aria-label="Loading products">
        {Array.from({ length: count }).map((_, idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div
        className="product-grid-empty"
        style={{
          width: '100%',
          padding: '48px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          color: '#6b7280',
          fontSize: '15px',
          textAlign: 'center',
        }}
      >
        <span>No products found.</span>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
