import React from 'react';

/**
 * PriceDisplay
 *
 * Renders a tax-inclusive price with an optional original price strikethrough.
 *
 * Props:
 *   taxInclusivePrice : number          — the final price to display (required)
 *   originalPrice     : number | null   — original / MRP price; shown with strikethrough when provided and higher than taxInclusivePrice
 *   currency          : string          — ISO 4217 currency code, defaults to 'INR'
 *   locale            : string          — Intl locale, defaults to 'en-IN'
 *   size              : 'sm' | 'md' | 'lg' — controls font sizing, defaults to 'md'
 *   showTaxLabel      : boolean         — whether to show "incl. all taxes" label, defaults to true
 */
const PriceDisplay = ({
  taxInclusivePrice,
  originalPrice,
  currency = 'INR',
  locale = 'en-IN',
  size = 'md',
  showTaxLabel = true,
}) => {
  const formatCurrency = (value) =>
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const hasValidPrice =
    taxInclusivePrice !== undefined && taxInclusivePrice !== null && !isNaN(Number(taxInclusivePrice));

  const hasOriginalPrice =
    originalPrice !== undefined &&
    originalPrice !== null &&
    !isNaN(Number(originalPrice)) &&
    Number(originalPrice) > Number(taxInclusivePrice);

  if (!hasValidPrice) return null;

  const discountPercent = hasOriginalPrice
    ? Math.round(((Number(originalPrice) - Number(taxInclusivePrice)) / Number(originalPrice)) * 100)
    : null;

  const fontSizes = {
    sm: { main: '14px', original: '12px', tax: '10px', badge: '11px' },
    md: { main: '18px', original: '14px', tax: '11px', badge: '12px' },
    lg: { main: '24px', original: '16px', tax: '12px', badge: '13px' },
  };

  const fs = fontSizes[size] || fontSizes.md;

  return (
    <div
      className="price-display"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
      }}
    >
      {/* ---- Main price row ---------------------------------------- */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <span
          className="price-display__main"
          style={{
            fontSize: fs.main,
            fontWeight: 700,
            color: '#111827',
            lineHeight: 1.2,
          }}
          aria-label={`Price: ${formatCurrency(taxInclusivePrice)}`}
        >
          {formatCurrency(taxInclusivePrice)}
        </span>

        {hasOriginalPrice && (
          <span
            className="price-display__original"
            style={{
              fontSize: fs.original,
              fontWeight: 400,
              color: '#9ca3af',
              lineHeight: 1.2,
              textDecoration: 'line-through',
            }}
            aria-label={`Original price: ${formatCurrency(originalPrice)}`}
          >
            {formatCurrency(originalPrice)}
          </span>
        )}

        {discountPercent !== null && discountPercent > 0 && (
          <span
            className="price-display__discount-badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: '#fef9c3',
              color: '#92400e',
              fontSize: fs.badge,
              fontWeight: 600,
              padding: '1px 6px',
              borderRadius: '4px',
              lineHeight: 1.5,
              whiteSpace: 'nowrap',
            }}
            aria-label={`${discountPercent}% off`}
          >
            {discountPercent}% off
          </span>
        )}
      </div>

      {/* ---- Tax label -------------------------------------------- */}
      {showTaxLabel && (
        <span
          className="price-display__tax-label"
          style={{
            fontSize: fs.tax,
            color: '#6b7280',
            lineHeight: 1.3,
            fontWeight: 400,
          }}
        >
          incl. all taxes
        </span>
      )}
    </div>
  );
};

export default PriceDisplay;
