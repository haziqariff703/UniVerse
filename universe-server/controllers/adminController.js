const User = require('../models/user');
const Event = require('../models/event');
const Registration = require('../models/registration');
const Venue = require('../models/venue');
const AuditLog = require('../models/auditLog');
const Category = require('../models/category');

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
    const [totalUsers, totalEvents, totalBookings, activeEvents, pendingEvents, pendingOrganizers, pendingSpeakers] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments(),
      Registration.countDocuments(),
      Event.countDocuments({ date_time: { $gte: new Date() }, status: 'approved' }),
      Event.countDocuments({ status: 'pending' }),
      User.countDocuments({ role: 'student', organizerRequest: true }),
      Speaker.countDocuments({ status: 'pending' })
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
        pendingSpeakers,
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
    const { name, location_code, max_capacity, facilities } = req.body;

    if (!name || !location_code || !max_capacity) {
      return res.status(400).json({ message: 'Name, location code, and max capacity are required' });
    }

    const images = [];
    if (req.file) {
      const filePath = req.file.path.replace(/\\/g, "/");
      images.push(`http://localhost:5000/${filePath}`);
    }

    const venue = new Venue({ 
      name, 
      location_code, 
      max_capacity: parseInt(max_capacity),
      facilities: typeof facilities === 'string' ? JSON.parse(facilities) : (facilities || []),
      images
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
    const { name, location_code, max_capacity, facilities } = req.body;

    const updateData = {
      name,
      location_code,
      max_capacity: max_capacity ? parseInt(max_capacity) : undefined,
      facilities: typeof facilities === 'string' ? JSON.parse(facilities) : facilities
    };

    if (req.file) {
      const filePath = req.file.path.replace(/\\/g, "/");
      updateData.images = [`http://localhost:5000/${filePath}`];
    }

    const venue = await Venue.findByIdAndUpdate(
      id,
      updateData,
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
    const speakers = await Speaker.find({ status: 'verified' }).sort({ name: 1 });
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

/**
 * Update Speaker
 * @route PUT /api/admin/speakers/:id
 */
exports.updateSpeaker = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, expertise, bio, social_links } = req.body;

    const speaker = await Speaker.findByIdAndUpdate(
      id,
      { name, expertise, bio, social_links },
      { new: true }
    );

    if (speaker) {
      await AuditLog.create({
        admin_id: req.user.id,
        action: 'UPDATE_SPEAKER',
        target_type: 'Speaker',
        target_id: speaker._id,
        details: { name: speaker.name },
        ip_address: req.ip
      });
    }

    if (!speaker) {
      return res.status(404).json({ message: 'Speaker not found' });
    }

    res.json({ message: 'Speaker updated successfully', speaker });
  } catch (error) {
    console.error('Update speaker error:', error);
    res.status(500).json({ message: 'Failed to update speaker' });
  }
};

/**
 * Delete Speaker
 * @route DELETE /api/admin/speakers/:id
 */
exports.deleteSpeaker = async (req, res) => {
  try {
    const { id } = req.params;

    const speaker = await Speaker.findByIdAndDelete(id);

    if (speaker) {
      await AuditLog.create({
        admin_id: req.user.id,
        action: 'DELETE_SPEAKER',
        target_type: 'Speaker',
        target_id: id,
        details: { name: speaker.name },
        ip_address: req.ip
      });
    }

    if (!speaker) {
      return res.status(404).json({ message: 'Speaker not found' });
    }

    res.json({ message: 'Speaker deleted successfully' });
  } catch (error) {
    console.error('Delete speaker error:', error);
    res.status(500).json({ message: 'Failed to delete speaker' });
  }
};

/**
 * Get Pending Speakers
 * @route GET /api/admin/speakers/pending
 */
exports.getPendingSpeakers = async (req, res) => {
  try {
    const speakers = await Speaker.find({ status: 'pending' })
      .populate('requested_by', 'name email')
      .sort({ created_at: -1 });

    res.json({ speakers });
  } catch (error) {
    console.error('Get pending speakers error:', error);
    res.status(500).json({ message: 'Failed to fetch pending speakers' });
  }
};

/**
 * Verify Speaker Proposal
 * @route PATCH /api/admin/speakers/:id/verify
 */
exports.verifySpeaker = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'approve' or 'reject'

    if (action === 'approve') {
      const speaker = await Speaker.findByIdAndUpdate(
        id,
        { status: 'verified' },
        { new: true }
      );

      if (speaker) {
        await AuditLog.create({
          admin_id: req.user.id,
          action: 'VERIFY_SPEAKER',
          target_type: 'Speaker',
          target_id: speaker._id,
          details: { name: speaker.name },
          ip_address: req.ip
        });
      }

      if (!speaker) return res.status(404).json({ message: 'Speaker not found' });
      res.json({ message: 'Speaker proposal approved', speaker });
    } else {
      const speaker = await Speaker.findByIdAndDelete(id);
      if (speaker) {
        await AuditLog.create({
          admin_id: req.user.id,
          action: 'REJECT_SPEAKER_PROPOSAL',
          target_type: 'Speaker',
          target_id: id,
          details: { name: speaker.name },
          ip_address: req.ip
        });
      }
      res.json({ message: 'Speaker proposal rejected and deleted' });
    }
  } catch (error) {
    console.error('Verify speaker error:', error);
    res.status(500).json({ message: 'Failed to verify speaker' });
  }
};

