import { useState, useEffect } from "react";
import { Building2 } from "lucide-react"; // company icon
import api from "../utils/axios";

export default function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get("/api/jobs");
        const jobs = res.data.jobs || [];

        // Group by company and count total openings
        const companyMap = {};
        jobs.forEach((job) => {
          if (job.company) {
            if (!companyMap[job.company]) {
              companyMap[job.company] = { openings: 0, name: job.company };
            }
            companyMap[job.company].openings += job.openings || 0;
          }
        });

        // Sort companies by openings (desc) and take top 4
        const sortedCompanies = Object.values(companyMap)
          .sort((a, b) => b.openings - a.openings)
          .slice(0, 4);

        setCompanies(sortedCompanies);
      } catch (err) {
        console.error("Error fetching companies", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  if (loading) return <p className="p-10">Loading companies...</p>;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-6 text-pastelBlue-800">
        Top Companies
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {companies.map((company, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-200 
                       flex flex-col items-center justify-center 
                       hover:shadow-lg hover:-translate-y-1 
                       transition-all duration-200 cursor-pointer"
          >
            <Building2 size={32} className="text-pastelBlue-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
            <p className="text-sm text-gray-500">{company.openings} openings</p>
          </div>
        ))}
      </div>
    </section>
  );
}
