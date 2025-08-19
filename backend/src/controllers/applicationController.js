const Application = require("../models/Application");
const Job = require("../models/Job");
const { createNotification } = require("./notificationController");

// Apply for a job
const applyJob = async (req, res) => {
  try {
    const { jobId, coverLetter, resume } = req.body;

    if (!jobId || !coverLetter || !resume) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user._id
    });
    if (existingApplication) {
      return res.status(400).json({ message: "You already applied to this job" });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      coverLetter,
      resume
    });

    res.status(201).json(application);
  } catch (error) {
    console.error("Apply job error:", error);
    res.status(500).json({ message: "Server error while applying for job" });
  }
};

// Get applications for a job
const getJobApplications = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const applications = await Application.find({ job: jobId })
      .populate("applicant", "name email skills location");

    res.json(applications);
  } catch (error) {
    console.error("Get job applications error:", error);
    res.status(500).json({ message: "Server error while fetching applications" });
  }
};

// Update application status
const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params; // match route param
    const { status } = req.body;

    const validStatuses = ["pending", "reviewed", "accepted", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(applicationId).populate("job");

    if (!application) return res.status(404).json({ message: "Application not found" });

    // Only recruiter who posted the job or admin can update
    if (
      application.job.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update status
    application.status = status;
    await application.save();

    // Send notification
    await createNotification({
      userId: application.applicant,
      type: "application_update",
      message: `Your application for "${application.job.title}" is now "${status}"`
    });

    res.json({ message: "Application status updated", application });
  } catch (error) {
    console.error("Update application status error:", error);
    res.status(500).json({ message: "Server error while updating status" });
  }
};

// Get all applied jobs for logged-in jobseeker
const getAppliedJobsForUser = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate("job");

    const appliedJobs = applications.map(app => app.job);

    res.json({ count: appliedJobs.length, appliedJobs });
  } catch (error) {
    console.error("Get applied jobs error:", error);
    res.status(500).json({ message: "Server error while fetching applied jobs" });
  }
};

module.exports = { applyJob, getJobApplications, updateApplicationStatus, getAppliedJobsForUser };
