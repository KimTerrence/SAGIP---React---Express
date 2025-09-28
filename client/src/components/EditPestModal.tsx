import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, X, Trash2, Save, Upload } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ControlMethods {
  Cultural: string[];
  Biological: string[];
  Chemical: string[];
}

interface EditPestModalProps {
  form: {
    idPest: number;
    pestName: string;
    tagalogName: string;
    host: string;
    identifyingMarks: string;
    whereToFind: string;
    damage: string;
    lifeCycle: string;
    pestImg: string;
    lifeCycleImg: string;
    controlMethods?: ControlMethods;
  };
  setForm: (form: any) => void;
  onClose: () => void;
  onSave: () => void;
  onDelete: (id: number) => void;
}

export default function EditPestModal({
  form,
  setForm,
  onClose,
  onSave,
  onDelete,
}: EditPestModalProps) {
  const [pestImg, setPestImg] = useState<File | null>(null);
  const [lifeCycleImg, setLifeCycleImg] = useState<File | null>(null);
  const [hosts, setHosts] = useState<string[]>([]); // fetched hosts
  const [isCustomHost, setIsCustomHost] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleControlChange = (
    type: keyof ControlMethods,
    index: number,
    value: string
  ) => {
    const updated: ControlMethods = {
      Cultural: [...(form.controlMethods?.Cultural || [])],
      Biological: [...(form.controlMethods?.Biological || [])],
      Chemical: [...(form.controlMethods?.Chemical || [])],
    };
    updated[type][index] = value;
    setForm({ ...form, controlMethods: updated });
  };

  const addControlMethod = (type: keyof ControlMethods) => {
    const updated: ControlMethods = {
      Cultural: [...(form.controlMethods?.Cultural || [])],
      Biological: [...(form.controlMethods?.Biological || [])],
      Chemical: [...(form.controlMethods?.Chemical || [])],
    };
    updated[type].push("");
    setForm({ ...form, controlMethods: updated });
  };

  const removeControlMethod = (type: keyof ControlMethods, index: number) => {
    const updated: ControlMethods = {
      Cultural: [...(form.controlMethods?.Cultural || [])],
      Biological: [...(form.controlMethods?.Biological || [])],
      Chemical: [...(form.controlMethods?.Chemical || [])],
    };
    updated[type].splice(index, 1);
    setForm({ ...form, controlMethods: updated });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries({
      pestName: form.pestName,
      tagalogName: form.tagalogName,
      host: form.host,
      identifyingMarks: form.identifyingMarks,
      whereToFind: form.whereToFind,
      damage: form.damage,
      lifeCycle: form.lifeCycle,
    }).forEach(([key, value]) => data.append(key, value || ""));

    if (pestImg) data.append("pestImg", pestImg);
    if (lifeCycleImg) data.append("lifeCycleImg", lifeCycleImg);

    data.append(
      "controlMethods",
      JSON.stringify({
        Cultural: form.controlMethods?.Cultural || [],
        Biological: form.controlMethods?.Biological || [],
        Chemical: form.controlMethods?.Chemical || [],
      })
    );

    try {
      await axios.put(`${API_BASE_URL}/pests/${form.idPest}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Pest updated successfully");
      onSave();
      onClose();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update pest");
    }
  };

  useEffect(() => {
  const fetchHosts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/pests/hosts`); // your API endpoint
      setHosts(res.data); // assume res.data is string[]
    } catch (err) {
      console.error("❌ Failed to fetch hosts:", err);
    }
  };
  fetchHosts();
}, []);

// Handle host change
const handleHostChange = (value: string) => {
  if (value === "Other") {
    setIsCustomHost(true);
    setForm({ ...form, host: "" });
  } else {
    setIsCustomHost(false);
    setForm({ ...form, host: value });
  }
};

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[9999] px-4 h-full">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-slideUp border border-gray-200">
        {/* Header */}
        <header className="flex justify-between items-center sticky top-0 bg-white z-20 backdrop-blur-md border-b border-gray-100 px-8 py-5">
          <h2 className="text-2xl font-semibold text-gray-900 select-none">
            ✏️ Edit Pest
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-full hover:bg-red-100 text-red-600 transition-shadow shadow-sm"
          >
            <X size={22} />
          </button>
        </header>

        {/* Form */}
        <form onSubmit={handleSave} className="px-8 py-6 space-y-10">
         {/* Pest Image + Basic Info side by side */}
