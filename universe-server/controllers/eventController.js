const Event = require('../models/event');
const Speaker = require('../models/speaker'); // Required for populate
const Review = require('../models/review');
const Registration = require('../models/registration');
const AuditLog = require('../models/auditLog');
const EventCrew = require('../models/eventCrew');
const CommunityMember = require('../models/communityMember');

// Leadership roles that grant event visibility
const LEADERSHIP_ROLES = ['President', 'Secretary', 'Treasurer', 'Committee', 'AJK'];

/**
 * Helper function to get all event IDs a user has access to.
 * Access is granted if the user is:
 * 1. The organizer (owner) of the event.
 * 2. An accepted crew member of the event.
 * 3. A leader (AJK, President, etc.) of the community that hosts the event.
 */
const getAccessibleEventIds = async (userId) => {
  // 1. Get events owned by the user
  const ownedEvents = await Event.find({ organizer_id: userId }).select('_id');
  const ownedEventIds = ownedEvents.map(e => e._id);

  // 2. Get events where user is an accepted crew member
  const crewAssignments = await EventCrew.find({ user_id: userId, status: 'accepted' });
  const crewEventIds = crewAssignments.map(c => c.event_id);

  // 3. Get communities where user is a leader
  const leaderMemberships = await CommunityMember.find({
    user_id: userId,
    role: { $in: LEADERSHIP_ROLES },
    status: 'Approved'
  });
  const leaderCommunityIds = leaderMemberships.map(m => m.community_id);

  // Get events belonging to those communities
  const communityEvents = await Event.find({ community_id: { $in: leaderCommunityIds } }).select('_id');
  const communityEventIds = communityEvents.map(e => e._id);

  // Combine and deduplicate
  const allEventIds = [...new Set([
    ...ownedEventIds.map(id => id.toString()),
    ...crewEventIds.map(id => id.toString()),
    ...communityEventIds.map(id => id.toString())
  ])];

  return allEventIds;
};

/**
 * @desc    Get all events (with optional filters)
 * @route   GET /api/events
 * @access  Public
 */
