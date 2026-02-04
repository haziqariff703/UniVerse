const EventCrew = require('../models/eventCrew');
const User = require('../models/user');
const Event = require('../models/event');
const CommunityMember = require('../models/communityMember');

/**
 * @desc    Get all crew/talent for an event
 * @route   GET /api/crew/:eventId
 * @access  Public (or Protected based on needs)
 */
exports.getCrewByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { type } = req.query;
    let filter = { event_id: eventId };
    if (type) filter.type = type;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Authorization
    const isAdmin = (req.user.roles || []).includes('admin');
    const isOwner = event.organizer_id.toString() === req.user.id;
    
    let isLeader = false;
    if (event.community_id) {
        const membership = await CommunityMember.findOne({
            community_id: event.community_id,
            user_id: req.user.id,
            status: 'Approved'
        });
        if (membership && ['President', 'Vice President', 'High Committee'].includes(membership.role)) {
            isLeader = true;
        }
    }

    const crewAssignment = await EventCrew.findOne({ event_id: eventId, user_id: req.user.id, status: 'accepted' });
    const isCrew = !!crewAssignment;

    if (!isAdmin && !isOwner && !isLeader && !isCrew) {
        return res.status(403).json({ message: "Not authorized to view crew for this event" });
    }

    const crew = await EventCrew.find(filter)
      .populate('user_id', 'name email student_id')
      .sort({ created_at: -1 });

    res.status(200).json(crew);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

/**
 * @desc    Update crew member role/department
 * @route   PUT /api/crew/:id
 * @access  Private (Organizer/Admin)
 */
exports.updateCrewMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, department } = req.body;

    const member = await EventCrew.findById(id);
    if (!member) {
      return res.status(404).json({ message: "Crew member not found" });
    }

    const event = await Event.findById(member.event_id);
    if (!event) return res.status(404).json({ message: "Associated event not found" });

    // Authorization
    const isAdmin = (req.user.roles || []).includes('admin');
    const isOwner = event.organizer_id.toString() === req.user.id;
    
    let isLeader = false;
    if (event.community_id) {
        const membership = await CommunityMember.findOne({
            community_id: event.community_id,
            user_id: req.user.id,
            status: 'Approved'
        });
        if (membership && ['President', 'Vice President', 'High Committee'].includes(membership.role)) {
            isLeader = true;
        }
    }

    if (!isAdmin && !isOwner && !isLeader) {
        return res.status(403).json({ message: "Not authorized to update crew" });
    }

    member.role = role;
    member.department = department;
    await member.save();
    
    await member.populate('user_id', 'name email');

    res.status(200).json(member);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

/**
 * @desc    Get eligible members for assignment (Approved community members not yet in crew)
 * @route   GET /api/crew/eligible/:eventId
 * @access  Private (Organizer/Admin)
 */
exports.getEligibleMembers = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Authorization
    const isAdmin = (req.user.roles || []).includes('admin');
    const isOwner = event.organizer_id.toString() === req.user.id;
    
    let isLeader = false;
    if (event.community_id) {
        const membership = await CommunityMember.findOne({
            community_id: event.community_id,
            user_id: req.user.id,
            status: 'Approved'
        });
        if (membership && ['President', 'Vice President', 'High Committee'].includes(membership.role)) {
            isLeader = true;
        }
    }

    if (!isAdmin && !isOwner && !isLeader) {
        return res.status(403).json({ message: "Not authorized to view eligible members" });
    }

    if (!event.community_id) {
       return res.status(200).json([]); // No community, no eligible members from membership
    }

    // Find all approved community members
    const approvedMembers = await CommunityMember.find({
      community_id: event.community_id,
      status: 'Approved'
    }).populate('user_id', 'name email student_id');

    // Find already assigned crew for this event
    const assignedCrew = await EventCrew.find({ event_id: eventId }).select('user_id');
    const assignedUserIds = assignedCrew.map(c => c.user_id?.toString());

    // Filter out members who are already in the crew
    const eligibleMembers = approvedMembers.filter(m => 
      m.user_id && !assignedUserIds.includes(m.user_id._id.toString())
    );

    res.status(200).json(eligibleMembers);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

/**
 * @desc    Add a member to the workforce (Invite/Assign)
 * @route   POST /api/crew
 * @access  Private (Organizer/Admin)
 */
exports.addCrewMember = async (req, res) => {
  try {
    const { event_id, user_id, temp_name, role, type, department } = req.body;

    const event = await Event.findById(event_id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Authorization
    const isAdmin = (req.user.roles || []).includes('admin');
    const isOwner = event.organizer_id.toString() === req.user.id;
    
    let isLeader = false;
    if (event.community_id) {
        const membership = await CommunityMember.findOne({
            community_id: event.community_id,
            user_id: req.user.id,
            status: 'Approved'
        });
        if (membership && ['President', 'Vice President', 'High Committee'].includes(membership.role)) {
            isLeader = true;
        }
    }

    if (!isAdmin && !isOwner && !isLeader) {
        return res.status(403).json({ message: "Not authorized to add crew" });
    }

      // Check if user is an approved member of the event's community
      if (event.community_id) {
        const isMember = await CommunityMember.findOne({
          community_id: event.community_id,
          user_id: user_id,
          status: 'Approved'
        });

        if (!isMember) {
          return res.status(403).json({ 
            message: "User must be an approved community member to be assigned as event crew." 
          });
        }
      }

      // Check if user is already assigned to this event
      const existing = await EventCrew.findOne({ event_id, user_id });
      if (existing) {
        return res.status(400).json({ message: "User already assigned to this event." });
      }

    const newCrew = new EventCrew({
      event_id,
      user_id,
      temp_name,
      role,
      type,
      department,
      status: 'accepted' // Auto-accept for manual adds for now
    });

    const savedCrew = await newCrew.save();
    
    // If populating user needed immediately
    if (user_id) {
        await savedCrew.populate('user_id', 'name email');
    }

    res.status(201).json({
      message: `${type === 'talent' ? 'Speaker' : 'Crew member'} added successfully`,
      member: savedCrew
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

/**
 * @desc    Remove a member
 * @route   DELETE /api/crew/:id
 * @access  Private
 */
exports.removeCrewMember = async (req, res) => {
  try {
    const member = await EventCrew.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Crew member not found" });
    }

    const event = await Event.findById(member.event_id);
    if (!event) return res.status(404).json({ message: "Associated event not found" });

    // Authorization
    const isAdmin = (req.user.roles || []).includes('admin');
    const isOwner = event.organizer_id.toString() === req.user.id;
    
    let isLeader = false;
    if (event.community_id) {
        const membership = await CommunityMember.findOne({
            community_id: event.community_id,
            user_id: req.user.id,
            status: 'Approved'
        });
        if (membership && ['President', 'Vice President', 'High Committee'].includes(membership.role)) {
            isLeader = true;
        }
    }

    if (!isAdmin && !isOwner && !isLeader) {
        return res.status(403).json({ message: "Not authorized to remove crew" });
    }

    await EventCrew.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Member removed" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
