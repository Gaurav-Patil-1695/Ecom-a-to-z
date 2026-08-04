/**
 * @typedef {Object} CartItem
 * @property {string} id - Unique cart item identifier
 * @property {string} cartId - Associated cart identifier
 * @property {string} skuId - Associated SKU identifier
 * @property {string} productId - Associated product identifier
 * @property {string} productName - Product name at time of addition
 * @property {string} skuCode - SKU code at time of addition
 * @property {Object.<string, string>} attributes - Key-value map of variant attributes (e.g. {"color": "Red", "size": "M"})
 * @property {number} quantity - Quantity of this item in the cart
 * @property {number} unitPrice - Unit price in smallest currency unit (e.g. paise)
 * @property {number} totalPrice - Total price for this line item (unitPrice * quantity)
 * @property {string} [imageUrl] - URL of the product image
 * @property {number} stock - Available stock for the selected SKU
 * @property {string} createdAt - ISO timestamp of when item was added
 * @property {string} updatedAt - ISO timestamp of last update
 */

/**
 * @typedef {Object} Cart
 * @property {string} id - Unique cart identifier
 * @property {string|null} userId - Associated user identifier, null for guest carts
 * @property {CartItem[]} items - Array of items in the cart
 * @property {number} subtotal - Sum of all item totalPrice values before discounts
 * @property {number} discount - Total discount amount applied
 * @property {number} total - Final total after discounts
 * @property {string|null} promoCode - Applied promo code string, null if none
 * @property {string|null} promoCodeId - Applied promo code identifier, null if none
 * @property {string} createdAt - ISO timestamp of cart creation
 * @property {string} updatedAt - ISO timestamp of last update
 */

export {};
