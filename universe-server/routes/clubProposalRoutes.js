const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const clubProposalController = require('../controllers/clubProposalController');
const upload = require('../middleware/upload');

router.post('/', auth, upload.fields([
  { name: 'constitution', maxCount: 1 },
  { name: 'consentLetter', maxCount: 1 },
  { name: 'logo', maxCount: 1 },
  { name: 'banner', maxCount: 1 }
]), clubProposalController.submitProposal);
router.get('/my-proposals', auth, clubProposalController.getMyProposals);

module.exports = router;
