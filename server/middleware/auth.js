const jwt = require('jsonwebtoken');

/**
 * Middleware: verifyToken
 * Protects routes that require a logged-in artisan.
 * Expects: Authorization: Bearer <token>
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.artisan = decoded; // { id, name, email, craft }
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.',
    });
  }
};

module.exports = { verifyToken };
