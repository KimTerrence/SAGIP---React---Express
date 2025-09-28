import { useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import EditPestModal from "../../components/EditPestModal";
import PestModal from "../../components/PestModal";
import { useOutletContext } from "react-router-dom";
import AddPestModal from "../../components/AddPestModal";
import API_BASE_URL from "../../config";

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
  const { search, filter, view, setFilter, setSearch, setView, pests, setPests } =
    useOutletContext<ContextType>();

  const [loading, setLoading] = useState(true);

  // Modals
  const [editingPest, setEditingPest] = useState<number | null>(null);
  const [form, setForm] = useState<Pest | null>(null);
  const [selectedPest, setSelectedPest] = useState<Pest | null>(null);
  const [adding, setAdding] = useState(false);

  // Fetch pests with control methods
 const fetchPests = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/pests`);
      const data: Pest[] = await res.json();
      setPests(data); // ✅ update context pests
    } catch (err) {
      console.error("Error fetching pests:", err);
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
    if (pests.length === 0) {   // only fetch if empty
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
        <div className={view === "card" ? "grid grid-cols-1 md:grid-cols-3 gap-6" : ""}>
          {filteredPests.map((pest) => (
            <div
  key={pest.idPest}
  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition relative cursor-pointer"
  onClick={() => setSelectedPest(pest)}
>
  {/* Image with name overlay */}
  <div className="relative w-full h-40">
    <img
      src={`${API_BASE_URL}${pest.pestImg}`}
      alt={pest.pestName}
      className="w-full h-full object-cover"
    />
    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
    {/* Text Overlay */}
    <div className="absolute bottom-2 left-2 text-white drop-shadow-md">
      <h2 className="text-lg font-semibold">{pest.pestName}</h2>
      <p className="text-sm italic">{pest.tagalogName}</p>
    </div>
  </div>

  {/* Card Body */}
  <div className="p-4 ">
    <p className="text-xs text-gray-700"><span className="bg-green-200 px-3 py-2 rounded-full">{pest.host}</span></p>
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
        <p className="text-gray-500">No pests found.</p>
      )}

      {/* View Modal */}
      {selectedPest && (
        <PestModal
          pest={{
            ...selectedPest,
            pestImg: selectedPest.pestImg ? `${API_BASE_URL}${selectedPest.pestImg}` : "",
            lifeCycleImg: selectedPest.lifeCycleImg ? `${API_BASE_URL}${selectedPest.lifeCycleImg}` : "",
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
          onSave={() => fetchPests()}
          onDelete={() => fetchPests()}
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
