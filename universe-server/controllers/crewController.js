const EventCrew = require('../models/eventCrew');
const User = require('../models/user');

/**
 * @desc    Get all crew/talent for an event
 * @route   GET /api/crew/:eventId
 * @access  Public (or Protected based on needs)
 */
exports.getCrewByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { type } = req.query; // optional filter: 'talent' or 'crew'

    let filter = { event_id: eventId };
    if (type) filter.type = type;

    const crew = await EventCrew.find(filter)
      .populate('user_id', 'name email student_id') // Populate user details
      .sort({ created_at: -1 });

    res.status(200).json(crew);
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

    // Check if user is already assigned to this event
    if (user_id) {
        const existing = await EventCrew.findOne({ event_id, user_id });
        if (existing) {
            return res.status(400).json({ message: "User already assigned to this event." });
        }
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
      // Check auth logic here if strict ownership needed
    await EventCrew.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Member removed" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
