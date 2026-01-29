const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { auth, authorize } = require('../middleware/auth');

// Protected routes (require authentication)
const upload = require('../middleware/upload');

// Protected routes (require authentication)
router.get('/my-events', auth, eventController.getMyEvents);
router.post('/', auth, authorize('admin', 'organizer'), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'proposal', maxCount: 1 }]), eventController.createEvent);
router.put('/:id', auth, authorize('admin', 'organizer'), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'proposal', maxCount: 1 }]), eventController.updateEvent);
router.delete('/:id', auth, authorize('admin'), eventController.deleteEvent);

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);

module.exports = router;