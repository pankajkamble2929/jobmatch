const express = require("express");
const { saveJob, removeSavedJob, getSavedJobs } = require("../controllers/savedJobController");
const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

// Jobseeker routes only
router.post("/", protect, authorize("jobseeker"), saveJob);
router.delete("/:jobId", protect, authorize("jobseeker"), removeSavedJob);
router.get("/", protect, authorize("jobseeker"), getSavedJobs);

module.exports = router;
