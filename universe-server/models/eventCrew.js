const mongoose = require('mongoose');

const eventCrewSchema = new mongoose.Schema({
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Can be null if inviting by email/name before they join, but for now let's assume valid users
  },
  // If inviting a non-user, we might store name/email temporarily
  temp_name: String,
  temp_email: String,

  role: {
    type: String,
    required: true, // e.g., "Main Speaker", "Head of Logistics" 
  },
  type: {
    type: String,
    enum: ['talent', 'crew'], // Talent = Speaker/VIP, Crew = AJK/Volunteer
    required: true
  },
  department: {
    type: String, // e.g., "Protocol", "Technical", "Stage"
    default: 'General'
  },
  status: {
    type: String,
    enum: ['invited', 'accepted', 'rejected', 'applied'],
    default: 'invited'
  },
  joined_at: {
    type: Date
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure a user has only one role per event (or allow multiple? let's restrict for now)
// eventCrewSchema.index({ event_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model('EventCrew', eventCrewSchema);
