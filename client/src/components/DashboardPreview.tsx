import React from "react";

export default function DashboardPreview({
  title = "Dashboard Preview",
  description = "Get a glimpse of your analytics, reports, and insights right from the dashboard.",
  previewImg = "/dashboard-preview.jpg",
  moreUrl = "/dashboard", // <-- link to your real dashboard route
}) {
  return (
    <section className="relative py-16 sm:py-20 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 text-center">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          {title}
        </h2>
        <p className="text-base sm:text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
          {description}
        </p>

        {/* Dashboard mockup */}
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          <img
            src={previewImg}
            alt="Dashboard preview"
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Button */}
        <div className="mt-10">
          <a
            href={moreUrl}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition"
          >
            View More
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
