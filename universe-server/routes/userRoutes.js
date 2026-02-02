const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const userController = require('../controllers/userController');

// @route   GET /api/users/profile
// @desc    Get current user's profile
// @access  Private
router.get('/profile', auth, userController.getProfile);

// @route   PUT /api/users/profile
// @desc    Update current user's profile
// @access  Private
router.put('/profile', auth, userController.updateProfile);

module.exports = router;
