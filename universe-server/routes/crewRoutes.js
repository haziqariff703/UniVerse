const express = require('express');
const router = express.Router();
const crewController = require('../controllers/crewController');
const { auth: verifyToken } = require('../middleware/auth');

// Public or Protected routes
router.get('/:eventId', crewController.getCrewByEvent);

// Protected Routes
router.post('/', verifyToken, crewController.addCrewMember);
router.delete('/:id', verifyToken, crewController.removeCrewMember);

module.exports = router;
