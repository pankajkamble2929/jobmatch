import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthProvider';
import NotificationsDropdown from './NotificationsDropdown';
import api from "../utils/axios";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [cities, setCities] = useState([]);
  const [isJobsOpen, setIsJobsOpen] = useState(false); // Toggle for Jobs dropdown
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch cities dynamically
    const fetchCities = async () => {
      try {
        const res = await api.get("/api/jobs");
        const jobs = res.data.jobs || [];
        const uniqueCities = [...new Set(jobs.map((job) => job.location))];
        setCities(uniqueCities);
      } catch (err) {
        console.error('Error fetching cities:', err);
      }
    };
    fetchCities();
  }, []);

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'jobseeker':
        return '/jobseeker/dashboard';
      case 'recruiter':
        return '/recruiter/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  const showRecruiterLinks = user && user.role === 'recruiter';
  const showJobseekerLinks = user && user.role === 'jobseeker';

  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4">
        <Link to="/" className="text-2xl font-bold text-pastelBlue-800">
          JobMatch
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          {/* Jobs Dropdown on click */}
          <div className="relative">
            <button
              onClick={() => setIsJobsOpen(!isJobsOpen)}
              className="flex items-center gap-1 hover:text-pastelBlue-700 font-medium"
            >
              Jobs{' '}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isJobsOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isJobsOpen && (
              <div className="absolute left-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-56 z-50">
                <ul>
                  <li>
                    <Link
                      to="/jobs"
                      className="block px-4 py-2 text-gray-700 hover:bg-pastelBlue-50"
                      onClick={() => setIsJobsOpen(false)}
                    >
                      All Jobs
                    </Link>
                  </li>
                  {cities.map((city) => {
                    const citySlug = city.toLowerCase().replace(/\s+/g, '-');
                    return (
                      <li key={city}>
                        <Link
                          to={`/jobs-in/${citySlug}`}
                          className="block px-4 py-2 text-gray-700 hover:bg-pastelBlue-50"
                          onClick={() => setIsJobsOpen(false)}
                        >
                          Jobs in {city}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          <Link to="/companies" className="hover:text-pastelBlue-700">
            Companies
          </Link>

          {showRecruiterLinks && (
            <>
              <Link to="/post-job" className="hover:text-pastelBlue-700">
                Post a Job
              </Link>
              <Link to="/pricing" className="hover:text-pastelBlue-700">
                Pricing
              </Link>
            </>
          )}

          {showJobseekerLinks && (
            <Link
              to="/jobseeker/recommendations"
              className="hover:text-pastelBlue-700 font-medium"
            >
              Recommendations
            </Link>
          )}

          {user && user.role === 'jobseeker' && <NotificationsDropdown />}

          {user ? (
            <>
              <Link
                to={getDashboardLink()}
                className="hover:text-pastelBlue-700"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="px-4 py-2 bg-pastelBlue-800 text-white rounded-lg hover:bg-pastelBlue-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 bg-white text-pastelBlue-800 border border-pastelBlue-800 rounded-lg hover:bg-pastelBlue-50"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-pastelBlue-800 text-white rounded-lg hover:bg-pastelBlue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(true)}>
            <Menu className="h-6 w-6 text-pastelBlue-900" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col p-6 overflow-y-auto">
          <button className="self-end mb-6" onClick={() => setIsOpen(false)}>
            <X className="h-6 w-6 text-gray-700" />
          </button>

          {/* Mobile Jobs */}
          <div className="mb-4">
            <button
              onClick={() => setIsJobsOpen(!isJobsOpen)}
              className="flex items-center justify-between w-full px-2 py-1 text-gray-700 font-medium hover:bg-pastelBlue-50 rounded"
            >
              Jobs{' '}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isJobsOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {isJobsOpen && (
              <ul className="mt-2 space-y-2 pl-2">
                <li>
                  <Link
                    to="/jobs"
                    className="block px-2 py-1 text-gray-700 hover:bg-pastelBlue-50 rounded"
                    onClick={() => setIsOpen(false)}
                  >
                    All Jobs
                  </Link>
                </li>
                {cities.map((city) => {
                  const citySlug = city.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <li key={city}>
                      <Link
                        to={`/jobs-in/${citySlug}`}
                        className="block px-2 py-1 text-gray-700 hover:bg-pastelBlue-50 rounded"
                        onClick={() => setIsOpen(false)}
                      >
                        Jobs in {city}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <Link
            to="/companies"
            className="mb-4 hover:text-pastelBlue-700"
            onClick={() => setIsOpen(false)}
          >
            Companies
          </Link>

          {showRecruiterLinks && (
            <>
              <Link
                to="/post-job"
                className="mb-4 hover:text-pastelBlue-700"
                onClick={() => setIsOpen(false)}
              >
                Post a Job
              </Link>
              <Link
                to="/pricing"
                className="mb-4 hover:text-pastelBlue-700"
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </Link>
            </>
          )}

          {showJobseekerLinks && (
            <Link
              to="/jobseeker/recommendations"
              className="mb-4 font-medium hover:text-pastelBlue-700"
              onClick={() => setIsOpen(false)}
            >
              Recommended Jobs
            </Link>
          )}

          {user ? (
            <>
              <Link
                to={getDashboardLink()}
                className="mb-4 hover:text-pastelBlue-700"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                  navigate('/');
                }}
                className="px-4 py-2 bg-pastelBlue-800 text-white rounded-lg hover:bg-pastelBlue-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 bg-white text-pastelBlue-800 border border-pastelBlue-800 rounded-lg mb-4 hover:bg-pastelBlue-50"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-pastelBlue-800 text-white rounded-lg hover:bg-pastelBlue-700"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
