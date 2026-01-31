const mongoose = require('mongoose');

const speakerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  expertise: { type: String }, // e.g., "AI & Robotics"
  bio: { type: String },
  social_links: {
    linkedin: String,
    twitter: String
  },
  status: { type: String, enum: ['pending', 'verified'], default: 'verified' },
  proposal_url: { type: String },
  requested_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Speaker', speakerSchema);