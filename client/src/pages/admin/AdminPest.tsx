import { useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import EditPestModal from "../../components/EditPestModal";
import PestModal from "../../components/PestModal";
import { useOutletContext } from "react-router-dom";
import AddPestModal from "../../components/AddPestModal";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type ContextType = {
  search: string;
  setSearch: (v: string) => void;
  filter: string;
  setFilter: (v: string) => void;
  view: "card" | "list";
  setView: (v: "card" | "list") => void;
  pests: Pest[];
  setPests: React.Dispatch<React.SetStateAction<Pest[]>>;
};

interface ControlMethods {
  Cultural: string[];
  Biological: string[];
  Chemical: string[];
}

interface Pest {
  idPest: number;
  pestImg: string;
  pestName: string;
  tagalogName: string;
  host: string;
  identifyingMarks: string;
  whereToFind: string;
  damage: string;
  lifeCycle: string;
  lifeCycleImg: string;
  controlMethods?: ControlMethods;
}

export default function AdminPest() {
  const { search, filter, view, pests, setPests } =
    useOutletContext<ContextType>();

  const [loading, setLoading] = useState(true);

  // Modals
  const [editingPest, setEditingPest] = useState<number | null>(null);
  const [form, setForm] = useState<Pest | null>(null);
  const [selectedPest, setSelectedPest] = useState<Pest | null>(null);
  const [adding, setAdding] = useState(false);

  // Fetch pests with control methods (axios)
  const fetchPests = async () => {
    try {
      const res = await axios.get<Pest[]>(`${API_BASE_URL}/pests`);
      setPests(res.data);
    } catch (err) {
      console.error("❌ Error fetching pests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pests.length === 0) {
      fetchPests();
    } else {
      setLoading(false);
    }
  }, []);

  const filteredPests = pests.filter((pest) => {
    const matchesSearch = pest.pestName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || pest.host === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <p>Loading pests...</p>;

 return (
  <div className="space-y-6">
    {filteredPests.length > 0 ? (
      view === "card" ? (
        // 🟢 CARD VIEW
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredPests.map((pest) => (
            <div
              key={pest.idPest}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition relative cursor-pointer"
              onClick={() => setSelectedPest(pest)}
            >
              {/* Image with overlay */}
              <div className="relative w-full h-40">
                <img
                  src={`${API_BASE_URL}${pest.pestImg}`}
                  alt={pest.pestName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-2 left-2 text-white drop-shadow-md">
                  <h2 className="text-lg font-semibold">{pest.pestName}</h2>
                  <p className="text-sm italic">{pest.tagalogName}</p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4">
                <p className="text-xs text-gray-700">
                  <span className="bg-green-200 px-3 py-2 rounded-full">{pest.host}</span>
                </p>
                <p className="mt-2 text-gray-600">
                  {pest.identifyingMarks.length > 80
                    ? pest.identifyingMarks.substring(0, 80) + "..."
                    : pest.identifyingMarks}
                </p>
              </div>

              {/* Edit Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setForm(pest);
                  setEditingPest(pest.idPest);
                }}
                className="absolute top-2 right-2 bg-green-600 text-white p-2 rounded-full shadow hover:bg-green-700"
              >
                <Pencil size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        // 🔵 LIST VIEW
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Pest Name</th>
                <th className="px-4 py-3">Tagalog Name</th>
                <th className="px-4 py-3">Host</th>
                <th className="px-4 py-3">Identifying Marks</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPests.map((pest) => (
                <tr
                  key={pest.idPest}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedPest(pest)}
                >
                  <td className="px-4 py-2">
                    <img
                      src={`${API_BASE_URL}${pest.pestImg}`}
                      alt={pest.pestName}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  </td>
                  <td className="px-4 py-2 font-medium">{pest.pestName}</td>
                  <td className="px-4 py-2 italic text-gray-600">{pest.tagalogName}</td>
                  <td className="px-4 py-2">
                    <span className="bg-green-200 px-2 py-1 rounded-full text-xs">
                      {pest.host}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {pest.identifyingMarks.length > 60
                      ? pest.identifyingMarks.substring(0, 60) + "..."
                      : pest.identifyingMarks}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setForm(pest);
                        setEditingPest(pest.idPest);
                      }}
                      className="bg-green-600 text-white px-2 py-1 rounded shadow hover:bg-green-700"
                    >
                      <Pencil size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    ) : (
      <p className="text-gray-500">No pests found.</p>
    )}

    {/* View Modal */}
    {selectedPest && (
      <PestModal
        pest={{
          ...selectedPest,
          pestImg: selectedPest.pestImg,
          lifeCycleImg: selectedPest.lifeCycleImg,
        }}
        onClose={() => setSelectedPest(null)}
      />
    )}

    {/* Edit Modal */}
    {editingPest && form && (
      <EditPestModal
        form={form}
        setForm={setForm}
        onClose={() => setEditingPest(null)}
        onSave={fetchPests}
        onDelete={fetchPests}
      />
    )}

    {/* Add Pest Button */}
    <button
      onClick={() => setAdding(true)}
      className="fixed bottom-4 right-4 px-4 py-4 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition"
    >
      <Plus size={24} />
    </button>

    {adding && <AddPestModal onClose={() => setAdding(false)} onAdded={fetchPests} />}
  </div>
);
}