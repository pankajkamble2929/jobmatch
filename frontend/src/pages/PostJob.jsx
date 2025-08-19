import { useState } from "react";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";

export default function PostJob() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    jobDescriptionPointers: [""], // array of bullet points
    jobRole: "",
    skillsRequired: "",
    experience: "",
    salaryRange: "",
    location: "",
    employmentType: "Permanent",
    jobType: "Full-time",
    openings: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePointerChange = (index, value) => {
    const newPointers = [...formData.jobDescriptionPointers];
    newPointers[index] = value;
    setFormData({ ...formData, jobDescriptionPointers: newPointers });
  };

  const addPointer = () => {
    setFormData({ ...formData, jobDescriptionPointers: [...formData.jobDescriptionPointers, ""] });
  };

  const removePointer = (index) => {
    const newPointers = formData.jobDescriptionPointers.filter((_, i) => i !== index);
    setFormData({ ...formData, jobDescriptionPointers: newPointers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/api/jobs", {
        ...formData,
        skillsRequired: formData.skillsRequired.split(",").map((s) => s.trim()),
      });
      setLoading(false);
      navigate("/recruiter/dashboard"); // Redirect to recruiter dashboard
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to post job");
      setLoading(false);
    }
  };

  return (
    <div className="bg-pastelBlue-50 min-h-screen text-gray-900">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold mb-6 text-pastelBlue-800">Post a New Job</h1>

        {error && <p className="text-red-600 mb-4 font-medium">{error}</p>}

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4"
        >
          <div>
            <label className="block mb-1 font-medium">Job Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pastelBlue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Company</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pastelBlue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Job Role</label>
            <input
              type="text"
              name="jobRole"
              value={formData.jobRole}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pastelBlue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pastelBlue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Job Description Pointers</label>
            {formData.jobDescriptionPointers.map((pointer, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={pointer}
                  onChange={(e) => handlePointerChange(index, e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pastelBlue-500"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removePointer(index)}
                    className="px-2 py-1 bg-pastelPink-400 text-white rounded-lg"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addPointer}
              className="px-3 py-1 bg-pastelBlue-600 text-white rounded-lg hover:bg-pastelBlue-700 mt-2"
            >
              Add Pointer
            </button>
          </div>

          <div>
            <label className="block mb-1 font-medium">Skills Required (comma-separated)</label>
            <input
              type="text"
              name="skillsRequired"
              value={formData.skillsRequired}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pastelBlue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Experience</label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pastelBlue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pastelBlue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Salary Range</label>
            <input
              type="text"
              name="salaryRange"
              value={formData.salaryRange}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pastelBlue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Employment Type</label>
            <select
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pastelBlue-500"
            >
              <option>Permanent</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Job Type</label>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pastelBlue-500"
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Remote</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Number of Openings</label>
            <input
              type="number"
              name="openings"
              value={formData.openings}
              onChange={handleChange}
              min={1}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pastelBlue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 px-4 py-2 text-white bg-pastelBlue-600 rounded-lg hover:bg-pastelBlue-700 font-medium"
          >
            {loading ? "Posting..." : "Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
}
