const express = require("express");
const {
  getAllUsers,
  deleteUser,
  getAllJobs,
  deleteJob,
  getAllApplications,
  updateApplicationStatus
} = require("../controllers/adminController");

const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

// Admin-only routes
router.use(protect);
router.use(authorize("admin"));

// Users
router.get("/users", getAllUsers);
router.delete("/users/:userId", deleteUser);

// Jobs
router.get("/jobs", getAllJobs);
router.delete("/jobs/:jobId", deleteJob);

// Applications
router.get("/applications", getAllApplications);
router.put("/applications/:applicationId", updateApplicationStatus);

module.exports = router;
