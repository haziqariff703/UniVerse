const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date_time: { type: Date, required: true },
  venue_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' }, // Link to Venues
  capacity: { type: Number, required: true },
  current_attendees: { type: Number, default: 0 },
  status: { type: String, enum: ['Open', 'Full', 'Cancelled'], default: 'Open' },
  tags: [String] // For searching/filtering
});

module.exports = mongoose.model('Event', eventSchema);