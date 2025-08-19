const express = require("express");
const { getNotifications, markAsRead } = require("../controllers/notificationController");
const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

// Jobseeker can get their notifications
router.get("/", protect, authorize("jobseeker"), getNotifications);

// Mark notification as read
router.put("/:id/read", protect, authorize("jobseeker"), markAsRead);

module.exports = router;
