import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export default function ServerError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-red-100 to-red-200 p-6">
      <AlertTriangle className="w-20 h-20 text-red-600 mb-6 animate-bounce" />
      <h1 className="text-6xl font-extrabold text-red-700 mb-4">500</h1>
      <p className="text-xl text-gray-800 mb-6">
        Oops! Something went wrong on our side.
      </p>
      <Link
        to="/"
        className="px-8 py-3 bg-red-600 text-white text-lg rounded-lg shadow-lg hover:bg-red-500 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
