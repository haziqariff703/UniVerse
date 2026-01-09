const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  // Relationships
  organizer_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
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
  status: { 
    type: String, 
    enum: ['Open', 'SoldOut', 'Cancelled'], 
    default: 'Open' 
  },
  tags: [String]
});

module.exports = mongoose.model('Event', eventSchema);