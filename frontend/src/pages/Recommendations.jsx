import { useEffect, useState } from "react";
import api from "../utils/axios";
import { useAuth } from "../context/AuthProvider";
import { Zap, Building, Clock, MapPin, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Recommendations() {
  const { user } = useAuth();
   const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const res = await api.get("/api/recommendations", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          params: { limit: 20, minScore: 0.5 },
        });
        setJobs(res.data.recommendations || []);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch recommendations");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  if (!user) return <p className="p-10">Loading user...</p>;
  if (loading) return <p className="p-10">Loading recommendations...</p>;
  if (error) return <p className="p-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-pastelBlue-800">Recommended Jobs for You</h1>

      {jobs.length === 0 ? (
        <p className="text-gray-500">No recommendations found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(({ job, score, components }) => {
            const skill = Math.round(components.skillScore * 100);
            const loc = Math.round(components.locScore * 100);
            const rec = Math.round(components.recScore * 100);
            const totalScore = Math.round(score * 100);
            const company = job.company || "N/A";

            return (
              <div
                key={job._id}
                className="p-6 border bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold text-pastelBlue-800">{job.title}</h2>
                  <span className="text-green-600 font-bold">{totalScore}%</span>
                </div>

                <p className="text-gray-600 mb-1 flex items-center gap-1">
                  <Briefcase className="h-4 w-4" /> {company}
                </p>

                <div className="bg-gray-100 p-2 rounded mb-2 space-y-1 text-sm text-gray-700">
                  <p className="flex items-center gap-1">
                    <Zap className="h-4 w-4" /> Skill Score: <span className="font-medium">{skill}%</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> Location Score: <span className="font-medium">{loc}%</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <Clock className="h-4 w-4" /> Recency: <span className="font-medium">{rec}%</span>
                  </p>
                </div>

                <button
                onClick={() => navigate(`/jobs/${job.slug}`)}
                className="mt-3 w-full py-2 bg-pastelBlue-800 text-white rounded-lg hover:bg-pastelBlue-700 transition"
              >
                View Details
              </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
