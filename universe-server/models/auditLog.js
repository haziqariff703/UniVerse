const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      // Admin actions
      'APPROVE_EVENT', 
      'REJECT_EVENT', 
      'DELETE_EVENT',
      'APPROVE_ORGANIZER', 
      'REJECT_ORGANIZER',
      'CREATE_VENUE',
      'UPDATE_VENUE', 
      'DELETE_VENUE',
      'DELETE_USER',
      'UPDATE_USER_ROLE',
      // Organizer actions
      'CREATE_EVENT',
      'UPDATE_EVENT',
      'CHECKIN_ATTENDEE',
      'CANCEL_REGISTRATION',
      'UPDATE_REGISTRATION'
    ]
  },
  target_type: {
    type: String,
    required: true,
    enum: ['Event', 'User', 'Venue', 'Registration']
  },
  target_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'target_type'
  },
  details: {
    type: Object, // Store snapshot or specific details
    default: {}
  },
  ip_address: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);