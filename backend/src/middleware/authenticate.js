import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

/**
 * JWT verification middleware.
 * Verifies the Bearer token from the Authorization header and attaches the
 * decoded payload to req.user.
 *
 * If no token is present the request is rejected with 401.
 * If the token is invalid or expired the request is rejected with 401.
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token missing.' });
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Authentication token expired.' });
    }
    return res.status(401).json({ message: 'Authentication token invalid.' });
  }
}

export default authenticate;
