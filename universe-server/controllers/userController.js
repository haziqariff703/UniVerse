const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { resolveFilePath } = require("../utils/pathResolver");

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

    const avatarUrl = resolveFilePath(req.file);
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

    const coverUrl = resolveFilePath(req.file);
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
    console.log("=== Upload Asset Request ===");
    console.log("File:", req.file ? req.file.originalname : "No file");
    console.log("User:", req.user ? req.user.id : "No user");
    console.log("Body:", req.body);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Validate PDF only
    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({
        message: "Only PDF files are allowed for certificates",
      });
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (req.file.size > maxSize) {
      return res.status(400).json({
        message: "File size exceeds 5MB limit",
      });
    }

    // Validate title
    const { title } = req.body;
    if (!title || title.trim().length < 3 || title.trim().length > 50) {
      return res.status(400).json({
        message: "Title is required (3-50 characters)",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      console.error("Upload Asset: User not found in DB", req.user.id);
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize assets if they don't exist
    if (!user.assets) {
      console.log("Upload Asset: Initializing assets array for user");
      user.assets = [];
    }

    const asset = {
      title: title.trim(),
      name: req.file.originalname,
      url: resolveFilePath(req.file),
      fileType: req.file.mimetype, // Renamed from 'type'
      size: (req.file.size / 1024 / 1024).toFixed(2) + " MB",
    };

    console.log("Upload Asset: Pushing new asset", asset);
    user.assets.push(asset);

    console.log("Upload Asset: Saving user document...");
    await user.save();
    console.log("Upload Asset: Save successful");

    res.status(200).json({
      message: "Certificate uploaded successfully",
      assets: user.assets,
    });
  } catch (error) {
    console.error("=== Upload Asset Error ===");
    console.error("Error Message:", error.message);
    console.error("Stack Trace:", error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Update user password
 * @route   PUT /api/users/security/password
 * @access  Private
 */
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required.",
      });
    }

    // Password strength validation (8+ chars, at least one number, one symbol)
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters with a number and symbol.",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Update Password Error:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

/**
 * @desc    Update user settings (privacy, notifications)
 * @route   PUT /api/users/settings
 * @access  Private
 */
exports.updateSettings = async (req, res) => {
  try {
    const { privacy, notifications, recoveryEmail } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Merge settings (partial updates)
    if (privacy) {
      user.settings.privacy = { ...user.settings.privacy, ...privacy };
    }
    if (notifications) {
      user.settings.notifications = {
        ...user.settings.notifications,
        ...notifications,
      };
    }
    if (recoveryEmail !== undefined) {
      user.settings.recoveryEmail = recoveryEmail;
    }

    await user.save();

    res.status(200).json({
      message: "Settings updated successfully.",
      settings: user.settings,
    });
  } catch (error) {
    console.error("Update Settings Error:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

/**
 * @desc    Export user data as JSON
 * @route   POST /api/users/data/export
 * @access  Private
 */
exports.exportUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password -__v")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Gather event history
    const Registration = require("../models/registration");
    const Event = require("../models/event");

    const registrations = await Registration.find({ user_id: req.user.id })
      .populate("event_id", "title date category")
      .lean();

    const eventHistory = registrations.map((reg) => ({
      eventTitle: reg.event_id?.title || "Unknown Event",
      eventDate: reg.event_id?.date,
      category: reg.event_id?.category,
      status: reg.status,
      registeredAt: reg.created_at,
    }));

    const exportData = {
      profile: {
        name: user.name,
        email: user.email,
        studentId: user.student_id,
        bio: user.bio,
        dna: user.dna,
        links: user.links,
      },
      gamification: {
        currentMerit: user.current_merit,
        meritGoal: user.merit_goal,
      },
      eventHistory,
      settings: user.settings,
      exportedAt: new Date().toISOString(),
    };

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=student_data.json",
    );
    res.status(200).json(exportData);
  } catch (error) {
    console.error("Export Data Error:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

/**
 * @desc    Delete user asset
 * @route   DELETE /api/users/profile/assets/:assetId
 * @access  Private
 */
exports.deleteAsset = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const assetId = req.params.assetId;
    const assetIndex = user.assets.findIndex(
      (asset) => asset._id.toString() === assetId,
    );

    if (assetIndex === -1) {
      return res.status(404).json({ message: "Asset not found" });
    }

    // Remove asset from array
    user.assets.splice(assetIndex, 1);
    await user.save();

    res.status(200).json({
      message: "Certificate deleted successfully",
      assets: user.assets,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
