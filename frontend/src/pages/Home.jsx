import Hero from '../components/Hero';
import JobList from '../components/JobList';
import CompanyList from '../components/CompanyList';
import CTA from '../components/CTA';
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.title = "JobMatch - Discover Jobs in Software, Engineering, AI & ML";

    const metaDescription = document.querySelector(
      'meta[name="description"]'
    );
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Browse top job opportunities in Software Development, Engineering, AI, and Machine Learning. Apply faster and find your dream job with JobMatch."
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content =
        "Browse top job opportunities in Software Development, Engineering, AI, and Machine Learning. Apply faster and find your dream job with JobMatch.";
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="bg-pastelBlue-50 min-h-screen text-gray-900">
      {/* Hero section */}
      <Hero />

      {/* Welcome section */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {/* Intro card */}
        <section className="rounded-2xl bg-white shadow-sm border border-gray-200 p-8">
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome to <span className="text-pastelBlue-700">JobMatch</span>
          </h2>
          <p className="mt-3 text-gray-600">
            Discover top opportunities in{' '}
            <span className="font-semibold">Software Development</span>,{' '}
            <span className="font-semibold">Engineering</span>, and the rapidly
            growing world of{' '}
            <span className="font-semibold">AI & Machine Learning</span>. JobMatch connects you
            with roles that shape the future of work.
          </p>
        </section>

        {/* CTA Banner 1 */}
        <CTA
          title="Looking to Hire Top Talent?"
          description="Post your job and reach thousands of qualified candidates instantly."
          buttonText="Post a Job"
          buttonLink="/login"
          bgColor="bg-pastelBlue-600"
          textColor="text-white"
        />

        {/* Featured Jobs */}
        <JobList />

        {/* CTA Banner 2 */}
        <CTA
          title="Upload Your Resume & Get Matched"
          description="Let our AI recommend the best jobs for you based on your skills and preferences."
          buttonText="Get Started"
          buttonLink="/login"
          bgColor="bg-green-600"
          textColor="text-white"
        />

        {/* Top Companies */}
        <CompanyList />
      </main>
    </div>
  );
}
