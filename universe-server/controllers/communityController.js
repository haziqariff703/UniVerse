const Community = require("../models/community");
const CommunityMember = require("../models/communityMember");
const User = require("../models/user");

/**
 * @desc    Create a new community
 * @route   POST /api/communities
 * @access  Private (Admin)
 */
exports.createCommunity = async (req, res) => {
  try {
    const { name, slug, description, category, advisor, owner_id } = req.body;

    const community = new Community({
      name,
      slug,
      description,
      category,
      advisor,
      owner_id: owner_id || req.user.id,
    });

    await community.save();

    // Automatically add owner as President/Advisor
    const member = new CommunityMember({
      community_id: community._id,
      user_id: community.owner_id,
      role: "President",
      status: "Approved",
      joined_at: new Date(),
    });
    await member.save();

    res.status(201).json(community);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

/**
 * @desc    Get all communities
 * @route   GET /api/communities
 * @access  Public
 */
exports.getAllCommunities = async (req, res) => {
  try {
    const communities = await Community.find();
    res.status(200).json(communities);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

/**
 * @desc    Get community by slug
 * @route   GET /api/communities/:slug
 * @access  Public
 */
exports.getCommunityBySlug = async (req, res) => {
  try {
    const community = await Community.findOne({
      slug: req.params.slug,
    }).populate("owner_id", "name email");
    if (!community) {
      return res.status(404).json({ message: "Community not found." });
    }

    const members = await CommunityMember.find({
      community_id: community._id,
      status: "Approved",
    }).populate("user_id", "name email");

    res.status(200).json({ community, members });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

/**
 * @desc    Apply to join a community
 * @route   POST /api/communities/:id/apply
 * @access  Private
 */
exports.applyToCommunity = async (req, res) => {
  try {
    const community_id = req.params.id;
    const user_id = req.user.id;

    const existingMember = await CommunityMember.findOne({
      community_id,
      user_id,
    });
    if (existingMember) {
      return res
        .status(400)
        .json({ message: "You have already applied or are a member." });
    }

    const application = new CommunityMember({
      community_id,
      user_id,
      status: "Applied",
    });

    await application.save();
    res
      .status(201)
      .json({ message: "Application submitted successfully.", application });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

/**
 * @desc    Update member status (Interview, Approve, Reject)
 * @route   PUT /api/communities/members/:memberId
 * @access  Private (Organizer)
 */
exports.updateMemberStatus = async (req, res) => {
  try {
    const { status, role, interview_date, interview_note, department } =
      req.body;
    const member = await CommunityMember.findById(req.params.memberId);

    if (!member) {
      return res.status(404).json({ message: "Membership record not found." });
    }

    // Authorization check: User must be an owner/President of the community, an Admin, or an Association member
    const community = await Community.findById(member.community_id);

    let isMember = false;
    if (req.user.roles.includes("association")) {
      const membership = await CommunityMember.findOne({
        community_id: member.community_id,
        user_id: req.user.id,
        status: "Approved",
      });
      if (membership) isMember = true;
    }

    const isAuthorized =
      community?.owner_id.toString() === req.user.id ||
      req.user.roles.includes("admin") ||
      isMember;

    if (!community || !isAuthorized) {
      return res
        .status(403)
        .json({ message: "Not authorized to manage this community." });
    }

    if (status) member.status = status;
    if (role) member.role = role;
    if (interview_date) member.interview_date = interview_date;
    if (interview_note) member.interview_note = interview_note;
    if (department) member.department = department;

    if (status === "Approved" && !member.joined_at) {
      member.joined_at = new Date();

      // If approved as AJK or higher (any role other than Member), grant organizer access
      const organizerRoles = [
        "President",
        "Secretary",
        "Treasurer",
        "Committee",
        "AJK",
      ];
      if (organizerRoles.includes(member.role)) {
        await User.findByIdAndUpdate(member.user_id, {
          is_organizer_approved: true,
          $addToSet: { roles: "organizer" },
        });
      } else {
        await User.findByIdAndUpdate(member.user_id, {
          is_organizer_approved: true,
        });
      }
    }

    await member.save();
    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

/**
 * @desc    Get community applicants for management
 * @route   GET /api/communities/:id/applicants
 * @access  Private (Organizer)
 */
exports.getCommunityApplicants = async (req, res) => {
  try {
    const community_id = req.params.id;

    // Authorization: Owner, Admin, or Approved AJK of this community
    const community = await Community.findById(community_id);
    if (!community) {
      return res.status(404).json({ message: "Community not found." });
    }

    const isOwner = community.owner_id.toString() === req.user.id;
    const isAdmin = req.user.roles.includes("admin");

    let isMember = false;
    if (!isOwner && !isAdmin) {
      const membership = await CommunityMember.findOne({
        community_id,
        user_id: req.user.id,
        status: "Approved",
      });
      if (membership) isMember = true;
    }

    if (!isOwner && !isAdmin && !isMember) {
      return res.status(403).json({ message: "Not authorized." });
    }

    const applicants = await CommunityMember.find({ community_id }).populate(
      "user_id",
      "name email student_id",
    );

    res.status(200).json(applicants);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

/**
 * @desc    Directly add a member to community (Invite/Add)
 * @route   POST /api/communities/:id/members
 * @access  Private (Organizer)
 */
exports.addMember = async (req, res) => {
  try {
    const community_id = req.params.id;
    const { student_id } = req.body;

    if (!student_id) {
      return res.status(400).json({ message: "Student ID is required." });
    }

    // 1. Authorization Check
    const community = await Community.findById(community_id);
    if (!community)
      return res.status(404).json({ message: "Community not found." });

    const isOwner = community.owner_id.toString() === req.user.id;
    const isAdmin = req.user.roles.includes("admin");

    // Check if user is an approved Association member
    let isAssociationMember = false;
    if (req.user.roles.includes("association")) {
      const callerMembership = await CommunityMember.findOne({
        community_id,
        user_id: req.user.id,
        status: "Approved",
      });
      if (callerMembership) isAssociationMember = true;
    }

    if (!isOwner && !isAdmin && !isAssociationMember) {
      return res
        .status(403)
        .json({ message: "Not authorized to add members." });
    }

    // 2. Find User
    const user = await User.findOne({ student_id });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Student not found with this ID." });
    }

    // 3. Check duplicate membership
    const existingMember = await CommunityMember.findOne({
      community_id,
      user_id: user._id,
    });
    if (existingMember) {
      return res.status(400).json({
        message: `User is already a member with status: ${existingMember.status}`,
      });
    }

    // 4. Create Member
    const newMember = new CommunityMember({
      community_id,
      user_id: user._id,
      status: "Approved", // Auto-approve direct adds
      role: "AJK", // Standardized from 'Crew' to match Model Enum
      joined_at: new Date(),
    });

    await newMember.save();

    // 5. Grant Organizer Access (Same as updateMemberStatus logic)
    await User.findByIdAndUpdate(user._id, {
      is_organizer_approved: true,
      $addToSet: { roles: "organizer" },
    });

    res
      .status(201)
      .json({ message: "Member added successfully", member: newMember, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Get communities where user is owner or approved member
 * @route   GET /api/communities/my-communities
 * @access  Private
 */
exports.getMyCommunities = async (req, res) => {
  try {
    // Safety check for user roles
    const roles = req.user.roles || [];

    // If Admin, return all communities
    if (roles.includes("admin")) {
      const allCommunities = await Community.find();
      return res.status(200).json(allCommunities);
    }

    // 1. Communities owned by user
    const owned = await Community.find({ owner_id: req.user.id });

    // 2. Communities where user is an approved member (AJK, President, etc.)
    const memberships = await CommunityMember.find({
      user_id: req.user.id,
      status: "Approved",
    }).populate("community_id");

    // Extract communities from memberships and filter out any nulls
    const memberOf = memberships
      .map((m) => m.community_id)
      .filter((c) => c !== null);

    // Combine and remove duplicates based on _id
    const combined = [...owned];
    memberOf.forEach((comm) => {
      if (!combined.some((c) => c._id.toString() === comm._id.toString())) {
        combined.push(comm);
      }
    });

    res.status(200).json(combined);
  } catch (err) {
    console.error("Get My Communities Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
