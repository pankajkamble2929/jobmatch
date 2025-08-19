const express = require("express");
const router = express.Router();
const {
  createJob,
  getJobs,
  searchJobs,
  getJobBySlug,
  getJobsByCity, // new controller
} = require("../controllers/jobController");
const { protect, authorize, optionalAuth } = require("../middlewares/auth");

// Public routes
router.get("/", getJobs);
router.get("/search", searchJobs);
router.get("/:slug", optionalAuth, getJobBySlug);

// GET jobs by city slug
router.get("/city/:citySlug", getJobsByCity);

// Protected route for creating jobs (only recruiters/admins)
router.post("/", protect, authorize("recruiter", "admin"), createJob);

module.exports = router;
