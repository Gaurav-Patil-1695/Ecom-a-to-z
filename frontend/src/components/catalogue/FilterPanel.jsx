import React, { useState, useCallback } from 'react';
import starIcon from '@/assets/icons/star.svg';
import chevronDownIcon from '@/assets/icons/chevron-down.svg';

const RATING_OPTIONS = [
  { value: 4, label: '4 & above' },
  { value: 3, label: '3 & above' },
  { value: 2, label: '2 & above' },
  { value: 1, label: '1 & above' },
];

const sectionHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  background: 'none',
  border: 'none',
  padding: '12px 0',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 600,
  color: '#111827',
  lineHeight: 1.4,
};

const dividerStyle = {
  borderTop: '1px solid #e5e7eb',
  margin: 0,
};

const resultCountBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#f3f4f6',
  color: '#6b7280',
  fontSize: '11px',
  fontWeight: 500,
  borderRadius: '10px',
  padding: '1px 7px',
  minWidth: '28px',
  lineHeight: '18px',
};

const checkboxRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  padding: '5px 0',
  cursor: 'pointer',
  userSelect: 'none',
};

const checkboxInputStyle = {
  width: '16px',
  height: '16px',
  accentColor: '#16a34a',
  cursor: 'pointer',
  flexShrink: 0,
};

const labelTextStyle = {
  flex: 1,
  fontSize: '13px',
  color: '#374151',
  lineHeight: 1.4,
};

const chevronStyle = (open) => ({
  width: '16px',
  height: '16px',
  transition: 'transform 0.2s ease',
  transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
  flexShrink: 0,
});

const FilterSection = ({ title, open, onToggle, children }) => (
  <div>
    <button
      type="button"
      style={sectionHeaderStyle}
      onClick={onToggle}
      aria-expanded={open}
    >
      <span>{title}</span>
      <img
        src={chevronDownIcon}
        alt=""
        aria-hidden="true"
        style={chevronStyle(open)}
      />
    </button>
    {open && (
      <div style={{ paddingBottom: '12px' }}>
        {children}
      </div>
    )}
    <hr style={dividerStyle} />
  </div>
);

const BrandFilter = ({ brands, selectedBrands, onChange }) => {
  const handleToggle = useCallback(
    (brandId) => {
      const next = selectedBrands.includes(brandId)
        ? selectedBrands.filter((b) => b !== brandId)
        : [...selectedBrands, brandId];
      onChange(next);
    },
    [selectedBrands, onChange]
  );

  if (!brands || brands.length === 0) {
    return (
      <p style={{ fontSize: '13px', color: '#9ca3af', margin: '4px 0' }}>
        No brands available
      </p>
    );
  }

  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {brands.map((brand) => {
        const checked = selectedBrands.includes(brand.id);
        const inputId = `brand-filter-${brand.id}`;
        return (
          <li key={brand.id}>
            <label htmlFor={inputId} style={checkboxRowStyle}>
              <input
                id={inputId}
                type="checkbox"
                style={checkboxInputStyle}
                checked={checked}
                onChange={() => handleToggle(brand.id)}
                aria-label={brand.name}
              />
              <span style={labelTextStyle}>{brand.name}</span>
              {brand.resultCount !== undefined && brand.resultCount !== null && (
                <span style={resultCountBadgeStyle}>
                  {brand.resultCount.toLocaleString('en-IN')}
                </span>
              )}
            </label>
          </li>
        );
      })}
    </ul>
  );
};

