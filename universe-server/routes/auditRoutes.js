const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');
const { auth, authorize } = require('../middleware/auth');

// Admin route for all audit logs
router.get('/', auth, authorize('admin'), auditController.getAuditLogs);

// Organizer route for their activity logs
router.get('/organizer', auth, authorize('admin', 'organizer'), auditController.getOrganizerActivityLogs);

module.exports = router;
