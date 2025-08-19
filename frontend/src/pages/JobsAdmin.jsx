import { useEffect, useState } from "react";
import api from "../utils/axios";
import { useAuth } from "../context/AuthProvider";
import { Trash2 } from "lucide-react";

export default function JobsAdmin() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/admin/jobs", {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        setJobs(res.data.jobs || []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await api.delete(`/api/admin/jobs/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setJobs(jobs.filter(j => j._id !== id));
    } catch (err) {
      console.error("Error deleting job:", err);
    }
  };

  if (!user) return <p className="p-10">Loading user...</p>;
  if (loading) return <p className="p-10">Loading jobs...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-pastelBlue-800">Jobs</h1>
      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Job Title</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Company</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Recruiter Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Openings</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.map(j => (
              <tr key={j._id}>
                <td className="px-4 py-2">{j.title}</td>
                <td className="px-4 py-2">{j.company}</td>
                <td className="px-4 py-2">{j.createdBy?.name || "N/A"}</td>
                <td className="px-4 py-2">{j.openings || 1}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(j._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
