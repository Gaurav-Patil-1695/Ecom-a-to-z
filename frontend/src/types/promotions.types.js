/**
 * @typedef {'percentage' | 'flat'} DiscountType
 * Discount type: 'percentage' for a percentage-based discount, 'flat' for a fixed amount discount
 */

/**
 * @typedef {Object} PromoCode
 * @property {string} id - Unique promo code identifier
 * @property {string} code - The promo code string
 * @property {DiscountType} discountType - Type of discount ('percentage' or 'flat')
 * @property {number} discountValue - Discount value; percentage (0-100) if discountType is 'percentage', or amount in smallest currency unit if 'flat'
 * @property {number} [minOrderValue] - Minimum order value required to apply this promo code, in smallest currency unit
 * @property {number} [maxDiscountAmount] - Maximum discount amount cap in smallest currency unit (applicable for 'percentage' type)
 * @property {number} [usageLimit] - Maximum total number of times this promo code can be used
 * @property {number} [usageCount] - Number of times this promo code has been used
 * @property {string|null} expiresAt - ISO timestamp of when the promo code expires, null if no expiry
 * @property {boolean} isActive - Whether this promo code is currently active
 * @property {string} createdAt - ISO timestamp of creation
 * @property {string} updatedAt - ISO timestamp of last update
 */

/**
 * @typedef {Object} ApplyPromoPayload
 * @property {string} code - The promo code string to apply
 */

/**
 * @typedef {Object} PromoCodeValidationResult
 * @property {boolean} valid - Whether the promo code is valid
 * @property {PromoCode} [promoCode] - The promo code object if valid
 * @property {number} [discountAmount] - Calculated discount amount in smallest currency unit
 * @property {string} [message] - Validation message if not valid
 */

export {};
