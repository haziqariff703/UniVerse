const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const userController = require("../controllers/userController");
const upload = require("../middleware/upload");

// @route   GET /api/users/profile
// @desc    Get current user's profile
// @access  Private
router.get("/profile", auth, userController.getProfile);

// @route   PUT /api/users/profile
// @desc    Update current user's profile
// @access  Private
router.put("/profile", auth, userController.updateProfile);

// @route   PUT /api/users/profile/avatar
// @desc    Upload avatar
// @access  Private
router.put(
  "/profile/avatar",
  auth,
  upload.single("image"),
  userController.uploadAvatar,
);

// @route   PUT /api/users/profile/cover
// @desc    Upload cover image
// @access  Private
router.put(
  "/profile/cover",
  auth,
  upload.single("image"),
  userController.uploadCover,
);

// @route   PUT /api/users/profile/assets
// @desc    Upload document asset
// @access  Private
router.put(
  "/profile/assets",
  auth,
  upload.single("file"),
  userController.uploadAsset,
);

module.exports = router;
