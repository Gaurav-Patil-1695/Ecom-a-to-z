import crypto from 'crypto';

const TOKEN_BYTE_LENGTH = 32;

/**
 * Generates a cryptographically secure random token.
 *
 * @returns {{ rawToken: string, hashedToken: string }}
 *   rawToken   - hex string to send to the user (not stored)
 *   hashedToken - SHA-256 hex digest to persist in the database
 */
export function generateResetToken() {
  const rawToken = crypto.randomBytes(TOKEN_BYTE_LENGTH).toString('hex');
  const hashedToken = hashToken(rawToken);
  return { rawToken, hashedToken };
}

/**
 * Hashes a raw token using SHA-256.
 *
 * @param {string} rawToken - The plain hex token string
 * @returns {string} SHA-256 hex digest
 */
export function hashToken(rawToken) {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

/**
 * Verifies that a raw token matches a stored hashed token.
 *
 * @param {string} rawToken    - The plain token received from the user
 * @param {string} hashedToken - The SHA-256 digest stored in the database
 * @returns {boolean} True if the tokens match
 */
export function verifyResetToken(rawToken, hashedToken) {
  const digest = hashToken(rawToken);
  return crypto.timingSafeEqual(
    Buffer.from(digest, 'hex'),
    Buffer.from(hashedToken, 'hex')
  );
}

/**
 * Checks whether a token expiry timestamp is still valid.
 *
 * @param {Date|string|number} expiresAt - The expiry value from the database
 * @returns {boolean} True if the token has not yet expired
 */
export function isTokenExpired(expiresAt) {
  return Date.now() > new Date(expiresAt).getTime();
}

/**
 * Returns a Date object representing the token expiry time.
 *
 * @param {number} [ttlMinutes=60] - Time-to-live in minutes
 * @returns {Date}
 */
export function tokenExpiresAt(ttlMinutes = 60) {
  return new Date(Date.now() + ttlMinutes * 60 * 1000);
}
