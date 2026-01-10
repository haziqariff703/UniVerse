const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  // Relationships
  event_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event', 
    required: true 
  },
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Registration Details
  status: { 
    type: String, 
    enum: ['Confirmed', 'Waitlist', 'CheckedIn', 'Cancelled'], 
    default: 'Confirmed' 
  },
  booking_time: { 
    type: Date, 
    default: Date.now 
  },
  qr_code_string: { 
    type: String 
  },
  
  // Denormalized Snapshots (NoSQL Pattern for read performance)
  event_snapshot: {
    title: String,
    venue: String,
    date_time: Date
  },
  user_snapshot: {
    name: String,
    student_id: String
  }
});

// Compound index to prevent duplicate registrations
registrationSchema.index({ event_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);