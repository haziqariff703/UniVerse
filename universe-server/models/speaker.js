const mongoose = require('mongoose');

const speakerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  expertise: { type: String }, // e.g., "AI & Robotics"
  bio: { type: String },
  social_links: {
    linkedin: String,
    twitter: String
  }
});

module.exports = mongoose.model('Speaker', speakerSchema);