const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude password
    res.json({ count: users.length, users });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Server error while fetching users" });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error while deleting user" });
  }
};

// Get all jobs
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("createdBy", "name email");
    res.json({ count: jobs.length, jobs });
  } catch (error) {
    console.error("Get all jobs error:", error);
    res.status(500).json({ message: "Server error while fetching jobs" });
  }
};

// Delete a job
const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    await Job.findByIdAndDelete(jobId);
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Delete job error:", error);
    res.status(500).json({ message: "Server error while deleting job" });
  }
};

// Get all applications
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("job", "title")
      .populate("applicant", "name email location skills");
    res.json({ count: applications.length, applications });
  } catch (error) {
    console.error("Get all applications error:", error);
    res.status(500).json({ message: "Server error while fetching applications" });
  }
};

// Update application status
const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );
    res.json({ message: "Application status updated", application });
  } catch (error) {
    console.error("Update application status error:", error);
    res.status(500).json({ message: "Server error while updating status" });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getAllJobs,
  deleteJob,
  getAllApplications,
  updateApplicationStatus
};
