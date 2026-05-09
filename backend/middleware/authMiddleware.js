// Authentication Middleware - Protects routes that require login
const authMiddleware = (req, res, next) => {
  // Check if user session exists
  if (req.session && req.session.userId) {
    // User is authenticated, proceed to next middleware/route handler
    next();
  } else {
    // User is not authenticated, return 401 Unauthorized
    res.status(401).json({ success: false, message: 'Unauthorized. Please login first.' });
  }
};

module.exports = authMiddleware;