import React from 'react';
import { Link } from 'react-router-dom';
import starIcon from '@/assets/icons/star.svg';
import placeholderProduct from '@/assets/images/placeholder-product.svg';

const ProductCard = ({ product }) => {
  if (!product) return null;

  const {
    id,
    name,
    slug,
    price,
    taxInclusivePrice,
    rating,
    reviewCount,
    images,
    brand,
  } = product;

  const displayPrice =
    taxInclusivePrice !== undefined && taxInclusivePrice !== null
      ? taxInclusivePrice
      : price;

  const primaryImage =
    images && images.length > 0 ? images[0].url : placeholderProduct;

  const productPath = slug ? `/products/${slug}` : `/products/${id}`;

  const formattedPrice =
    displayPrice !== undefined && displayPrice !== null
      ? new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(displayPrice)
      : null;

  const formattedRating =
    rating !== undefined && rating !== null
      ? Number(rating).toFixed(1)
      : null;

  return (
    <Link
      to={productPath}
      className="product-card"
      aria-label={name}
      style={{
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        color: 'inherit',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #e5e7eb',
        background: '#ffffff',
        transition: 'box-shadow 0.2s ease',
      }}
    >
      <div
        className="product-card__image-wrapper"
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '100%',
          background: '#f9fafb',
          overflow: 'hidden',
        }}
      >
        <img
          src={primaryImage}
          alt={name || 'Product image'}
          className="product-card__image"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onError={(e) => {
            e.currentTarget.src = placeholderProduct;
          }}
        />
        {formattedRating && (
          <div
            className="product-card__rating-badge"
            aria-label={`Rating: ${formattedRating}`}
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              background: '#16a34a',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 600,
              lineHeight: 1,
              padding: '3px 7px',
              borderRadius: '4px',
            }}
          >
            <span>{formattedRating}</span>
            <img
              src={starIcon}
              alt="star"
              width={11}
              height={11}
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            {reviewCount !== undefined && reviewCount !== null && (
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 400,
                  marginLeft: '2px',
                  opacity: 0.9,
                }}
              >
                ({reviewCount})
              </span>
            )}
          </div>
        )}
      </div>

      <div
        className="product-card__body"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          padding: '10px 12px 12px',
          flex: 1,
        }}
      >
        {brand && brand.name && (
          <span
            className="product-card__brand"
            style={{
              fontSize: '11px',
              color: '#6b7280',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              lineHeight: 1.2,
            }}
          >
            {brand.name}
          </span>
        )}

        <h3
          className="product-card__name"
          style={{
            margin: 0,
            fontSize: '14px',
            fontWeight: 500,
            color: '#111827',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {name}
        </h3>

        <div
          className="product-card__footer"
          style={{
            marginTop: 'auto',
            paddingTop: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {formattedPrice && (
            <div
              className="product-card__price"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1px',
              }}
            >
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#111827',
                  lineHeight: 1.2,
                }}
              >
                {formattedPrice}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  color: '#6b7280',
                  lineHeight: 1,
                }}
              >
                incl. all taxes
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
