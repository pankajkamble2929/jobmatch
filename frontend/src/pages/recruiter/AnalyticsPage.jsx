import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { useAuth } from "../../context/AuthProvider";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const res = await api.get("/api/analytics", {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        setAnalytics(res.data.analytics || []);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  if (!user) return <p className="p-10">Loading user...</p>;
  if (loading) return <p className="p-10">Loading analytics...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-pastelBlue-800">
        Recruiter Analytics
      </h1>

      {/* Job Summary Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Job Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Applications
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status Breakdown
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {analytics.map((job) => (
              <tr key={job.jobId}>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                  {job.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{job.totalApplications}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {Object.entries(job.statusCount || {}).map(([status, count]) => (
                    <span
                      key={status}
                      className="inline-block mr-2 px-2 py-1 text-xs font-medium rounded-full bg-pastelBlue-100 text-pastelBlue-800"
                    >
                      {status}: {count}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {analytics.length === 0 && (
          <p className="p-4 text-gray-500">No jobs posted yet.</p>
        )}
      </div>
    </div>
  );
}
