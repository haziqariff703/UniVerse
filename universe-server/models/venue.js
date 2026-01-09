const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location_code: { type: String, required: true }, // e.g., "A-101"
  max_capacity: { type: Number, required: true },
  facilities: [String], // Array of strings e.g., ["Projector", "AC"]
  images: [String] // Array of image URLs
});

module.exports = mongoose.model('Venue', venueSchema);