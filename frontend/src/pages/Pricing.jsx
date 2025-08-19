import { Check } from "lucide-react";

export default function Pricing() {
  const recruiterPlans = [
    {
      name: "Free",
      price: "₹0",
      period: "/month",
      features: ["Post up to 2 jobs", "Basic candidate search", "Email support"],
      buttonText: "Get Started",
    },
    {
      name: "Pro",
      price: "₹999",
      period: "/month",
      features: [
        "Post up to 20 jobs",
        "Advanced candidate search",
        "Priority email support",
        "Analytics dashboard",
      ],
      buttonText: "Upgrade to Pro",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "₹4999",
      period: "/month",
      features: [
        "Unlimited job postings",
        "Dedicated account manager",
        "Custom integrations",
        "24/7 phone & email support",
      ],
      buttonText: "Contact Sales",
    },
  ];

  const candidatePlan = {
    name: "Candidate Plan",
    price: "₹0",
    period: "/forever",
    features: [
      "Apply to unlimited jobs",
      "Upload your resume",
      "Get job alerts",
      "Always free for candidates 🎉",
    ],
    buttonText: "Start Applying",
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">Pricing Plans</h1>
        <p className="mt-3 text-gray-600">
          Recruiter & Candidate plans designed to fit your needs.
        </p>
      </div>

      {/* Recruiter Plans */}
      <div className="max-w-6xl mx-auto mb-20">
        <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
          Recruiter Plans
        </h2>
        <p className="text-gray-600 text-center mb-10">
          These plans are for recruiters/employers to post jobs & manage applicants.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {recruiterPlans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-2xl shadow-lg p-8 bg-white border ${
                plan.highlighted
                  ? "border-blue-600 scale-105"
                  : "border-gray-200"
              } transition-transform`}
            >
              <h2 className="text-xl font-semibold text-gray-900">
                {plan.name}
              </h2>
              <p className="mt-4 text-4xl font-bold text-gray-900">
                {plan.price}
                <span className="text-lg font-medium text-gray-600">
                  {plan.period}
                </span>
              </p>

              <ul className="mt-6 space-y-3 text-left">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <Check className="text-green-500 mr-2 h-5 w-5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`mt-8 w-full py-3 rounded-xl font-medium ${
                  plan.highlighted
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Candidate Plan */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
          Candidate Plan
        </h2>
        <p className="text-gray-600 text-center mb-10">
          This plan is <b>only for job seekers/candidates</b>.
        </p>

        <div className="rounded-2xl shadow-lg p-8 bg-white border border-green-400 hover:shadow-xl transition">
          <h3 className="text-xl font-bold text-gray-900">
            {candidatePlan.name}
          </h3>
          <p className="mt-4 text-4xl font-bold text-green-600">
            {candidatePlan.price}
            <span className="text-lg font-medium text-gray-600">
              {candidatePlan.period}
            </span>
          </p>

          <ul className="mt-6 space-y-3 text-left">
            {candidatePlan.features.map((feature, i) => (
              <li key={i} className="flex items-center text-gray-700">
                <Check className="text-green-500 mr-2 h-5 w-5" />
                {feature}
              </li>
            ))}
          </ul>

          <button className="mt-8 w-full py-3 rounded-xl font-medium bg-green-600 text-white hover:bg-green-700">
            {candidatePlan.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
