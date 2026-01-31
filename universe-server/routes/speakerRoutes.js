const express = require('express');
const router = express.Router();
const speakerController = require('../controllers/speakerController');
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public/Organizer routes
router.get('/', speakerController.getVerifiedSpeakers);
router.post('/propose', auth, authorize('organizer', 'admin'), upload.single('proposal'), speakerController.proposeSpeaker);

module.exports = router;
