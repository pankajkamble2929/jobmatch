import { useEffect, useState } from 'react';
import { MapPin, Briefcase, IndianRupee, Users, X, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';

export default function Companies() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [companies, setCompanies] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  useEffect(() => {
    document.title = 'Top Companies - JobMatch';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Discover top companies hiring in AI, Software Development, and Engineering. Explore company profiles and apply directly with JobMatch.'
      );
    }

    const fetchJobs = async () => {
      try {
        const res = await api.get('/api/jobs');
        const jobList = res.data.jobs || [];
        setJobs(jobList);
        setFilteredJobs(jobList);

        // Extract unique company names
        const uniqueCompanies = [...new Set(jobList.map((job) => job.company))];
        setCompanies(uniqueCompanies);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs whenever selected companies change
  useEffect(() => {
    if (selectedCompanies.length === 0) {
      setFilteredJobs(jobs);
    } else {
      setFilteredJobs(
        jobs.filter((job) => selectedCompanies.includes(job.company))
      );
    }
  }, [selectedCompanies, jobs]);

  const handleSelectCompany = (company) => {
    if (company && !selectedCompanies.includes(company)) {
      setSelectedCompanies([...selectedCompanies, company]);
    }
  };

  const removeCompany = (company) => {
    setSelectedCompanies(selectedCompanies.filter((c) => c !== company));
  };

  const resetFilters = () => {
    setSelectedCompanies([]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading jobs...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
          Explore Companies
        </h1>

        {/* Filter Section */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-10 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-1/2">
              <Filter className="w-5 h-5 text-blue-600" />
              <select
                onChange={(e) => handleSelectCompany(e.target.value)}
                className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                defaultValue=""
              >
                <option value="" disabled>
                  Select a company
                </option>
                {companies.map((company, idx) => (
                  <option key={idx} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            {selectedCompanies.length > 1 && (
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Selected Chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedCompanies.map((company, idx) => (
              <span
                key={idx}
                className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm"
              >
                {company}
                <button
                  onClick={() => removeCompany(company)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Jobs Section */}
        {filteredJobs.length === 0 ? (
          <p className="text-center text-gray-600">
            No jobs found for selected companies.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
              >
                <h2 className="text-xl font-semibold text-blue-600">
                  {job.company}
                </h2>
                <p className="text-gray-900 font-medium">{job.title}</p>

                <p className="text-gray-600 mt-3 line-clamp-3">
                  {job.description}
                </p>

                <div className="mt-4 space-y-2 text-gray-700 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-500" />
                    <span>
                      {job.employmentType} • {job.jobType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span>{job.openings} Openings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-blue-500" />
                    <span>{job.salaryRange}</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {job.skillsRequired?.slice(0, 3).map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <Link
                  to={`/jobs/${job.slug}`}
                  className="inline-block mt-4 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
