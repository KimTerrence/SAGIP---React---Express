import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Bug, Leaf, Map } from "lucide-react";

export default function AdminDashboard() {
  // Example dummy data (replace with API/DB data)
  const pestRanking = [
    { name: "Rice Bug", count: 45 },
    { name: "Stem Borer", count: 32 },
    { name: "Brown Planthopper", count: 27 },
    { name: "Armyworm", count: 20 },
    { name: "Leaf Folder", count: 15 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6 flex items-center gap-4">
          <Bug className="text-emerald-600" size={32} />
          <div>
            <h3 className="text-sm text-gray-500">Total Pests Detected</h3>
            <p className="text-2xl font-bold text-emerald-700">139</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 flex items-center gap-4">
          <Leaf className="text-emerald-600" size={32} />
          <div>
            <h3 className="text-sm text-gray-500">Most Common Pest</h3>
            <p className="text-lg font-semibold text-emerald-700">Rice Bug</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 flex items-center gap-4">
          <Map className="text-emerald-600" size={32} />
          <div>
            <h3 className="text-sm text-gray-500">Fields Monitored</h3>
            <p className="text-2xl font-bold text-emerald-700">12</p>
          </div>
        </div>
      </div>

      {/* Pest Ranking Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-emerald-800 mb-4">Top Detected Pests</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={pestRanking}>
            <XAxis dataKey="name" stroke="#065f46" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#059669" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
