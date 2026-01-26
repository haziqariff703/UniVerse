const Registration = require('../models/registration');
const Event = require('../models/event');
const User = require('../models/user');

/**
 * @desc    Register for an event
 * @route   POST /api/registrations
 * @access  Private
 */
exports.registerForEvent = async (req, res) => {
  try {
    const { event_id } = req.body;
    const user_id = req.user.id;

    // Check if event exists
    const event = await Event.findById(event_id).populate('venue_id', 'name');
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    // Check if event is open
    if (event.status !== 'Open') {
      return res.status(400).json({ message: `Event is ${event.status}. Registration not available.` });
    }

    // Check capacity
    if (event.current_attendees >= event.capacity) {
      return res.status(400).json({ message: "Event is full. Consider joining the waitlist." });
    }

    // Check if user already registered
    const existingRegistration = await Registration.findOne({ event_id, user_id });
    if (existingRegistration) {
      return res.status(400).json({ message: "You are already registered for this event." });
    }

    // Get user data for snapshot
    const user = await User.findById(user_id).select('name student_id email');

    // Create registration with snapshots (NoSQL denormalization pattern)
    const registration = new Registration({
      event_id,
      user_id,
      status: 'Confirmed',
      booking_time: new Date(),
      qr_code_string: `UNIV-${event_id.slice(-4)}-${user_id.slice(-4)}-${Date.now()}`,
      event_snapshot: {
        title: event.title,
        date_time: event.date_time,
        venue: event.venue_id?.name || 'TBA'
      },
      user_snapshot: {
        name: user.name,
        student_id: user.student_id
      }
    });

    await registration.save();

    // Update event attendee count atomically
    await Event.findByIdAndUpdate(event_id, { $inc: { current_attendees: 1 } });

    // Update event status if full
    if (event.current_attendees + 1 >= event.capacity) {
      await Event.findByIdAndUpdate(event_id, { status: 'SoldOut' });
    }

    res.status(201).json({
      message: "Successfully registered for event!",
      registration: {
        id: registration._id,
        qr_code: registration.qr_code_string,
        status: registration.status,
        event: registration.event_snapshot
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: "Server error during registration.", error: error.message });
  }
};

/**
 * @desc    Get all registrations for a specific event (Organizer View)
 * @route   GET /api/registrations/event/:id
 * @access  Private (Organizer/Admin)
 */
exports.getEventRegistrations = async (req, res) => {
  try {
    const event_id = req.params.id;
    
    // Verify ownership
    const event = await Event.findById(event_id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    if (event.organizer_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized to view these registrations." });
    }

    const registrations = await Registration.find({ event_id })
      .sort({ booking_time: -1 });

    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

/**
 * @desc    Get user's registrations (my bookings)
 * @route   GET /api/registrations/my-bookings
 * @access  Private
 */
exports.getMyBookings = async (req, res) => {
  try {
    const registrations = await Registration.find({ user_id: req.user.id })
      .populate('event_id', 'title date_time status')
      .sort({ booking_time: -1 });

    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

/**
 * @desc    Cancel a registration
 * @route   DELETE /api/registrations/:id
 * @access  Private
 */
exports.cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ message: "Registration not found." });
    }

    // Check ownership
    if (registration.user_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized to cancel this registration." });
    }

    // Update registration status
    registration.status = 'Cancelled';
    await registration.save();

    // Decrement attendee count
    await Event.findByIdAndUpdate(registration.event_id, { $inc: { current_attendees: -1 } });

    // If event was SoldOut, reopen it
    const event = await Event.findById(registration.event_id);
    if (event && event.status === 'SoldOut' && event.current_attendees < event.capacity) {
      event.status = 'Open';
      await event.save();
    }

    res.status(200).json({ message: "Registration cancelled successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

/**
 * @desc    Check-in at event (QR Code scan)
 * @route   POST /api/registrations/checkin
 * @access  Private (Staff/Admin)
 */
exports.checkIn = async (req, res) => {
  try {
    const { qr_code } = req.body;

    const registration = await Registration.findOne({ qr_code_string: qr_code });

    if (!registration) {
      return res.status(404).json({ message: "Invalid QR code." });
    }

    if (registration.status === 'CheckedIn') {
      return res.status(400).json({ message: "Already checked in." });
    }

    if (registration.status === 'Cancelled') {
      return res.status(400).json({ message: "This registration was cancelled." });
    }

    registration.status = 'CheckedIn';
    await registration.save();

    res.status(200).json({
      message: "Check-in successful!",
      user: registration.user_snapshot
    });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
