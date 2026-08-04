/**
 * Tax utility functions for GST calculations.
 *
 * GST in India is typically included in the displayed price (inclusive).
 * The standard GST rate used here is 18% unless overridden.
 */

const DEFAULT_GST_RATE = 0.18;

/**
 * Derives the GST-inclusive display price from a base (exclusive) price.
 *
 * @param {number} basePrice - The price before GST (exclusive).
 * @param {number} [gstRate=DEFAULT_GST_RATE] - The GST rate as a decimal (e.g. 0.18 for 18%).
 * @returns {number} The GST-inclusive price.
 */
export function getInclusivePrice(basePrice, gstRate = DEFAULT_GST_RATE) {
  if (typeof basePrice !== 'number' || isNaN(basePrice) || basePrice < 0) return 0;
  if (typeof gstRate !== 'number' || isNaN(gstRate) || gstRate < 0) return basePrice;
  return basePrice * (1 + gstRate);
}

/**
 * Extracts the GST tax portion from a GST-inclusive price.
 *
 * Formula: tax = inclusivePrice - (inclusivePrice / (1 + gstRate))
 *
 * @param {number} inclusivePrice - The price including GST.
 * @param {number} [gstRate=DEFAULT_GST_RATE] - The GST rate as a decimal (e.g. 0.18 for 18%).
 * @returns {number} The tax amount contained within the inclusive price.
 */
export function extractTaxFromInclusive(inclusivePrice, gstRate = DEFAULT_GST_RATE) {
  if (typeof inclusivePrice !== 'number' || isNaN(inclusivePrice) || inclusivePrice < 0) return 0;
  if (typeof gstRate !== 'number' || isNaN(gstRate) || gstRate <= 0) return 0;
  const basePrice = inclusivePrice / (1 + gstRate);
  return inclusivePrice - basePrice;
}

/**
 * Derives the base (GST-exclusive) price from a GST-inclusive price.
 *
 * @param {number} inclusivePrice - The price including GST.
 * @param {number} [gstRate=DEFAULT_GST_RATE] - The GST rate as a decimal (e.g. 0.18 for 18%).
 * @returns {number} The base price before GST.
 */
export function getBasePrice(inclusivePrice, gstRate = DEFAULT_GST_RATE) {
  if (typeof inclusivePrice !== 'number' || isNaN(inclusivePrice) || inclusivePrice < 0) return 0;
  if (typeof gstRate !== 'number' || isNaN(gstRate) || gstRate < 0) return inclusivePrice;
  return inclusivePrice / (1 + gstRate);
}

/**
 * Builds a tax breakdown object from a GST-inclusive price.
 *
 * @param {number} inclusivePrice - The price including GST.
 * @param {number} [gstRate=DEFAULT_GST_RATE] - The GST rate as a decimal (e.g. 0.18 for 18%).
 * @returns {{ basePrice: number, taxAmount: number, inclusivePrice: number, gstRate: number, gstPercentage: number }}
 *   An object with all relevant tax figures.
 */
export function getTaxBreakdown(inclusivePrice, gstRate = DEFAULT_GST_RATE) {
  const resolvedRate = typeof gstRate === 'number' && !isNaN(gstRate) && gstRate >= 0 ? gstRate : DEFAULT_GST_RATE;
  const base = getBasePrice(inclusivePrice, resolvedRate);
  const tax = extractTaxFromInclusive(inclusivePrice, resolvedRate);

  return {
    basePrice: base,
    taxAmount: tax,
    inclusivePrice: typeof inclusivePrice === 'number' && !isNaN(inclusivePrice) ? inclusivePrice : 0,
    gstRate: resolvedRate,
    gstPercentage: resolvedRate * 100,
  };
}

export default {
  getInclusivePrice,
  extractTaxFromInclusive,
  getBasePrice,
  getTaxBreakdown,
};
