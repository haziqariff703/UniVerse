const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g., "DELETE_EVENT"
  performed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  target_document_id: { type: mongoose.Schema.Types.ObjectId }, // The ID of the item changed
  ip_address: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);