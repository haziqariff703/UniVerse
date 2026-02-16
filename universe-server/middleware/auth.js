const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user data to request.
 */
const auth = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

/**
 * Role-based Authorization Middleware
 * Restricts access to specific roles.
 * @param  {...string} roles - Allowed roles (e.g., 'admin', 'organizer')
 */
const authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required.' });
      }
      
      // Check against new roles array if it exists in the token
      if (req.user.roles && req.user.roles.some(r => roles.includes(r))) {
        return next();
      }

      // Fallback to legacy single role field (Keep for now, but roles array is primary)
      if (roles.includes(req.user.role)) {
        return next();
      }
      
      return res.status(403).json({ 
        message: `Access denied. Required role: ${roles.join(' or ')}.` 
      });
    } catch (error) {
      console.error('Authorization Error:', error);
      res.status(500).json({ message: 'Server error during authorization', error: error.message });
    }
  };
};

module.exports = { auth, authorize };
