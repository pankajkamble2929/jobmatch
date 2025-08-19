// utils/skillExtractor.js

// Predefined list of skills for matching
const knownSkills = [
  "javascript", "react", "node.js", "node", "express", "mongodb",
  "html", "css", "python", "java", "c++", "c#", "sql", "typescript",
  "aws", "docker", "kubernetes", "git", "machine learning", "ai", "nlp"
];

const extractSkills = (text) => {
  const found = [];
  const lowerText = text.toLowerCase();
  knownSkills.forEach(skill => {
    if (lowerText.includes(skill)) {
      found.push(skill);
    }
  });
  return [...new Set(found)];
};

module.exports = { extractSkills };
