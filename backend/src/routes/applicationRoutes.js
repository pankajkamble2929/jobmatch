const express = require("express");
const {
  applyJob,
  getJobApplications,
  updateApplicationStatus,
  getAppliedJobsForUser // import new controller function
} = require("../controllers/applicationController");
const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

// Apply for a job (Job seekers only)
router.post("/", protect, authorize("jobseeker"), applyJob);

// Get all applied jobs for logged-in jobseeker
router.get("/", protect, authorize("jobseeker"), getAppliedJobsForUser);

// Get applications for a job (Recruiter/Admin only)
router.get("/:jobId", protect, authorize("recruiter", "admin"), getJobApplications);

// Update application status (Recruiter/Admin only)
router.put("/:id/status", protect, authorize("recruiter", "admin"), updateApplicationStatus);

module.exports = router;
