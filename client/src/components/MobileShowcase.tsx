

export default function MobileShowcase({
  title = "Your App",
  subtitle = "Mobile showcase",
  description = "Highlight key benefits and a short hook here.",
  features = ["Offline ready", "Fast AI inference", "Simple camera capture"],
  screenshotUrl = "/mobile1.jpg",
  screenshotUrl2 = "/mobile2.jpg",
  downloadUrl = "#",
}) {
  return (
    <section className="relative overflow-hidde from-white via-indigo-50/40 to-white py-16 sm:py-20 md:py-28">
      {/* Background blobs */}

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Dual Phone mockups */}
          <div className="flex flex-row justify-center md:justify-end items-center gap-4 sm:gap-6 md:gap-10">
  {[screenshotUrl, screenshotUrl2].map((screen, idx) => (
    <div
      key={idx}
      className={`relative w-28 h-[240px] xs:w-32 xs:h-[280px] sm:w-40 sm:h-[340px] md:w-48 md:h-[420px] lg:w-56 lg:h-[480px] 
      bg-black/80 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden border-[4px] border-black 
      transform transition duration-500 hover:scale-105 ${
        idx === 0
          ? "sm:-rotate-3 sm:translate-y-2"
          : "sm:rotate-3 sm:-translate-y-2"
      }`}
    >
      {/* Top notch */}
      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/50 rounded-xl z-10" />

      {/* Screen */}
      <div className="absolute inset-[3px]  rounded-[1.2rem] md:rounded-[2.5rem] overflow-hidden bg-gray-900">
        {screen ? (
          <img
            src={screen}
            alt={`App screenshot ${idx + 1}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex w-full h-full items-center justify-center text-gray-400 bg-gray-800">
            Add screenshotUrl{idx === 0 ? "" : "2"}
          </div>
        )}
      </div>

      {/* Bottom home indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 sm:w-16 h-1 rounded-full bg-gray-300/70" />
    </div>
  ))}
</div>


          {/* Text area */}
          <div className="text-center md:text-left">
            <h3 className="text-xs sm:text-sm md:text-base text-indigo-600 font-semibold tracking-wider mb-3 uppercase">
              {subtitle}
            </h3>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight mb-6 text-gray-900">
              {title}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-8 sm:mb-10 leading-relaxed max-w-xl mx-auto md:mx-0">
              {description}
            </p>

            <ul className="mb-8 sm:mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 justify-center md:justify-start"
                >
                  <span className="mt-1 inline-flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-xs sm:text-sm font-bold shadow-sm">
                    ✓
                  </span>
                  <span className="text-gray-700 text-sm sm:text-base font-medium">
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <a
                href={downloadUrl}
                download
                className="inline-flex items-center justify-center gap-3 px-6 sm:px-7 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 13a1 1 0 011-1h3v-4a1 1 0 112 0v4h3a1 1 0 011 1v1a1 1 0 11-2 0v-1H6v1a1 1 0 11-2 0v-1z"
                    clipRule="evenodd"
                  />
                  <path d="M7 7a1 1 0 012 0v4H7V7z" />
                </svg>
                Download
              </a>

              <button
                type="button"
                onClick={() =>
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-2.5 sm:py-3 rounded-2xl border border-gray-300 bg-white text-gray-700 font-medium shadow hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98] transition"
              >
                Learn more
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-6">
              By downloading you agree to the app terms and privacy policy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
