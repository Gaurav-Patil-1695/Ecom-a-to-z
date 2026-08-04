/**
 * Shipping utility functions.
 *
 * Shipping policy:
 *   - Free shipping (₹0) when the order total is ₹799 or above.
 *   - Flat shipping charge of ₹49 when the order total is below ₹799.
 */

const FREE_SHIPPING_THRESHOLD = 799;
const SHIPPING_CHARGE = 49;
const FREE_SHIPPING = 0;

/**
 * Computes the shipping charge for a given order total.
 *
 * @param {number} orderTotal - The total price of items in the cart (in ₹).
 * @returns {number} ₹0 if orderTotal >= ₹799, otherwise ₹49.
 */
export function getShippingCharge(orderTotal) {
  if (typeof orderTotal !== 'number' || isNaN(orderTotal) || orderTotal < 0) {
    return SHIPPING_CHARGE;
  }
  return orderTotal >= FREE_SHIPPING_THRESHOLD ? FREE_SHIPPING : SHIPPING_CHARGE;
}

/**
 * Returns true when the given order total qualifies for free shipping.
 *
 * @param {number} orderTotal - The total price of items in the cart (in ₹).
 * @returns {boolean} Whether shipping is free.
 */
export function isFreeShipping(orderTotal) {
  if (typeof orderTotal !== 'number' || isNaN(orderTotal) || orderTotal < 0) {
    return false;
  }
  return orderTotal >= FREE_SHIPPING_THRESHOLD;
}

/**
 * Returns the amount still needed to qualify for free shipping.
 *
 * @param {number} orderTotal - The total price of items in the cart (in ₹).
 * @returns {number} The remaining amount needed, or 0 if already eligible.
 */
export function amountUntilFreeShipping(orderTotal) {
  if (typeof orderTotal !== 'number' || isNaN(orderTotal) || orderTotal < 0) {
    return FREE_SHIPPING_THRESHOLD;
  }
  const remaining = FREE_SHIPPING_THRESHOLD - orderTotal;
  return remaining > 0 ? remaining : 0;
}

export default {
  getShippingCharge,
  isFreeShipping,
  amountUntilFreeShipping,
};
