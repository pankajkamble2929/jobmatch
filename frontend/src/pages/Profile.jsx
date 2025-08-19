import { useState, useEffect } from 'react';
import api from "../utils/axios";
import { useAuth } from '../context/AuthProvider';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    skills: [],
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // ✅ store selected file
  const [uploading, setUploading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  // ✅ Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(
          '/api/users/profile'
        );
        setProfile(data);
        setFormData({
          name: data.name,
          email: data.email,
          location: data.location,
          skills: data.skills || [],
        });
        setResumeFile(data.resumeFile || null);
      } catch (error) {
        console.error('Error fetching profile:', error.response?.data || error);
      }
    };
    fetchProfile();
  }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Save profile
  const handleSave = async () => {
    try {
      const { data } = await api.put(
        '/api/users/profile',
        formData
      );
      setProfile(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error);
    }
  };

  // ✅ Select file (does not auto-upload)
  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // ✅ Upload/Update CV + extract skills
  const handleUpdateCV = async () => {
    if (!selectedFile) {
      alert('Please select a CV file first.');
      return;
    }

    if (resumeFile) {
      const confirmReplace = window.confirm(
        'You already uploaded a CV. Do you want to replace it?'
      );
      if (!confirmReplace) return;
    }

    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      setUploading(true);
      const { data } = await api.post(
        '/api/resume/upload',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      // Debug logs
      console.log('Upload Response:', data);

      // ✅ Update resume + skills
      setResumeFile(data.resumeFile);
      if (data.skills) {
        setFormData((prev) => ({ ...prev, skills: data.skills }));
      }
      if (data.recommendations) {
        setRecommendations(data.recommendations);
      }
      setSelectedFile(null);
    } catch (error) {
      console.error('CV Upload error:', error.response?.data || error);
    } finally {
      setUploading(false);
    }
  };

  if (!profile) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">Profile</h2>

      {/* Name */}
      <div className="mb-3">
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          disabled={!isEditing}
          onChange={handleChange}
          className={`w-full border rounded p-2 ${
            !isEditing && 'bg-gray-100 cursor-not-allowed'
          }`}
        />
      </div>

      {/* Email */}
      <div className="mb-3">
        <label className="block text-gray-700">Email</label>
        <input
          type="text"
          name="email"
          value={formData.email}
          disabled
          className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Location */}
      <div className="mb-3">
        <label className="block text-gray-700">Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          disabled={!isEditing}
          onChange={handleChange}
          className={`w-full border rounded p-2 ${
            !isEditing && 'bg-gray-100 cursor-not-allowed'
          }`}
        />
      </div>

      {/* Skills */}
      <div className="mb-3">
        <label className="block text-gray-700">Skills</label>
        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex justify-end">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Save
          </button>
        )}
      </div>

      {/* ✅ Upload CV Section */}
      <hr className="my-6" />
      <h3 className="text-lg font-semibold mb-3">Upload CV</h3>

      <div className="flex items-center gap-3">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileSelect}
          className="border p-2 rounded"
        />
        <button
          onClick={handleUpdateCV}
          disabled={uploading}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg"
        >
          {uploading ? 'Updating...' : 'Update CV'}
        </button>
      </div>

      {resumeFile && (
        <p className="text-gray-700 text-sm mt-2">Uploaded: {resumeFile}</p>
      )}

      {/* ✅ Recommendations */}
      {recommendations.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">
            Recommended Jobs for You:
          </h4>
          <ul className="space-y-4">
            {recommendations.map((rec, idx) => (
              <li
                key={idx}
                className="relative p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition"
              >
                {/* ✅ Profile Match Badge */}
                <span className="absolute top-2 right-2 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  Profile Match: {(rec.score * 100).toFixed(0)}%
                </span>

                <h5 className="text-md font-bold text-blue-700">
                  {rec.job.title} @ {rec.job.company}
                </h5>
                <p className="text-gray-600 text-sm mt-1">
                  {rec.job.description}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  <span className="font-semibold">Location:</span>{' '}
                  {rec.job.location}
                </p>
                <p className="text-gray-500 text-sm">
                  <span className="font-semibold">Experience:</span>{' '}
                  {rec.job.experience}
                </p>
                <p className="text-gray-500 text-sm">
                  <span className="font-semibold">Skills Required:</span>{' '}
                  {rec.job.skillsRequired.join(', ')}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
