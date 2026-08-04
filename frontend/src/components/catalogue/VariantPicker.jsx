import React, { useState, useEffect, useCallback, useMemo } from 'react';
import checkIcon from '@/assets/icons/check.svg';

/**
 * VariantPicker
 *
 * Resolves a size + colour selection to a matching SKU.
 *
 * Props:
 *   skus          : Array<SKU>  — full list of SKUs for the product
 *   selectedSkuId : string | number | null — currently selected SKU id (controlled)
 *   onSkuChange   : (sku: SKU | null) => void — called whenever the resolved SKU changes
 *
 * Each SKU object shape (minimum required):
 *   {
 *     id          : string | number,
 *     size        : string | null,
 *     colour      : string | null,   // also accepts 'color'
 *     colourHex   : string | null,   // also accepts 'colorHex' — optional CSS colour value
 *     stockQty    : number,
 *     price       : number,
 *     taxInclusivePrice : number | null,
 *   }
 */
const VariantPicker = ({ skus = [], selectedSkuId, onSkuChange }) => {
  /* ------------------------------------------------------------------ *
   * Normalise SKU shape — tolerate British / American spelling          *
   * ------------------------------------------------------------------ */
  const normalisedSkus = useMemo(
    () =>
      skus.map((s) => ({
        ...s,
        colour: s.colour ?? s.color ?? null,
        colourHex: s.colourHex ?? s.colorHex ?? null,
      })),
    [skus]
  );

  /* ------------------------------------------------------------------ *
   * Derive available sizes and colours from the SKU list                *
   * ------------------------------------------------------------------ */
  const sizes = useMemo(() => {
    const seen = new Set();
    const result = [];
    normalisedSkus.forEach((s) => {
      if (s.size && !seen.has(s.size)) {
        seen.add(s.size);
        result.push(s.size);
      }
    });
    return result;
  }, [normalisedSkus]);

  const colours = useMemo(() => {
    const seen = new Set();
    const result = [];
    normalisedSkus.forEach((s) => {
      if (s.colour && !seen.has(s.colour)) {
        seen.add(s.colour);
        result.push({ label: s.colour, hex: s.colourHex || null });
      }
    });
    return result;
  }, [normalisedSkus]);

  const hasSize = sizes.length > 0;
  const hasColour = colours.length > 0;

  /* ------------------------------------------------------------------ *
   * Local selection state                                               *
   * ------------------------------------------------------------------ */
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColour, setSelectedColour] = useState(null);

  /* Initialise from selectedSkuId when it changes externally */
  useEffect(() => {
    if (selectedSkuId == null) {
      setSelectedSize(null);
      setSelectedColour(null);
      return;
    }
    const sku = normalisedSkus.find((s) => String(s.id) === String(selectedSkuId));
    if (sku) {
      setSelectedSize(sku.size ?? null);
      setSelectedColour(sku.colour ?? null);
    }
  }, [selectedSkuId, normalisedSkus]);

  /* ------------------------------------------------------------------ *
   * Resolve selection → SKU                                             *
   * ------------------------------------------------------------------ */
  const resolveSku = useCallback(
    (size, colour) => {
      return (
        normalisedSkus.find((s) => {
          const sizeMatch = !hasSize || s.size === size;
          const colourMatch = !hasColour || s.colour === colour;
          return sizeMatch && colourMatch;
        }) || null
      );
    },
    [normalisedSkus, hasSize, hasColour]
  );

  /* Notify parent whenever resolved SKU changes */
  useEffect(() => {
    if (!hasSize && !hasColour) {
      onSkuChange && onSkuChange(normalisedSkus[0] || null);
      return;
    }
    const sku = resolveSku(selectedSize, selectedColour);
    onSkuChange && onSkuChange(sku);
  }, [selectedSize, selectedColour, resolveSku, hasSize, hasColour, normalisedSkus, onSkuChange]);

  /* ------------------------------------------------------------------ *
   * Helpers: is a given option "compatible" with current partial state  *
   * ------------------------------------------------------------------ */
  const isSizeAvailable = useCallback(
    (size) => {
      return normalisedSkus.some((s) => {
        const sizeMatch = s.size === size;
        const colourMatch = !hasColour || !selectedColour || s.colour === selectedColour;
        return sizeMatch && colourMatch;
      });
    },
    [normalisedSkus, hasColour, selectedColour]
  );

  const isColourAvailable = useCallback(
    (colour) => {
      return normalisedSkus.some((s) => {
        const colourMatch = s.colour === colour;
        const sizeMatch = !hasSize || !selectedSize || s.size === selectedSize;
        return colourMatch && sizeMatch;
      });
    },
    [normalisedSkus, hasSize, selectedSize]
  );

  /* ------------------------------------------------------------------ *
   * Handlers                                                            *
   * ------------------------------------------------------------------ */
  const handleSizeClick = useCallback(
    (size) => {
      const next = selectedSize === size ? null : size;
      setSelectedSize(next);
    },
    [selectedSize]
  );

  const handleColourClick = useCallback(
    (colour) => {
      const next = selectedColour === colour ? null : colour;
      setSelectedColour(next);
    },
    [selectedColour]
  );

  /* ------------------------------------------------------------------ *
   * Resolved SKU for stock display                                      *
   * ------------------------------------------------------------------ */
  const resolvedSku = useMemo(
    () => resolveSku(selectedSize, selectedColour),
    [resolveSku, selectedSize, selectedColour]
  );

  const stockLabel = useMemo(() => {
    if (!resolvedSku) return null;
    if (resolvedSku.stockQty === 0) return { text: 'Out of stock', colour: '#dc2626' };
    if (resolvedSku.stockQty <= 5)
      return { text: `Only ${resolvedSku.stockQty} left`, colour: '#d97706' };
    return { text: 'In stock', colour: '#16a34a' };
  }, [resolvedSku]);

  if (!hasSize && !hasColour) return null;

  /* ------------------------------------------------------------------ *
   * Render                                                              *
   * ------------------------------------------------------------------ */
  return (
    <div
      className="variant-picker"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
      }}
    >
      {/* ---- Size Selector ---------------------------------------- */}
      {hasSize && (
        <div className="variant-picker__section">
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '6px',
              marginBottom: '8px',
            }}
          >
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#374151',
                lineHeight: 1.4,
              }}
            >
              Size
            </span>
            {selectedSize && (
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 400,
                  color: '#111827',
                  lineHeight: 1.4,
                }}
              >
                : {selectedSize}
              </span>
            )}
          </div>

          <div
            role="listbox"
            aria-label="Select size"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            {sizes.map((size) => {
              const isSelected = selectedSize === size;
              const available = isSizeAvailable(size);
              return (
                <button
                  key={size}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  aria-label={`Size ${size}${!available ? ', unavailable' : ''}`}
                  disabled={!available}
                  onClick={() => handleSizeClick(size)}
                  style={{
                    minWidth: '42px',
                    height: '42px',
                    padding: '0 10px',
                    border: isSelected
                      ? '2px solid #16a34a'
                      : '1.5px solid #d1d5db',
                    borderRadius: '6px',
                    background: isSelected ? '#f0fdf4' : '#ffffff',
                    color: !available
                      ? '#d1d5db'
                      : isSelected
                      ? '#15803d'
                      : '#374151',
                    fontSize: '13px',
                    fontWeight: isSelected ? 600 : 400,
                    cursor: available ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    transition: 'border-color 0.15s ease, background 0.15s ease',
                    textDecoration: !available ? 'line-through' : 'none',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                >
                  {size}
                  {isSelected && (
                    <img
                      src={checkIcon}
                      alt=""
                      aria-hidden="true"
                      width={10}
                      height={10}
                      style={{
                        position: 'absolute',
                        top: '3px',
                        right: '3px',
                        filter:
                          'invert(40%) sepia(90%) saturate(400%) hue-rotate(100deg) brightness(90%)',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ---- Colour Selector --------------------------------------- */}
      {hasColour && (
        <div className="variant-picker__section">
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '6px',
              marginBottom: '8px',
            }}
          >
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#374151',
                lineHeight: 1.4,
              }}
            >
              Colour
            </span>
            {selectedColour && (
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 400,
                  color: '#111827',
                  lineHeight: 1.4,
                }}
              >
                : {selectedColour}
              </span>
            )}
          </div>

          <div
            role="listbox"
            aria-label="Select colour"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            {colours.map(({ label, hex }) => {
              const isSelected = selectedColour === label;
              const available = isColourAvailable(label);
              const hasHex = Boolean(hex);

              return hasHex ? (
                /* Colour swatch button */
                <button
                  key={label}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  aria-label={`Colour ${label}${!available ? ', unavailable' : ''}`}
                  disabled={!available}
                  onClick={() => handleColourClick(label)}
                  title={label}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: hex,
                    border: isSelected
                      ? '3px solid #16a34a'
                      : '2px solid #d1d5db',
                    outline: isSelected ? '2px solid #f0fdf4' : 'none',
                    outlineOffset: '1px',
                    cursor: available ? 'pointer' : 'not-allowed',
                    position: 'relative',
                    opacity: available ? 1 : 0.35,
                    transition:
                      'border-color 0.15s ease, outline 0.15s ease, opacity 0.15s ease',
                    padding: 0,
                    flexShrink: 0,
                  }}
                >
                  {isSelected && (
                    <img
                      src={checkIcon}
                      alt=""
                      aria-hidden="true"
                      width={14}
                      height={14}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        filter: 'brightness(0) invert(1) drop-shadow(0 0 1px rgba(0,0,0,0.5))',
                      }}
                    />
                  )}
                </button>
              ) : (
                /* Text label button */
                <button
                  key={label}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  aria-label={`Colour ${label}${!available ? ', unavailable' : ''}`}
                  disabled={!available}
                  onClick={() => handleColourClick(label)}
                  style={{
                    minWidth: '52px',
                    height: '36px',
                    padding: '0 12px',
                    border: isSelected
                      ? '2px solid #16a34a'
                      : '1.5px solid #d1d5db',
                    borderRadius: '6px',
                    background: isSelected ? '#f0fdf4' : '#ffffff',
                    color: !available
                      ? '#d1d5db'
                      : isSelected
                      ? '#15803d'
                      : '#374151',
                    fontSize: '13px',
                    fontWeight: isSelected ? 600 : 400,
                    cursor: available ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    transition: 'border-color 0.15s ease, background 0.15s ease',
                    textDecoration: !available ? 'line-through' : 'none',
                    outline: 'none',
                    boxSizing: 'border-box',
                    position: 'relative',
                  }}
                >
                  {label}
                  {isSelected && (
                    <img
                      src={checkIcon}
                      alt=""
                      aria-hidden="true"
                      width={10}
                      height={10}
                      style={{
                        position: 'absolute',
                        top: '3px',
                        right: '3px',
                        filter:
                          'invert(40%) sepia(90%) saturate(400%) hue-rotate(100deg) brightness(90%)',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ---- Stock status ----------------------------------------- */}
      {stockLabel && (
        <div
          className="variant-picker__stock"
          aria-live="polite"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: stockLabel.colour,
              flexShrink: 0,
              display: 'inline-block',
            }}
          />
          <span
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: stockLabel.colour,
              lineHeight: 1.4,
            }}
          >
            {stockLabel.text}
          </span>
        </div>
      )}

      {/* ---- No matching SKU warning ----------------------------- */}
      {!resolvedSku && (selectedSize || selectedColour) && (
        <p
          role="alert"
          style={{
            margin: 0,
            fontSize: '12px',
            color: '#dc2626',
            lineHeight: 1.4,
          }}
        >
          This combination is not available. Please adjust your selection.
        </p>
      )}
    </div>
  );
};

export default VariantPicker;
