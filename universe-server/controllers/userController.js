const User = require("../models/user");
const bcrypt = require("bcryptjs");

/**
 * @desc    Update current user's profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
exports.updateProfile = async (req, res) => {
  try {
    const { name, preferences, currentPassword, newPassword, bio, links, dna } =
      req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (preferences) user.preferences = preferences;
    if (bio !== undefined) user.bio = bio;
    if (links) user.links = links;
    if (dna) user.dna = dna;

    // Handle password change
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          message: "Current password is required to set a new password.",
        });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect." });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully!",
      user: {
        id: user._id,
        student_id: user.student_id,
        name: user.name,
        email: user.email,
        role: user.role,
        preferences: user.preferences,
        bio: user.bio,
        links: user.links,
        dna: user.dna,
        avatar: user.avatar,
        coverImage: user.coverImage,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

/**
 * @desc    Get current user's profile
 * @route   GET /api/users/profile
 * @access  Private
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").lean();
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Include community roles summary
    const CommunityMember = require("../models/communityMember");
    const memberships = await CommunityMember.find({
      user_id: req.user.id,
      status: "Approved",
    });

    const communityRoles = memberships.map((m) => m.role);
    const isPresident = communityRoles.includes("President");

    console.log(
      `[getProfile] User: ${user.email}, Roles: ${user.roles}, IsPresident: ${isPresident}`,
    );

    res.status(200).json({
      ...user,
      avatar: user.avatar || "",
      coverImage: user.coverImage || "",
      bio: user.bio || "",
      dna: user.dna || [],
      assets: user.assets || [],
      isPresident,
      communityRoles,
    });
  } catch (error) {
    console.error("[getProfile] Error:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

/**
 * @desc    Upload avatar
 * @route   PUT /api/users/profile/avatar
 * @access  Private
 */
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Construct URL (assuming server serves public folder)
    const avatarUrl = `/public/uploads/${req.file.filename}`;
    user.avatar = avatarUrl;
    await user.save();

    res.status(200).json({
      message: "Avatar uploaded successfully",
      avatar: avatarUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Upload cover image
 * @route   PUT /api/users/profile/cover
 * @access  Private
 */
exports.uploadCover = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const coverUrl = `/public/uploads/${req.file.filename}`;
    user.coverImage = coverUrl;
    await user.save();

    res.status(200).json({
      message: "Cover image uploaded successfully",
      coverImage: coverUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Upload document asset
 * @route   PUT /api/users/profile/assets
 * @access  Private
 */
exports.uploadAsset = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const asset = {
      name: req.file.originalname,
      url: `/public/uploads/${req.file.filename}`,
      type: req.file.mimetype,
      size: (req.file.size / 1024 / 1024).toFixed(2) + " MB",
    };

    user.assets.push(asset);
    await user.save();

    res.status(200).json({
      message: "Asset uploaded successfully",
      assets: user.assets,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Upload document asset
 * @route   PUT /api/users/profile/assets
 * @access  Private
 */
exports.uploadAsset = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const asset = {
      name: req.file.originalname,
      url: `/public/uploads/${req.file.filename}`,
      type: req.file.mimetype,
      size: (req.file.size / 1024 / 1024).toFixed(2) + " MB",
    };

    user.assets.push(asset);
    await user.save();

    res.status(200).json({
      message: "Asset uploaded successfully",
      assets: user.assets,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
