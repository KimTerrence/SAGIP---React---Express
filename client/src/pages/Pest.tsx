// pages/Pest.tsx
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import PestModal from "../components/PestModal";
import { LayoutGrid, List } from "lucide-react";
import API_BASE_URL from "../config";

interface Pest {
  idPest: number;
  pestName: string;
  tagalogName: string;
  identifyingMarks: string;
  whereToFind: string;
  damage: string;
  lifeCycle: string;
  cultural: string;
  biological: string;
  chemical: string;
  pestImg: string;
  lifeCycleImg: string;
}

export default function Pest() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState<"card" | "list">("card");
  const [selectedPest, setSelectedPest] = useState<Pest | null>(null);
  const [pests, setPests] = useState<Pest[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch pests from backend
  useEffect(() => {
    const fetchPests = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/pests`);
        const data = await res.json();
        setPests(data);
      } catch (err) {
        console.error("❌ Failed to fetch pests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPests();
  }, []);

  // Filtering
  const filteredPests = pests.filter(
    (pest) =>
      (filter === "all" ||
        pest.identifyingMarks.toLowerCase().includes(filter.toLowerCase())) &&
      pest.pestName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-5xl mx-auto">
        {/* Header Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <input
            type="text"
            placeholder="Search pests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border rounded-lg w-full md:w-1/3"
          />

          <div className="flex items-center gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="all">All</option>
              <option value="insect">Insects</option>
              <option value="fungus">Fungus</option>
            </select>

            <button
              onClick={() => setView("card")}
              className={`p-2 rounded-lg border ${
                view === "card" ? "bg-gray-200" : ""
              }`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-lg border ${
                view === "list" ? "bg-gray-200" : ""
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Pest List */}
        {loading ? (
          <p className="text-center text-gray-500">Loading pests...</p>
        ) : filteredPests.length === 0 ? (
          <p className="text-center text-gray-500">No pests found.</p>
        ) : view === "card" ? (
          <div className="grid md:grid-cols-3 gap-4">
            {filteredPests.map((pest) => (
              <div
                key={pest.idPest}
                onClick={() => setSelectedPest(pest)}
                className="p-4 bg-white rounded-xl shadow hover:shadow-lg cursor-pointer transition"
              >
                {pest.pestImg && (
                  <img
                    src={`${API_BASE_URL}${pest.pestImg}`}
                    alt={pest.pestName}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="font-semibold text-lg">{pest.pestName}</h3>
                <p className="text-sm text-gray-500">{pest.tagalogName}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y rounded-xl bg-white shadow">
            {filteredPests.map((pest) => (
              <div
                key={pest.idPest}
                onClick={() => setSelectedPest(pest)}
                className="p-4 hover:bg-gray-50 cursor-pointer flex justify-between"
              >
                <span>{pest.pestName}</span>
                <span className="text-sm text-gray-500">{pest.tagalogName}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
     {selectedPest && (
  <>
    <PestModal
      pest={{
        ...selectedPest,
        pestImg: selectedPest.pestImg
          ? `${API_BASE_URL}${selectedPest.pestImg}`
          : "",
        lifeCycleImg: selectedPest.lifeCycleImg
          ? `${API_BASE_URL}${selectedPest.lifeCycleImg}`
          : "",
      }}
      onClose={() => setSelectedPest(null)}
    />
  </>
)}

    </>
  );
}
