const mongoose = require("mongoose");

const broadcastLogSchema = new mongoose.Schema({
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  target_role: {
    type: String,
    enum: ["all", "student", "organizer"],
    default: "all",
  },
  target_event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    default: null,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["info", "alert", "success"],
    default: "info",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("BroadcastLog", broadcastLogSchema);
