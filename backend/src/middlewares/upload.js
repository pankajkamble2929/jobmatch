// middlewares/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises; // use async fs
const crypto = require("crypto");

const uploadDir = path.join(__dirname, "..", "uploads", "resumes");

// Ensure upload folder exists (async)
(async () => {
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (err) {
    console.error("Failed to create upload directory:", err);
  }
})();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const random = crypto.randomBytes(6).toString("hex");
    const filename = `${Date.now()}-${random}${path.extname(file.originalname)}`;
    cb(null, filename);
  }
});

const fileFilter = function (req, file, cb) {
  const allowed = [".pdf"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    const err = new Error("Only PDF files are allowed");
    err.statusCode = 400; // JSON error code
    cb(err, false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
