// routes/matchRoutes.js
const express = require("express");
const { getRecommendations } = require("../controllers/matchController");
const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

// jobseekers only
router.get("/", protect, authorize("jobseeker"), getRecommendations);

module.exports = router;
