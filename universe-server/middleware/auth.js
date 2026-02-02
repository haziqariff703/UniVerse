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
 * @param  {...string} roles - Allowed roles (e.g., 'admin', 'staff')
 */
const authorize = (...roles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }
    
    // Direct role match
    if (roles.includes(req.user.role)) {
      return next();
    }

    // Special case: if 'organizer' is in allowed roles, also allow users with is_organizer_approved
    if (roles.includes('organizer')) {
      const User = require('../models/user');
      const user = await User.findById(req.user.id);
      if (user && user.is_organizer_approved) {
        return next();
      }
    }
    
    return res.status(403).json({ 
      message: `Access denied. Required role: ${roles.join(' or ')}.` 
    });
  };
};

module.exports = { auth, authorize };
