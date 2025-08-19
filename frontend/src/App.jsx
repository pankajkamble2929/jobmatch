import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Companies from './pages/Companies';
import PostJob from './pages/PostJob';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import DashboardJobseeker from './pages/DashboardJobseeker';
import DashboardRecruiter from './pages/DashboardRecruiter';
import DashboardAdmin from './pages/DashboardAdmin';
import UsersAdmin from './pages/UsersAdmin';
import JobsAdmin from './pages/JobsAdmin';
import Profile from './pages/Profile';
import { useAuth } from './context/AuthProvider';
import Recommendations from './pages/Recommendations';
import ApplicationsPage from './pages/ApplicationsPage';
import AnalyticsPage from './pages/recruiter/AnalyticsPage';
import JobsByCity from './pages/JobsByCity';
import NotificationsPage from './pages/NotificationsPage.jsx';
import NotFound from './pages/NotFound';
import ServerError from './pages/ServerError';

// ✅ Protected Route wrapper
function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="p-10">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
}

export default function App() {
  return (
    <div className="min-h-screen bg-pastelBlue-50 text-gray-900 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/jobs-in/:citySlug" element={<JobsByCity />} />

          {/* Jobseeker Routes */}
          <Route
            path="/jobseeker/dashboard"
            element={
              <ProtectedRoute roles={['jobseeker']}>
                <DashboardJobseeker />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute roles={['jobseeker']}>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobseeker/recommendations"
            element={
              <ProtectedRoute roles={['jobseeker']}>
                <Recommendations />
              </ProtectedRoute>
            }
          />

          {/* Recruiter */}
          <Route
            path="/recruiter/dashboard"
            element={
              <ProtectedRoute roles={['recruiter']}>
                <DashboardRecruiter />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter/analytics"
            element={
              <ProtectedRoute roles={['recruiter']}>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/applications"
            element={
              <ProtectedRoute roles={['recruiter']}>
                <ApplicationsPage />
              </ProtectedRoute>
            }
          />

          {/* Post a Job */}
          <Route
            path="/post-job"
            element={
              <ProtectedRoute roles={['recruiter', 'admin']}>
                <PostJob />
              </ProtectedRoute>
            }
          />

          {/* Profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute roles={['jobseeker', 'recruiter']}>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roles={['admin']}>
                <DashboardAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute roles={['admin']}>
                <UsersAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/jobs"
            element={
              <ProtectedRoute roles={['admin']}>
                <JobsAdmin />
              </ProtectedRoute>
            }
          />
          {/* 500 error route */}
          <Route path="/500" element={<ServerError />} />

          {/* 404 route must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
