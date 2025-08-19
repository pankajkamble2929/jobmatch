import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import {
  Briefcase,
  Users,
  Bookmark,
  CheckSquare,
  IndianRupee,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from "../utils/axios";

export default function Dashboard() {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch saved jobs
        const savedRes = await api.get(
          '/api/saved-jobs',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          }
        );
        setSavedJobs(savedRes.data.savedJobs || []);

        // Fetch applied jobs
        const appliedRes = await api.get(
          '/api/applications',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          }
        );
        setAppliedJobs(appliedRes.data.appliedJobs || []);
      } catch (err) {
        console.error('Error fetching dashboard jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user]);

  // Unsave a job dynamically
  const handleUnsave = async (jobId) => {
    try {
      await api.delete(`/api/saved-jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setSavedJobs((prev) => prev.filter((job) => job._id !== jobId));
    } catch (err) {
      console.error('Error unsaving job:', err);
    }
  };

  if (!user) return <p className="p-10">Loading user...</p>;
  if (loading) return <p className="p-10">Loading dashboard...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-pastelBlue-800">
        Hi {user.name}, welcome to your dashboard!
      </h1>

      {/* User Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg rounded-xl p-6 flex items-center gap-4">
          <Users className="text-pastelBlue-600 w-8 h-8" />
          <div>
            <p className="text-gray-500">Role</p>
            <p className="font-semibold capitalize">{user.role}</p>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-xl p-6 flex items-center gap-4">
          <Bookmark className="text-pastelBlue-600 w-8 h-8" />
          <div>
            <p className="text-gray-500">Saved Jobs</p>
            <p className="font-semibold">{savedJobs.length}</p>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-xl p-6 flex items-center gap-4">
          <CheckSquare className="text-pastelBlue-600 w-8 h-8" />
          <div>
            <p className="text-gray-500">Applied Jobs</p>
            <p className="font-semibold">{appliedJobs.length}</p>
          </div>
        </div>
      </div>

      {/* Update Profile Button */}
      <Link
        to="/profile"
        className="inline-block px-4 py-2 bg-pastelBlue-800 text-white rounded-lg hover:bg-pastelBlue-700"
      >
        Update Profile
      </Link>

      {/* Saved Jobs Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-pastelBlue-800">
          Saved Jobs
        </h2>
        {savedJobs.length === 0 ? (
          <p className="text-gray-500">No saved jobs yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedJobs.filter(Boolean).map((job) => (
              <JobCard key={job._id} job={job} onUnsave={handleUnsave} saved />
            ))}
          </div>
        )}
      </div>

      {/* Applied Jobs Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-pastelBlue-800">
          Applied Jobs
        </h2>
        {appliedJobs.length === 0 ? (
          <p className="text-gray-500">No applied jobs yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {appliedJobs.filter(Boolean).map((job) => (
              <JobCard key={job._id} job={job} applied />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// JobCard Component
function JobCard({ job, onUnsave, saved, applied }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
      <p className="text-sm text-gray-600">{job.company}</p>
      <p className="text-sm text-gray-500 flex items-center gap-1">
        <Briefcase className="w-4 h-4" /> {job.jobRole}
      </p>
      <p className="text-sm text-gray-500 flex items-center gap-1">
        <IndianRupee className="w-4 h-4" /> {job.salaryRange}
      </p>

      <div className="flex gap-2 mt-4">
        {saved && (
          <button
            onClick={() => onUnsave(job._id)}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Unsave
          </button>
        )}
        {applied && (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded">
            Applied
          </span>
        )}
        <Link
          to={`/jobs/${job.slug}`}
          className="ml-auto px-3 py-1 bg-pastelBlue-600 text-white rounded hover:bg-pastelBlue-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
