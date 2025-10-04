"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Bug, Leaf, User } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Detection {
  id: number;
  pestName: string;
  dateDetected: string;
  email: string;
  host?: string;
}

export default function AdminDashboard() {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/detections`)
      .then(res => setDetections(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  
  const validDetections = detections.filter(d => d.pestName && d.pestName !== "None");

   // Replace dashes with spaces
  validDetections.forEach(d => {
    d.pestName = d.pestName.replace(/-/g, " ");
    d.pestName = d.pestName.replace(/\b\w/g, char => char.toUpperCase())
  });

  // Calculate stats
  const totalPests = validDetections.length;

 // Count per pestName
const pestCounts: Record<string, number> = {};
validDetections.forEach(d => {
  const name = d.pestName;
  pestCounts[name] = (pestCounts[name] || 0) + 1;
});

// Most common pest
const mostCommonPest = Object.entries(pestCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

// Unique fields/hosts
const appUserCount = new Set(validDetections.map(d => d.host ?? d.email)).size;

// Top pests for chart
const pestRanking = Object.entries(pestCounts)
  .map(([name, count]) => ({ name, count }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 5); // top 5

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6 flex items-center gap-4">
          <Bug className="text-emerald-600" size={32} />
          <div>
            <h3 className="text-sm text-gray-500">Total Pests Detected</h3>
            <p className="text-2xl font-bold text-emerald-700">{totalPests}</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 flex items-center gap-4">
          <Leaf className="text-emerald-600" size={32} />
          <div>
            <h3 className="text-sm text-gray-500">Most Common Pest</h3>
            <p className="text-lg font-semibold text-emerald-700">{mostCommonPest}</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 flex items-center gap-4">
          <User className="text-emerald-600" size={32} />
          <div>
            <h3 className="text-sm text-gray-500">App User Count</h3>
            <p className="text-2xl font-bold text-emerald-700">{appUserCount}</p>
          </div>
        </div>
      </div>

      {/* Pest Ranking Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-emerald-800 mb-4">Top Detected Pests</h2>
        {loading ? (
          <p className="text-gray-500 text-center">Loading chart...</p>
        ) : pestRanking.length === 0 ? (
          <p className="text-gray-500 text-center">No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pestRanking}>
              <XAxis dataKey="name" stroke="#065f46" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#059669" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
