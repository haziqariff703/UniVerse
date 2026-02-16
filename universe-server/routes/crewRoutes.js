const express = require('express');
const router = express.Router();
const crewController = require('../controllers/crewController');
const { auth: verifyToken } = require('../middleware/auth');

// Public or Protected routes
router.get('/:eventId', verifyToken, crewController.getCrewByEvent);
router.get('/eligible/:eventId', verifyToken, crewController.getEligibleMembers);

// Protected Routes
router.post('/', verifyToken, crewController.addCrewMember);
router.put('/:id', verifyToken, crewController.updateCrewMember); // Update role/dept
router.delete('/:id', verifyToken, crewController.removeCrewMember);

module.exports = router;
