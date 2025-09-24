import { useState } from "react";
import { Pencil } from "lucide-react";
import EditPestModal from "../../components/EditPestModal";
import { useOutletContext } from "react-router-dom";

type ContextType = { search: string; filter: string; view: "card" | "list" };

const initialPests = [
  { id: 1, name: "Brown Planthopper", host: "Corn", description: "Sap-sucking insect causing hopper burn.", image: "/pest/palay/greenleafhopper.jpg" },
  { id: 2, name: "Rice Blast", host: "Corn", description: "Fungal disease causing lesions on leaves.", image: "/pest/palay/greenleafhopper.jpg" },
  { id: 3, name: "Armyworm", host: "Corn", description: "Caterpillar that feeds on rice leaves.", image: "/pest/palay/greenleafhopper.jpg" },
  { id: 5, name: "Weeds", host: "Palay", description: "Competes with rice plants for nutrients. Competes with rice plants for nutrients Competes with rice plants for nutrientsCompetes with rice plants for nutrientsCompetes with rice plants for nutrientsCompetes with rice plants for nutrientsCompetes with rice plants for nutrientsCompetes with rice plants for nutrients", image: "/pest/palay/greenleafhopper.jpg" },
  { id: 6, name: "Armyworm", host: "Corn", description: "Caterpillar that feeds on rice leaves.", image: "/pest/palay/greenleafhopper.jpg" },
  { id: 7, name: "Armyworm", host: "Corn", description: "Caterpillar that feeds on rice leaves.", image: "/pest/palay/greenleafhopper.jpg" },
  { id: 8, name: "Armyworm", host: "Corn", description: "Caterpillar that feeds on rice leaves.", image: "/pest/palay/greenleafhopper.jpg" },
];

export default function AdminPest() {
  const { search, filter, view } = useOutletContext<ContextType>();
  const [pests, setPests] = useState(initialPests);

  // Edit modal state
  const [editingPest, setEditingPest] = useState<any>(null);
  const [form, setForm] = useState({ id: 0, name: "", host: "", description: "", image: "" });

  const filteredPests = pests.filter((pest) => {
    const matchesSearch = pest.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || pest.host === filter;
    return matchesSearch && matchesFilter;
  });

  // Open edit form
  const handleEdit = (pest: any) => {
    setForm(pest);
    setEditingPest(pest.id);
  };

  // Save edited pest
  const handleSave = () => {
    setPests((prev) =>
      prev.map((p) => (p.id === form.id ? { ...form } : p))
    );
    setEditingPest(null);
  };

  // Delete pest
  const handleDelete = (id: number) => {
    setPests((prev) => prev.filter((p) => p.id !== id));
    setEditingPest(null);
  };

  return (
    <div>
     

      {/* Pest Display */}
      {filteredPests.length > 0 ? (
        view === "card" ? (
          // Card View
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredPests.map((pest) => (
              <div key={pest.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition relative">
                <img src={pest.image} alt={pest.name} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{pest.name}</h2>
                  <p className="text-sm text-gray-500">{pest.host}</p>
                  <p className="mt-2 text-gray-600">
                    {pest.description.length > 80
                      ? pest.description.substring(0, 80) + "..."
                      : pest.description}
                  </p>
                </div>
                <button
                  onClick={() => handleEdit(pest)}
                  className="absolute top-2 right-2 bg-green-600 text-white p-2 rounded-full shadow hover:bg-green-700"
                >
                  <Pencil size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="p-3 text-left hidden md:flex">Image</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Host</th>
                  <th className="p-3 text-left hidden md:flex">Description</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPests.map((pest) => (
                  <tr key={pest.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 hidden md:flex">
                      <img src={pest.image} alt={pest.name} className="h-12 w-12 object-cover rounded" />
                    </td>
                    <td className="p-3 font-semibold">{pest.name}</td>
                    <td className="p-3">{pest.host}</td>
                    <td className="p-3 text-gray-600 hidden md:flex">
                      {pest.description.length > 100
                        ? pest.description.substring(0, 100) + "..."
                        : pest.description}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleEdit(pest)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"
                      >
                        <Pencil size={14} /> Edit
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

      {/* Edit Modal */}
      {editingPest && (
        <EditPestModal
          form={form}
          setForm={setForm}
          onClose={() => setEditingPest(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
