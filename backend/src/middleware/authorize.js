/**
 * RBAC middleware factory.
 * Returns a middleware that checks whether req.user has the required role.
 *
 * Usage:
 *   router.get('/admin/reports', authenticate, authorize('admin'), handler)
 *
 * If req.user is not present the request is rejected with 401.
 * If req.user does not possess the required role the request is rejected with 403.
 *
 * @param {string} role - The role name that must be present in req.user.roles.
 * @returns {import('express').RequestHandler}
 */
export function authorize(role) {
  return function authorizeMiddleware(req, res, next) {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication token missing.' });
    }

    const roles = Array.isArray(req.user.roles) ? req.user.roles : [];

    if (!roles.includes(role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions.' });
    }

    return next();
  };
}

export default authorize;
