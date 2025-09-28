// pages/Download.tsx
import Navbar from "../components/Navbar";
import { Download, Smartphone, Info } from "lucide-react";

export default function DownloadApp() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-10 md:p-20">
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
          {/* Page Header */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold mb-3 text-gray-900">
              📥 Download Center
            </h1>
            <p className="text-gray-600 text-lg">
              Get the latest version of our app and useful resources below.
            </p>
          </div>

          {/* App Download Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <Smartphone className="w-7 h-7 mr-2 text-green-600" /> App Download
            </h2>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 shadow-sm">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    Smart Agricultural Assistant (Android)
                  </p>
                  <p className="text-sm text-gray-500">Version 1.0.0</p>
                </div>
                <a
                  href="/downloads/sagip-app.apk"
                  download
                  className="mt-4 sm:mt-0 flex items-center bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition shadow"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download APK
                </a>
              </div>

              {/* Release Notes */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-inner">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  📝 Release Notes
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Initial release of the Smart Agricultural Assistant app.</li>
                  <li>AI-powered pest detection for rice and corn crops.</li>
                  <li>Offline detection support using ONNX model.</li>
                  <li>User registration and local SQLite storage.</li>
                  <li>Data sync with remote MySQL when online.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-12 flex items-start bg-yellow-50 border border-yellow-200 rounded-xl p-5 shadow-sm">
            <Info className="w-6 h-6 text-yellow-600 mr-3 mt-1" />
            <p className="text-gray-700 text-sm md:text-base">
              Make sure to enable{" "}
              <span className="font-semibold">“Install unknown apps”</span> in
              your Android settings to install the APK.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
