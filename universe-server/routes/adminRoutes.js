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

// Event Management
router.get('/events', auth, authorize('admin'), adminController.getAllEvents);
router.get('/events/pending', auth, authorize('admin'), adminController.getPendingEvents);
router.patch('/events/:id/approve', auth, authorize('admin'), adminController.approveEvent);
router.patch('/events/:id/reject', auth, authorize('admin'), adminController.rejectEvent);

// Organizer Approval
router.get('/organizers/pending', auth, authorize('admin'), adminController.getPendingOrganizers);
router.patch('/organizers/:id/approve', auth, authorize('admin'), adminController.approveOrganizer);
router.patch('/organizers/:id/reject', auth, authorize('admin'), adminController.rejectOrganizer);

// Venue Management
router.get('/venues', auth, authorize('admin', 'organizer'), adminController.getAllVenues);
router.post('/venues', auth, authorize('admin'), adminController.createVenue);
router.put('/venues/:id', auth, authorize('admin'), adminController.updateVenue);
router.delete('/venues/:id', auth, authorize('admin'), adminController.deleteVenue);

// Speaker Management
router.get('/speakers', auth, authorize('admin', 'organizer'), adminController.getAllSpeakers);
router.post('/speakers', auth, authorize('admin'), adminController.createSpeaker);
router.put('/speakers/:id', auth, authorize('admin'), adminController.updateSpeaker);
router.delete('/speakers/:id', auth, authorize('admin'), adminController.deleteSpeaker);

// Review Management
router.get('/reviews', auth, authorize('admin'), adminController.getAllReviews);
router.delete('/reviews/:id', auth, authorize('admin'), adminController.deleteReview);

// Notification Management
router.get('/notifications', auth, authorize('admin'), adminController.getAllNotifications);
router.post('/notifications', auth, authorize('admin'), adminController.createNotification);
router.delete('/notifications/:id', auth, authorize('admin'), adminController.deleteNotification);

module.exports = router;
