import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, X, Trash2, Upload, Save } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ControlMethods {
  Cultural: string[];
  Biological: string[];
  Chemical: string[];
}

interface PestForm {
  pestName: string;
  tagalogName: string;
  identifyingMarks: string;
  whereToFind: string;
  damage: string;
  lifeCycle: string;
  host: string;
  controlMethods: ControlMethods;
}

interface AddPestModalProps {
  onClose: () => void;
  onAdded: () => void;
}

export default function AddPestModal({ onClose, onAdded }: AddPestModalProps) {
  const [form, setForm] = useState<PestForm>({
    pestName: "",
    tagalogName: "",
    identifyingMarks: "",
    whereToFind: "",
    damage: "",
    lifeCycle: "",
    host: "",
    controlMethods: { Cultural: [], Biological: [], Chemical: [] },
  });

  const [hosts, setHosts] = useState<string[]>([]);
  const [isCustomHost, setIsCustomHost] = useState(false);
  const [pestImg, setPestImg] = useState<File | null>(null);
  const [lifeCycleImg, setLifeCycleImg] = useState<File | null>(null);

  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/pests/hosts`);
        setHosts(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch hosts:", err);
      }
    };
    fetchHosts();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleHostChange = (value: string) => {
    if (value === "Other") {
      setIsCustomHost(true);
      setForm({ ...form, host: "" });
    } else {
      setIsCustomHost(false);
      setForm({ ...form, host: value });
    }
  };

  const addControlMethod = (type: keyof ControlMethods) => {
    setForm({
      ...form,
      controlMethods: {
        ...form.controlMethods,
        [type]: [...form.controlMethods[type], ""],
      },
    });
  };

  const handleControlChange = (type: keyof ControlMethods, index: number, value: string) => {
    const updated = [...form.controlMethods[type]];
    updated[index] = value;
    setForm({
      ...form,
      controlMethods: { ...form.controlMethods, [type]: updated },
    });
  };

  const removeControlMethod = (type: keyof ControlMethods, index: number) => {
    const updated = [...form.controlMethods[type]];
    updated.splice(index, 1);
    setForm({
      ...form,
      controlMethods: { ...form.controlMethods, [type]: updated },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries({
      pestName: form.pestName,
      tagalogName: form.tagalogName,
      identifyingMarks: form.identifyingMarks,
      whereToFind: form.whereToFind,
      damage: form.damage,
      lifeCycle: form.lifeCycle,
      host: form.host,
    }).forEach(([key, value]) => data.append(key, value || ""));

    if (pestImg) data.append("pestImg", pestImg);
    if (lifeCycleImg) data.append("lifeCycleImg", lifeCycleImg);

    data.append("controlMethods", JSON.stringify(form.controlMethods));

    try {
      await axios.post(`${API_BASE_URL}/pests`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Pest added successfully");
      onAdded();
      onClose();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add pest");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[9999] px-4 h-full">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-slideUp border border-gray-200">
        {/* Header */}
        <header className="flex justify-between items-center sticky top-0 bg-white z-20 backdrop-blur-md border-b border-gray-100 px-8 py-5">
          <h2 className="text-2xl font-semibold text-gray-900">➕ Add New Pest</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-red-100 text-red-600 transition"
          >
            <X size={22} />
          </button>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-10">
          {/* Pest Image + Basic Info */}
          <section className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Pest Image Upload */}
              <div className="flex flex-col items-center space-y-4">
                <h3 className="text-xl font-bold text-gray-800 w-full">Basic Info</h3>
                {pestImg ? (
                  <div className="relative rounded-2xl overflow-hidden shadow-md border border-gray-300">
                    <img
                      src={URL.createObjectURL(pestImg)}
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

              {/* Basic Info Fields */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-5">
                  <input
                    type="text"
                    name="pestName"
                    value={form.pestName}
                    onChange={handleChange}
                    placeholder="Pest Name"
                    required
                    className="p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-400"
                  />
                  <input
                    type="text"
                    name="tagalogName"
                    value={form.tagalogName}
                    onChange={handleChange}
                    placeholder="Tagalog Name"
                    className="p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-400"
                  />

                  {/* Host Dropdown */}
                  <div className="flex flex-col">
                    <label className="mb-2 font-medium text-gray-700">Host</label>
                    <select
                      value={isCustomHost ? "Other" : form.host}
                      onChange={(e) => handleHostChange(e.target.value)}
                      className="p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-400"
                      required
                    >
                      <option value="">-- Select Host --</option>
                      {hosts.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                      <option value="Other">Other</option>
                    </select>

                    {isCustomHost && (
                      <input
                        type="text"
                        name="host"
                        value={form.host}
                        onChange={handleChange}
                        placeholder="Enter custom host"
                        className="mt-3 p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-400"
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
            {["identifyingMarks", "whereToFind", "damage"].map((field) => (
              <textarea
                key={field}
                name={field}
                value={(form as any)[field]}
                onChange={handleChange}
                placeholder={`Enter ${field}`}
                className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-400 "
              />
            ))}
          </section>

          {/* Life Cycle */}
          <section className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Life Cycle Image */}
              <div className="flex flex-col items-center space-y-4">
                <h3 className="text-xl font-bold text-gray-800 w-full">Life Cycle Image</h3>
                {lifeCycleImg ? (
                  <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-md border border-gray-300">
                    <img
                      src={URL.createObjectURL(lifeCycleImg)}
                      alt="Life Cycle"
                      className="w-full object-cover"
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

              {/* Life Cycle Text */}
              <div className="flex flex-col">
                <h3 className="text-xl font-bold text-gray-800">Life Cycle</h3>
                <textarea
                  name="lifeCycle"
                  value={form.lifeCycle}
                  onChange={handleChange}
                  placeholder="Enter life cycle details"
                  rows={6}
                  className="mt-4 p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-400"
                />
              </div>
            </div>
          </section>

          {/* Control Methods */}
          <section className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800">Control Methods</h3>
            {(["Cultural", "Biological", "Chemical"] as (keyof ControlMethods)[]).map((type) => (
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
                {form.controlMethods[type].map((value, idx) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <input
                      type="text"
                      value={value}
                      placeholder={`Enter ${type} control method`}
                      onChange={(e) => handleControlChange(type, idx, e.target.value)}
                      className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400"
                    />
                    <button
                      type="button"
                      onClick={() => removeControlMethod(type, idx)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </section>

          {/* Footer */}
          <footer className="flex justify-end gap-4 border-t border-gray-200 px-8 py-4 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-full border border-gray-300 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-green-600 text-white shadow hover:bg-green-700 transition"
            >
              <Save size={18} /> Add Pest
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
