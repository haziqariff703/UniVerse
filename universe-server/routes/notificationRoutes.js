const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const { auth, authorize } = require("../middleware/auth");

// Student/All User Routes
router.get("/", auth, notificationController.getMyNotifications);
router.patch("/:id/read", auth, notificationController.markAsRead);
router.put("/read-all", auth, notificationController.markAllAsRead);

// Organizer Routes
router.post("/organizer", auth, authorize("organizer", "admin"), notificationController.createOrganizerBroadcast);
router.get("/organizer", auth, authorize("organizer", "admin"), notificationController.getOrganizerBroadcasts);



module.exports = router;

