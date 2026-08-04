/**
 * @typedef {Object} OrderItem
 * @property {string} id - Unique order item identifier
 * @property {string} orderId - Associated order identifier
 * @property {string} skuId - Associated SKU identifier
 * @property {string} productId - Associated product identifier
 * @property {string} productName - Product name at time of order
 * @property {string} skuCode - SKU code at time of order
 * @property {Object.<string, string>} attributes - Key-value map of variant attributes (e.g. {"color": "Red", "size": "M"})
 * @property {number} quantity - Quantity ordered
 * @property {number} unitPrice - Unit price in smallest currency unit (e.g. paise)
 * @property {number} totalPrice - Total price for this line item (unitPrice * quantity)
 * @property {string} [imageUrl] - URL of the product image
 * @property {string} createdAt - ISO timestamp of creation
 */

/**
 * @typedef {Object} OrderStatusHistory
 * @property {string} id - Unique status history entry identifier
 * @property {string} orderId - Associated order identifier
 * @property {string} status - Order status value at this point in history
 * @property {string} [comment] - Optional comment about the status change
 * @property {string} [changedBy] - Identifier of the user who made the change
 * @property {string} createdAt - ISO timestamp of when this status was recorded
 */

/**
 * @typedef {Object} OrderTracking
 * @property {string} id - Unique tracking entry identifier
 * @property {string} orderId - Associated order identifier
 * @property {string} carrier - Name of the shipping carrier
 * @property {string} trackingNumber - Carrier tracking number
 * @property {string} [trackingUrl] - URL to the carrier tracking page
 * @property {string} [estimatedDelivery] - ISO timestamp of estimated delivery date
 * @property {string} [currentStatus] - Current tracking status from the carrier
 * @property {string} createdAt - ISO timestamp of creation
 * @property {string} updatedAt - ISO timestamp of last update
 */

/**
 * @typedef {Object} Order
 * @property {string} id - Unique order identifier
 * @property {string|null} userId - Associated user identifier, null for guest orders
 * @property {string} status - Current order status
 * @property {OrderItem[]} items - Array of items in the order
 * @property {number} subtotal - Sum of all item totalPrice values before discounts
 * @property {number} discount - Total discount amount applied
 * @property {number} total - Final total after discounts
 * @property {string|null} promoCode - Applied promo code string, null if none
 * @property {string|null} promoCodeId - Applied promo code identifier, null if none
 * @property {string} addressId - Associated delivery address identifier
 * @property {Object} [address] - Snapshot of the delivery address at time of order
 * @property {string} paymentMethod - Payment method used
 * @property {string} [paymentStatus] - Current payment status
 * @property {OrderStatusHistory[]} [statusHistory] - Array of status history entries
 * @property {OrderTracking} [tracking] - Associated tracking information
 * @property {string} createdAt - ISO timestamp of order creation
 * @property {string} updatedAt - ISO timestamp of last update
 */

export {};
