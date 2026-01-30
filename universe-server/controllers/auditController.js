const AuditLog = require('../models/auditLog');

/**
 * Get Audit Logs
 * @route GET /api/admin/audit-logs
 * @access Admin only
 */
exports.getAuditLogs = async (req, res) => {
  try {
    const { action, admin, target_type, search, limit = 20, page = 1 } = req.query;
    
    const query = {};
    if (action) query.action = action;
    if (admin) query.admin_id = admin;
    if (target_type) query.target_type = target_type;
    if (search) {
      // Basic search on target_id or details (if possible with string regex)
      query.$or = [
        { target_id: mongoose.isValidObjectId(search) ? search : undefined },
        { 'details.name': { $regex: search, $options: 'i' } }
      ].filter(o => o.target_id !== undefined || o['details.name']);
    }

    const logs = await AuditLog.find(query)
      .populate('admin_id', 'name email')
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await AuditLog.countDocuments(query);

    // Calculate Summary Stats for KPI Cards (based on ALL logs, or filtered?)
    // Usually, KPIs show global context or search context. Let's do global for overview.
    const stats = {
      totalLogs: await AuditLog.countDocuments(),
      securityActions: await AuditLog.countDocuments({ 
        action: { $regex: /REJECT|DELETE/, $options: 'i' } 
      }),
      eventActions: await AuditLog.countDocuments({ target_type: 'Event' }),
      venueActions: await AuditLog.countDocuments({ target_type: 'Venue' })
    };

    res.json({
      logs,
      stats,
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