const PriceRangeFilter = ({ min, max, value, onChange }) => {
  const safeMin = typeof min === 'number' ? min : 0;
  const safeMax = typeof max === 'number' ? max : 100000;
  const currentMin =
    value && typeof value.min === 'number' ? value.min : safeMin;
  const currentMax =
    value && typeof value.max === 'number' ? value.max : safeMax;

  const handleMinChange = (e) => {
    const parsed = Number(e.target.value);
    const clamped = Math.min(parsed, currentMax);
    onChange({ min: clamped, max: currentMax });
  };

  const handleMaxChange = (e) => {
    const parsed = Number(e.target.value);
    const clamped = Math.max(parsed, currentMin);
    onChange({ min: currentMin, max: clamped });
  };

  const formatCurrency = (v) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(v);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <span
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#111827',
            minWidth: '64px',
          }}
        >
          {formatCurrency(currentMin)}
        </span>
        <span style={{ fontSize: '12px', color: '#9ca3af' }}>—</span>
        <span
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#111827',
            minWidth: '64px',
            textAlign: 'right',
          }}
        >
          {formatCurrency(currentMax)}
        </span>
      </div>

      <div style={{ position: 'relative', height: '20px' }}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '4px',
            background: '#e5e7eb',
            borderRadius: '2px',
            transform: 'translateY(-50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: `${((currentMin - safeMin) / (safeMax - safeMin)) * 100}%`,
            right: `${100 - ((currentMax - safeMin) / (safeMax - safeMin)) * 100}%`,
            height: '4px',
            background: '#16a34a',
            borderRadius: '2px',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }}
        />
        <input
          type="range"
          min={safeMin}
          max={safeMax}
          step={100}
          value={currentMin}
          onChange={handleMinChange}
          aria-label="Minimum price"
          style={{
            position: 'absolute',
            width: '100%',
            height: '20px',
            opacity: 0,
            cursor: 'pointer',
            zIndex: 2,
            margin: 0,
            padding: 0,
          }}
        />
        <input
          type="range"
          min={safeMin}
          max={safeMax}
          step={100}
          value={currentMax}
          onChange={handleMaxChange}
          aria-label="Maximum price"
          style={{
            position: 'absolute',
            width: '100%',
            height: '20px',
            opacity: 0,
            cursor: 'pointer',
            zIndex: 3,
            margin: 0,
            padding: 0,
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <div style={{ flex: 1 }}>
          <label
            htmlFor="price-min-input"
            style={{ fontSize: '11px', color: '#6b7280', display: 'block', marginBottom: '3px' }}
          >
            Min (₹)
          </label>
          <input
            id="price-min-input"
            type="number"
            min={safeMin}
            max={currentMax}
            step={100}
            value={currentMin}
            onChange={handleMinChange}
            style={{
              width: '100%',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              padding: '5px 8px',
              fontSize: '13px',
              color: '#111827',
              background: '#ffffff',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label
            htmlFor="price-max-input"
            style={{ fontSize: '11px', color: '#6b7280', display: 'block', marginBottom: '3px' }}
          >
            Max (₹)
          </label>
          <input
            id="price-max-input"
            type="number"
            min={currentMin}
            max={safeMax}
            step={100}
            value={currentMax}
            onChange={handleMaxChange}
            style={{
              width: '100%',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              padding: '5px 8px',
              fontSize: '13px',
              color: '#111827',
              background: '#ffffff',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>
    </div>
  );
};

const RatingFilter = ({ selectedRating, onChange, ratingCounts }) => (
  <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
    {RATING_OPTIONS.map((option) => {
      const inputId = `rating-filter-${option.value}`;
      const checked = selectedRating === option.value;
      const count =
        ratingCounts && ratingCounts[option.value] !== undefined
          ? ratingCounts[option.value]
          : null;
      return (
        <li key={option.value}>
          <label htmlFor={inputId} style={checkboxRowStyle}>
            <input
              id={inputId}
              type="radio"
              name="rating-filter"
              style={checkboxInputStyle}
              checked={checked}
              onChange={() => onChange(checked ? null : option.value)}
              aria-label={`Rating ${option.label}`}
            />
            <span
              style={{
                ...labelTextStyle,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <img
                  key={i}
                  src={starIcon}
                  alt=""
                  aria-hidden="true"
                  width={13}
                  height={13}
                  style={{
                    filter:
                      i < option.value
                        ? 'invert(64%) sepia(79%) saturate(500%) hue-rotate(1deg) brightness(103%) contrast(101%)'
                        : 'invert(85%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(90%)',
                  }}
                />
              ))}
              <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '2px' }}>
                {option.label}
              </span>
            </span>
            {count !== null && (
              <span style={resultCountBadgeStyle}>
                {count.toLocaleString('en-IN')}
              </span>
            )}
          </label>
        </li>
      );
    })}
  </ul>
);

const FilterPanel = ({
  brands = [],
  selectedBrands = [],
  onBrandsChange,
  priceRange,
  selectedPriceRange,
  onPriceRangeChange,
  selectedRating,
  onRatingChange,
  ratingCounts,
  onClearAll,
}) => {
  const [openSections, setOpenSections] = useState({
    brand: true,
    price: true,
    rating: true,
  });

  const toggleSection = useCallback((key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    selectedRating !== null ||
    selectedRating !== undefined ||
    (selectedPriceRange &&
      priceRange &&
      (selectedPriceRange.min !== priceRange.min ||
        selectedPriceRange.max !== priceRange.max));

  return (
    <aside
      aria-label="Product filters"
      style={{
        width: '100%',
        background: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        padding: '0 16px 8px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 0 10px',
          borderBottom: '1px solid #e5e7eb',
          marginBottom: '2px',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: '15px',
            fontWeight: 700,
            color: '#111827',
            lineHeight: 1.3,
          }}
        >
          Filters
        </h2>
        {hasActiveFilters && onClearAll && (
          <button
            type="button"
            onClick={onClearAll}
            style={{
              background: 'none',
              border: 'none',
              padding: '2px 0',
              cursor: 'pointer',
              fontSize: '12px',
              color: '#16a34a',
              fontWeight: 600,
              textDecoration: 'underline',
              lineHeight: 1.4,
            }}
          >
            Clear all
          </button>
        )}
      </div>

      <FilterSection
        title="Brand"
        open={openSections.brand}
        onToggle={() => toggleSection('brand')}
      >
        <BrandFilter
          brands={brands}
          selectedBrands={selectedBrands}
          onChange={onBrandsChange}
        />
      </FilterSection>

      <FilterSection
        title="Price Range"
        open={openSections.price}
        onToggle={() => toggleSection('price')}
      >
        <PriceRangeFilter
          min={priceRange ? priceRange.min : 0}
          max={priceRange ? priceRange.max : 100000}
          value={selectedPriceRange}
          onChange={onPriceRangeChange}
        />
      </FilterSection>

      <FilterSection
        title="Rating"
        open={openSections.rating}
        onToggle={() => toggleSection('rating')}
      >
        <RatingFilter
          selectedRating={selectedRating}
          onChange={onRatingChange}
          ratingCounts={ratingCounts}
        />
      </FilterSection>
    </aside>
  );
};

export default FilterPanel;
