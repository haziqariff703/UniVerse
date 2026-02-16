const express = require('express');
const router = express.Router();
const venueController = require('../controllers/venueController');
const eventController = require('../controllers/eventController');
const { auth } = require('../middleware/auth');

/**
 * Public/Organizer Venue Routes
 */

// Get all venues
router.get('/', venueController.getAllVenues);

// Get venue by ID
router.get('/:id', venueController.getVenueById);

// Get all approved events for a specific venue
router.get('/:id/events', eventController.getEventsByVenue);

module.exports = router;