<section className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
    {/* Pest Image */}
    <div className="flex flex-col items-center space-y-4">
      <h3 className="text-xl font-bold text-gray-800 w-full">Basic Info</h3>
      {pestImg || form.pestImg ? (
        <div className="relative h-full rounded-2xl overflow-hidden shadow-md border border-gray-300">
          <img
            src={
              pestImg
                ? URL.createObjectURL(pestImg)
                : `${API_BASE_URL}${form.pestImg}`
            }
            alt="Pest"
            className="h-full object-cover"
          />
          <label
            htmlFor="pest-img-upload"
            className="absolute inset-0 bg-black/30 flex justify-center items-center text-white font-semibold cursor-pointer opacity-0 hover:opacity-100 transition-opacity rounded-2xl"
          >
            <Upload className="mr-2" size={20} /> Change Image
          </label>
          <input
            type="file"
            id="pest-img-upload"
            className="hidden"
            accept="image/*"
            onChange={(e) => setPestImg(e.target.files?.[0] || null)}
          />
        </div>
      ) : (
        <label
          htmlFor="pest-img-upload"
          className="border-2 border-dashed border-gray-300 rounded-2xl p-10 flex flex-col items-center justify-center hover:bg-gray-100 transition cursor-pointer text-center text-gray-500"
        >
          <Upload className="mb-3" size={28} />
          <span className="text-base font-medium">
            Click to upload pest image
          </span>
          <input
            type="file"
            id="pest-img-upload"
            className="hidden"
            accept="image/*"
            onChange={(e) => setPestImg(e.target.files?.[0] || null)}
          />
        </label>
      )}
    </div>

    {/* Basic Info */}
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5">
        {[
          { name: "pestName", label: "Pest Name", required: true },
          { name: "tagalogName", label: "Tagalog Name", required: false },
        ].map((field) => (
          <div key={field.name} className="flex flex-col">
            <label
              htmlFor={field.name}
              className="mb-2 font-medium text-gray-700"
            >
              {field.label}
            </label>
            <input
              id={field.name}
              type="text"
              name={field.name}
              value={(form as any)[field.name]}
              onChange={handleChange}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              required={field.required}
              className="p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
            />
          </div>
        ))}

              {/* Host Dropdown */}
<div className="flex flex-col">
  <label htmlFor="host" className="mb-2 font-medium text-gray-700">
    Host
  </label>
  <select
    id="host"
    value={isCustomHost ? "Other" : (form as any).host || ""}
    onChange={(e) => handleHostChange(e.target.value)}
    className="p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
    required
  >
    <option value="">-- Select Host --</option>
    {hosts.map((h) => (
      <option key={h} value={h}>
        {h}
      </option>
    ))}
    <option value="Other">Other</option>
  </select>

  {isCustomHost && (
    <input
      type="text"
      value={(form as any).host}
      onChange={(e) => setForm({ ...form, host: e.target.value })}
      placeholder="Enter custom host"
      className="mt-3 p-3 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none transition"
      required
    />
  )}
</div>
      </div>
    </div>
  </div>
</section>
          {/* Details */}
          <section className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800">Details</h3>
            {[
              { name: "identifyingMarks", label: "Identifying Marks", rows: 3 },
              { name: "whereToFind", label: "Where To Find", rows: 2 },
              { name: "damage", label: "Damage", rows: 2 },
            ].map((field) => (
              <div key={field.name} className="flex flex-col">
                <label
                  htmlFor={field.name}
                  className="mb-2 font-medium text-gray-700"
                >
                  {field.label}
                </label>
                <textarea
                  id={field.name}
                  name={field.name}
                  value={(form as any)[field.name]}
                  onChange={handleChange}
                  rows={field.rows}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  className="p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                />
              </div>
            ))}
          </section>

        {/* Life Cycle Image + Life Cycle Text side by side */}
