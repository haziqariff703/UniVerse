const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: {
    type: String,
    required: true
  },
  message: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['info', 'alert', 'success'],
    default: 'info' 
  },
  read: { 
    type: Boolean, 
    default: false 
  },
  related_event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    default: null
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Notification', notificationSchema);
