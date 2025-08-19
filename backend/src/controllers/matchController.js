// controllers/matchController.js
const Job = require("../models/Job");
const { skillMatch, locationScore, recencyScore } = require("../utils/matcher");

const getRecommendations = async (req, res) => {
  try {
    const user = req.user;
    const userSkills = Array.isArray(user.skills) ? user.skills.map(s => s.toLowerCase()) : [];
    const userLocation = user.location || "";

    const limit = parseInt(req.query.limit, 10) || 10;
    const minScore = parseFloat(req.query.minScore) || 0;

    const jobs = await Job.find().populate("createdBy", "name email");

    const scored = jobs.map(job => {
      const jobSkills = (job.skillsRequired || []).map(s => s.toLowerCase());

      // ✅ use skillMatch from matcher.js
      const { score: skillScore, matchedSkills } = skillMatch(userSkills, jobSkills);

      const locScore = locationScore(userLocation, job.location || "");
      const recScore = recencyScore(job.createdAt);

      const score = (0.65 * skillScore) + (0.2 * locScore) + (0.15 * recScore);

      return {
        job,
        score: Math.round(score * 100) / 100,
        components: {
          skillScore: Math.round(skillScore * 100) / 100,
          locScore: Math.round(locScore * 100) / 100,
          recScore: Math.round(recScore * 100) / 100,
          matchedSkills
        }
      };
    });

    const filtered = scored
      .filter(s => s.score >= minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    res.json({
      count: filtered.length,
      recommendations: filtered
    });
  } catch (error) {
    console.error("Recommendation error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRecommendations };
