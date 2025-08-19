import React from "react";
import { Sparkles } from "lucide-react";

export default function CTA({
  title,
  description,
  buttonText,
  buttonLink,
  bgColor = "bg-pastelBlue-600",
  textColor = "text-white",
  icon = <Sparkles className="w-6 h-6 inline-block mr-2" />,
}) {
  return (
    <section className={`${bgColor} rounded-2xl shadow-lg p-10 text-center`}>
      <div className="max-w-4xl mx-auto">
        <h2 className={`text-3xl sm:text-4xl font-bold ${textColor} mb-4 flex justify-center items-center`}>
          {icon}
          {title}
        </h2>
        <p className={`text-lg sm:text-xl ${textColor} mb-6`}>
          {description}
        </p>
        <a
          href={buttonLink}
          className={`inline-block px-8 py-4 font-semibold rounded-lg shadow hover:opacity-90 transition ${bgColor === "bg-white" ? "bg-pastelBlue-600 text-white" : "bg-white text-black"}`}
        >
          {buttonText}
        </a>
      </div>
    </section>
  );
}
