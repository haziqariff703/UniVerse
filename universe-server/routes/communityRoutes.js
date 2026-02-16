const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const communityController = require('../controllers/communityController');

// Protected Routes (Specific paths must come BEFORE parameterized routes)
router.get('/my-communities', auth, communityController.getMyCommunities);
router.post('/', auth, communityController.createCommunity);
router.post('/:id/apply', auth, communityController.applyToCommunity);
router.get('/:id/applicants', auth, communityController.getCommunityApplicants);
router.post('/:id/members', auth, communityController.addMember); // Direct Add
router.put('/members/:memberId', auth, communityController.updateMemberStatus);

// Public Routes (Parameterized routes last)
router.get('/', communityController.getAllCommunities);
router.get('/:slug', communityController.getCommunityBySlug);

module.exports = router;
