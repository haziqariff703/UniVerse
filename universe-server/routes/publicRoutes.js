const express = require("express");
const router = express.Router();
const publicController = require("../controllers/publicController");

const notificationController = require("../controllers/notificationController");
router.get("/stats", publicController.getPublicStats);
router.get("/news", notificationController.getPublicNews);

module.exports = router;
