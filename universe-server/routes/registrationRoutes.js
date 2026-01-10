const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { auth, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// User routes
router.post('/', registrationController.registerForEvent);
router.get('/my-bookings', registrationController.getMyBookings);
router.delete('/:id', registrationController.cancelRegistration);

// Staff/Admin routes
router.post('/checkin', authorize('admin', 'staff'), registrationController.checkIn);

module.exports = router;
