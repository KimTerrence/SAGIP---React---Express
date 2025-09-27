import { useState } from "react";
import API_BASE_URL from "../config";

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
  controlMethods: ControlMethods;
  pestImgFile?: File;
  lifeCycleImgFile?: File;
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
    controlMethods: { Cultural: [], Biological: [], Chemical: [] },
  });

  const handleChange = (key: keyof PestForm, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (key: "pestImgFile" | "lifeCycleImgFile", file: File | null) => {
    if (file) handleChange(key, file);
  };

  const handleAddControlMethod = (type: keyof ControlMethods) => {
    const desc = prompt(`Add ${type} control method`);
    if (desc) {
      setForm(prev => ({
        ...prev,
        controlMethods: {
          ...prev.controlMethods,
          [type]: [...prev.controlMethods[type], desc],
        },
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("pestName", form.pestName);
      formData.append("tagalogName", form.tagalogName);
      formData.append("identifyingMarks", form.identifyingMarks);
      formData.append("whereToFind", form.whereToFind);
      formData.append("damage", form.damage);
      formData.append("lifeCycle", form.lifeCycle);

      if (form.pestImgFile) formData.append("pestImg", form.pestImgFile);
      if (form.lifeCycleImgFile) formData.append("lifeCycleImg", form.lifeCycleImgFile);

      formData.append("controlMethods", JSON.stringify(form.controlMethods));

      const res = await fetch(`${API_BASE_URL}/pests`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        onAdded();
        onClose();
      } else {
        console.error("❌ Failed to add pest");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slideUp relative">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-800">➕ Add New Pest</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-xl font-bold transition"
          >
            ✕
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-5">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Pest Name"
              value={form.pestName}
              onChange={e => handleChange("pestName", e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
              required
            />
            <input
              placeholder="Tagalog Name"
              value={form.tagalogName}
              onChange={e => handleChange("tagalogName", e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
            />
          </div>

          <textarea
            placeholder="Identifying Marks"
            value={form.identifyingMarks}
            onChange={e => handleChange("identifyingMarks", e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
            rows={2}
          />
          <textarea
            placeholder="Where to Find"
            value={form.whereToFind}
            onChange={e => handleChange("whereToFind", e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
            rows={2}
          />
          <textarea
            placeholder="Damage"
            value={form.damage}
            onChange={e => handleChange("damage", e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
            rows={2}
          />
          <textarea
            placeholder="Life Cycle"
            value={form.lifeCycle}
            onChange={e => handleChange("lifeCycle", e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
            rows={3}
          />

          {/* Control Methods */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">Control Methods</h3>
            {(["Cultural", "Biological", "Chemical"] as (keyof ControlMethods)[]).map(type => (
              <div key={type} className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <label className="font-medium text-gray-700">{type}</label>
                  <button
                    type="button"
                    onClick={() => handleAddControlMethod(type)}
                    className="text-green-600 font-bold hover:underline"
                  >
                    + Add
                  </button>
                </div>
                <ul className="list-disc ml-5 text-gray-700">
                  {form.controlMethods[type].map((item, idx) => (
                    <li key={idx} className="text-sm">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* File Uploads */}
          <div className="space-y-4">
            <div>
              <label className="block font-medium text-gray-700">Pest Image</label>
              <input
                type="file"
                onChange={e => handleFileChange("pestImgFile", e.target.files?.[0] || null)}
                className="w-full mt-2"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Life Cycle Image</label>
              <input
                type="file"
                onChange={e => handleFileChange("lifeCycleImgFile", e.target.files?.[0] || null)}
                className="w-full mt-2"
              />
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="flex justify-end gap-3 border-t px-6 py-4 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition"
          >
            Add Pest
          </button>
        </div>
      </div>
    </div>
  );
}
