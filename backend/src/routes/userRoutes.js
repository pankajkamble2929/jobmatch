const express = require("express");
const { updateProfile, getRecommendations, getProfile } = require("../controllers/userController");
const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

// Get user profile
router.get("/profile", protect, authorize("jobseeker"), getProfile);

// Update profile
router.put("/profile", protect, authorize("jobseeker"), updateProfile);

// Get recommendations
router.get("/recommendations", protect, authorize("jobseeker"), getRecommendations);

module.exports = router;
