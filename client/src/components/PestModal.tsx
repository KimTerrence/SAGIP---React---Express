import { X, Info, Leaf, Bug, Skull } from "lucide-react";
import { useEffect } from "react";
import API_BASE_URL from "../config";

interface ControlMethods {
  Cultural: string[];
  Biological: string[];
  Chemical: string[];
}

interface PestModalProps {
  pest: {
    pestImg: string;
    lifeCycleImg: string;
    pestName: string;
    tagalogName: string;
    identifyingMarks: string;
    whereToFind: string;
    damage: string;
    lifeCycle: string;
    controlMethods?: ControlMethods;
  };
  onClose: () => void;
}

export default function PestModal({ pest, onClose }: PestModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center h-full"
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl mx-4 p-6 animate-fadeIn overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 rounded-full p-1 hover:bg-gray-100 transition"
        >
          <X size={28} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-gray-800">{pest.pestName}</h2>
          <p className="text-lg text-gray-500 mt-1">{pest.tagalogName}</p>
        </div>

        {/* Pest Image */}
        {pest.pestImg && (
          <img
            src={pest.pestImg.startsWith("http") ? pest.pestImg : `${API_BASE_URL}${pest.pestImg}`}
            alt={pest.pestName}
            className="w-full h-64 object-cover rounded-2xl border shadow-md mb-6"
          />
        )}

        {/* General Info */}
        <div className="bg-gray-50 p-4 rounded-xl mb-6 shadow-sm border-l-4 border-green-400">
          <div className="flex items-center mb-3 gap-2 text-green-700">
            <Info size={20} />
            <h3 className="text-xl font-semibold">General Info</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700 text-sm">
            {pest.identifyingMarks && (
              <p>
                <strong>Identifying Marks:</strong> {pest.identifyingMarks}
              </p>
            )}
            {pest.whereToFind && (
              <p>
                <strong>Where To Find:</strong> {pest.whereToFind}
              </p>
            )}
            {pest.damage && (
              <p>
                <strong>Damage:</strong> {pest.damage}
              </p>
            )}
          </div>
        </div>

        {/* Life Cycle Section */}
        {(pest.lifeCycle || pest.lifeCycleImg) && (
          <div className="bg-yellow-50 p-4 rounded-xl mb-6 shadow-sm border-l-4 border-yellow-400">
            <div className="flex items-center mb-3 gap-2 text-yellow-700">
              <Leaf size={20} />
              <h3 className="text-xl font-semibold">Life Cycle</h3>
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-start">
              {pest.lifeCycleImg && (
                <img
                  src={pest.lifeCycleImg.startsWith("http") ? pest.lifeCycleImg : `${API_BASE_URL}${pest.lifeCycleImg}`}
                  alt={`${pest.pestName} Life Cycle`}
                  className="w-full md:w-1/2 h-48 object-cover rounded-xl border shadow-sm"
                />
              )}
              {pest.lifeCycle && (
                <p className="text-gray-700 text-sm md:w-1/2">{pest.lifeCycle}</p>
              )}
            </div>
          </div>
        )}

        {/* Control Methods */}
        {pest.controlMethods && (
          <div className="mb-4">
            <div className="flex items-center mb-3 gap-2 text-gray-700">
              <Bug size={20} />
              <h3 className="text-xl font-semibold">Control Methods</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Cultural */}
              {pest.controlMethods.Cultural.length > 0 && (
                <div className="bg-green-50 p-4 rounded-xl border shadow-sm hover:shadow-md transition">
                  <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-1">
                    <Leaf size={16} /> Cultural
                  </h4>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                    {pest.controlMethods.Cultural.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Biological */}
              {pest.controlMethods.Biological.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-xl border shadow-sm hover:shadow-md transition">
                  <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-1">
                    <Bug size={16} /> Biological
                  </h4>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                    {pest.controlMethods.Biological.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Chemical */}
              {pest.controlMethods.Chemical.length > 0 && (
                <div className="bg-red-50 p-4 rounded-xl border shadow-sm hover:shadow-md transition">
                  <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-1">
                    <Skull size={16} /> Chemical
                  </h4>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                    {pest.controlMethods.Chemical.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
