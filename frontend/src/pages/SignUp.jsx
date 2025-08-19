import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/axios";
import { useAuth } from "../context/AuthProvider";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "jobseeker",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const { user, login } = useAuth(); // ✅ get current user
  const navigate = useNavigate();

  // ✅ Redirect if already logged in
  useEffect(() => {
    document.title = "Sign Up - JobMatch";

  let metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute(
      "content",
      "Create a JobMatch account to browse jobs, save opportunities, and apply to Software, Engineering, AI & ML roles."
    );
  } else {
    metaDescription = document.createElement("meta");
    metaDescription.name = "description";
    metaDescription.content =
      "Create a JobMatch account to browse jobs, save opportunities, and apply to Software, Engineering, AI & ML roles.";
    document.head.appendChild(metaDescription);
  }
    
    if (user) {
      switch (user.role) {
        case "jobseeker":
          navigate("/jobseeker/dashboard");
          break;
        case "recruiter":
          navigate("/recruiter/dashboard");
          break;
        case "admin":
          navigate("/admin/dashboard");
          break;
        default:
          navigate("/");
      }
    }
  }, [user, navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await api.post(
        "/api/auth/register",
        formData
      );

      // Use your AuthProvider login function
      await login(res.data.email, formData.password);

      setMessage("Registration successful! Redirecting...");
      setTimeout(() => {
        switch (res.data.role) {
          case "jobseeker":
            navigate("/jobseeker/dashboard");
            break;
          case "recruiter":
            navigate("/recruiter/dashboard");
            break;
          case "admin":
            navigate("/admin/dashboard");
            break;
          default:
            navigate("/");
        }
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>

        {message && <p className="text-blue-600 mb-2">{message}</p>}

        <input
          name="name"
          placeholder="Name"
          className="w-full border p-2 rounded mb-3"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded mb-3"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <div className="relative mb-3">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full border p-2 rounded"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-sm text-gray-500"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <select
          name="role"
          className="w-full border p-2 rounded mb-3"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="jobseeker">Job Seeker</option>
          <option value="recruiter">Recruiter</option>
        </select>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Sign Up
        </button>

        <p className="text-center mt-4 text-gray-600 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-600 font-medium hover:underline"
          >
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
