/**
 * @typedef {Object} Address
 * @property {string} id - Unique address identifier
 * @property {string} userId - Associated user identifier
 * @property {string} firstName - Recipient first name
 * @property {string} lastName - Recipient last name
 * @property {string} phone - Recipient phone number
 * @property {string} line1 - Address line 1 (street, house/flat number)
 * @property {string} [line2] - Optional address line 2 (area, landmark)
 * @property {string} city - City name
 * @property {string} state - State or province name
 * @property {string} pin_code - Postal / PIN code
 * @property {string} country - Country name
 * @property {boolean} isDefault - Whether this is the user's default address
 * @property {boolean} isServiceable - Whether the pin code is serviceable for delivery
 * @property {string} createdAt - ISO timestamp of creation
 * @property {string} updatedAt - ISO timestamp of last update
 */

/**
 * @typedef {Object} AddressPayload
 * @property {string} firstName - Recipient first name
 * @property {string} lastName - Recipient last name
 * @property {string} phone - Recipient phone number
 * @property {string} line1 - Address line 1 (street, house/flat number)
 * @property {string} [line2] - Optional address line 2 (area, landmark)
 * @property {string} city - City name
 * @property {string} state - State or province name
 * @property {string} pin_code - Postal / PIN code
 * @property {string} country - Country name
 * @property {boolean} [isDefault] - Whether to set as the user's default address
 */

/**
 * @typedef {Object} ServiceabilityResult
 * @property {string} pin_code - The pin code that was checked
 * @property {boolean} isServiceable - Whether the pin code is serviceable for delivery
 */

export {};
