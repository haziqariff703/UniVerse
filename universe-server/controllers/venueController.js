const Venue = require('../models/venue');

/**
 * @desc    Get all venues
 * @route   GET /api/venues
 * @access  Public
 */
exports.getAllVenues = async (req, res) => {
  try {
    const { type } = req.query;
    let query = {};
    if (type && type !== 'All') {
      query.type = type;
    }
    const venues = await Venue.find(query).sort({ name: 1 });
    res.json(venues);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Get venue by ID
 * @route   GET /api/venues/:id
 * @access  Public
 */
exports.getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    res.json(venue);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Venue not found' });
    }
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Get all approved events for a specific venue (Redirected from venueRoutes)
 * @route   GET /api/venues/:id/events
 * @access  Public
 */
// This logic is already in eventController.js, but keeping it here for consistency if needed later.
// For now, venueRoutes uses eventController.getEventsByVenue
