import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from "../utils/axios";
import {
  MapPin,
  Building2,
  IndianRupee,
  Clock,
  Users,
  Briefcase,
  Bookmark,
  Send,
} from 'lucide-react';
import { useAuth } from '../context/AuthProvider';

export default function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [relevantJobs, setRelevantJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [applying, setApplying] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

  const timeAgo = (dateString) => {
    const now = new Date();
    const created = new Date(dateString);
    const diff = Math.floor((now - created) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 30 * 86400) return `${Math.floor(diff / 86400)}d ago`;
    return created.toLocaleDateString();
  };

  const fetchSavedJobs = async (token) => {
    try {
      const res = await api.get('/api/saved-jobs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.savedJobs.map((j) => j._id);
    } catch {
      return [];
    }
  };

  useEffect(() => {
  const fetchJob = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/jobs/${id}`);
      let jobData = res.data;

      // Capitalize necessary fields
      jobData = {
        ...jobData,
        title: capitalize(jobData.title),
        company: capitalize(jobData.company),
        location: capitalize(jobData.location),
        experience: capitalize(jobData.experience),
        salaryRange: capitalize(jobData.salaryRange),
        jobType: capitalize(jobData.jobType),
        employmentType: capitalize(jobData.employmentType),
        skillsRequired: jobData.skillsRequired?.map(capitalize) || [],
        jobDescriptionPointers:
          jobData.jobDescriptionPointers?.map(capitalize) || [],
      };

      if (jobData.skillsRequired?.length > 0) {
        const skillsQuery = jobData.skillsRequired.join(',');
        const relevantRes = await api.get(
          `/api/jobs/search?skills=${skillsQuery}`
        );
        const filteredJobs = relevantRes.data.jobs
          .filter((j) => j._id !== jobData._id)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10)
          .map((j) => ({
            ...j,
            title: capitalize(j.title),
            company: capitalize(j.company),
            location: capitalize(j.location),
            jobType: capitalize(j.jobType),
          }));
        setRelevantJobs(filteredJobs);
      }

      let savedState = false;
      let appliedState = false;
      let applicantsCount = jobData.applicantsCount || 0;

      if (user) {
        const token = localStorage.getItem('authToken');
        if (token) {
          const savedJobIds = await fetchSavedJobs(token);
          savedState = savedJobIds.includes(jobData._id);

          try {
            const appliedRes = await api.get(
              '/api/applications',
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            const appliedJobs = appliedRes.data.appliedJobs || [];
            appliedState = appliedJobs.some((j) => j._id === jobData._id);
            applicantsCount = appliedJobs.filter(
              (j) => j._id === jobData._id
            ).length;
          } catch {
            appliedState = false;
          }
        }
      }

      setJob({ ...jobData, applicantsCount });
      setSaved(savedState);
      setAlreadyApplied(appliedState);
    } catch (err) {
      console.error('Error fetching job:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchJob();
}, [id, user]);

  const handleSave = async () => {
    if (!user) return navigate('/login');
    const token = localStorage.getItem('authToken');
    if (!token) return navigate('/login');

    try {
      if (!saved) {
        await api.post(
          '/api/saved-jobs',
          { jobId: job._id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setSaved(true);
      } else {
        await api.delete(`/api/saved-jobs/${job._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setSaved(false);
      }
    } catch (err) {
      console.error('Error saving/unsaving job:', err);
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const handleApply = async () => {
    if (!user) return navigate('/login');
    const token = localStorage.getItem('authToken');
    if (!token) return navigate('/login');

    try {
      setApplying(true);
      await api.post(
        '/api/applications',
        {
          jobId: job._id,
          coverLetter: 'I am interested in this job.',
          resume: 'https://example.com/resume.pdf',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAlreadyApplied(true);
      setJob((prev) => ({
        ...prev,
        applicantsCount: (prev.applicantsCount || 0) + 1,
      }));
      alert('Application submitted successfully!');
    } catch (err) {
      console.error('Error applying:', err);
      alert('Application failed');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <p className="p-10 text-lg">Loading job details...</p>;
  if (!job) return <p className="p-10 text-lg">Job not found.</p>;

  return (
    <div className="bg-gradient-to-br from-pastelBlue-50 to-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
        {/* Left */}
        <div className="col-span-12 md:col-span-8 space-y-8">
          <div className="bg-white shadow-lg rounded-2xl p-8 space-y-4">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Briefcase className="text-pastelBlue-600" size={28} />{' '}
              {job.title}
            </h1>

            {/* Job Score for Jobseekers */}
            {user?.role === 'jobseeker' && job.matchScore && (
              <div className="bg-gray-100 p-3 rounded-lg flex gap-4 justify-between text-sm font-medium text-gray-700">
                <span>
                  Total Score:{' '}
                  <span className="text-green-600">
                    {job.matchScore.totalScore}%
                  </span>
                </span>
                <span>Skill: {job.matchScore.skillScore}%</span>
                <span>Location: {job.matchScore.locScore}%</span>
                <span>Recency: {job.matchScore.recScore}%</span>
              </div>
            )}

            <p className="flex items-center gap-2 text-lg text-gray-700">
              <Building2 size={20} className="text-gray-500" /> {job.company}
            </p>

            <div className="flex flex-wrap gap-4 text-gray-600">
              <span className="flex items-center gap-1">
                <MapPin size={18} className="text-gray-500" /> {job.location}
              </span>
              <span className="flex items-center gap-1">
                <IndianRupee size={18} className="text-green-600" />{' '}
                {job.salaryRange}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={18} className="text-gray-500" /> {job.experience}
              </span>
            </div>

            <hr className="my-4 border-gray-200" />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <p
                className="flex items-center gap-2"
                title={new Date(job.createdAt).toLocaleString()}
              >
                <Clock size={16} /> Posted: {timeAgo(job.createdAt)}
              </p>
              <p className="flex items-center gap-2">
                <Users size={16} /> Applicants: {job.applicantsCount || 0}+
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              {(user?.role === 'jobseeker' || !user) && (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                  >
                    <Bookmark size={18} /> {saved ? 'Unsave' : 'Save'}
                  </button>

                  {!alreadyApplied ? (
                    <button
                      onClick={handleApply}
                      disabled={applying}
                      className="flex items-center gap-2 px-6 py-2 bg-pastelBlue-600 text-white rounded-full hover:bg-pastelBlue-700 transition"
                    >
                      <Send size={18} />{' '}
                      {applying ? 'Applying...' : 'Apply Now'}
                    </button>
                  ) : (
                    <span className="flex items-center gap-2 px-6 py-2 bg-green-100 text-green-800 rounded-full">
                      Already Applied
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Job Description</h2>
            <p className="leading-relaxed text-gray-700">{job.description}</p>
            {job.jobDescriptionPointers?.length > 0 && (
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {job.jobDescriptionPointers.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            )}
            <div>
              <p className="font-bold text-gray-900">Skills Required:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {job.skillsRequired?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-pastelBlue-100 text-pastelBlue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="col-span-12 md:col-span-4">
          <div className="bg-white shadow-lg rounded-2xl p-6 space-y-4 sticky top-6">
            <h2 className="text-xl font-bold mb-2">Relevant Jobs</h2>
            {relevantJobs.length === 0 ? (
              <p className="text-gray-500">No matching jobs found.</p>
            ) : (
              relevantJobs.map((j, idx) => (
                <div key={j._id}>
                  <Link
                    to={`/jobs/${j.slug}`}
                    className="block hover:bg-gray-50 p-3 rounded-lg transition"
                  >
                    <h3 className="font-semibold text-lg">{j.title}</h3>
                    <p className="text-gray-600 flex items-center gap-2">
                      <Building2 size={16} /> {j.company}
                    </p>
                    <p className="text-gray-500 flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" /> {j.jobType}
                    </p>
                  </Link>
                  {idx < relevantJobs.length - 1 && (
                    <hr className="my-2 border-gray-200" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
