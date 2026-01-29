const User = require('../models/user');
const Event = require('../models/event');
const Registration = require('../models/registration');
const Venue = require('../models/venue');
const AuditLog = require('../models/auditLog');

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
    const [totalUsers, totalEvents, totalBookings, activeEvents, pendingEvents, pendingOrganizers] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments(),
      Registration.countDocuments(),
      Event.countDocuments({ date_time: { $gte: new Date() }, status: 'approved' }),
      Event.countDocuments({ status: 'pending' }),
      User.countDocuments({ role: 'student', organizerRequest: true })
    ]);

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
        pendingEvents,
        pendingOrganizers,
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
 */
exports.getAllUsers = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;
    
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
 */
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['student', 'organizer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role, organizerRequest: false },
      { new: true }
    ).select('-password');

    if (user) {
      await AuditLog.create({
        admin_id: req.user.id,
        action: 'UPDATE_USER_ROLE',
        target_type: 'User',
        target_id: user._id,
        details: { role },
        ip_address: req.ip
      });
    }

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
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(id);

    if (user) {
      await AuditLog.create({
        admin_id: req.user.id,
        action: 'DELETE_USER',
        target_type: 'User',
        target_id: id,
        details: { email: user.email },
        ip_address: req.ip
      });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await Registration.deleteMany({ user_id: id });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

/**
 * Get All Events
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
      .populate('organizer_id', 'name email')
      .populate('venue_id', 'name location_code')
      .sort({ date_time: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

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

    // KPI Stats (Global)
    const [totalEvents, approvedCount, rejectedCount, pendingCount, totalRegistrations] = await Promise.all([
      Event.countDocuments(),
      Event.countDocuments({ status: 'approved' }),
      Event.countDocuments({ status: 'rejected' }),
      Event.countDocuments({ status: 'pending' }),
      Registration.countDocuments()
    ]);

    res.json({
      events: eventsWithStats,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalEvents: total
      },
      stats: {
        total: totalEvents,
        approved: approvedCount,
        rejected: rejectedCount,
        pending: pendingCount,
        registrations: totalRegistrations
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
};

// ==================== EVENT APPROVAL ====================

/**
 * Get Pending Events
 * @route GET /api/admin/events/pending
 */
exports.getPendingEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: 'pending' })
      .populate('organizer_id', 'name email')
      .populate('venue_id', 'name location_code max_capacity')
      .sort({ created_at: -1 });

    res.json({ events });
  } catch (error) {
    console.error('Get pending events error:', error);
    res.status(500).json({ message: 'Failed to fetch pending events' });
  }
};

/**
 * Approve Event
 * @route PATCH /api/admin/events/:id/approve
 */
exports.approveEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true }
    );

    if (event) {
      await AuditLog.create({
        admin_id: req.user.id,
        action: 'APPROVE_EVENT',
        target_type: 'Event',
        target_id: event._id,
        details: { title: event.title },
        ip_address: req.ip
      });
    }

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event approved successfully', event });
  } catch (error) {
    console.error('Approve event error:', error);
    res.status(500).json({ message: 'Failed to approve event' });
  }
};

/**
 * Reject Event
 * @route PATCH /api/admin/events/:id/reject
 */
exports.rejectEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByIdAndUpdate(
      id,
      { status: 'rejected' },
      { new: true }
    );

    if (event) {
      await AuditLog.create({
        admin_id: req.user.id,
        action: 'REJECT_EVENT',
        target_type: 'Event',
        target_id: event._id,
        details: { title: event.title },
        ip_address: req.ip
      });
    }

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event rejected', event });
  } catch (error) {
    console.error('Reject event error:', error);
    res.status(500).json({ message: 'Failed to reject event' });
  }
};

// ==================== ORGANIZER APPROVAL ====================

/**
 * Get Pending Organizer Requests
 * @route GET /api/admin/organizers/pending
 */
exports.getPendingOrganizers = async (req, res) => {
  try {
    const users = await User.find({ role: 'student', organizerRequest: true })
      .select('-password')
      .sort({ created_at: -1 });

    res.json({ users });
  } catch (error) {
    console.error('Get pending organizers error:', error);
    res.status(500).json({ message: 'Failed to fetch pending organizers' });
  }
};

/**
 * Approve Organizer Request
 * @route PATCH /api/admin/organizers/:id/approve
 */
exports.approveOrganizer = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { role: 'organizer', organizerRequest: false },
      { new: true }
    ).select('-password');

    if (user) {
      await AuditLog.create({
        admin_id: req.user.id,
        action: 'APPROVE_ORGANIZER',
        target_type: 'User',
        target_id: user._id,
        details: { email: user.email },
        ip_address: req.ip
      });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Organizer approved successfully', user });
  } catch (error) {
    console.error('Approve organizer error:', error);
    res.status(500).json({ message: 'Failed to approve organizer' });
  }
};

