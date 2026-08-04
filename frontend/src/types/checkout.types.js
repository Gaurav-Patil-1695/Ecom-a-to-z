/**
 * @typedef {Object} CheckoutInitiatePayload
 * @property {string} cartId - Identifier of the cart to initiate checkout for
 * @property {string} addressId - Identifier of the delivery address
 * @property {string} [promoCode] - Optional promo code to apply
 */

/**
 * @typedef {Object} CheckoutConfirmPayload
 * @property {string} orderId - Identifier of the order to confirm
 * @property {string} paymentMethod - Payment method selected by the user
 * @property {string} [paymentToken] - Optional payment token from payment provider
 */

export {};
