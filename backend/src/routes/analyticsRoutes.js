const express = require("express");
const { getRecruiterAnalytics } = require("../controllers/analyticsController");
const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

// Only recruiters can access analytics
router.get("/", protect, authorize("recruiter"), getRecruiterAnalytics);

module.exports = router;