// ==================== REVIEW MANAGEMENT ====================

const Review = require('../models/review');

/**
 * Get All Reviews
 * @route GET /api/admin/reviews
 */
exports.getAllReviews = async (req, res) => {
  try {
    const { event_id } = req.query;
    const query = event_id ? { event_id } : {};

    const reviews = await Review.find(query)
      .populate('user_id', 'name email student_id')
      .populate('event_id', 'title')
      .sort({ created_at: -1 });

    // Calculate metrics
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0 
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : 0;
    const criticalReviews = reviews.filter(r => r.rating <= 2).length;

    res.json({ 
      reviews,
      stats: {
        total: totalReviews,
        average: avgRating,
        critical: criticalReviews
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};

/**
 * Delete Review
 * @route DELETE /api/admin/reviews/:id
 */
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndDelete(id);

    if (review) {
      await AuditLog.create({
        admin_id: req.user.id,
        action: 'DELETE_REVIEW',
        target_type: 'Review',
        target_id: id,
        details: { rating: review.rating },
        ip_address: req.ip
      });
    }

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Failed to delete review' });
  }
};

// ==================== CATEGORY MANAGEMENT ====================

/**
 * Get All Categories
 * @route GET /api/admin/categories
 */
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    
    // Get usage count for each category from Event model (assuming tags field stores category names)
    const categoriesWithStats = await Promise.all(categories.map(async (cat) => {
      const usageCount = await Event.countDocuments({ tags: cat.name });
      return {
        ...cat.toObject(),
        usageCount
      };
    }));

    // Stats for KPI
    const totalCategories = categories.length;
    const activeCategories = categories.filter(c => c.is_active).length;

    res.json({ 
      categories: categoriesWithStats,
      stats: {
        total: totalCategories,
        active: activeCategories,
        inactive: totalCategories - activeCategories
      }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};

/**
 * Create Category
 * @route POST /api/admin/categories
 */
exports.createCategory = async (req, res) => {
  try {
    const { name, description, color, icon } = req.body;

    const category = new Category({
      name,
      description,
      color,
      icon
    });

    await category.save();

    await AuditLog.create({
      admin_id: req.user.id,
      action: 'CREATE_CATEGORY',
      target_type: 'Category',
      target_id: category._id,
      details: { name: category.name },
      ip_address: req.ip
    });

    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: error.code === 11000 ? 'Category name already exists' : 'Failed to create category' });
  }
};

/**
 * Update Category
 * @route PUT /api/admin/categories/:id
 */
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, color, icon, is_active } = req.body;

    const category = await Category.findByIdAndUpdate(
      id,
      { name, description, color, icon, is_active },
      { new: true, runValidators: true }
    );

    if (category) {
      await AuditLog.create({
        admin_id: req.user.id,
        action: 'UPDATE_CATEGORY',
        target_type: 'Category',
        target_id: category._id,
        details: { name: category.name, is_active },
        ip_address: req.ip
      });
    }

    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category updated successfully', category });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Failed to update category' });
  }
};

/**
 * Delete Category
 * @route DELETE /api/admin/categories/:id
 */
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    // Check if category is in use
    const inUse = await Event.exists({ tags: category.name });
    if (inUse) {
      return res.status(400).json({ message: 'Cannot delete category that is currently in use by events' });
    }

    await Category.findByIdAndDelete(id);

    await AuditLog.create({
      admin_id: req.user.id,
      action: 'DELETE_CATEGORY',
      target_type: 'Category',
      target_id: id,
      details: { name: category.name },
      ip_address: req.ip
    });

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Failed to delete category' });
  }
};

// ==================== NOTIFICATION MANAGEMENT ====================

const Notification = require('../models/notification');

/**
 * Get System Notifications
 * @route GET /api/admin/notifications
 */
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('user_id', 'name')
      .sort({ created_at: -1 })
      .limit(50); // Limit to last 50 for performance

    res.json({ notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

/**
 * Create Broadcast Notification
 * @route POST /api/admin/notifications
 */
exports.createNotification = async (req, res) => {
  try {
    const { message, type, target_role } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Find target users
    const query = target_role && target_role !== 'all' ? { role: target_role } : {};
    const users = await User.find(query).select('_id');

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found for this target' });
    }

    // Create notifications in bulk
    const notifications = users.map(user => ({
      user_id: user._id,
      message,
      type: type || 'info',
      created_at: new Date()
    }));

    await Notification.insertMany(notifications);

    await AuditLog.create({
      admin_id: req.user.id,
      action: 'BROADCAST_NOTIFICATION',
      target_type: 'System',
      target_id: req.user.id,
      details: { message, recipient_count: users.length },
      ip_address: req.ip
    });

    res.status(201).json({ 
      message: `Notification sent to ${users.length} users`,
      count: users.length 
    });
  } catch (error) {
    console.error('Broadcast notification error:', error);
    res.status(500).json({ message: 'Failed to send notifications' });
  }
};

/**
 * Delete Notification (Cleanup)
 * @route DELETE /api/admin/notifications/:id
 */
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Failed to delete notification' });
  }
};

