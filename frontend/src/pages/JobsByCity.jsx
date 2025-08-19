import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/axios";
import { Building2, MapPin, IndianRupee, Clock, Users } from "lucide-react";

export default function JobsByCity() {
  const { citySlug } = useParams(); 
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allCities, setAllCities] = useState([]);

  const cityName = citySlug.replace(/-/g, " ").toUpperCase();

  useEffect(() => {
    const seoTitle = `Latest Job Openings in ${cityName} | Apply Now - JobMatch`;
    const seoDescription = `Discover the newest job opportunities in ${cityName}. Explore top positions across industries and companies. Apply now with JobMatch to boost your career.`;
    document.title = seoTitle;

    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", seoDescription);
    } else {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      metaDescription.content = seoDescription;
      document.head.appendChild(metaDescription);
    }

    const fetchJobsByCity = async () => {
      try {
        const res = await api.get(`/api/jobs/city/${citySlug}`);
        setJobs(res.data.jobs || []);
      } catch (err) {
        console.error("Error fetching jobs by city", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchAllCities = async () => {
      try {
        const res = await api.get("/api/jobs");
        const jobsData = res.data.jobs || [];
        const uniqueCities = [...new Set(jobsData.map((job) => job.location))];
        setAllCities(uniqueCities);
      } catch (err) {
        console.error("Error fetching all cities", err);
      }
    };

    fetchJobsByCity();
    fetchAllCities();
  }, [citySlug, cityName]);

  if (loading) return <p className="p-10 text-lg">Loading jobs...</p>;
  if (jobs.length === 0) return <p className="p-10 text-lg">No jobs found in {cityName}.</p>;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="lg:flex lg:gap-8">
        {/* Jobs list */}
        <div className="lg:flex-1 grid gap-6 sm:grid-cols-1 lg:grid-cols-1">
          <h1 className="text-3xl font-bold mb-6 text-pastelBlue-800">Jobs in {cityName}</h1>
          
          {jobs.map((job) => (
            <div key={job.slug} className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition flex flex-col lg:flex-row">
              
              {/* Left: Job Title & Company */}
              <div className="lg:w-2/3 p-6 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">{job.title}</h2>
                  <div className="flex items-center mt-2 gap-4 text-gray-600">
                    <Building2 className="h-5 w-5" /> {job.company}
                    <MapPin className="h-5 w-5" /> {job.location}
                  </div>
                </div>
                <Link
                  to={`/jobs/${job.slug}`}
                  className="mt-4 inline-block px-5 py-2 bg-pastelBlue-600 text-white rounded-lg hover:bg-pastelBlue-700 transition w-fit"
                >
                  View Details
                </Link>
              </div>

              {/* Right: Job Details */}
              <div className="lg:w-1/3 bg-white p-6 flex flex-col justify-center gap-3">
                {job.salary && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <IndianRupee className="h-5 w-5" /> {job.salary}
                  </div>
                )}
                {job.experience && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Users className="h-5 w-5" /> {job.experience} yrs
                  </div>
                )}
                {job.jobType && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="h-5 w-5" /> {job.jobType}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block lg:w-64 bg-white border border-gray-200 rounded-xl p-4 shadow-sm h-fit sticky top-28">
          <h2 className="text-lg font-semibold mb-4 text-pastelBlue-800">Other Cities</h2>
          <ul className="space-y-2">
            {allCities
              .filter((city) => city.toLowerCase() !== cityName.toLowerCase())
              .map((city) => {
                const citySlugItem = city.toLowerCase().replace(/\s+/g, "-");
                return (
                  <li key={city}>
                    <Link
                      to={`/jobs-in/${citySlugItem}`}
                      className="block px-3 py-2 rounded-lg hover:bg-pastelBlue-100 text-gray-700 hover:text-pastelBlue-800 transition"
                    >
                      Jobs in {city}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </aside>
      </div>
    </div>
  );
}
