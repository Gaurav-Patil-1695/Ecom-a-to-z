/**
 * @typedef {Object} User
 * @property {string} id - Unique user identifier
 * @property {string} email - User email address
 * @property {string} firstName - User first name
 * @property {string} lastName - User last name
 * @property {string} phone - User phone number
 * @property {string[]} roles - Array of role names assigned to the user
 * @property {boolean} isGuest - Whether the user is a guest
 * @property {string} createdAt - ISO timestamp of account creation
 * @property {string} updatedAt - ISO timestamp of last update
 */

/**
 * @typedef {Object} LoginPayload
 * @property {string} email - User email address
 * @property {string} password - User password
 */

/**
 * @typedef {Object} RegisterPayload
 * @property {string} firstName - User first name
 * @property {string} lastName - User last name
 * @property {string} email - User email address
 * @property {string} password - User password
 * @property {string} [phone] - Optional user phone number
 */

/**
 * @typedef {Object} ResetPayload
 * @property {string} token - Password reset token
 * @property {string} password - New password
 */

/**
 * @typedef {Object} AuthTokens
 * @property {string} accessToken - JWT access token
 * @property {string} refreshToken - JWT refresh token
 */

/**
 * @typedef {Object} AuthResponse
 * @property {User} user - Authenticated user object
 * @property {string} accessToken - JWT access token
 * @property {string} refreshToken - JWT refresh token
 */

/**
 * @typedef {Object} ForgotPasswordPayload
 * @property {string} email - Email address for password reset
 */

/**
 * @typedef {Object} ChangePasswordPayload
 * @property {string} currentPassword - Current password
 * @property {string} newPassword - New password
 */

/**
 * @typedef {Object} GuestRegisterPayload
 * @property {string} email - Guest user email address
 */

export {};
