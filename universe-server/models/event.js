const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  // Relationships
  organizer_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  community_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community'
  },
  venue_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Venue' 
  },
  speaker_ids: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Speaker' 
  }],
  
  // Event Details
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  location: {
    type: String
  },
  date_time: { 
    type: Date, 
    required: true 
  },
  duration_minutes: { 
    type: Number, 
    default: 60 
  },
  capacity: { 
    type: Number, 
    required: true 
  },
  current_attendees: { 
    type: Number, 
    default: 0 
  },
  ticket_price: {
    type: Number,
    default: 0
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'Open', 'SoldOut', 'Cancelled'], 
    default: 'pending' 
  },
  tags: [String],
  image: {
    type: String
  },
  proposal: {
    type: String
  },
  rejection_reason: {
    type: String
  },

  // Public Display & Filtering
  category: {
    type: String,
    enum: ['Academic', 'Creative', 'Lifestyle', 'Community', 'Leadership'],
    default: 'Academic'
  },
  is_featured: {
    type: Boolean,
    default: false
  },
  merit_points: {
    type: Number,
    default: 0
  },

  // Targeting / Eligibility
  target_audience: {
    type: String,
    enum: ['All Students', 'FPM Students', 'FiTA Students', 'FSKM Students', 'College Jasmine', 'Final Year Students'],
    default: 'All Students'
  },

  // Interactive Management
  schedule: [{
    time: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    speaker_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Speaker' }
  }],
  tasks: [{
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    dueDate: { type: Date }
  }]
});

module.exports = mongoose.model('Event', eventSchema);