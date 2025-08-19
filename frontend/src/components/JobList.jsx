import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";
import { MapPin, Briefcase, IndianRupee } from "lucide-react";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/api/jobs");
        setJobs(res.data.jobs?.slice(0, 3) || []); // Top 3 jobs
      } catch (err) {
        console.error("Error fetching jobs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <p className="p-10">Loading jobs...</p>;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-6 text-pastelBlue-800">
        Featured Jobs
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            {/* Job Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {job.title}
            </h3>

            {/* Company */}
            <p className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Briefcase size={16} className="text-pastelBlue-600" />
              {job.company || job.createdBy?.name}
            </p>

            {/* Location */}
            <p className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <MapPin size={16} className="text-gray-400" />
              {job.location}
            </p>

            {/* Salary */}
            {job.salaryRange && (
              <p className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <IndianRupee size={16} className="text-gray-400" />
                {job.salaryRange}
              </p>
            )}

            {/* View Details */}
            <Link
              to={`/jobs/${job.slug}`}
              className="inline-block mt-4 px-4 py-2 text-sm font-medium bg-pastelBlue-600 text-white rounded-lg hover:bg-pastelBlue-700 transition"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
