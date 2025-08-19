const User = require("../models/User");
const Job = require("../models/Job");

// Save a job
const saveJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const user = await User.findById(req.user._id);

    if (user.savedJobs.includes(jobId)) {
      return res.status(400).json({ message: "Job already saved" });
    }

    user.savedJobs.push(jobId);
    await user.save();

    res.json({ message: "Job saved successfully", savedJobs: user.savedJobs });
  } catch (error) {
    console.error("Save job error:", error);
    res.status(500).json({ message: "Server error while saving job" });
  }
};

// Remove a saved job
const removeSavedJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const user = await User.findById(req.user._id);

    user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
    await user.save();

    res.json({ message: "Job removed from saved list", savedJobs: user.savedJobs });
  } catch (error) {
    console.error("Remove saved job error:", error);
    res.status(500).json({ message: "Server error while removing saved job" });
  }
};

// Get all saved jobs
const getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("savedJobs");
    res.json({ count: user.savedJobs.length, savedJobs: user.savedJobs });
  } catch (error) {
    console.error("Get saved jobs error:", error);
    res.status(500).json({ message: "Server error while fetching saved jobs" });
  }
};

module.exports = { saveJob, removeSavedJob, getSavedJobs };
