// File: src/pages/ApplicationsPage.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import api from "../utils/axios";

export default function ApplicationsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState({});

  useEffect(() => {
    // Redirect if not logged in or not recruiter/admin
    if (!user || (user.role !== 'recruiter' && user.role !== 'admin')) {
      navigate('/login');
      return;
    }

    const fetchApplications = async () => {
      try {
        setLoading(true);

        // Fetch jobs posted by current recruiter/admin
        const jobsRes = await api.get('/api/jobs', {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });

        const myJobs = jobsRes.data.jobs.filter(
          (job) => job.createdBy._id === user._id || user.role === 'admin'
        );

        // Fetch applications for each job
        const allApplications = await Promise.all(
          myJobs.map(async (job) => {
            try {
              const appsRes = await api.get(
                `/api/applications/${job._id}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
              );
              return appsRes.data.map((app) => ({ ...app, jobTitle: job.title }));
            } catch (err) {
              console.error(`Error fetching applications for job ${job._id}:`, err);
              return [];
            }
          })
        );

        setApplications(allApplications.flat());
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user, navigate]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      setStatusUpdating((prev) => ({ ...prev, [appId]: true }));

      await api.put(
        `/api/applications/${appId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
      );

      setApplications((prev) =>
        prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
      );
    } catch (err) {
      console.error('Error updating status:', err);
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setStatusUpdating((prev) => ({ ...prev, [appId]: false }));
    }
  };

  if (!user) return <p className="p-10">Loading user...</p>;
  if (loading) return <p className="p-10">Loading applications...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-pastelBlue-800 mb-6">
        Job Applications
      </h1>

      {applications.length === 0 ? (
        <p className="text-gray-500">No applications found.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Job Title</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Applicant Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Skills</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Location</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app._id}>
                  <td className="px-4 py-2">{app.jobTitle}</td>
                  <td className="px-4 py-2">{app.applicant.name}</td>
                  <td className="px-4 py-2">{app.applicant.email}</td>
                  <td className="px-4 py-2">
                    {app.applicant.skills
                      .slice(0, 3)
                      .map((skill) => skill.charAt(0).toUpperCase() + skill.slice(1))
                      .join(', ')}
                  </td>
                  <td className="px-4 py-2">{app.applicant.location}</td>
                  <td className="px-4 py-2 capitalize">{app.status}</td>
                  <td className="px-4 py-2">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      disabled={statusUpdating[app._id]}
                      className="border rounded px-2 py-1"
                    >
                      {['pending', 'reviewed', 'accepted', 'rejected'].map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
