const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { auth, authorize } = require('../middleware/auth');

// Public route (no auth required)
router.get('/event/:id/public', registrationController.getPublicEventRegistrations);

// All routes below require authentication
router.use(auth);

// User routes
router.post('/', registrationController.registerForEvent);
router.get('/my-bookings', registrationController.getMyBookings);
router.delete('/:id', registrationController.cancelRegistration);

// Staff/Admin/Organizer routes
router.get('/event/:id', authorize('organizer', 'admin', 'staff'), registrationController.getEventRegistrations);
router.post('/checkin', authorize('organizer', 'admin', 'staff'), registrationController.checkIn);
router.patch('/:id/status', authorize('organizer', 'admin', 'staff'), registrationController.updateStatus);

module.exports = router;