exports.getAllEvents = async (req, res) => {
  try {
    const { category, status, search, is_featured, upcoming } = req.query;
    
    // Build filter object
    let filter = {};
    
    // Category filter (for the new category field)
    if (category && category !== 'All') {
      filter.category = category;
    }
    
    // Status filter
    if (status) {
      if (status !== 'all') {
        filter.status = status;
      }
      // if status is 'all', we don't add status to filter
    } else {
      // By default, only show approved events to the public
      filter.status = 'approved';
    }

    // Featured filter
    if (is_featured === 'true') {
      filter.is_featured = true;
    }

    // Upcoming filter (date is in the future or past)
    if (upcoming === 'true') {
      filter.date_time = { $gte: new Date() };
    } else if (upcoming === 'false') {
      filter.date_time = { $lt: new Date() };
    }

    // Search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const events = await Event.find(filter)
      .populate('organizer_id', 'name email')
      .populate('venue_id', 'name location_code')
      .populate('speaker_ids', 'name expertise')
      .sort({ date_time: 1 }); // Sort by upcoming first

    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

exports.getMyEvents = async (req, res) => {
  try {
    const CommunityMember = require('../models/communityMember');
    
    // Find communities where user is an approved member (AJK, President, etc.)
    const memberships = await CommunityMember.find({ 
      user_id: req.user.id, 
      status: 'Approved' 
    });
    
    const communityIds = memberships.map(m => m.community_id);
    
    // Find events where user is an accepted crew member
    const crewAssignments = await EventCrew.find({ 
      user_id: req.user.id, 
      status: 'accepted' 
    });
    const crewEventIds = crewAssignments.map(c => c.event_id);
    
    console.log("Fetching events for user's communities:", communityIds);
    console.log("Fetching events for user's crew assignments:", crewEventIds);
    
    // Find events that belong to these communities OR were created by this user directly OR user is crew member
    const events = await Event.find({ 
      $or: [
        { community_id: { $in: communityIds } },
        { organizer_id: req.user.id },
        { _id: { $in: crewEventIds } }
      ]
    })
      .populate('venue_id', 'name location_code')
      .populate('community_id', 'name slug')
      .sort({ date_time: -1 });

    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

/**
 * @desc    Get all events for a specific venue
 * @route   GET /api/venues/:id/events
 * @access  Public/Organizer
 */
exports.getEventsByVenue = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query;

    let filter = { venue_id: id };

    if (status === 'all') {
      // Don't add status filter to get all
    } else if (status) {
      filter.status = status;
    } else {
      filter.status = 'approved';
    }

    const events = await Event.find(filter)
      .populate('organizer_id', 'name email')
      .populate('venue_id', 'name location_code')
      .sort({ date_time: 1 });

    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};


/**
 * @desc    Get single event by ID
 * @route   GET /api/events/:id
 * @access  Public
 */
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer_id', 'name email')
      .populate('venue_id', 'name location_code max_capacity facilities')
      .populate('speaker_ids', 'name expertise bio');

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

/**
 * @desc    Create a new event
 * @route   POST /api/events
 * @access  Private (Admin/Organizer)
 */
exports.createEvent = async (req, res) => {
  try {
    // Set organizer_id from authenticated user
    // Set organizer_id from authenticated user
    const eventData = {
      ...req.body,
      organizer_id: req.user.id
    };

    if (req.files) {
      if (req.files['image']) {
        eventData.image = req.files['image'][0].path.replace(/\\/g, "/");
      }
      if (req.files['proposal']) {
        eventData.proposal = req.files['proposal'][0].path.replace(/\\/g, "/");
      }
    }

    console.log("Creating event for user:", req.user.id);
    console.log("Event Data:", eventData);

    const newEvent = new Event(eventData);
    const savedEvent = await newEvent.save();
    
    res.status(201).json({
      message: "Event created successfully!",
      event: savedEvent
    });
  } catch (err) {
    res.status(400).json({ message: "Validation Error", error: err.message });
  }
};

/**
 * @desc    Update an event
 * @route   PUT /api/events/:id
 * @access  Private (Admin/Organizer)
 */
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    // Authorization: Owner, Admin, or approved member of the hosting community
    const isOwner = event.organizer_id.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    let isCommunityMember = false;
    if (event.community_id) {
      const CommunityMember = require('../models/communityMember');
      const membership = await CommunityMember.findOne({
        community_id: event.community_id,
        user_id: req.user.id,
        status: 'Approved'
      });
      if (membership) isCommunityMember = true;
    }

    if (!isOwner && !isAdmin && !isCommunityMember) {
      return res.status(403).json({ message: "Not authorized to update this event." });
    }

    const updateData = { ...req.body };

    // Sanitize reference fields: extract ObjectId from populated objects
    const refFields = ['organizer_id', 'venue_id', 'community_id'];
    refFields.forEach(field => {
      if (updateData[field] && typeof updateData[field] === 'object' && updateData[field]._id) {
        updateData[field] = updateData[field]._id;
      }
    });

    // Sanitize speaker_ids array
    if (updateData.speaker_ids && Array.isArray(updateData.speaker_ids)) {
      updateData.speaker_ids = updateData.speaker_ids.map(s => 
        typeof s === 'object' && s._id ? s._id : s
      );
    }

    // Handle File Uploads
    if (req.files) {
      if (req.files['image']) {
        updateData.image = req.files['image'][0].path.replace(/\\/g, "/");
      }
      if (req.files['proposal']) {
        updateData.proposal = req.files['proposal'][0].path.replace(/\\/g, "/");
      }
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Event updated successfully!",
      event: updatedEvent
    });
  } catch (err) {
    console.error("Event Update Error:", err);
    res.status(400).json({ message: "Update Error", error: err.message });
  }
};

