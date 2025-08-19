// utils/matcher.js

// Job-centric skill similarity
const skillMatch = (userSkills = [], jobSkills = []) => {
  const U = new Set(userSkills.map(s => s.toLowerCase().trim()));
  const J = new Set(jobSkills.map(s => s.toLowerCase().trim()));

  const intersection = [...J].filter(skill => U.has(skill));
  const score = J.size > 0 ? intersection.length / J.size : 0;

  return {
    score,
    matchedSkills: intersection
  };
};

// Location match score
const locationScore = (userLocation = "", jobLocation = "") => {
  const u = userLocation.trim().toLowerCase();
  const j = jobLocation.trim().toLowerCase();
  if (!u || !j) return 0;
  if (j.includes("remote") || j.includes("work from home")) return 1;
  if (u === j) return 1;
  if (j.includes(u) || u.includes(j)) return 0.8;
  return 0;
};

// Recency score
const recencyScore = (createdAt, now = new Date()) => {
  const created = new Date(createdAt);
  const ageDays = Math.max(0, (now - created) / (1000 * 60 * 60 * 24));
  return Math.max(0, 1 - ageDays / 30);
};

module.exports = { skillMatch, locationScore, recencyScore };
