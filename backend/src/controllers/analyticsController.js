const Job = require("../models/Job");
const Application = require("../models/Application");

// Get recruiter dashboard analytics
const getRecruiterAnalytics = async (req, res) => {
  try {
    const recruiterId = req.user._id;

    // Get all jobs posted by this recruiter
    const jobs = await Job.find({ createdBy: recruiterId });

    const analytics = [];

    for (const job of jobs) {
      // Find applications and populate applicant info
      const applications = await Application.find({ job: job._id }).populate(
        "applicant",
        "location skills name email"
      );

      // Count applications by status
      const statusCount = applications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {});

      // Count top locations
      const locationCount = applications.reduce((acc, app) => {
        const loc =
          app.applicant && app.applicant.location
            ? app.applicant.location
            : "Unknown";
        acc[loc] = (acc[loc] || 0) + 1;
        return acc;
      }, {});

      // Count top skills with normalization
      const skillsCount = {};
      applications.forEach(app => {
        if (app.applicant && app.applicant.skills && app.applicant.skills.length > 0) {
          app.applicant.skills.forEach(skill => {
            const normalizedSkill = skill.trim().toLowerCase();
            skillsCount[normalizedSkill] = (skillsCount[normalizedSkill] || 0) + 1;
          });
        }
      });

      // Format skills (capitalize first letter)
      const formattedSkillsCount = {};
      for (const skill in skillsCount) {
        const formattedSkill = skill.charAt(0).toUpperCase() + skill.slice(1);
        formattedSkillsCount[formattedSkill] = skillsCount[skill];
      }

      analytics.push({
        jobId: job._id,
        title: job.title,
        totalApplications: applications.length,
        statusCount,
        topLocations: locationCount,
        topSkills: formattedSkillsCount
      });
    }

    res.json({ count: analytics.length, analytics });
  } catch (error) {
    console.error("Recruiter analytics error:", error);
    res.status(500).json({ message: "Server error while fetching analytics" });
  }
};

module.exports = { getRecruiterAnalytics };
