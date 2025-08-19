const mongoose = require("mongoose");
const slugify = require("slugify"); 

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  jobDescriptionPointers: [{ type: String }],
  jobRole: { type: String },
  skillsRequired: { type: [String], default: [] },
  experience: { type: String },
  salaryRange: { type: String },
  location: { type: String },
  slug: { type: String, unique: true },

  employmentType: {
    type: String,
    enum: ["Permanent", "Temporary", "Contract", "Internship", "Freelance"],
    default: "Permanent"
  },

  jobType: {
    type: String,
    enum: ["Full-time", "Part-time", "Remote", "Hybrid"],
    default: "Full-time"
  },

  openings: { type: Number, default: 1 },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

// 🔹 Pre-save hook to generate slug automatically
jobSchema.pre("save", async function (next) {
  if (this.isModified("title") || !this.slug) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;

    // Ensure uniqueness
    while (await this.constructor.findOne({ slug })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }
    this.slug = slug;
  }
  next();
});

module.exports = mongoose.model("Job", jobSchema);
