/**
 * Centralised Express error handler.
 * Must be registered AFTER all routes and other middleware:
 *   app.use(errorHandler)
 *
 * Produces structured JSON error responses of the form:
 *   { message: string, errors?: any }
 *
 * HTTP status code precedence:
 *   1. err.statusCode  (set by application code)
 *   2. err.status      (set by some third-party libraries)
 *   3. 500             (fallback)
 */
export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const statusCode =
    typeof err.statusCode === 'number'
      ? err.statusCode
      : typeof err.status === 'number'
      ? err.status
      : 500;

  const body = {
    message: err.message || 'Internal Server Error',
  };

  // Attach validation error details when present (e.g. from express-validator)
  if (err.errors !== undefined) {
    body.errors = err.errors;
  }

  // Log unexpected server errors for observability (only non-4xx)
  if (statusCode >= 500) {
    console.error('[errorHandler]', err);
  }

  return res.status(statusCode).json(body);
}

export default errorHandler;
