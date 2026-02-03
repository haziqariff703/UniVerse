const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const clubProposalController = require('../controllers/clubProposalController');

router.post('/', auth, clubProposalController.submitProposal);
router.get('/my-proposals', auth, clubProposalController.getMyProposals);

module.exports = router;
