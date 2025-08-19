const Notification = require("../models/Notification");
const { getIo, connectedUsers } = require("../utils/socket");
const sendEmail = require("../utils/email"); // optional if you want email notifications
const User = require("../models/User");

/**
 * Create a notification for a user
 * Sends real-time Socket.io notification
 * Optionally sends email notification
 */
const createNotification = async ({ userId, type, message }) => {
  try {
    if (!userId) throw new Error("userId is required");

    // Save notification in DB
    const notification = await Notification.create({ user: userId, type, message });

    // Send Socket.io notification if user is online
    const io = getIo(); // safely get io instance
    const socketId = connectedUsers[userId];
    if (socketId) {
      io.to(socketId).emit("newNotification", notification);
    }

    // Optional: send email notification if user has email
    const user = await User.findById(userId);
    if (user && user.email) {
      try {
        await sendEmail({
          to: user.email,
          subject: "JobMatch Notification",
          text: message
        });
      } catch (emailErr) {
        console.error("Error sending email notification:", emailErr.message);
      }
    }

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error.message);
    throw error; // propagate error if needed
  }
};

/**
 * Get all notifications for the logged-in user
 */
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ count: notifications.length, notifications });
  } catch (error) {
    console.error("Get notifications error:", error.message);
    res.status(500).json({ message: "Server error while fetching notifications" });
  }
};

/**
 * Mark a notification as read
 */
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.read = true;
    await notification.save();

    res.json({ message: "Notification marked as read", notification });
  } catch (error) {
    console.error("Mark as read error:", error.message);
    res.status(500).json({ message: "Server error while updating notification" });
  }
};

module.exports = { createNotification, getNotifications, markAsRead };
