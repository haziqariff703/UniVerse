const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Define the endpoints
router.get('/', eventController.getAllEvents);
router.post('/', eventController.createEvent);

module.exports = router;