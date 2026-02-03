const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  tagline: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    default: ''
  },
  banner: {
    type: String,
    default: ''
  },
  advisor: {
    name: { type: String, required: true },
    title: { type: String, default: 'Club Advisor' },
    email: { type: String }
  },
  social_links: {
    instagram: String,
    facebook: String,
    website: String,
    twitter: String
  },
  stats: {
    member_count: { type: Number, default: 0 },
    event_count: { type: Number, default: 0 },
    founded_year: { type: Number }
  },
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // The student/user who manages this club
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Community', communitySchema);
