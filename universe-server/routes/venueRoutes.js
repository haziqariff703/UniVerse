const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { auth } = require('../middleware/auth');

/**
 * Public/Organizer Venue Routes
 */

// Get all approved events for a specific venue
router.get('/:id/events', eventController.getEventsByVenue);

module.exports = router;
