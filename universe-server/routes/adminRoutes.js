const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, authorize } = require('../middleware/auth');

/**
 * Admin Routes
 * All routes are protected with authentication and admin-only authorization (RBAC).
 */

// Dashboard Statistics
router.get('/stats', auth, authorize('admin'), adminController.getDashboardStats);

// User Management
router.get('/users', auth, authorize('admin'), adminController.getAllUsers);
router.put('/users/:id/role', auth, authorize('admin'), adminController.updateUserRole);
router.delete('/users/:id', auth, authorize('admin'), adminController.deleteUser);

// Event Management (Admin view)
router.get('/events', auth, authorize('admin'), adminController.getAllEvents);

module.exports = router;
