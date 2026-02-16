const express = require('express');
const router = express.Router();
const speakerController = require('../controllers/speakerController');
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public/Organizer routes
router.get('/', speakerController.getVerifiedSpeakers);
router.get('/organizer', auth, speakerController.getSpeakersForOrganizer); // New context-aware list
router.post('/seed', speakerController.seedSpeakers); // Dev route to seed data
router.get('/:id', speakerController.getSpeakerById);
router.post('/propose', auth, authorize('organizer', 'admin', 'association'), upload.fields([{ name: 'proposal', maxCount: 1 }, { name: 'image', maxCount: 1 }]), speakerController.proposeSpeaker);
router.put('/:id', auth, authorize('organizer', 'admin', 'association'), upload.fields([{ name: 'proposal', maxCount: 1 }, { name: 'image', maxCount: 1 }]), speakerController.updateSpeaker);
router.delete('/:id', auth, authorize('organizer', 'admin', 'association'), speakerController.deleteSpeaker);

module.exports = router;
