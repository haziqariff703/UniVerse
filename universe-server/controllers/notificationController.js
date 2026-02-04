const Notification = require("../models/notification");
const BroadcastLog = require("../models/broadcastLog");
const User = require("../models/user");
const Registration = require("../models/registration");
const Event = require("../models/event");

/**
 * @desc    Get notifications for the logged-in user
 * @route   GET /api/notifications
 * @access  Private
 */
exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient_id: req.user.id })
      .sort({ created_at: -1 })
      .limit(50);

    res.json({ notifications });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

/**
 * @desc    Mark a notification as read
 * @route   PATCH /api/notifications/:id/read
 * @access  Private
 */
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient_id: req.user.id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification marked as read", notification });
  } catch (error) {
    console.error("Mark read error:", error);
    res.status(500).json({ message: "Failed to update notification" });
  }
};

/**
 * @desc    Mark all notifications as read for the logged-in user
 * @route   PUT /api/notifications/read-all
 * @access  Private
 */
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient_id: req.user.id, read: false },
      { read: true }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark all read error:", error);
    res.status(500).json({ message: "Failed to update notifications" });
  }
};

/**
 * @desc    Broadcast system notification (Admin)
 * @route   POST /api/admin/notifications
 * @access  Admin
 */
exports.createAdminBroadcast = async (req, res) => {
  try {
    const { message, type, target_role } = req.body;
    const title = type === "alert" ? "Action Required" : type === "success" ? "Success Alert" : "System Information";

    // 1. Create Broadcast Log
    const broadcast = new BroadcastLog({
      sender_id: req.user.id,
      target_role: target_role || "all",
      message,
      title,
      type: type || "info",
    });
    await broadcast.save();

    // 2. Find target users
    const query = {};
    if (target_role && target_role !== "all") {
      query.roles = target_role;
    }

    const users = await User.find(query).select("_id");

    // 3. Simple Fan-out (In a real app, this should be a background job)
    const notifications = users.map((u) => ({
      recipient_id: u._id,
      title,
      message,
      type: type || "info",
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({ 
      message: `Broadcast sent to ${users.length} users`,
      broadcast 
    });
  } catch (error) {
    console.error("Admin broadcast error:", error);
    res.status(500).json({ message: "Failed to send broadcast" });
  }
};

/**
 * @desc    Get all broadcast logs (Admin)
 * @route   GET /api/admin/notifications
 * @access  Admin
 */
exports.getAdminBroadcasts = async (req, res) => {
  try {
    const notifications = await BroadcastLog.find()
      .populate("sender_id", "name")
      .sort({ created_at: -1 })
      .limit(50);

    res.json({ notifications });
  } catch (error) {
    console.error("Get broadcasts error:", error);
    res.status(500).json({ message: "Failed to fetch broadcast logs" });
  }
};

/**
 * @desc    Delete a broadcast log (Admin)
 * @route   DELETE /api/admin/notifications/:id
 * @access  Admin
 */
exports.deleteBroadcast = async (req, res) => {
  try {
    const broadcast = await BroadcastLog.findByIdAndDelete(req.params.id);
    if (!broadcast) {
      return res.status(404).json({ message: "Log not found" });
    }
    res.json({ message: "Broadcast log deleted" });
  } catch (error) {
    console.error("Delete broadcast error:", error);
    res.status(500).json({ message: "Failed to delete log" });
  }
};

/**
 * @desc    Organizer broadcast to specific audiences
 * @route   POST /api/notifications/organizer
 * @access  Organizer
 */
exports.createOrganizerBroadcast = async (req, res) => {
  try {
    const { event_id, subject, message, target_audience } = req.body;

    if (!target_audience) {
      return res.status(400).json({ message: "Target audience is required" });
    }

    let recipientIds = [];
    let relatedEvent = null;

    if (event_id && event_id !== "none") {
      relatedEvent = await Event.findById(event_id);
      if (!relatedEvent) return res.status(404).json({ message: "Event not found" });

      // Verify ownership/leadership
      const isOwner = relatedEvent.organizer_id.toString() === req.user.id;
      const isAdmin = req.user.roles.includes('admin');
      if (!isOwner && !isAdmin) {
         // Check community leader
         const CommunityMember = require('../models/communityMember');
         const membership = await CommunityMember.findOne({
           community_id: relatedEvent.community_id,
           user_id: req.user.id,
           status: 'Approved'
         });
         if (!membership || !['President', 'Vice President', 'High Committee'].includes(membership.role)) {
            return res.status(403).json({ message: "Unauthorized to broadcast for this event" });
         }
      }
    }

    // 1. Determine Recipient IDs
    if (target_audience === 'attendees' && event_id) {
      const registrations = await Registration.find({ event_id, status: 'Confirmed' }).select("user_id");
      recipientIds = registrations.map(r => r.user_id);
    } else if (target_audience === 'workforce' && event_id) {
      const crew = await EventCrew.find({ event_id, status: 'accepted' }).select("user_id");
      recipientIds = crew.map(c => c.user_id);
    } else if (target_audience === 'students') {
      const User = require('../models/user');
      const students = await User.find({ roles: 'student' }).select("_id");
      recipientIds = students.map(s => s._id);
    }

    if (recipientIds.length === 0) {
      return res.status(400).json({ message: "No recipients found for the selected audience" });
    }

    // 2. Log the broadcast
    const broadcast = new BroadcastLog({
      sender_id: req.user.id,
      target_event_id: relatedEvent ? relatedEvent._id : null,
      target_role: target_audience === 'students' ? 'student' : 'all',
      title: subject,
      message,
      type: "info",
    });
    await broadcast.save();

    // 3. Fan-out notifications
    const notifications = recipientIds.map(uid => ({
      recipient_id: uid,
      title: subject,
      message,
      type: "info",
      related_event_id: relatedEvent ? relatedEvent._id : null
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({ 
      message: `Broadcast message sent to ${recipientIds.length} members`,
      broadcast 
    });
  } catch (error) {
    console.error("Organizer broadcast error:", error);
    res.status(500).json({ message: "Failed to send broadcast" });
  }
};


/**
 * @desc    Get organizer broadcast history
 * @route   GET /api/notifications/organizer
 * @access  Organizer
 */
exports.getOrganizerBroadcasts = async (req, res) => {
  try {
    const broadcasts = await BroadcastLog.find({ sender_id: req.user.id })
      .populate("target_event_id", "title")
      .sort({ created_at: -1 })
      .limit(20);

    res.json({ 
      broadcasts: broadcasts.map(b => ({
        id: b._id,
        subject: b.title,
        event: b.target_event_id?.title || "Unknown Event",
        message: b.message,
        date: new Date(b.created_at).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        status: "delivered", // Static for now as we don't track per-recipient delivery
        sent_to: "N/A" // We could count recipients if needed
      }))
    });
  } catch (error) {
    console.error("Organizer history error:", error);
    res.status(500).json({ message: "Failed to fetch broadcast history" });
  }
};

