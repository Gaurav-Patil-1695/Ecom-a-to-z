/**
 * Utility functions for parsing API error responses into user-facing messages.
 *
 * Handles Axios-style error objects with a `response` property as well as
 * plain Error objects and unknown thrown values.
 */

/**
 * Default fallback message when no specific message can be extracted.
 */
const DEFAULT_ERROR_MESSAGE = 'An unexpected error occurred. Please try again.';

/**
 * Maps HTTP status codes to user-facing fallback messages.
 */
const STATUS_CODE_MESSAGES = {
  400: 'The request was invalid. Please check your input and try again.',
  401: 'You are not authorised to perform this action. Please log in and try again.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  409: 'A conflict occurred. The resource may already exist.',
  422: 'The request could not be processed due to validation errors.',
  429: 'Too many requests. Please wait a moment and try again.',
  500: 'A server error occurred. Please try again later.',
  502: 'The server is temporarily unavailable. Please try again later.',
  503: 'The service is currently unavailable. Please try again later.',
};

/**
 * Extracts a single user-facing error message string from an API error.
 *
 * Resolution order:
 *   1. `error.response.data.message` (string)
 *   2. `error.response.data.error` (string)
 *   3. HTTP status code fallback from STATUS_CODE_MESSAGES
 *   4. `error.message` (plain Error)
 *   5. DEFAULT_ERROR_MESSAGE
 *
 * @param {unknown} error - The error thrown by an API call.
 * @returns {string} A user-facing error message.
 */
export function parseApiError(error) {
  if (!error) return DEFAULT_ERROR_MESSAGE;

  // Axios-style error with a response object
  if (error.response) {
    const { data, status } = error.response;

    if (data) {
      if (typeof data.message === 'string' && data.message.trim()) {
        return data.message.trim();
      }
      if (typeof data.error === 'string' && data.error.trim()) {
        return data.error.trim();
      }
    }

    if (typeof status === 'number' && STATUS_CODE_MESSAGES[status]) {
      return STATUS_CODE_MESSAGES[status];
    }
  }

  // Network / timeout errors (no response)
  if (error.request && !error.response) {
    return 'Unable to reach the server. Please check your internet connection and try again.';
  }

  // Plain Error object
  if (error instanceof Error && typeof error.message === 'string' && error.message.trim()) {
    return error.message.trim();
  }

  return DEFAULT_ERROR_MESSAGE;
}

/**
 * Extracts field-level validation errors from an API error response.
 *
 * Looks for `error.response.data.errors` which is expected to be either:
 *   - An object mapping field names to error message strings: `{ field: 'message' }`
 *   - An array of objects with `field` and `message` properties:
 *     `[{ field: 'email', message: 'Invalid email address.' }]`
 *
 * @param {unknown} error - The error thrown by an API call.
 * @returns {Record<string, string>} An object mapping field names to error messages,
 *   or an empty object if no field errors are found.
 */
export function parseFieldErrors(error) {
  if (!error || !error.response || !error.response.data) return {};

  const { errors } = error.response.data;

  if (!errors) return {};

  // Already a plain object mapping field -> message
  if (typeof errors === 'object' && !Array.isArray(errors)) {
    const result = {};
    for (const [key, value] of Object.entries(errors)) {
      if (typeof value === 'string') {
        result[key] = value;
      } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
        result[key] = value[0];
      }
    }
    return result;
  }

  // Array of { field, message } objects
  if (Array.isArray(errors)) {
    const result = {};
    for (const item of errors) {
      if (
        item &&
        typeof item === 'object' &&
        typeof item.field === 'string' &&
        typeof item.message === 'string'
      ) {
        if (!result[item.field]) {
          result[item.field] = item.message;
        }
      }
    }
    return result;
  }

  return {};
}

/**
 * Returns true when the error represents an HTTP 401 Unauthorised response.
 *
 * @param {unknown} error - The error thrown by an API call.
 * @returns {boolean}
 */
export function isUnauthorisedError(error) {
  return !!(
    error &&
    error.response &&
    typeof error.response.status === 'number' &&
    error.response.status === 401
  );
}

/**
 * Returns true when the error represents an HTTP 403 Forbidden response.
 *
 * @param {unknown} error - The error thrown by an API call.
 * @returns {boolean}
 */
export function isForbiddenError(error) {
  return !!(
    error &&
    error.response &&
    typeof error.response.status === 'number' &&
    error.response.status === 403
  );
}

/**
 * Returns true when the error represents an HTTP 404 Not Found response.
 *
 * @param {unknown} error - The error thrown by an API call.
 * @returns {boolean}
 */
export function isNotFoundError(error) {
  return !!(
    error &&
    error.response &&
    typeof error.response.status === 'number' &&
    error.response.status === 404
  );
}

/**
 * Returns true when the error represents a network failure (request made but no response received).
 *
 * @param {unknown} error - The error thrown by an API call.
 * @returns {boolean}
 */
export function isNetworkError(error) {
  return !!(error && error.request && !error.response);
}

/**
 * Returns the HTTP status code from an API error, or null if unavailable.
 *
 * @param {unknown} error - The error thrown by an API call.
 * @returns {number|null} The HTTP status code, or null.
 */
export function getErrorStatusCode(error) {
  if (
    error &&
    error.response &&
    typeof error.response.status === 'number'
  ) {
    return error.response.status;
  }
  return null;
}

export default {
  parseApiError,
  parseFieldErrors,
  isUnauthorisedError,
  isForbiddenError,
  isNotFoundError,
  isNetworkError,
  getErrorStatusCode,
};
