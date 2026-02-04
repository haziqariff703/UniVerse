const mongoose = require('mongoose');

const speakerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, default: "Guest Speaker" }, // e.g., "Astrophysicist"
  expertise: { type: String }, // e.g., "Astrophysics"
  category: { type: String, enum: ["Science", "Tech", "Arts", "Leadership", "Other"], default: "Other" },
  bio: { type: String }, // Short bio for cards
  about: { type: String }, // Long bio for details page
  image: { type: String }, // URL
  social_links: {
    linkedin: String,
    twitter: String,
    website: String
  },
  stats: {
    talks: { type: Number, default: 0 },
    merit: { type: Number, default: 0 },
    rating: { type: Number, default: 0.0 }
  },
  achievements: [String],
  past_events: [{
    year: String,
    title: String
  }],
  upcoming: { type: String }, // Title of upcoming event
  status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' }, // Default to pending for proposals
  proposal_url: { type: String },
  requested_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Speaker', speakerSchema);