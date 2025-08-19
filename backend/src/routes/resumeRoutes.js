const express = require("express");
const { uploadResumeAndRecommend } = require("../controllers/resumeController");
const { protect, authorize } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

const router = express.Router();

// Wrap multer to return JSON errors
router.post("/upload", protect, authorize("jobseeker"), function (req, res) {
  upload.single("resume")(req, res, function (err) {
    if (err) {
      return res.status(err.statusCode || 400).json({ message: err.message || "File upload error" });
    }
    return uploadResumeAndRecommend(req, res);
  });
});

module.exports = router;
