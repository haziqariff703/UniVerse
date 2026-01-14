const User = require('../models/user');
const Event = require('../models/event');
const Registration = require('../models/registration');

/**
 * Admin Controller
 * Handles all admin-specific operations with role-based access control.
 */

/**
 * Get Dashboard Statistics
 * @route GET /api/admin/stats
 * @access Admin only
 */
exports.getDashboardStats = async (req, res) => {
  try {
    // Aggregate counts
    const [totalUsers, totalEvents, totalBookings, activeEvents] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments(),
      Registration.countDocuments(),
      Event.countDocuments({ date_time: { $gte: new Date() } })
    ]);

    // Get recent activity (last 10 registrations)
    const recentActivity = await Registration.find()
      .sort({ booking_time: -1 })
      .limit(10)
      .populate('user_id', 'name student_id')
      .populate('event_id', 'title');

    res.json({
      stats: {
        totalUsers,
        totalEvents,
        totalBookings,
        activeEvents,
        // Revenue placeholder - implement when payment model exists
        revenue: 0
      },
      recentActivity: recentActivity.map(reg => ({
        id: reg._id,
        user: reg.user_id?.name || reg.user_snapshot?.name || 'Unknown',
        action: 'Registered for',
        target: reg.event_id?.title || reg.event_snapshot?.title || 'Unknown Event',
        time: reg.booking_time
      }))
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
};

/**
 * Get All Users
 * @route GET /api/admin/users
 * @access Admin only
 */
exports.getAllUsers = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;
    
    // Build query
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { student_id: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

/**
 * Update User Role
 * @route PUT /api/admin/users/:id/role
 * @access Admin only
 */
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['student', 'staff', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User role updated successfully', user });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ message: 'Failed to update user role' });
  }
};

/**
 * Delete User
 * @route DELETE /api/admin/users/:id
 * @access Admin only
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent self-deletion
    if (id === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Also delete user's registrations
    await Registration.deleteMany({ user_id: id });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

/**
 * Get All Events (Admin view with extra details)
 * @route GET /api/admin/events
 * @access Admin only
 */
exports.getAllEvents = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const events = await Event.find(query)
      .sort({ date_time: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Get registration counts for each event
    const eventsWithStats = await Promise.all(
      events.map(async (event) => {
        const registrationCount = await Registration.countDocuments({ event_id: event._id });
        return {
          ...event.toObject(),
          registrationCount
        };
      })
    );

    const total = await Event.countDocuments(query);

    res.json({
      events: eventsWithStats,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalEvents: total
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
};
