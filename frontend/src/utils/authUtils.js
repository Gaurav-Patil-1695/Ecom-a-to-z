/**
 * Auth utility functions for JWT handling on the client side.
 *
 * These utilities decode JWT claims and check token expiry without
 * any cryptographic verification (signature verification is server-side only).
 */

/**
 * Decodes the payload of a JWT without verifying its signature.
 *
 * @param {string} token - The raw JWT string.
 * @returns {object|null} The decoded payload object, or null if decoding fails.
 */
export function decodeToken(token) {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const base64Url = parts[1];
    // Replace URL-safe chars and pad to a multiple of 4
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const jsonPayload = atob(padded);
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Returns true when the given JWT token is expired based on its `exp` claim.
 * Treats tokens with no `exp` claim as non-expired.
 *
 * @param {string} token - The raw JWT string.
 * @returns {boolean} Whether the token is expired.
 */
export function isTokenExpired(token) {
  const payload = decodeToken(token);
  if (!payload) return true;

  if (typeof payload.exp !== 'number') return false;

  // `exp` is in seconds; Date.now() is in milliseconds
  return Date.now() >= payload.exp * 1000;
}

/**
 * Extracts a specific claim from a JWT payload.
 *
 * @param {string} token - The raw JWT string.
 * @param {string} claim - The claim key to extract.
 * @returns {*} The value of the claim, or undefined if not present.
 */
export function getTokenClaim(token, claim) {
  const payload = decodeToken(token);
  if (!payload) return undefined;
  return payload[claim];
}

/**
 * Returns the user id (`sub` claim) from a JWT token.
 *
 * @param {string} token - The raw JWT string.
 * @returns {string|null} The subject (user id), or null if not available.
 */
export function getTokenUserId(token) {
  const sub = getTokenClaim(token, 'sub');
  return sub !== undefined ? sub : null;
}

/**
 * Returns the roles array from a JWT token.
 * Looks for a `roles` claim; falls back to an empty array.
 *
 * @param {string} token - The raw JWT string.
 * @returns {string[]} The list of roles encoded in the token.
 */
export function getTokenRoles(token) {
  const roles = getTokenClaim(token, 'roles');
  if (Array.isArray(roles)) return roles;
  return [];
}

/**
 * Returns true when the JWT token represents a valid (non-expired, decodable) session.
 *
 * @param {string} token - The raw JWT string.
 * @returns {boolean} Whether the token is present and not expired.
 */
export function isAuthenticated(token) {
  if (!token || typeof token !== 'string') return false;
  return !isTokenExpired(token);
}

/**
 * Returns the number of seconds until the token expires.
 * Returns 0 if already expired or if the token has no `exp` claim.
 *
 * @param {string} token - The raw JWT string.
 * @returns {number} Seconds remaining until expiry, or 0.
 */
export function getTokenSecondsUntilExpiry(token) {
  const payload = decodeToken(token);
  if (!payload || typeof payload.exp !== 'number') return 0;
  const remaining = Math.floor(payload.exp - Date.now() / 1000);
  return remaining > 0 ? remaining : 0;
}

export default {
  decodeToken,
  isTokenExpired,
  getTokenClaim,
  getTokenUserId,
  getTokenRoles,
  isAuthenticated,
  getTokenSecondsUntilExpiry,
};
