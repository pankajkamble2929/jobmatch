import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pastelBlue-100 to-pastelBlue-200 p-6">
      <h1 className="text-8xl font-extrabold text-pastelBlue-800 mb-6 animate-pulse">404</h1>
      <p className="text-2xl text-gray-800 mb-6">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Link
        to="/"
        className="px-8 py-3 bg-pastelBlue-800 text-white text-lg rounded-lg shadow-lg hover:bg-pastelBlue-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
