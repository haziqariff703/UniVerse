const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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
  
  // Review Details
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  // Detailed Atmos Metrics
  value: { type: Number, min: 1, max: 10, default: 5 },   // Merit/Career Value
  energy: { type: Number, min: 1, max: 10, default: 5 },  // Vibe/Hype
  welfare: { type: Number, min: 1, max: 10, default: 5 }, // Food/Facilities
  
  comment: { 
    type: String 
  },
  photos: [String],
  created_at: { 
    type: Date, 
    default: Date.now 
  }
});

// Compound index to prevent duplicate reviews (one review per user per event)
reviewSchema.index({ event_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
