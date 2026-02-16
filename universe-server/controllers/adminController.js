const User = require('../models/user');
const Event = require('../models/event');
const Registration = require('../models/registration');
const Venue = require('../models/venue');
const AuditLog = require('../models/auditLog');
const Category = require('../models/category');
const Notification = require('../models/notification');
const Speaker = require('../models/speaker');
const Community = require('../models/community');
const Review = require('../models/review');
const ClubProposal = require('../models/clubProposal');
const bcrypt = require('bcryptjs');
const path = require('path');
const { resolveFilePath } = require('../utils/pathResolver');

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
    const range = req.query.range || 'year';
    const now = new Date();

    const startOfDay = (date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const getWeekStart = (date) => {
      const day = date.getDay(); // 0 = Sunday, 1 = Monday
      const diffToMonday = (day + 6) % 7;
      const start = startOfDay(date);
      start.setDate(start.getDate() - diffToMonday);
      return start;
    };
    
    // 1. Define Date Ranges (Calendar periods: current vs previous)
    let startDate;
    let prevStartDate;
    let prevEndDate;

    switch (range) {
      case 'week': {
        startDate = getWeekStart(now);
        prevStartDate = new Date(startDate);
        prevStartDate.setDate(prevStartDate.getDate() - 7);
        prevEndDate = new Date(now);
        prevEndDate.setDate(prevEndDate.getDate() - 7);
        break;
      }
      case 'month': {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        prevStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const previousMonthAnchor = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1
        );
        const lastDayOfPrevMonth = new Date(
          previousMonthAnchor.getFullYear(),
          previousMonthAnchor.getMonth() + 1,
          0
        ).getDate();
        prevEndDate = new Date(previousMonthAnchor);
        prevEndDate.setDate(Math.min(now.getDate(), lastDayOfPrevMonth));
        prevEndDate.setHours(
          now.getHours(),
          now.getMinutes(),
          now.getSeconds(),
          now.getMilliseconds()
        );
        break;
      }
      case 'year':
      default: {
        startDate = new Date(now.getFullYear(), 0, 1);
        prevStartDate = new Date(now.getFullYear() - 1, 0, 1);
        prevEndDate = new Date(now);
        prevEndDate.setFullYear(prevEndDate.getFullYear() - 1);
        break;
      }
    }

    // 2. KPI Counts (Filtered by Range)
    const [
      currentUsers, 
      prevUsers, 
      currentEvents, 
      prevEvents, 
      currentBookings, 
      prevBookings,
      pendingEvents,
      activeEvents,
      registrationCount,
      checkedInCount,
      reviewCount
    ] = await Promise.all([
      User.countDocuments({ created_at: { $gte: startDate } }),
      User.countDocuments({ created_at: { $gte: prevStartDate, $lt: prevEndDate } }),
      Event.countDocuments({ created_at: { $gte: startDate } }),
      Event.countDocuments({ created_at: { $gte: prevStartDate, $lt: prevEndDate } }),
      Registration.countDocuments({ booking_time: { $gte: startDate } }),
      Registration.countDocuments({ booking_time: { $gte: prevStartDate, $lt: prevEndDate } }),
      Event.countDocuments({ status: 'pending' }),
      Event.countDocuments({ status: 'approved', end_time: { $gte: new Date() } }),
      Registration.countDocuments({ booking_time: { $gte: startDate } }),
      Registration.countDocuments({ booking_time: { $gte: startDate }, status: 'CheckedIn' }),
      Review.countDocuments({ created_at: { $gte: startDate } })
    ]);

    // Total counts (Lifetime) - helpful for context
    const [totalUsers, totalEvents, totalBookings] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments(),
      Registration.countDocuments()
    ]);

    const calculateChange = (current, prev) => {
      if (prev === 0) return current > 0 ? "100" : "0.0";
      const change = ((current - prev) / prev) * 100;
      return change.toFixed(1);
    };

    // 3. Revenue Calculation (Real aggregation)
    const revenueDocs = await Registration.aggregate([
      { 
        $match: { 
          status: { $ne: 'Cancelled' },
          booking_time: { $gte: startDate }
        } 
      },
      {
        $lookup: {
          from: 'events',
          localField: 'event_id',
          foreignField: '_id',
          as: 'event'
        }
      },
      { $unwind: '$event' },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $ifNull: ['$event.ticket_price', 0] } }
        }
      }
    ]);
    const totalRevenue = revenueDocs.length > 0 ? revenueDocs[0].totalRevenue : 0;

    // 4. Revenue Breakdown (Category / Audience / Organizer)
    const revenueByCategory = await Registration.aggregate([
      { 
        $match: { 
          status: { $ne: 'Cancelled' },
          booking_time: { $gte: startDate }
        } 
      },
      {
        $lookup: {
          from: 'events',
          localField: 'event_id',
          foreignField: '_id',
          as: 'event'
        }
      },
      { $unwind: '$event' },
      {
        $group: {
          _id: { $ifNull: ['$event.category', 'Uncategorized'] },
          value: { $sum: { $ifNull: ['$event.ticket_price', 0] } }
        }
      },
      { $sort: { value: -1 } },
      { $limit: 6 }
    ]);

    const revenueByAudience = await Registration.aggregate([
      { 
        $match: { 
          status: { $ne: 'Cancelled' },
          booking_time: { $gte: startDate }
        } 
      },
      {
        $lookup: {
          from: 'events',
          localField: 'event_id',
          foreignField: '_id',
          as: 'event'
        }
      },
      { $unwind: '$event' },
      {
        $group: {
          _id: { $ifNull: ['$event.target_audience', 'General'] },
          value: { $sum: { $ifNull: ['$event.ticket_price', 0] } }
        }
      },
      { $sort: { value: -1 } },
      { $limit: 6 }
    ]);

    const revenueByOrganizer = await Registration.aggregate([
      { 
        $match: { 
          status: { $ne: 'Cancelled' },
          booking_time: { $gte: startDate }
        } 
      },
      {
        $lookup: {
          from: 'events',
          localField: 'event_id',
          foreignField: '_id',
          as: 'event'
        }
      },
      { $unwind: '$event' },
      {
        $group: {
          _id: '$event.organizer_id',
          value: { $sum: { $ifNull: ['$event.ticket_price', 0] } }
        }
      },
      { $sort: { value: -1 } },
      { $limit: 6 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'organizer'
        }
      },
      { $unwind: { path: '$organizer', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          name: { $ifNull: ['$organizer.name', 'Unknown Organizer'] },
          value: 1
        }
      }
    ]);

    const conversionFunnel = [
      { name: 'Registrations', value: registrationCount },
      { name: 'Checked In', value: checkedInCount },
      { name: 'Reviews', value: reviewCount }
    ];

    // 5. Daily Traffic (Last 7 Days - constant window but relevant for "Daily")
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyActivity = await Registration.aggregate([
      { $match: { booking_time: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dayOfWeek: '$booking_time' },
          count: { $sum: 1 }
        }
      }
    ]);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const trafficData = days.map((day, index) => {
      const found = dailyActivity.find(d => d._id === index + 1);
      return { 
        name: day, 
        value: found ? found.count : 0,
        active: new Date().getDay() === index
      };
    });

    // 6. Trending Events (Top 5 by Registrations in specified range)
    const trendingEvents = await Registration.aggregate([
      { $match: { booking_time: { $gte: startDate } } },
      {
        $group: {
          _id: '$event_id',
          sold: { $sum: 1 }
        }
      },
      { $sort: { sold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'events',
          localField: '_id',
          foreignField: '_id',
          as: 'event'
        }
      },
      { $unwind: '$event' },
      {
        $project: {
          name: '$event.title',
          sold: 1,
          revenue: { $multiply: ['$sold', { $ifNull: ['$event.ticket_price', 0] }] },
          rating: { $ifNull: ['$event.rating', 5.0] }
        }
      }
    ]);

    // 7. User Satisfaction (Real aggregation from Reviews)
    const reviewStats = await Review.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          positive: { 
            $sum: { 
              $cond: [{ $gte: ["$rating", 4] }, 1, 0] 
            } 
          }
        }
      }
    ]);

    // 8. Platform Activity (Revenue Trend over time)
    let groupBy;
    switch(range) {
      case 'week':
      case 'month':
        groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$booking_time" } };
        break;
      case 'year':
      default:
        groupBy = { $month: '$booking_time' };
        break;
    }

    const activityStats = await Registration.aggregate([
      {
        $lookup: {
          from: 'events',
          localField: 'event_id',
          foreignField: '_id',
          as: 'event'
        }
      },
      { $unwind: '$event' },
      {
        $match: {
          status: { $ne: 'Cancelled' },
          booking_time: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: { $ifNull: ['$event.ticket_price', 0] } },
          sales: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    let formattedActivityData = [];
    if (range === 'year') {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      formattedActivityData = months.map((month, index) => {
        const found = activityStats.find(stat => stat._id === index + 1);
        return {
          name: month,
          value: found ? found.revenue : 0,
          sales: found ? found.sales : 0
        };
      });
    } else {
      const dates = [];
      let currentDate = new Date(startDate);
      while (currentDate <= now) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      formattedActivityData = dates.map(date => {
        const dateString = date.toISOString().split('T')[0];
        const found = activityStats.find(stat => stat._id === dateString);
        return {
          name: range === 'week' 
            ? date.toLocaleDateString('en-US', { weekday: 'short' })
            : date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
          value: found ? found.revenue : 0,
          sales: found ? found.sales : 0,
          fullDate: dateString
        };
      });
    }

    const satisfactionData = reviewStats.length > 0 ? {
      score: Math.round((reviewStats[0].positive / reviewStats[0].total) * 100),
      positive: reviewStats[0].positive,
      total: reviewStats[0].total
    } : { score: 0, positive: 0, total: 0 };

    // 9. Upcoming Events (Next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const upcomingEvents = await Event.find({
      status: 'approved',
      date_time: { $gte: now, $lte: nextWeek }
    })
      .populate('venue_id', 'name')
      .sort({ date_time: 1 })
      .limit(10)
      .lean();

    const upcomingWithCounts = await Promise.all(
      upcomingEvents.map(async (evt) => {
        const regCount = await Registration.countDocuments({ event_id: evt._id });
        return {
          _id: evt._id,
          title: evt.title,
          date_time: evt.date_time,
          venue: evt.venue_id?.name || 'TBA',
          registrations: regCount,
          max_capacity: evt.max_capacity || 0
        };
      })
    );

    // 10. Pending Actions (counts for Quick Actions widget)
    const [pendingOrganizerCount, pendingSpeakerCount] = await Promise.all([
      User.countDocuments({ organizerRequest: true }),
      Speaker.countDocuments({ status: 'pending' })
    ]);

    // 11. Gender Distribution
    const genderAgg = await User.aggregate([
      {
        $group: {
          _id: { $ifNull: ['$gender', 'Not specified'] },
          count: { $sum: 1 }
        }
      }
    ]);
    const genderDistribution = genderAgg.map(g => ({
      name: g._id,
      value: g.count
    }));

    res.json({
      stats: {
        totalEvents: range === 'year' ? totalEvents : currentEvents,
        eventsChange: calculateChange(currentEvents, prevEvents),
        totalUsers: range === 'year' ? totalUsers : currentUsers,
        usersChange: calculateChange(currentUsers, prevUsers),
        totalBookings: range === 'year' ? totalBookings : currentBookings,
        bookingsChange: calculateChange(currentBookings, prevBookings),
        pendingEvents,
        activeEvents,
        revenue: totalRevenue,
        revenueBreakdown: {
          category: revenueByCategory.map((item) => ({
            name: item._id || 'Uncategorized',
            value: item.value || 0
          })),
          audience: revenueByAudience.map((item) => ({
            name: item._id || 'General',
            value: item.value || 0
          })),
          organizer: revenueByOrganizer.map((item) => ({
            name: item.name || 'Unknown Organizer',
            value: item.value || 0
          }))
        },
        conversionFunnel,
        trafficData,
        trendingEvents,
        satisfaction: satisfactionData,
        activityStats: formattedActivityData,
        upcomingEvents: upcomingWithCounts,
        pendingActions: {
          events: pendingEvents,
          organizers: pendingOrganizerCount,
          speakers: pendingSpeakerCount
        },
        genderDistribution
      }
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

    // Fetch global stats for KPI cards
    const [totalUsers, studentCount, organizerCount, adminCount, associationCount] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'organizer' }),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ role: 'association' })
    ]);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total
      },
      stats: {
        total: totalUsers,
        student: studentCount,
        organizer: organizerCount,
        admin: adminCount,
        association: associationCount
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

    const validRoles = ['student', 'organizer', 'admin', 'association'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Prepare roles array update
    let rolesUpdate = ['student'];
    if (role !== 'student') rolesUpdate.push(role);
    if (role === 'association' && !rolesUpdate.includes('organizer')) {
      rolesUpdate.push('organizer');
    }

    const user = await User.findByIdAndUpdate(
      id,
      { 
        role, 
        roles: rolesUpdate,
        organizerRequest: false,
        is_organizer_approved: role === 'organizer' || role === 'association'
      },
      { new: true }
    ).select('-password');

    if (user) {
      await AuditLog.create({
        admin_id: req.user.id,
        action: 'UPDATE_USER_ROLE',
        target_type: 'User',
        target_id: user._id,
        details: { role, roles: rolesUpdate },
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
      // Create notification
      await Notification.create({
        recipient_id: event.organizer_id,
        title: "Event Approved",
        message: `Your event "${event.title}" has been approved!`,
        type: 'success'
      });


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
    const { reason } = req.body;

    const event = await Event.findByIdAndUpdate(
      id,
      { 
        status: 'rejected',
        rejection_reason: reason 
      },
      { new: true }
    );

    if (event) {
      // Create notification
      await Notification.create({
        recipient_id: event.organizer_id,
        title: "Event Rejected",
        message: `Your event "${event.title}" has been rejected. Reason: ${reason || 'No reason provided'}`,
        type: 'alert'
      });


      await AuditLog.create({
        admin_id: req.user.id,
        action: 'REJECT_EVENT',
        target_type: 'Event',
        target_id: event._id,
        details: { title: event.title, reason },
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
    // DEBUG: Log checks
    const allRequests = await User.countDocuments({ organizerRequest: true });
    console.log(`[DEBUG] Total users with organizerRequest: ${allRequests}`);

    // Allow any user with an active organizerRequest to be shown, regardless of current role
    // This fixes issues where a user might already be an 'organizer' (e.g. from previous tests) but wants to submit a new proposal
    const users = await User.find({ organizerRequest: true })
      .select('-password')
      .sort({ created_at: -1 })
      .lean();
    
    console.log(`[DEBUG] Users found with organizerRequest=true: ${users.length}`);

    // Populate the latest proposal for each user
    const usersWithProposals = await Promise.all(users.map(async (user) => {
      try {
        const proposal = await ClubProposal.findOne({ 
          student_id: user._id, 
          status: 'pending' 
        }).sort({ created_at: -1 });
        return { ...user, proposal };
      } catch (err) {
        console.error(`Error fetching proposal for user ${user._id}:`, err);
        return { ...user, proposal: null };
      }
    }));

    res.json({ users: usersWithProposals });
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
      { 
        $addToSet: { roles: 'organizer' }, // Add 'organizer' to roles array if not present
        role: 'organizer', // Keep legacy for now
        is_organizer_approved: true,
        organizerRequest: false 
      },
      { new: true }
    ).select('-password');

    if (user) {
      // Check for an associated club proposal
      const ClubProposal = require('../models/clubProposal');
      const Community = require('../models/community');
      const CommunityMember = require('../models/communityMember');

      const proposal = await ClubProposal.findOne({ 
        student_id: user._id, 
        status: 'pending' 
      }).sort({ created_at: -1 });

      if (proposal) {
        // 1. Create the community
        const community = new Community({
          name: proposal.clubName,
          slug: proposal.clubName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
          description: proposal.mission,
          category: proposal.category.charAt(0).toUpperCase() + proposal.category.slice(1),
          advisor: {
            name: proposal.advisorName,
            title: 'Faculty Advisor'
          },
          owner_id: user._id,
          is_verified: true, // Automatically verified since Admin approved the proposal
          logo: proposal.logo_url || '',
          banner: proposal.banner_url || ''
        });
        await community.save();

        // 2. Add owner as President member
        const member = new CommunityMember({
          community_id: community._id,
          user_id: user._id,
          role: 'President',
          status: 'Approved',
          joined_at: new Date()
        });
        await member.save();

        // 3. Mark proposal as approved
        proposal.status = 'approved';
        await proposal.save();
      }

      // Create notification
      await Notification.create({
        recipient_id: user._id,
        title: "Organizer Approved",
        message: 'Your request to become an organizer has been approved! You can now access the Organizer Suite.',
        type: 'success'
      });


      await AuditLog.create({
        admin_id: req.user.id,
        action: 'APPROVE_ORGANIZER',
        target_type: 'User',
        target_id: user._id,
        details: { email: user.email, hasProposal: !!proposal },
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
    const { reason } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { organizerRequest: false },
      { new: true }
    ).select('-password');

    if (user) {
      // Create notification (primary way to inform user of rejection reason)
      await Notification.create({
        recipient_id: user._id,
        title: "Organizer Request Rejected",
        message: `Your request to become an organizer has been rejected. Reason: ${reason || 'No reason provided'}`,
        type: 'alert'
      });


      await AuditLog.create({
        admin_id: req.user.id,
        action: 'REJECT_ORGANIZER',
        target_type: 'User',
        target_id: user._id,
        details: { email: user.email, reason },
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
    const { 
      name, 
      location_code, 
      max_capacity, 
      facilities, 
      type, 
      description, 
      bestFor,
      accessHours,
      accessLevel,
      managedBy,
      occupancyStatus 
    } = req.body;

    if (!name || !location_code || !max_capacity) {
      return res.status(400).json({ message: 'Name, location code, and max capacity are required' });
    }

    const images = [];
    if (req.file) {
      images.push(resolveFilePath(req.file));
    }

    const venue = new Venue({ 
      name, 
      location_code, 
      max_capacity: parseInt(max_capacity),
      facilities: typeof facilities === 'string' ? JSON.parse(facilities) : (facilities || []),
      type: type || 'Other',
      description,
      bestFor: typeof bestFor === 'string' ? JSON.parse(bestFor) : (bestFor || []),
      accessHours,
      accessLevel,
      managedBy,
      occupancyStatus: occupancyStatus || 'Available',
      images,
      image: images.length > 0 ? images[0] : undefined
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
    const { 
      name, 
      location_code, 
      max_capacity, 
      facilities,
      type, 
      description, 
      bestFor,
      accessHours,
      accessLevel,
      managedBy,
      occupancyStatus 
    } = req.body;

    const updateData = {
      name,
      location_code,
      max_capacity: max_capacity ? parseInt(max_capacity) : undefined,
      facilities: typeof facilities === 'string' ? JSON.parse(facilities) : facilities,
      type,
      description,
      bestFor: typeof bestFor === 'string' ? JSON.parse(bestFor) : bestFor,
      accessHours,
      accessLevel,
      managedBy,
      occupancyStatus
    };

    if (req.file) {
      const resolvedPath = resolveFilePath(req.file);
      updateData.image = resolvedPath;
      updateData.images = [resolvedPath]; // Set as first image
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

// Speaker management logic follows...

/**
 * Get All Speakers
 * @route GET /api/admin/speakers
 */
exports.getAllSpeakers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    const query = { status: 'verified' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { expertise: { $regex: search, $options: 'i' } }
      ];
    }

    const speakers = await Speaker.find(query)
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Speaker.countDocuments(query);

    res.json({ 
      speakers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        total
      }
    });
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
    const { name, role, expertise, category, bio, about, social_links, achievements, upcoming } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Speaker name is required' });
    }

    let image = null;
    let proposal_url = null;

    if (req.files) {
      if (req.files.image) {
        image = resolveFilePath(req.files.image[0]);
      }
      if (req.files.proposal) {
        proposal_url = resolveFilePath(req.files.proposal[0]);
      }
    }

    const speaker = new Speaker({
      name,
      role,
      expertise,
      category,
      bio,
      about: about || bio, // Fallback to bio if about is not provided
      social_links: typeof social_links === 'string' ? JSON.parse(social_links) : social_links,
      achievements: typeof achievements === 'string' ? JSON.parse(achievements) : achievements,
      upcoming,
      image,
      proposal_url,
      status: 'verified' // Auto-verify when created by admin
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
    const { name, role, expertise, category, bio, about, social_links, achievements, upcoming, status } = req.body;

    const updateData = {
      name,
      role,
      expertise,
      category,
      bio,
      about,
      upcoming,
      status
    };

    if (social_links) {
      updateData.social_links = typeof social_links === 'string' ? JSON.parse(social_links) : social_links;
    }
    if (achievements) {
      updateData.achievements = typeof achievements === 'string' ? JSON.parse(achievements) : achievements;
    }

    if (req.files) {
      if (req.files.image) {
        updateData.image = resolveFilePath(req.files.image[0]);
      }
      if (req.files.proposal) {
        updateData.proposal_url = resolveFilePath(req.files.proposal[0]);
      }
    }

    const speaker = await Speaker.findByIdAndUpdate(
      id,
      updateData,
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
    
    // Get usage count for each category from Event and Community models
    const categoriesWithStats = await Promise.all(categories.map(async (cat) => {
      const eventUsage = await Event.countDocuments({ tags: cat.name });
      const communityUsage = await Community.countDocuments({ category: cat.name });
      return {
        ...cat.toObject(),
        usageCount: eventUsage + communityUsage,
        eventUsage,
        communityUsage
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


/**
 * Create User Manually
 * @route POST /api/admin/users
 * @access Admin only
 */
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, student_id } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Role validation
    const validRoles = ['student', 'organizer', 'staff', 'admin', 'association'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Prepare roles array
    let roles = ['student'];
    if (role !== 'student' && !roles.includes(role)) {
      roles.push(role);
    }
    
    // Associations inherit organizer permissions
    if (role === 'association' && !roles.includes('organizer')) {
      roles.push('organizer');
    }

    // Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role,
      roles: roles,
      student_id: student_id || undefined,
      is_organizer_approved: role === 'organizer' || role === 'association', // Auto-approve if created by admin
      organizerRequest: false
    });

    await newUser.save();

    // Audit Log
    await AuditLog.create({
      admin_id: req.user.id,
      action: 'CREATE_USER_MANUAL',
      target_type: 'User',
      target_id: newUser._id,
      details: { name: newUser.name, email: newUser.email, role: newUser.role },
      ip_address: req.ip
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        roles: newUser.roles
      }
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
};

/**
 * Community Management
 */
exports.getAllCommunities = async (req, res) => {
  try {
    const communities = await Community.find()
      .populate('owner_id', 'name email student_id')
      .sort({ name: 1 });

    // 1. Get Event Stat Counts
    const eventStats = await Event.aggregate([
      { $group: { _id: '$organizer_id', count: { $sum: 1 } } }
    ]);
    const eventStatsMap = eventStats.reduce((acc, curr) => {
      if (curr._id) {
        acc[curr._id.toString()] = curr.count;
      }
      return acc;
    }, {});

    // 2. Get Member Counts (New)
    const CommunityMember = require('../models/communityMember');
    const memberStats = await CommunityMember.aggregate([
      { $match: { status: 'Approved' } }, // Only count approved members
      { $group: { _id: '$community_id', count: { $sum: 1 } } }
    ]);
    const memberStatsMap = memberStats.reduce((acc, curr) => {
      if (curr._id) {
        acc[curr._id.toString()] = curr.count; // Ensure ID is string for lookup
      }
      return acc;
    }, {});

    const enrichedDocs = communities.map(doc => ({
      ...doc.toObject(),
      eventCount: eventStatsMap[doc.owner_id?._id?.toString()] || 0,
      memberCount: memberStatsMap[doc._id.toString()] || 0 // Default to 0
    }));

    res.json({
      communities: enrichedDocs,
      stats: {
        total: communities.length,
        verified: communities.filter(c => c.is_verified).length,
        unverified: communities.filter(c => !c.is_verified).length
      }
    });
  } catch (error) {
    console.error('Get admin communities error:', error);
    res.status(500).json({ message: 'Failed to fetch communities' });
  }
};

exports.createCommunity = async (req, res) => {
  try {
    let { name, slug, description, category, advisor, owner_id, tagline } = req.body;

    // Parse advisor if it's a string (from FormData)
    if (typeof advisor === 'string') {
      try {
        advisor = JSON.parse(advisor);
      } catch (e) {
        console.error('Advisor parsing error:', e);
      }
    }

    const community = new Community({
      name,
      slug,
      description,
      category,
      advisor,
      tagline,
      owner_id: owner_id || req.user.id,
      is_verified: true // Admin-created are auto-verified
    });

    // Handle Image Uploads
    if (req.files) {
      if (req.files.logo) {
        community.logo = resolveFilePath(req.files.logo[0]);
      }
      if (req.files.banner) {
        community.banner = resolveFilePath(req.files.banner[0]);
      }
    }

    await community.save();

    // Audit Log
    await AuditLog.create({
      admin_id: req.user.id,
      action: 'CREATE_COMMUNITY_MANUAL',
      target_type: 'Community',
      target_id: community._id,
      details: { name: community.name },
      ip_address: req.ip
    });

    res.status(201).json(community);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

exports.updateCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    let updates = req.body;

    // Parse sub-objects if they are strings (from FormData)
    if (typeof updates.advisor === 'string') {
      try {
        updates.advisor = JSON.parse(updates.advisor);
      } catch (e) {}
    }

    // Handle Image Uploads
    if (req.files) {
      if (req.files.logo) {
        updates.logo = resolveFilePath(req.files.logo[0]);
      }
      if (req.files.banner) {
        updates.banner = resolveFilePath(req.files.banner[0]);
      }
    }

    const community = await Community.findByIdAndUpdate(id, updates, { new: true });
    
    if (!community) return res.status(404).json({ message: 'Community not found' });

    res.json(community);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

exports.deleteCommunity = async (req, res) => {
  try {
    const community = await Community.findByIdAndDelete(req.params.id);
    if (!community) return res.status(404).json({ message: 'Community not found' });

    res.json({ message: 'Community deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
