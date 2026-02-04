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
      'CREATE_USER_MANUAL',
      'CREATE_CATEGORY',
      'UPDATE_CATEGORY',
      'DELETE_CATEGORY',
      'DELETE_REVIEW',
      'CREATE_COMMUNITY_MANUAL',
      'BROADCAST_NOTIFICATION',
      // Speaker actions
      'CREATE_SPEAKER',
      'UPDATE_SPEAKER',
      'DELETE_SPEAKER',
      'VERIFY_SPEAKER',
      'REJECT_SPEAKER_PROPOSAL',
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
    enum: ['Event', 'User', 'Venue', 'Registration', 'Category', 'Review', 'Community', 'System', 'Speaker']
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