const AuditLog = require('../models/auditLog');
const Event = require('../models/event');
const Registration = require('../models/registration');
const mongoose = require('mongoose');

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

/**
 * Get Organizer Activity Logs
 * @route GET /api/organizer/activity-logs
 * @access Organizer only
 */
exports.getOrganizerActivityLogs = async (req, res) => {
  try {
    const organizerId = req.user.id;
    const { eventId, search, limit = 20, page = 1, dateRange } = req.query;

    const { getAccessibleEventIds } = require('../utils/accessControl');
    const eventIds = await getAccessibleEventIds(organizerId);

    // If filtering by specific event, ensure it's within accessible ones
    let finalEventIds = eventIds;
    if (eventId && mongoose.isValidObjectId(eventId)) {
      if (eventIds.some(id => id.toString() === eventId)) {
        finalEventIds = [new mongoose.Types.ObjectId(eventId)];
      } else {
        // Not authorized for this specific event
        return res.json({
          logs: [],
          stats: { totalLogs: 0, eventActions: 0, registrations: 0, updates: 0 },
          pagination: { currentPage: 1, totalPages: 0, totalLogs: 0 }
        });
      }
    }

    const organizerEvents = await Event.find({ _id: { $in: finalEventIds } }).select('_id title');

    if (eventIds.length === 0) {
      return res.json({
        logs: [],
        stats: { totalLogs: 0, eventActions: 0, registrations: 0, updates: 0 },
        pagination: { currentPage: 1, totalPages: 0, totalLogs: 0 }
      });
    }

    // Build date filter
    let dateFilter = {};
    if (dateRange === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dateFilter = { $gte: today };
    } else if (dateRange === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = { $gte: weekAgo };
    } else if (dateRange === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter = { $gte: monthAgo };
    }

    // Get audit logs for these events
    const auditQuery = {
      target_type: 'Event',
      target_id: { $in: finalEventIds }
    };
    if (Object.keys(dateFilter).length > 0) {
      auditQuery.created_at = dateFilter;
    }
    if (search) {
      auditQuery.$or = [
        { action: { $regex: search, $options: 'i' } },
        { 'details.title': { $regex: search, $options: 'i' } }
      ];
    }

    const auditLogs = await AuditLog.find(auditQuery)
      .populate('admin_id', 'name email')
      .sort({ created_at: -1 });

    // Get registrations for these events
    const regQuery = { event_id: { $in: finalEventIds } };
    if (Object.keys(dateFilter).length > 0) {
      regQuery.booking_time = dateFilter;
    }
    
    const registrations = await Registration.find(regQuery)
      .populate('user_id', 'name email')
      .populate('event_id', 'title')
      .sort({ booking_time: -1 });

    // Map to unified format
    const auditLogsFormatted = auditLogs.map(log => {
      const event = organizerEvents.find(e => e._id.toString() === log.target_id.toString());
      return {
        id: log._id,
        date: log.created_at,
        user: {
          name: log.admin_id?.name || 'System',
          email: log.admin_id?.email || 'system@universe.com',
          initial: log.admin_id?.name?.substring(0, 2).toUpperCase() || 'SYS'
        },
        action: getActionType(log.action),
        title: formatAuditTitle(log.action, event?.title, log.details),
        status: getAuditStatus(log.action),
        type: 'audit',
        eventId: log.target_id
      };
    });

    const registrationsFormatted = registrations.map(reg => ({
      id: reg._id,
      date: reg.booking_time,
      user: {
        name: reg.user_id?.name || 'Unknown',
        email: reg.user_id?.email || 'unknown@universe.com',
        initial: reg.user_id?.name?.substring(0, 2).toUpperCase() || 'UN'
      },
      action: reg.status === 'CheckedIn' ? 'Check-in' : 'Registration',
      title: `${reg.status === 'CheckedIn' ? 'Checked in to' : 'Registered for'} "${reg.event_id?.title || 'Event'}"`,
      status: reg.status === 'CheckedIn' ? 'completed' : reg.status === 'Cancelled' ? 'critical' : 'completed',
      type: 'registration',
      eventId: reg.event_id?._id
    }));

    // Combine and sort by date
    let allLogs = [...auditLogsFormatted, ...registrationsFormatted]
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      allLogs = allLogs.filter(log => 
        log.user.name.toLowerCase().includes(searchLower) ||
        log.user.email.toLowerCase().includes(searchLower) ||
        log.title.toLowerCase().includes(searchLower) ||
        log.action.toLowerCase().includes(searchLower)
      );
    }

    // Filter by action type (CRUD filter)
    const { action } = req.query;
    if (action && action !== 'all') {
      allLogs = allLogs.filter(log => log.action === action);
    }

    const totalLogs = allLogs.length;
    const paginatedLogs = allLogs.slice((page - 1) * limit, page * limit);

    // Calculate stats
    const stats = {
      totalLogs,
      eventActions: auditLogsFormatted.length,
      registrations: registrationsFormatted.filter(r => r.action === 'Registration').length,
      updates: auditLogsFormatted.filter(l => l.action === 'Update').length,
      checkIns: registrationsFormatted.filter(r => r.action === 'Check-in').length,
      critical: allLogs.filter(l => l.status === 'critical').length
    };

    res.json({
      logs: paginatedLogs,
      stats,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalLogs / limit),
        totalLogs
      }
    });
  } catch (error) {
    console.error('Get organizer activity logs error:', error);
    res.status(500).json({ message: 'Failed to fetch activity logs' });
  }
};

// Helper functions
function getActionType(action) {
  if (action.includes('CREATE')) return 'Create';
  if (action.includes('UPDATE')) return 'Update';
  if (action.includes('DELETE')) return 'Delete';
  if (action.includes('APPROVE')) return 'Approval';
  if (action.includes('REJECT')) return 'Reject';
  if (action.includes('CHECKIN')) return 'Check-in';
  return 'Action';
}

function formatAuditTitle(action, eventTitle, details) {
  const event = eventTitle || details?.title || 'Event';
  switch (action) {
    case 'CREATE_EVENT': return `Created event "${event}"`;
    case 'UPDATE_EVENT': return `Updated event details for "${event}"`;
    case 'APPROVE_EVENT': return `Event "${event}" was approved`;
    case 'REJECT_EVENT': return `Event "${event}" was rejected`;
    case 'DELETE_EVENT': return `Event "${event}" was deleted`;
    case 'CHECKIN_ATTENDEE': return `Checked in attendee for "${event}"`;
    default: return `${getActionType(action)} action on "${event}"`;
  }
}

function getAuditStatus(action) {
  if (action.includes('REJECT') || action.includes('DELETE')) return 'critical';
  if (action.includes('APPROVE') || action.includes('CREATE')) return 'completed';
  return 'completed';
}
