const Job = require("../models/Job");
const User = require("../models/User");
const { createNotification } = require("./notificationController");
const { getIo, connectedUsers } = require("../utils/socket");
const { skillMatch, locationScore, recencyScore } = require("../utils/matcher");

// Create Job
const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      jobDescriptionPointers,
      jobRole,
      skillsRequired,
      location,
      salaryRange,
      employmentType,
      jobType,
      experience,
      openings
    } = req.body;

    const job = await Job.create({
      title,
      company,
      description,
      jobDescriptionPointers,
      jobRole,
      skillsRequired,
      location,
      salaryRange,
      employmentType,
      jobType,
      experience,
      openings,
      createdBy: req.user?._id
    });

    // Find matching jobseekers
    const matchingUsers = await User.find({
      role: "jobseeker",
      skills: { $in: skillsRequired },
      location: { $regex: location, $options: "i" }
    });

    const io = getIo(); // get initialized Socket.io

    for (const user of matchingUsers) {
      const socketId = connectedUsers[user._id];
      const message = `New job "${title}" matches your skills!`;

      if (socketId) {
        io.to(socketId).emit("newNotification", { jobId: job._id, message });
      }

      await createNotification({ userId: user._id, type: "job_posted", message });
    }

    res.status(201).json({ message: "Job created successfully", job });
  } catch (error) {
    console.error("Create job error:", error);
    res.status(500).json({ message: error.message || "Server error while creating job" });
  }
};

// Get all jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");
    res.json({ count: jobs.length, jobs });
  } catch (error) {
    console.error("Get jobs error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Job search & filter
const searchJobs = async (req, res) => {
  try {
    const { keyword, location, skills, employmentType, jobType, minDate, maxDate } = req.query;

    let filter = {};

    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } }
      ];
    }

    if (location) filter.location = { $regex: location, $options: "i" };

    if (skills) {
      const skillArray = Array.isArray(skills) ? skills : skills.split(",");
      filter.skillsRequired = { $in: skillArray };
    }

    if (employmentType) {
      filter.employmentType = { $regex: employmentType, $options: "i" };
    }

    if (jobType) {
      filter.jobType = { $regex: jobType, $options: "i" };
    }

    if (minDate || maxDate) {
      filter.createdAt = {};
      if (minDate) filter.createdAt.$gte = new Date(minDate);
      if (maxDate) filter.createdAt.$lte = new Date(maxDate);
    }

    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");

    res.json({ count: jobs.length, jobs });
  } catch (error) {
    console.error("Job search error:", error);
    res.status(500).json({ message: "Server error while searching jobs" });
  }
};

// Get jobs by city slug
const getJobsByCity = async (req, res) => {
  try {
    const { citySlug } = req.params;
    const cityName = citySlug.replace(/-/g, " ");
    const jobs = await Job.find({
      location: { $regex: new RegExp(`^${cityName}$`, "i") }
    }).populate("createdBy", "name email");

    res.json({ jobs });
  } catch (error) {
    console.error("Get jobs by city error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single job by slug
const getJobBySlug = async (req, res) => {
  try {
    const job = await Job.findOne({ slug: req.params.slug }).populate(
      "createdBy",
      "name email"
    );

    if (!job) return res.status(404).json({ message: "Job not found" });

    const applicantsCount = job.applicants?.length || 0;
    let matchScore = null;

    if (req.user && req.user.role === "jobseeker") {
      const userSkills = Array.isArray(req.user.skills)
        ? req.user.skills.map((s) => s.toLowerCase())
        : [];
      const userLocation = req.user.location || "";

      const jobSkills = (job.skillsRequired || []).map((s) => s.toLowerCase());

      const { score: skillScore } = skillMatch(userSkills, jobSkills);
      const locScore = locationScore(userLocation, job.location || "");
      const recScore = recencyScore(job.createdAt);

      const totalScore = (0.65 * skillScore + 0.2 * locScore + 0.15 * recScore) * 100;

      matchScore = {
        totalScore: Math.round(totalScore),
        skillScore: Math.round(skillScore * 100),
        locScore: Math.round(locScore * 100),
        recScore: Math.round(recScore * 100)
      };
    }

    res.json({ ...job.toObject(), applicantsCount, matchScore });
  } catch (error) {
    console.error("Get job by slug error:", error);
    res.status(500).json({ message: "Server error while fetching job" });
  }
};

module.exports = {
  createJob,
  getJobs,
  searchJobs,
  getJobBySlug,
  getJobsByCity // <-- exported here
};