<section className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
    {/* Life Cycle Image */}
    <div className="flex flex-col items-center space-y-4">
      <h3 className="text-xl font-bold text-gray-800 w-full">Life Cycle Image</h3>
      {lifeCycleImg || form.lifeCycleImg ? (
        <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-md border border-gray-300">
          <img
            src={
              lifeCycleImg
                ? URL.createObjectURL(lifeCycleImg)
                : `${API_BASE_URL}${form.lifeCycleImg}`
            }
            alt="Life Cycle"
            className=" w-full object-cover"
          />
          <label
            htmlFor="life-cycle-img-upload"
            className="absolute inset-0 bg-black/30 flex justify-center items-center text-white font-semibold cursor-pointer opacity-0 hover:opacity-100 transition-opacity rounded-2xl"
          >
            <Upload className="mr-2" size={20} /> Change Image
          </label>
          <input
            type="file"
            id="life-cycle-img-upload"
            className="hidden"
            accept="image/*"
            onChange={(e) => setLifeCycleImg(e.target.files?.[0] || null)}
          />
        </div>
      ) : (
        <label
          htmlFor="life-cycle-img-upload"
          className="border-2 border-dashed border-gray-300 rounded-2xl p-10 flex flex-col items-center justify-center hover:bg-gray-100 transition cursor-pointer text-center text-gray-500 max-w-md w-full"
        >
          <Upload className="mb-3" size={28} />
          <span className="text-base font-medium">
            Click to upload life cycle image
          </span>
          <input
            type="file"
            id="life-cycle-img-upload"
            className="hidden"
            accept="image/*"
            onChange={(e) => setLifeCycleImg(e.target.files?.[0] || null)}
          />
        </label>
      )}
    </div>

    {/* Life Cycle Details */}
    <div className="flex flex-col h-full">
      <h3 className="text-xl font-bold text-gray-800">Life Cycle</h3>
      <textarea
        id="lifeCycle"
        name="lifeCycle"
        value={form.lifeCycle}
        onChange={handleChange}
        rows={6}
        placeholder="Enter life cycle details"
        className="p-3 h-full rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent  transition mt-4"
      />
    </div>
  </div>
</section>

 
          {/* Control Methods */}
          <section className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800">Control Methods</h3>
            {(["Cultural", "Biological", "Chemical"] as (keyof ControlMethods)[]).map(
              (type) => (
                <div key={type} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="font-semibold text-gray-900 text-lg">{type}</label>
                    <button
                      type="button"
                      onClick={() => addControlMethod(type)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-green-600 hover:bg-green-50 font-semibold transition"
                    >
                      <Plus size={18} /> Add
                    </button>
                  </div>
                  {form.controlMethods &&
                    form.controlMethods[type].map((value, idx) => (
                      <div key={idx} className="flex gap-3 items-center">
                        <input
                          type="text"
                          value={value}
                          placeholder={`Enter ${type} control method`}
                          onChange={(e) =>
                            handleControlChange(type, idx, e.target.value)
                          }
                          className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                        />
                        <button
                          type="button"
                          onClick={() => removeControlMethod(type, idx)}
                          aria-label={`Remove ${type} control method`}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                </div>
              )
            )}
          </section>

<footer className="flex flex-col md:flex-row justify-between gap-4 bottom-0 bg-white/90 backdrop-blur border-t border-gray-200 px-8 py-4 shadow-inner">
<button
  type="button"
  onClick={async () => {
    if (!confirm("Are you sure you want to delete this pest?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/pests/${form.idPest}`);
      alert("✅ Pest deleted successfully");
      onDelete(form.idPest); // notify parent to refresh the list
      onClose(); // close modal
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete pest");
    }
  }}
  className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-red-600 text-white shadow hover:bg-red-700 transition"
>
  <Trash2 size={18} /> Delete
</button>


  <div className="flex gap-4 justify-end flex-grow">
    <button
      type="button"
      onClick={onClose}
      className="flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-gray-300 hover:bg-gray-100 transition"
    >
      Cancel
    </button>
    <button
      type="submit"
      className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-green-600 text-white shadow hover:bg-green-700 transition"
    >
      <Save size={18} /> Save
    </button>
  </div>
</footer>

        </form>
      </div>
    </div>
  );
}
