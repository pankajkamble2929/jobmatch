import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from "../utils/axios";
import {
  Search,
  MapPin,
  Building2,
  IndianRupee,
  Briefcase,
} from 'lucide-react';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [cities, setCities] = useState([]);

  const { citySlug } = useParams(); // ✅ read citySlug from URL

  useEffect(() => {
    document.title = 'Explore Jobs - JobMatch';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Find the latest job opportunities in Software Development, Engineering, AI, and Machine Learning. Apply to jobs with JobMatch easily.'
      );
    }

    const fetchJobs = async () => {
      try {
        const res = await api.get('/api/jobs');
        setJobs(res.data.jobs || []);
        // extract unique cities
        const uniqueCities = [
          ...new Set(res.data.jobs.map((job) => job.location.toLowerCase())),
        ];
        setCities(uniqueCities);
      } catch (err) {
        console.error('Error fetching jobs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // 🔹 Filter jobs by search, location input, and citySlug from URL
  const filteredJobs = jobs.filter((job) => {
    const matchesTitle = job.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocationInput = job.location?.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesCitySlug = citySlug
      ? job.location?.toLowerCase().replace(/\s+/g, '-') === citySlug
      : true;

    return matchesTitle && matchesLocationInput && matchesCitySlug;
  });

  if (loading)
    return <p className="p-10 text-lg font-medium">Loading jobs...</p>;

  return (
    <div className="bg-gradient-to-br from-pastelBlue-50 to-white min-h-screen text-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Heading */}
        <h1 className="text-4xl font-extrabold mb-8 text-pastelBlue-800 text-center">
          🔍 Browse Jobs
        </h1>

        {/* Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 mb-10 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pastelBlue-500"
            />
          </div>

          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Filter by location..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full pl-10 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pastelBlue-500"
            />
          </div>
        </div>

        {/* City Chips for SEO-friendly links */}
        <div className="flex flex-wrap gap-2 mb-6">
          {cities.map((city, idx) => {
            const citySlugItem = city.replace(/\s+/g, '-').toLowerCase();
            return (
              <Link
                key={idx}
                to={`/jobs-in/${citySlugItem}`} 
                className="px-3 py-1 bg-pastelBlue-100 text-pastelBlue-800 rounded-full hover:bg-pastelBlue-200 transition text-sm"
              >
                {city.charAt(0).toUpperCase() + city.slice(1)}
              </Link>
            );
          })}
        </div>

        {/* Job List */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div
                key={job.slug}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition duration-200 ease-in-out"
              >
                {/* Job Title */}
                <h3 className="text-xl font-medium text-gray-900 flex items-center gap-2">
                  <Briefcase size={20} className="text-pastelBlue-600" />
                  {job.title}
                </h3>

                {/* Company */}
                <p className="mt-2 flex items-center gap-2 text-gray-700">
                  <Building2 size={18} className="text-gray-500" />
                  {job.company || job.createdBy?.name}
                </p>

                {/* Location */}
                <p className="mt-1 flex items-center gap-2 text-gray-600">
                  <MapPin size={18} className="text-gray-500" />
                  {job.location}
                </p>

                {/* Salary */}
                {job.salaryRange && (
                  <p className="mt-1 flex items-center gap-2 text-gray-600">
                    <IndianRupee size={18} className="text-green-500" />
                    {job.salaryRange}
                  </p>
                )}

                {/* Button */}
                <Link
                  to={`/jobs/${job.slug}`}
                  className="inline-block mt-6 px-5 py-2 text-sm font-medium bg-pastelBlue-600 text-white rounded-lg hover:bg-pastelBlue-700 transition"
                >
                  View Details
                </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-600 col-span-full text-center text-lg font-medium">
              No jobs found for your search.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
