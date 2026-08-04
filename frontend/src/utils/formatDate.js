/**
 * Formats an ISO date string (or Date object) to a human-readable display string.
 *
 * @param {string|Date} date - The ISO date string or Date object to format.
 * @param {object} [options] - Optional Intl.DateTimeFormat options to override defaults.
 * @returns {string} The formatted date string, e.g. "12 Jan 2024".
 */
export function formatDate(date, options = {}) {
  if (!date) return '';

  const defaultOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };

  const mergedOptions = { ...defaultOptions, ...options };

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) return '';

  return new Intl.DateTimeFormat('en-IN', mergedOptions).format(dateObj);
}

/**
 * Formats an ISO date string (or Date object) to a date-time display string.
 *
 * @param {string|Date} date - The ISO date string or Date object to format.
 * @param {object} [options] - Optional Intl.DateTimeFormat options to override defaults.
 * @returns {string} The formatted date-time string, e.g. "12 Jan 2024, 03:30 PM".
 */
export function formatDateTime(date, options = {}) {
  if (!date) return '';

  const defaultOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  const mergedOptions = { ...defaultOptions, ...options };

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) return '';

  return new Intl.DateTimeFormat('en-IN', mergedOptions).format(dateObj);
}

/**
 * Formats an ISO date string (or Date object) as a relative time string.
 * Falls back to formatDate when the difference exceeds 7 days.
 *
 * @param {string|Date} date - The ISO date string or Date object to format.
 * @returns {string} A relative string like "2 days ago" or a formatted date.
 */
export function formatRelativeDate(date) {
  if (!date) return '';

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) return '';

  const now = new Date();
  const diffMs = now - dateObj;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays <= 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;

  return formatDate(dateObj);
}

export default formatDate;
