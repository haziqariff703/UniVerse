const AuditLog = require('../models/auditLog');

/**
 * Get Audit Logs
 * @route GET /api/admin/audit-logs
 * @access Admin only
 */
exports.getAuditLogs = async (req, res) => {
  try {
    const { action, admin, limit = 20, page = 1 } = req.query;
    
    const query = {};
    if (action) query.action = action;
    if (admin) query.admin_id = admin;

    const logs = await AuditLog.find(query)
      .populate('admin_id', 'name email')
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await AuditLog.countDocuments(query);

    res.json({
      logs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalLogs: total
      }
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ message: 'Failed to fetch audit logs' });
  }
};