/**
 * Reject Organizer Request
 * @route PATCH /api/admin/organizers/:id/reject
 */
exports.rejectOrganizer = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { organizerRequest: false },
      { new: true }
    ).select('-password');

    if (user) {
      await AuditLog.create({
        admin_id: req.user.id,
        action: 'REJECT_ORGANIZER',
        target_type: 'User',
        target_id: user._id,
        details: { email: user.email },
        ip_address: req.ip
      });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Organizer request rejected', user });
  } catch (error) {
    console.error('Reject organizer error:', error);
    res.status(500).json({ message: 'Failed to reject organizer' });
  }
};

// ==================== VENUE MANAGEMENT ====================

/**
 * Get All Venues
 * @route GET /api/admin/venues
 */
exports.getAllVenues = async (req, res) => {
  try {
    const venues = await Venue.find().sort({ name: 1 });
    res.json({ venues });
  } catch (error) {
    console.error('Get venues error:', error);
    res.status(500).json({ message: 'Failed to fetch venues' });
  }
};

/**
 * Create Venue
 * @route POST /api/admin/venues
 */
exports.createVenue = async (req, res) => {
  try {
    const { name, location_code, max_capacity, facilities, images } = req.body;

    if (!name || !location_code || !max_capacity) {
      return res.status(400).json({ message: 'Name, location code, and max capacity are required' });
    }

    const venue = new Venue({ 
      name, 
      location_code, 
      max_capacity: parseInt(max_capacity),
      facilities: facilities || [],
      images: images || []
    });
    await venue.save();

    await AuditLog.create({
      admin_id: req.user.id,
      action: 'CREATE_VENUE',
      target_type: 'Venue',
      target_id: venue._id,
      details: { name: venue.name },
      ip_address: req.ip
    });

    res.status(201).json({ message: 'Venue created successfully', venue });
  } catch (error) {
    console.error('Create venue error:', error);
    res.status(500).json({ message: 'Failed to create venue' });
  }
};

/**
 * Update Venue
 * @route PUT /api/admin/venues/:id
 */
exports.updateVenue = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location_code, max_capacity, facilities, images } = req.body;

    const venue = await Venue.findByIdAndUpdate(
      id,
      { 
        name, 
        location_code, 
        max_capacity: max_capacity ? parseInt(max_capacity) : undefined,
        facilities,
        images
      },
      { new: true }
    );

    if (venue) {
      await AuditLog.create({
        admin_id: req.user.id,
        action: 'UPDATE_VENUE',
        target_type: 'Venue',
        target_id: venue._id,
        details: { name: venue.name },
        ip_address: req.ip
      });
    }

    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    res.json({ message: 'Venue updated successfully', venue });
  } catch (error) {
    console.error('Update venue error:', error);
    res.status(500).json({ message: 'Failed to update venue' });
  }
};

/**
 * Delete Venue
 * @route DELETE /api/admin/venues/:id
 */
exports.deleteVenue = async (req, res) => {
  try {
    const { id } = req.params;

    const venue = await Venue.findByIdAndDelete(id);

    if (venue) {
      await AuditLog.create({
        admin_id: req.user.id,
        action: 'DELETE_VENUE',
        target_type: 'Venue',
        target_id: id,
        details: { name: venue.name },
        ip_address: req.ip
      });
    }

    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    res.json({ message: 'Venue deleted successfully' });
  } catch (error) {
    console.error('Delete venue error:', error);
    res.status(500).json({ message: 'Failed to delete venue' });
  }
};

// ==================== SPEAKER MANAGEMENT ====================

const Speaker = require('../models/speaker');

/**
 * Get All Speakers
 * @route GET /api/admin/speakers
 */
exports.getAllSpeakers = async (req, res) => {
  try {
    const speakers = await Speaker.find().sort({ name: 1 });
    res.json({ speakers });
  } catch (error) {
    console.error('Get speakers error:', error);
    res.status(500).json({ message: 'Failed to fetch speakers' });
  }
};

/**
 * Create Speaker
 * @route POST /api/admin/speakers
 */
exports.createSpeaker = async (req, res) => {
  try {
    const { name, expertise, bio, social_links } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Speaker name is required' });
    }

    const speaker = new Speaker({
      name,
      expertise,
      bio,
      social_links
    });
    await speaker.save();

    await AuditLog.create({
      admin_id: req.user.id,
      action: 'CREATE_SPEAKER',
      target_type: 'Speaker',
      target_id: speaker._id,
      details: { name: speaker.name },
      ip_address: req.ip
    });

    res.status(201).json({ message: 'Speaker added successfully', speaker });
  } catch (error) {
    console.error('Create speaker error:', error);
    res.status(500).json({ message: 'Failed to add speaker' });
  }
};

