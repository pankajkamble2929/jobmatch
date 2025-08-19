const fs = require('fs');
const pdfParse = require('pdf-parse');
const { extractSkills } = require('../utils/skillExtractor');
const User = require('../models/User');
const Job = require('../models/Job');
const { jaccard, locationScore, recencyScore } = require('../utils/matcher');

const uploadResumeAndRecommend = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;

    // Parse PDF
    const fileBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(fileBuffer);

    // Extract skills
    const extractedSkills = extractSkills(pdfData.text || '');

    // Update user's skills + save resume file
    const user = await User.findById(req.user._id);
    if (!user) {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(404).json({ message: 'User not found' });
    }

    user.skills = Array.from(
      new Set([...(user.skills || []), ...extractedSkills])
    );
    user.resumeFile = req.file.originalname; // ✅ Save uploaded file name
    await user.save();

    // Clean up uploaded file (if you don't want to keep raw files in server)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    // Job recommendation logic
    const userSkills = user.skills;
    const userLocation = user.location || '';
    const limit = parseInt(req.query.limit, 10) || 10;
    const minScore = parseFloat(req.query.minScore) || 0;

    const jobs = await Job.find().populate('createdBy', 'name email');

    const scored = jobs.map((job) => {
      const skillScore = jaccard(userSkills, job.skillsRequired || []);
      const locScore = locationScore(userLocation, job.location || '');
      const recScore = recencyScore(job.createdAt);

      const score = 0.6 * skillScore + 0.25 * locScore + 0.15 * recScore;

      return {
        job,
        score: Math.round(score * 100) / 100,
        components: {
          skillScore: Math.round(skillScore * 100) / 100,
          locScore: Math.round(locScore * 100) / 100,
          recScore: Math.round(recScore * 100) / 100,
        },
      };
    });

    const filtered = scored
      .filter((s) => s.score >= minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    res.json({
      message:
        'Resume uploaded, skills updated, and top job recommendations returned',
      extractedSkills,
      updatedSkills: user.skills,
      resumeFile: user.resumeFile, // ✅ send filename
      recommendations: filtered,
    });
  } catch (error) {
    console.error('Resume + recommendation error:', error);
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        console.error('Failed to remove file:', e);
      }
    }
    res.status(500).json({
      message: error.message || 'Server error while processing resume',
    });
  }
};

module.exports = { uploadResumeAndRecommend };
