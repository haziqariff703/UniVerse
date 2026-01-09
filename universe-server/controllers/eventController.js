const Event = require('../models/event');

// Get all events (CRUD: Read)
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Create a new event (CRUD: Create)
exports.createEvent = async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(400).json({ message: "Validation Error", error: err.message });
  }
};