/**
 * @desc    Delete an event
 * @route   DELETE /api/events/:id
 * @access  Private (Admin only)
 */
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    await Event.findByIdAndDelete(req.params.id);

    // TODO: Log to AuditLog collection

    res.status(200).json({ message: "Event deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Delete Error", error: err.message });
  }
};

/**
 * @desc    Get analytics for organizer's events
 * @route   GET /api/events/organizer/analytics
 * @access  Private (Organizer/Admin)
 */
exports.getOrganizerAnalytics = async (req, res) => {
  try {
    const organizerId = req.user.id;

    // Get all events by this organizer
    const events = await Event.find({ organizer_id: organizerId });
    const eventIds = events.map(e => e._id);

    // Get all reviews for these events
    const reviews = await Review.find({ event_id: { $in: eventIds } });

    // Calculate Metrics
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : 0;

    // Rating Distribution
    const distribution = {
      "5 Stars": 0,
      "4 Stars": 0,
      "3 Stars": 0,
      "2 Stars": 0,
      "1 Star": 0
    };

    reviews.forEach(r => {
      const label = r.rating === 1 ? "1 Star" : `${r.rating} Stars`;
      if (distribution[label] !== undefined) {
        distribution[label]++;
      }
    });

    const chartData = Object.entries(distribution)
      .reverse()
      .map(([name, value]) => ({ name, value }));

    // Sentiment Heuristic (Simple estimation based on rating)
    // 4-5 stars = Positive, 3 = Neutral, 1-2 = Negative
    const positiveCount = reviews.filter(r => r.rating >= 4).length;
    const sentimentScore = totalReviews > 0
      ? Math.round((positiveCount / totalReviews) * 100)
      : 0;

    res.status(200).json({
      totalReviews,
      avgRating,
      sentimentScore,
      chartData,
      totalEvents: events.length
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

/**
 * @desc    Get all reviews for organizer's events
 * @route   GET /api/events/organizer/reviews
 * @access  Private (Organizer/Admin)
 */
exports.getOrganizerReviews = async (req, res) => {
  try {
    const organizerId = req.user.id;
    const { event_id } = req.query;

    // Get all accessible events (owned, crew, or community leader)
    let eventIds = await getAccessibleEventIds(organizerId);

    // If a specific event_id is requested, filter to just that one (if accessible)
    if (event_id) {
      if (eventIds.includes(event_id.toString())) {
        eventIds = [event_id];
      } else {
        return res.status(403).json({ message: "Unauthorized" });
      }
    }

    const events = await Event.find({ _id: { $in: eventIds } });

    const reviews = await Review.find({ event_id: { $in: eventIds } })
      .populate('user_id', 'name email')
      .populate('event_id', 'title')
      .sort({ created_at: -1 });

    // Map to match frontend expectations
    const formattedReviews = reviews.map(r => ({
      id: r._id,
      user_name: r.user_id?.name || "Anonymous",
      user_initials: (r.user_id?.name || "A").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
      event_title: r.event_id?.title || "Unknown Event",
      rating: r.rating,
      comment: r.comment,
      date: r.created_at,
      sentiment: r.rating >= 4 ? "positive" : r.rating <= 2 ? "negative" : "neutral"
    }));

    res.status(200).json(formattedReviews);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

/**
 * @desc    Get financial statistics for organizer
 * @route   GET /api/events/organizer/finance-stats
 * @access  Private (Organizer/Admin)
 */
exports.getOrganizerFinanceStats = async (req, res) => {
  try {
    const organizerId = req.user.id;

    // Get all accessible events (owned, crew, or community leader)
    const eventIds = await getAccessibleEventIds(organizerId);

    // Get all valid registrations for these events
    const registrations = await Registration.find({ 
      event_id: { $in: eventIds },
      status: { $in: ['Confirmed', 'CheckedIn'] }
    }).populate('event_id', 'ticket_price title');

    // Calculate Core Metrics
    let totalRevenue = 0;
    let ticketsSold = registrations.length;
    let activeRegistrations = registrations.filter(r => r.status === 'Confirmed').length;
    
    registrations.forEach(r => {
      totalRevenue += (r.event_id?.ticket_price || 0);
    });

    const avgTicketPrice = ticketsSold > 0 ? (totalRevenue / ticketsSold).toFixed(2) : 0;

    // Monthly Performance Trends (Last 7 months)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const performanceMap = {};
    
    // Initialize last 7 months with zero
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthLabel = monthNames[d.getMonth()];
      performanceMap[monthLabel] = { name: monthLabel, revenue: 0, registrations: 0 };
    }

    registrations.forEach(r => {
      const date = new Date(r.booking_time);
      const monthLabel = monthNames[date.getMonth()];
      if (performanceMap[monthLabel]) {
        performanceMap[monthLabel].revenue += (r.event_id?.ticket_price || 0);
        performanceMap[monthLabel].registrations += 1;
      }
    });

    const revenueData = Object.values(performanceMap);

    // Growth Trend Calculation (this month vs last month)
    const now = new Date();
    const thisMonth = now.getMonth();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const thisMonthLabel = monthNames[thisMonth];
    const lastMonthLabel = monthNames[lastMonth];

    const thisMonthStats = performanceMap[thisMonthLabel] || { revenue: 0, registrations: 0 };
    const lastMonthStats = performanceMap[lastMonthLabel] || { revenue: 0, registrations: 0 };

    const calcGrowth = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return (((current - previous) / previous) * 100).toFixed(1);
    };

    const trends = {
      revenueTrend: calcGrowth(thisMonthStats.revenue, lastMonthStats.revenue),
      ticketsTrend: calcGrowth(thisMonthStats.registrations, lastMonthStats.registrations),
      avgPriceTrend: 0, // Not enough data within a month for accurate avg price shifts
      registrationTrend: calcGrowth(thisMonthStats.registrations, lastMonthStats.registrations)
    };

    // Recent Activity - Get latest 5 registrations
    const recentRegs = await Registration.find({ event_id: { $in: eventIds } })
      .sort({ booking_time: -1 })
      .limit(5)
      .populate('event_id', 'title')
      .populate('user_id', 'name');

    const recentActivity = recentRegs.map(r => ({
      id: r._id,
      type: 'registration',
      message: `New registration for '${r.event_id?.title || 'Unknown Event'}'`,
      time: r.booking_time,
      status: r.status
    }));

    // Insight data
    const insight = {
      label: "REGISTRATION TREND",
      value: `${trends.registrationTrend > 0 ? '+' : ''}${trends.registrationTrend}%`,
      positive: parseFloat(trends.registrationTrend) >= 0
    };

    res.status(200).json({
      totalRevenue,
      ticketsSold,
      avgTicketPrice,
      activeRegistrations,
      revenueData,
      trends,
      recentActivity,
      insight
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

/**
 * @desc    Get transaction history for organizer
 * @route   GET /api/events/organizer/transactions
 * @access  Private (Organizer/Admin)
 */
exports.getOrganizerTransactions = async (req, res) => {
  try {
    const organizerId = req.user.id;

    // Get all accessible events (owned, crew, or community leader)
    const eventIds = await getAccessibleEventIds(organizerId);

    const registrations = await Registration.find({ 
      event_id: { $in: eventIds }
    })
    .populate('event_id', 'title ticket_price')
    .sort({ booking_time: -1 });

    const transactions = registrations.map(r => ({
      id: r._id,
      event: r.event_id?.title || "Unknown Event",
      amount: r.event_id?.ticket_price || 0,
      date: r.booking_time,
      status: r.status.toLowerCase(),
      type: "income"
    }));

    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

/**
 * @desc    Get event-specific analytics for dashboard
 * @route   GET /api/events/:id/analytics
 * @access  Private (Organizer/Admin)
 */
exports.getEventAnalytics = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    // Verify event belongs to organizer or user is crew member
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user has access to this event (owner, crew, or community leader)
    const accessibleEventIds = await getAccessibleEventIds(userId);
    
    // Check if the requested eventId is in the accessible list
    // Ensure we compare strings
    const hasAccess = accessibleEventIds.some(id => id.toString() === eventId.toString());

    if (!hasAccess && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Get registrations for this event
    const registrations = await Registration.find({ event_id: eventId })
      .sort({ booking_time: -1 })
      .populate('user_id', 'name');

    // Calculate stats
    const totalRegistered = registrations.length;
    const checkedIn = registrations.filter(r => r.status === 'CheckedIn').length;
    const confirmed = registrations.filter(r => r.status === 'Confirmed').length;
    const cancelled = registrations.filter(r => r.status === 'Cancelled').length;

    // Registration trends (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);

      const count = registrations.filter(r => {
        const bookingDate = new Date(r.booking_time);
        return bookingDate >= d && bookingDate < nextDay;
      }).length;

      last7Days.push({
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        value: count
      });
    }

    // Calculate insight (this week vs last week)
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const thisWeekRegs = registrations.filter(r => new Date(r.booking_time) >= oneWeekAgo).length;
    const lastWeekRegs = registrations.filter(r => {
      const bookingDate = new Date(r.booking_time);
      return bookingDate >= twoWeeksAgo && bookingDate < oneWeekAgo;
    }).length;

    let growthPercent = 0;
    if (lastWeekRegs > 0) {
      growthPercent = (((thisWeekRegs - lastWeekRegs) / lastWeekRegs) * 100).toFixed(1);
    } else if (thisWeekRegs > 0) {
      growthPercent = 100;
    }

    const insight = {
      label: "REGISTRATION TREND",
      value: `${parseFloat(growthPercent) > 0 ? '+' : ''}${growthPercent}%`,
      positive: parseFloat(growthPercent) >= 0
    };

    // Get recent registrations (last 5)
    const recentRegistrations = registrations.slice(0, 5).map(r => ({
      id: r._id,
      type: 'registration',
      message: `${r.user_id?.name || 'Someone'} registered for this event`,
      time: r.booking_time,
      status: r.status
    }));

    // Get audit logs for this event
    const auditLogs = await AuditLog.find({ 
      target_type: 'Event',
      target_id: eventId 
    })
      .sort({ created_at: -1 })
      .limit(5)
      .populate('admin_id', 'name');

    const recentAuditActivity = auditLogs.map(log => ({
      id: log._id,
      type: 'audit',
      message: formatAuditMessage(log.action, log.details),
      time: log.created_at,
      status: log.action
    }));

    // Merge and sort recent activity by time
    const recentActivity = [...recentRegistrations, ...recentAuditActivity]
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5);

    res.status(200).json({
      stats: {
        totalRegistered,
        checkedIn,
        confirmed,
        cancelled,
        revenue: totalRegistered * (event.ticket_price || 0)
      },
      registrationTrends: last7Days,
      insight,
      recentActivity
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Helper function to format audit log messages
function formatAuditMessage(action, details) {
  const actionMessages = {
    'CREATE_EVENT': 'Event was created',
    'UPDATE_EVENT': 'Event details were updated',
    'APPROVE_EVENT': 'Event was approved by admin',
    'REJECT_EVENT': 'Event was rejected by admin',
    'DELETE_EVENT': 'Event was deleted',
    'CHECKIN_ATTENDEE': `Attendee ${details?.attendeeName || ''} was checked in`,
    'CANCEL_REGISTRATION': `Registration ${details?.registrationId || ''} was cancelled`,
    'UPDATE_REGISTRATION': `Registration status changed to ${details?.newStatus || ''}`
  };
  return actionMessages[action] || `Action: ${action}`;
}

/**
 * @desc    Get Category Intelligence data for organizer
 * @route   GET /api/events/organizer/category-intelligence
 * @access  Private (Organizer/Admin)
 */
exports.getCategoryIntelligence = async (req, res) => {
  try {
    const organizerId = req.user.id;

    // Get all accessible events (owned, crew, or community leader)
    const eventIds = await getAccessibleEventIds(organizerId);
    
    if (eventIds.length === 0) {
      return res.status(200).json({
        categoryData: [],
        insights: [],
        summary: { totalCategories: 0, bestPerformer: null, worstPerformer: null }
      });
    }

    const events = await Event.find({ _id: { $in: eventIds } });

    // Get all registrations for these events
    const registrations = await Registration.find({
      event_id: { $in: eventIds },
      status: { $in: ['Confirmed', 'CheckedIn'] }
    }).populate('event_id', 'ticket_price category title');

    // Get all reviews for these events
    const reviews = await Review.find({ event_id: { $in: eventIds } }).populate('event_id', 'category');

    // Aggregate by category
    const categoryStats = {};

    // Initialize categories with events
    events.forEach(event => {
      const cat = event.category || 'Uncategorized';
      if (!categoryStats[cat]) {
        categoryStats[cat] = {
          category: cat,
          totalEvents: 0,
          totalRevenue: 0,
          totalAttendees: 0,
          totalReviews: 0,
          ratingSum: 0,
          positiveReviews: 0,
          negativeReviews: 0,
          events: []
        };
      }
      categoryStats[cat].totalEvents++;
      categoryStats[cat].events.push({ id: event._id, title: event.title });
    });

    // Add revenue and attendance from registrations
    registrations.forEach(reg => {
      const cat = reg.event_id?.category || 'Uncategorized';
      if (categoryStats[cat]) {
        categoryStats[cat].totalRevenue += (reg.event_id?.ticket_price || 0);
        categoryStats[cat].totalAttendees++;
      }
    });

    // Add review data
    reviews.forEach(review => {
      const cat = review.event_id?.category || 'Uncategorized';
      if (categoryStats[cat]) {
        categoryStats[cat].totalReviews++;
        categoryStats[cat].ratingSum += review.rating;
        if (review.rating >= 4) categoryStats[cat].positiveReviews++;
        if (review.rating <= 2) categoryStats[cat].negativeReviews++;
      }
    });

    // Calculate derived metrics and generate insights
    const categoryData = Object.values(categoryStats).map(cat => {
      const avgRating = cat.totalReviews > 0 ? (cat.ratingSum / cat.totalReviews).toFixed(1) : 0;
      const sentimentScore = cat.totalReviews > 0 
        ? Math.round((cat.positiveReviews / cat.totalReviews) * 100) 
        : 0;
      const avgRevenuePerEvent = cat.totalEvents > 0 
        ? Math.round(cat.totalRevenue / cat.totalEvents) 
        : 0;
      const avgAttendeesPerEvent = cat.totalEvents > 0 
        ? Math.round(cat.totalAttendees / cat.totalEvents) 
        : 0;

      // Strategic Classification
      let classification = 'Neutral';
      if (cat.totalRevenue > 0 && parseFloat(avgRating) >= 4) {
        classification = 'High Performer';
      } else if (cat.totalRevenue > 0 && parseFloat(avgRating) < 3) {
        classification = 'Quality Issue';
      } else if (cat.totalRevenue === 0 && parseFloat(avgRating) >= 4) {
        classification = 'Community Builder';
      } else if (cat.totalAttendees === 0) {
        classification = 'Needs Attention';
      }

      return {
        category: cat.category,
        totalEvents: cat.totalEvents,
        totalRevenue: cat.totalRevenue,
        totalAttendees: cat.totalAttendees,
        totalReviews: cat.totalReviews,
        avgRating: parseFloat(avgRating),
        sentimentScore,
        avgRevenuePerEvent,
        avgAttendeesPerEvent,
        classification
      };
    });

    // Sort by revenue descending
    categoryData.sort((a, b) => b.totalRevenue - a.totalRevenue);

    // Generate Strategic Insights
    const insights = [];
    const bestRevenue = categoryData[0];
    const worstRating = [...categoryData].sort((a, b) => a.avgRating - b.avgRating)[0];
    const bestRating = [...categoryData].sort((a, b) => b.avgRating - a.avgRating)[0];

    if (bestRevenue && bestRevenue.totalRevenue > 0) {
      insights.push({
        type: 'success',
        title: 'Top Revenue Category',
        message: `"${bestRevenue.category}" events generated RM${bestRevenue.totalRevenue.toLocaleString()} in total revenue.`,
        action: 'Consider hosting more events in this category.'
      });
    }

    if (bestRating && bestRating.totalReviews > 0 && bestRating.avgRating >= 4) {
      insights.push({
        type: 'success',
        title: 'Highest Rated Category',
        message: `"${bestRating.category}" has an average rating of ${bestRating.avgRating}/5 stars.`,
        action: 'Great quality! Maintain these standards.'
      });
    }

    if (worstRating && worstRating.totalReviews > 0 && worstRating.avgRating < 3) {
      insights.push({
        type: 'warning',
        title: 'Quality Improvement Needed',
        message: `"${worstRating.category}" has an average rating of ${worstRating.avgRating}/5 stars.`,
        action: 'Review feedback and improve event quality.'
      });
    }

    const lowAttendance = categoryData.filter(c => c.avgAttendeesPerEvent < 5 && c.totalEvents > 0);
    if (lowAttendance.length > 0) {
      insights.push({
        type: 'info',
        title: 'Low Attendance Categories',
        message: `${lowAttendance.length} categor${lowAttendance.length > 1 ? 'ies' : 'y'} have less than 5 attendees per event on average.`,
        action: 'Consider improving marketing or event timing.'
      });
    }

    res.status(200).json({
      categoryData,
      insights,
      summary: {
        totalCategories: categoryData.length,
        bestPerformer: bestRevenue?.category || null,
        worstPerformer: worstRating?.category || null,
        totalRevenue: categoryData.reduce((sum, c) => sum + c.totalRevenue, 0),
        totalAttendees: categoryData.reduce((sum, c) => sum + c.totalAttendees, 0)
      }
    });
  } catch (err) {
    console.error('Category Intelligence Error:', err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
/**
 * @desc    Update event schedule
 * @route   PUT /api/events/:id/schedule
 * @access  Private (Organizer/Admin)
 */
exports.updateEventSchedule = async (req, res) => {
  try {
    const { schedule } = req.body;
    const eventId = req.params.id;
    const event = await Event.findById(eventId);

    if (!event) return res.status(404).json({ message: "Event not found" });

    // Verify ownership
    if (event.organizer_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized" });
    }

    event.schedule = schedule;
    await event.save();

    // Log the update
    await AuditLog.create({
      organizer_id: req.user.id,
      event_id: event._id,
      action: 'UPDATE_EVENT',
      details: `Updated event schedule for "${event.title}"`
    });

    res.status(200).json(event.schedule);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

/**
 * @desc    Update event tasks
 * @route   PUT /api/events/:id/tasks
 * @access  Private (Organizer/Admin)
 */
exports.updateEventTasks = async (req, res) => {
  try {
    const { tasks } = req.body;
    const eventId = req.params.id;
    const event = await Event.findById(eventId);

    if (!event) return res.status(404).json({ message: "Event not found" });

    // Verify ownership
    if (event.organizer_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized" });
    }

    event.tasks = tasks;
    await event.save();

    res.status(200).json(event.tasks);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
