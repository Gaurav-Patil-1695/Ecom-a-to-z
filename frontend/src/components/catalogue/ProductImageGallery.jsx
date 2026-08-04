import React, { useState, useCallback, useEffect, useRef } from 'react';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import chevronLeftIcon from '@/assets/icons/chevron-left.svg';
import chevronRightIcon from '@/assets/icons/chevron-right.svg';

/**
 * ProductImageGallery
 *
 * Main product image display for PDP.
 *
 * Props:
 *   images : Array<{ url: string, alt?: string }>
 *   productName : string — used for fallback alt text
 */
const ProductImageGallery = ({ images = [], productName = 'Product image' }) => {
  const normalisedImages =
    images && images.length > 0
      ? images
      : [{ url: placeholderProduct, alt: productName }];

  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const mainImageRef = useRef(null);
  const thumbnailListRef = useRef(null);

  const total = normalisedImages.length;

  const goTo = useCallback(
    (index) => {
      const clamped = Math.max(0, Math.min(index, total - 1));
      setActiveIndex(clamped);
      setZoomed(false);
    },
    [total]
  );

  const goPrev = useCallback(() => {
    goTo(activeIndex === 0 ? total - 1 : activeIndex - 1);
  }, [activeIndex, goTo, total]);

  const goNext = useCallback(() => {
    goTo(activeIndex === total - 1 ? 0 : activeIndex + 1);
  }, [activeIndex, goTo, total]);

  /* Scroll active thumbnail into view */
  useEffect(() => {
    if (!thumbnailListRef.current) return;
    const activeThumbnail = thumbnailListRef.current.children[activeIndex];
    if (activeThumbnail) {
      activeThumbnail.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [activeIndex]);

  /* Keyboard navigation */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'Escape') {
        setZoomed(false);
      }
    },
    [goPrev, goNext]
  );

  /* Zoom handlers */
  const handleMouseMove = useCallback((e) => {
    if (!mainImageRef.current) return;
    const rect = mainImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setZoomed(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setZoomed(false);
  }, []);

  const activeImage = normalisedImages[activeIndex];
  const activeUrl = activeImage ? activeImage.url : placeholderProduct;
  const activeAlt = activeImage ? activeImage.alt || productName : productName;

  return (
    <div
      className="product-image-gallery"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%',
        userSelect: 'none',
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Product image gallery"
      role="region"
    >
      {/* ---- Main image ------------------------------------------- */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '100%',
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid #e5e7eb',
          background: '#f9fafb',
          cursor: zoomed ? 'zoom-out' : 'zoom-in',
        }}
        ref={mainImageRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onClick={() => setZoomed((z) => !z)}
        aria-live="polite"
      >
        <img
          src={activeUrl}
          alt={activeAlt}
          draggable={false}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            transition: zoomed ? 'none' : 'transform 0.2s ease',
            transform: zoomed
              ? `scale(2) translate(${50 - zoomPos.x}%, ${50 - zoomPos.y}%)`
              : 'scale(1)',
            transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
            willChange: 'transform',
            pointerEvents: 'none',
          }}
          onError={(e) => {
            e.currentTarget.src = placeholderProduct;
          }}
        />

        {/* Image counter badge */}
        {total > 1 && (
          <div
            aria-label={`Image ${activeIndex + 1} of ${total}`}
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              background: 'rgba(0, 0, 0, 0.45)',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 500,
              padding: '3px 8px',
              borderRadius: '999px',
              lineHeight: 1.4,
              pointerEvents: 'none',
              zIndex: 2,
            }}
          >
            {activeIndex + 1} / {total}
          </div>
        )}

        {/* Prev / Next arrows */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              aria-label="Previous image"
              style={{
                position: 'absolute',
                top: '50%',
                left: '8px',
                transform: 'translateY(-50%)',
                zIndex: 3,
                background: 'rgba(255, 255, 255, 0.85)',
                border: '1px solid #e5e7eb',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 0,
                boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
                transition: 'background 0.15s ease',
              }}
            >
              <img
                src={chevronLeftIcon}
                alt=""
                aria-hidden="true"
                width={16}
                height={16}
                style={{ display: 'block' }}
              />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              aria-label="Next image"
              style={{
                position: 'absolute',
                top: '50%',
                right: '8px',
                transform: 'translateY(-50%)',
                zIndex: 3,
                background: 'rgba(255, 255, 255, 0.85)',
                border: '1px solid #e5e7eb',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 0,
                boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
                transition: 'background 0.15s ease',
              }}
            >
              <img
                src={chevronRightIcon}
                alt=""
                aria-hidden="true"
                width={16}
                height={16}
                style={{ display: 'block' }}
              />
            </button>
          </>
        )}
      </div>

      {/* ---- Thumbnail strip -------------------------------------- */}
      {total > 1 && (
        <div
          ref={thumbnailListRef}
          role="list"
          aria-label="Image thumbnails"
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px',
            scrollbarWidth: 'thin',
            scrollbarColor: '#d1d5db transparent',
          }}
        >
          {normalisedImages.map((image, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={index}
                role="listitem"
                style={{ flexShrink: 0 }}
              >
                <button
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`View image ${index + 1}${
                    image.alt ? `: ${image.alt}` : ''
                  }`}
                  aria-current={isActive ? 'true' : undefined}
                  style={{
                    width: '64px',
                    height: '64px',
                    padding: 0,
                    border: isActive
                      ? '2px solid #16a34a'
                      : '1.5px solid #e5e7eb',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    background: '#f9fafb',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                    boxShadow: isActive
                      ? '0 0 0 2px #bbf7d0'
                      : 'none',
                    outline: 'none',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={image.url || placeholderProduct}
                    alt={image.alt || `${productName} thumbnail ${index + 1}`}
                    draggable={false}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                    onError={(e) => {
                      e.currentTarget.src = placeholderProduct;
                    }}
                  />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ---- Dot indicators (mobile-friendly fallback) ------------ */}
      {total > 1 && total <= 8 && (
        <div
          role="tablist"
          aria-label="Image navigation dots"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '6px',
            marginTop: '2px',
          }}
        >
          {normalisedImages.map((_, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to image ${index + 1}`}
                onClick={() => goTo(index)}
                style={{
                  width: isActive ? '20px' : '8px',
                  height: '8px',
                  borderRadius: '999px',
                  border: 'none',
                  background: isActive ? '#16a34a' : '#d1d5db',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'width 0.2s ease, background 0.2s ease',
                  flexShrink: 0,
                  outline: 'none',
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
