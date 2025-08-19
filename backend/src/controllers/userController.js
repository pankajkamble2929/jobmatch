const User = require("../models/User");
const Job = require("../models/Job");
const { jaccard, locationScore, recencyScore } = require("../utils/matcher");

// Update profile (jobseeker)
const updateProfile = async (req, res) => {
  try {
    const { name, location, skills } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (location) user.location = location;
    if (skills && Array.isArray(skills)) {
      user.skills = Array.from(new Set([...user.skills, ...skills]));
    }

    await user.save();
    res.json({ message: "Profile updated", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while updating profile" });
  }
};

// Get recommendations
const getRecommendations = async (req, res) => {
  try {
    const user = req.user;
    const userSkills = Array.isArray(user.skills) ? user.skills : [];
    const userLocation = user.location || "";

    const limit = parseInt(req.query.limit, 10) || 10;
    const minScore = parseFloat(req.query.minScore) || 0;

    const jobs = await Job.find().populate("createdBy", "name email");

    const scored = jobs.map(job => {
      const skillScore = jaccard(userSkills, job.skillsRequired || []);
      const locScore = locationScore(userLocation, job.location || "");
      const recScore = recencyScore(job.createdAt);

      const score = 0.6 * skillScore + 0.25 * locScore + 0.15 * recScore;

      return {
        job,
        score: Math.round(score * 100) / 100,
        components: {
          skillScore: Math.round(skillScore * 100) / 100,
          locScore: Math.round(locScore * 100) / 100,
          recScore: Math.round(recScore * 100) / 100
        }
      };
    });

    const filtered = scored
      .filter(s => s.score >= minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    res.json({ count: filtered.length, recommendations: filtered });
  } catch (error) {
    console.error("Recommendation error:", error);
    res.status(500).json({ message: "Server error while fetching recommendations" });
  }
};

// ✅ Get profile (with resume, skills, etc.)
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error fetching profile" });
  }
};

module.exports = { updateProfile, getRecommendations, getProfile };
