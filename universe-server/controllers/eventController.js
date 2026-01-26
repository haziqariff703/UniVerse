const Event = require('../models/event');
const Speaker = require('../models/speaker'); // Required for populate

/**
 * @desc    Get all events (with optional filters)
 * @route   GET /api/events
 * @access  Public
 */
exports.getAllEvents = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    
    // Build filter object
    let filter = {};
    if (category) filter.tags = { $in: [category] };
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const events = await Event.find(filter)
      .populate('organizer_id', 'name email')
      .populate('venue_id', 'name location_code')
      .populate('speaker_ids', 'name expertise')
      .sort({ date_time: 1 }); // Sort by upcoming first

    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

/**
 * @desc    Get all events created by the logged-in user
 * @route   GET /api/events/my-events
 * @access  Private (Organizer/Admin)
 */
exports.getMyEvents = async (req, res) => {
  try {
    console.log("Fetching events for organizer:", req.user.id);
    const events = await Event.find({ organizer_id: req.user.id })
      .populate('venue_id', 'name location_code')
      .sort({ date_time: -1 }); // Newest first

    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};


/**
 * @desc    Get single event by ID
 * @route   GET /api/events/:id
 * @access  Public
 */
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer_id', 'name email')
      .populate('venue_id', 'name location_code max_capacity facilities')
      .populate('speaker_ids', 'name expertise bio');

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

/**
 * @desc    Create a new event
 * @route   POST /api/events
 * @access  Private (Admin/Organizer)
 */
exports.createEvent = async (req, res) => {
  try {
    // Set organizer_id from authenticated user
    const eventData = {
      ...req.body,
      organizer_id: req.user.id
    };

    console.log("Creating event for user:", req.user.id);
    console.log("Event Data:", eventData);

    const newEvent = new Event(eventData);
    const savedEvent = await newEvent.save();
    
    res.status(201).json({
      message: "Event created successfully!",
      event: savedEvent
    });
  } catch (err) {
    res.status(400).json({ message: "Validation Error", error: err.message });
  }
};

/**
 * @desc    Update an event
 * @route   PUT /api/events/:id
 * @access  Private (Admin/Organizer)
 */
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    // Check if user is organizer or admin
    if (event.organizer_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized to update this event." });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Event updated successfully!",
      event: updatedEvent
    });
  } catch (err) {
    res.status(400).json({ message: "Update Error", error: err.message });
  }
};

/**
 * @desc    Delete an event
 * @route   DELETE /api/events/:id
 * @access  Private (Admin only)
 */
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    await Event.findByIdAndDelete(req.params.id);

    // TODO: Log to AuditLog collection

    res.status(200).json({ message: "Event deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Delete Error", error: err.message });
  }
};