import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { user, login } = useAuth(); // ✅ get user
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ✅ Redirect if already logged in
  useEffect(() => {
    document.title = "Login - JobMatch";

  let metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute(
      "content",
      "Login to your JobMatch account to access job opportunities, save jobs, and apply quickly to your dream roles."
    );
  } else {
    metaDescription = document.createElement("meta");
    metaDescription.name = "description";
    metaDescription.content =
      "Login to your JobMatch account to access job opportunities, save jobs, and apply quickly to your dream roles.";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);

    if (res.success) {
      // Redirect based on role
      switch (res.user.role) {
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
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Email</label>
          <input
            type="email"
            className="w-full border rounded-lg p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            className="w-full border rounded-lg p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-pastelBlue-800 text-white py-2 rounded-lg hover:bg-pastelBlue-700"
        >
          Login
        </button>
      </form>

      {/* Not registered text */}
      <p className="text-center mt-4 text-gray-600 text-sm">
        Not registered?{" "}
        <Link to="/signup" className="text-pastelBlue-600 font-medium hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
