import React from 'react';
import closeIcon from '@/assets/icons/close.svg';

const chipStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
  background: '#f0fdf4',
  border: '1px solid #bbf7d0',
  borderRadius: '999px',
  padding: '3px 10px 3px 12px',
  fontSize: '12px',
  fontWeight: 500,
  color: '#15803d',
  lineHeight: 1.4,
  whiteSpace: 'nowrap',
  maxWidth: '220px',
};

const chipLabelStyle = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const removeButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'none',
  border: 'none',
  padding: '1px',
  margin: 0,
  cursor: 'pointer',
  borderRadius: '50%',
  flexShrink: 0,
  lineHeight: 1,
  color: '#15803d',
  transition: 'background 0.15s ease',
};

const clearAllButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  background: 'none',
  border: 'none',
  padding: '3px 0',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: 600,
  color: '#6b7280',
  textDecoration: 'underline',
  lineHeight: 1.4,
  whiteSpace: 'nowrap',
  flexShrink: 0,
};

const Chip = ({ label, onRemove, ariaLabel }) => (
  <div style={chipStyle} role="listitem">
    <span style={chipLabelStyle} title={label}>
      {label}
    </span>
    <button
      type="button"
      onClick={onRemove}
      style={removeButtonStyle}
      aria-label={ariaLabel || `Remove filter: ${label}`}
    >
      <img
        src={closeIcon}
        alt=""
        aria-hidden="true"
        width={12}
        height={12}
        style={{ display: 'block', filter: 'invert(35%) sepia(80%) saturate(400%) hue-rotate(100deg) brightness(90%)' }}
      />
    </button>
  </div>
);

const formatCurrency = (v) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(v);

/**
 * ActiveFilterBar
 *
 * Props:
 *   selectedBrands       : Array<{ id: string|number, name: string }>
 *   onRemoveBrand        : (brandId) => void
 *   selectedPriceRange   : { min: number, max: number } | null
 *   defaultPriceRange    : { min: number, max: number } | null
 *   onRemovePriceRange   : () => void
 *   selectedRating       : number | null
 *   onRemoveRating       : () => void
 *   onClearAll           : () => void
 */
const ActiveFilterBar = ({
  selectedBrands = [],
  onRemoveBrand,
  selectedPriceRange,
  defaultPriceRange,
  onRemovePriceRange,
  selectedRating,
  onRemoveRating,
  onClearAll,
}) => {
  const hasPriceFilter =
    selectedPriceRange &&
    defaultPriceRange &&
    (selectedPriceRange.min !== defaultPriceRange.min ||
      selectedPriceRange.max !== defaultPriceRange.max);

  const hasRatingFilter =
    selectedRating !== null && selectedRating !== undefined;

  const hasBrandFilters = selectedBrands && selectedBrands.length > 0;

  const hasAnyFilter = hasBrandFilters || hasPriceFilter || hasRatingFilter;

  if (!hasAnyFilter) return null;

  return (
    <div
      aria-label="Active filters"
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
        width: '100%',
      }}
    >
      <span
        style={{
          fontSize: '12px',
          fontWeight: 600,
          color: '#6b7280',
          flexShrink: 0,
          lineHeight: 1.4,
        }}
      >
        Filters:
      </span>

      <div
        role="list"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          alignItems: 'center',
          flex: 1,
          minWidth: 0,
        }}
      >
        {hasBrandFilters &&
          selectedBrands.map((brand) => (
            <Chip
              key={brand.id}
              label={brand.name}
              ariaLabel={`Remove brand filter: ${brand.name}`}
              onRemove={() => onRemoveBrand && onRemoveBrand(brand.id)}
            />
          ))}

        {hasPriceFilter && (
          <Chip
            label={`${formatCurrency(selectedPriceRange.min)} – ${formatCurrency(selectedPriceRange.max)}`}
            ariaLabel="Remove price range filter"
            onRemove={() => onRemovePriceRange && onRemovePriceRange()}
          />
        )}

        {hasRatingFilter && (
          <Chip
            label={`${selectedRating}★ & above`}
            ariaLabel="Remove rating filter"
            onRemove={() => onRemoveRating && onRemoveRating()}
          />
        )}
      </div>

      {onClearAll && (
        <button
          type="button"
          style={clearAllButtonStyle}
          onClick={onClearAll}
          aria-label="Clear all filters"
        >
          Clear all
        </button>
      )}
    </div>
  );
};

export default ActiveFilterBar;
