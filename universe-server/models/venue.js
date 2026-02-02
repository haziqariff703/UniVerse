const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location_code: { type: String, required: true }, // e.g., "A-101"
  max_capacity: { type: Number, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['Academic', 'Residential', 'Social', 'Outdoor', 'Other'],
    default: 'Other'
  },
  description: { type: String },
  facilities: [String],
  bestFor: [String],
  image: { type: String }, // Primary image
  images: [String], // Array of gallery image URLs
  glowColor: { type: String, default: 'purple' },
  occupancyStatus: { 
    type: String, 
    enum: ['Available', 'Busy', 'Moderate', 'Closed'],
    default: 'Available'
  },
  liveOccupancy: { type: Number, default: 0 },
  nextAvailable: { type: String, default: 'Now' },
  // Essential Info fields
  accessHours: { type: String, default: '08:00 - 22:00' },
  accessLevel: { type: String, default: 'Student ID' },
  managedBy: { type: String, default: 'HEP Office' }
}, { timestamps: true });

module.exports = mongoose.model('Venue', venueSchema);