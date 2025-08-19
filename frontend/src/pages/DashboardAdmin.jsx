import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

export default function DashboardAdmin() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalJobseekers: 0,
    totalRecruiters: 0,
    totalJobs: 0,
    totalApplications: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Get all users
        const usersRes = await api.get("/api/admin/users", {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        const users = usersRes.data.users;
        const totalJobseekers = users.filter(u => u.role === "jobseeker").length;
        const totalRecruiters = users.filter(u => u.role === "recruiter").length;

        // Get all jobs
        const jobsRes = await api.get("/api/admin/jobs", {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        const totalJobs = jobsRes.data.count;

        // Get all applications
        const appsRes = await api.get("/api/admin/applications", {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        const totalApplications = appsRes.data.count;

        setStats({ totalJobseekers, totalRecruiters, totalJobs, totalApplications });
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (!user) return <p className="p-10">Loading user...</p>;
  if (loading) return <p className="p-10">Loading dashboard...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-pastelBlue-800">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow-lg rounded-xl p-6 text-center">
          <p className="text-gray-500">Total Jobseekers</p>
          <p className="font-bold text-2xl">{stats.totalJobseekers}</p>
        </div>
        <div className="bg-white shadow-lg rounded-xl p-6 text-center">
          <p className="text-gray-500">Total Recruiters</p>
          <p className="font-bold text-2xl">{stats.totalRecruiters}</p>
        </div>
        <div className="bg-white shadow-lg rounded-xl p-6 text-center">
          <p className="text-gray-500">Total Jobs</p>
          <p className="font-bold text-2xl">{stats.totalJobs}</p>
        </div>
        <div className="bg-white shadow-lg rounded-xl p-6 text-center">
          <p className="text-gray-500">Total Applications</p>
          <p className="font-bold text-2xl">{stats.totalApplications}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => navigate("/admin/users")}
          className="px-4 py-2 bg-pastelBlue-800 text-white rounded-lg hover:bg-pastelBlue-700"
        >
          Manage Users
        </button>
        <button
          onClick={() => navigate("/admin/jobs")}
          className="px-4 py-2 bg-pastelBlue-500 text-white rounded-lg hover:bg-pastelBlue-600"
        >
          Manage Jobs
        </button>
      </div>
    </div>
  );
}
