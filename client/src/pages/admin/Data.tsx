"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { LayoutGrid, List } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Detection {
  id: number;
  pestName: string;
  imagePath: string;
  dateDetected: string;
  email: string;
  userId: number;
  host?: string;
}

export default function DetectionGallery() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"card" | "list">("card");
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
    axios.get(`${API_BASE_URL}/detections`)
      .then(res => {
        const cleanedData = res.data.map((d: Detection) => ({
          ...d,
          // Replace dashes with spaces and capitalize first letters
          pestName: d.pestName
            .replace(/-/g, " ")
            .replace(/\b\w/g, char => char.toUpperCase())
        }));
        setDetections(cleanedData);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredDetections = detections.filter(d =>
    d.pestName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search detections..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded-lg w-full md:w-1/3"
        />

        <button
          onClick={() => setView("card")}
          className={`p-2 rounded-lg border ${view === "card" ? "bg-gray-200" : ""}`}
        >
          <LayoutGrid size={18} />
        </button>
        <button
          onClick={() => setView("list")}
          className={`p-2 rounded-lg border ${view === "list" ? "bg-gray-200" : ""}`}
        >
          <List size={18} />
        </button>
      </div>

      {/* Card View */}
      {loading ? (
        <p className="text-center text-gray-500">Loading detections...</p>
      ) : filteredDetections.length === 0 ? (
        <p className="text-center text-gray-500">No detections found.</p>
      ) : view === "card" ? (
        <div className="grid md:grid-cols-3 gap-4">
          {filteredDetections.map(d => (
            <div
              key={d.id}
              className="p-4 bg-white rounded-xl shadow hover:shadow-lg cursor-pointer transition"
            >
              <img
                src={API_BASE_URL + d.imagePath}
                alt={d.pestName}
                className="w-full h-48 object-cover rounded-lg mb-2"
              />
              <h3 className="text-center font-semibold">{d.pestName}</h3>
            </div>
          ))}
        </div>
      ) : (
        // List View - Table Style
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Image</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Pest Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">User</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Host</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date Detected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDetections.map(d => (
                <tr key={d.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-4 py-2">
                    <img
                      src={API_BASE_URL + d.imagePath}
                      alt={d.pestName}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  </td>
                  <td className="px-4 py-2">{d.pestName}</td>
                  <td className="px-4 py-2">{d.email}</td>
                  <td className="px-4 py-2">{d.host ?? "-"}</td>
                  <td className="px-4 py-2">{new Date(d.dateDetected).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
