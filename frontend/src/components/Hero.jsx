import { Briefcase, Sparkles } from "lucide-react";
import JobHuntIllustration from "../assets/job-hunt.png";
import { useEffect, useState } from "react";

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const parallaxX = (factor) => (mousePos.x / window.innerWidth - 0.5) * factor;
  const parallaxY = (factor) => (mousePos.y / window.innerHeight - 0.5) * factor;

  return (
    <section className="bg-gradient-to-b from-pastelBlue-50 to-white relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-pastelBlue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-pastelBlue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <div className="text-center lg:text-left relative z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
            Find Your <span className="text-pastelBlue-600">Dream Job</span> with AI
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            AI-powered job recommendations tailored just for you. 
            Search smarter, apply faster, and land your ideal role effortlessly.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="mt-8 flex justify-center lg:justify-start gap-4">
            <a
              href="/login"
              className="px-6 py-3 bg-pastelBlue-600 text-white rounded-lg font-semibold flex items-center gap-2 shadow-lg transform transition duration-500 hover:scale-105 hover:bg-pastelBlue-700"
            >
              <Sparkles className="w-5 h-5 animate-bounce" />
              Get Started
            </a>
            <a
              href="/login"
              className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg font-semibold flex items-center gap-2 shadow transform transition duration-500 hover:scale-105 hover:bg-gray-200"
            >
              <Briefcase className="w-5 h-5" />
              Post a Job
            </a>
          </div>
        </div>

        {/* Right Illustration with Parallax */}
        <div
          className="flex justify-center lg:justify-end relative z-10"
          style={{
            transform: `translateX(${parallaxX(30)}px) translateY(${parallaxY(30)}px)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <img
            src={JobHuntIllustration}
            alt="Job Search Illustration"
            className="max-w-md w-full drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
