import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import { Briefcase, Users, CheckSquare, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from "../utils/axios";

export default function DashboardRecruiter() {
  const { user } = useAuth();
  const [postedJobs, setPostedJobs] = useState([]);
  const [pendingApplicationsCount, setPendingApplicationsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch all jobs posted by this recruiter
        const resJobs = await api.get('/api/jobs', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        const myJobs = resJobs.data.jobs.filter(
          (job) => job.createdBy._id === user._id
        );
        setPostedJobs(myJobs);

        // Fetch all applications for this recruiter
        const resAnalytics = await api.get(
          '/api/analytics',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          }
        );

        // Sum all pending applications across jobs
        const pendingCount = resAnalytics.data.analytics.reduce((acc, job) => {
          return acc + (job.statusCount.pending || 0);
        }, 0);

        setPendingApplicationsCount(pendingCount);
      } catch (err) {
        console.error('Error fetching recruiter dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (!user) return <p className="p-10">Loading user...</p>;
  if (loading) return <p className="p-10">Loading dashboard...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-pastelBlue-800">
        Hi {user.name}, welcome to your recruiter dashboard!
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
          <Briefcase className="text-pastelBlue-600 w-8 h-8" />
          <div>
            <p className="text-gray-500">Posted Jobs</p>
            <p className="font-semibold">{postedJobs.length}</p>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-xl p-6 flex items-center gap-4">
          <CheckSquare className="text-pastelBlue-600 w-8 h-8" />
          <div>
            <p className="text-gray-500">Pending Applications</p>
            <p className="font-semibold">{pendingApplicationsCount}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Link
          to="/post-job"
          className="inline-block px-4 py-2 bg-pastelBlue-800 text-white rounded-lg hover:bg-pastelBlue-700"
        >
          Post a Job
        </Link>
        <Link
          to="/recruiter/analytics"
          className="inline-block px-4 py-2 bg-pastelBlue-500 text-white rounded-lg hover:bg-pastelBlue-600"
        >
          View Analytics
        </Link>
        <Link
          to="/applications"
          className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Update Application Status
        </Link>
      </div>

      {/* Posted Jobs Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-pastelBlue-800">
          Posted Jobs
        </h2>
        {postedJobs.length === 0 ? (
          <p className="text-gray-500">No jobs posted yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {postedJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Job Card for recruiter
function JobCard({ job }) {
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

      <Link
        to={`/jobs/${job.slug}`}
        className="mt-4 inline-block px-3 py-1 bg-pastelBlue-600 text-white rounded hover:bg-pastelBlue-700"
      >
        View Details
      </Link>
    </div>
  );
}
