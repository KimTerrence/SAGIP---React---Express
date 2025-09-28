import { X, Info, Leaf, Bug, Skull } from "lucide-react";
import { useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
    <div className="fixed h-full inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <header className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-200 flex justify-end items-center px-6 py-4 z-20">
           <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-full hover:bg-red-100 text-red-600 transition-shadow shadow-sm"
          >
            <X size={22} />
          </button>
        </header>

        {/* Content */}
        <main className="p-8 space-y-10 text-gray-800">
          {/* Pest Image with Title Overlay */}
          {pest.pestImg && (
            <div className="relative w-full h-80 rounded-3xl overflow-hidden shadow-md border border-gray-200">
              <img
                  src={`${API_BASE_URL}${pest.pestImg}`}            
                alt={pest.pestName}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              {/* Text Overlay */}
              <div className="absolute bottom-6 left-6 text-white">
                <h2 className="text-3xl font-bold drop-shadow-md">
                  {pest.pestName}
                </h2>
                <p className="text-lg italic text-gray-200">
                  {pest.tagalogName}
                </p>
              </div>
            </div>
          )}

          {/* General Info */}
          <section className="bg-gray-50 p-6 rounded-3xl border border-gray-200 shadow-inner">
            <div className="flex items-center gap-3 mb-4 text-green-700">
              <Info size={24} />
              <h3 className="text-2xl font-semibold select-none">General Info</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 text-base leading-relaxed">
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
          </section>

          {/* Life Cycle */}
          {(pest.lifeCycle || pest.lifeCycleImg) && (
            <section className="bg-yellow-50 p-6 rounded-3xl border border-yellow-200 shadow-inner">
              <div className="flex items-center gap-3 mb-5 text-yellow-700">
                <Leaf size={24} />
                <h3 className="text-2xl font-semibold select-none">Life Cycle</h3>
              </div>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {pest.lifeCycleImg && (
                  <img
                    src={`${API_BASE_URL}${pest.lifeCycleImg}`}                    
                    alt={`${pest.pestName} Life Cycle`}
                    className="h-full md:w-1/2 h-52 object-cover rounded-3xl border border-yellow-300 shadow-sm"
                    loading="lazy"
                  />
                )}
                {pest.lifeCycle && (
                  <p className="md:w-1/2 text-gray-800 text-base leading-relaxed">
                    {pest.lifeCycle}
                  </p>
                )}
              </div>
            </section>
          )}

          {/* Control Methods */}
          {pest.controlMethods && (
            <section>
              <div className="flex items-center gap-3 mb-6 text-gray-800 select-none">
                <Bug size={24} />
                <h3 className="text-2xl font-semibold">Control Methods</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Cultural */}
                {pest.controlMethods.Cultural.length > 0 && (
                  <div className="bg-green-50 p-6 rounded-3xl border border-green-300 shadow-inner">
                    <h4 className="font-semibold text-green-700 mb-4 flex items-center gap-2 select-none text-lg">
                      <Leaf size={18} /> Cultural
                    </h4>
                    <ul className="list-disc list-inside text-gray-700 text-base space-y-2">
                      {pest.controlMethods.Cultural.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Biological */}
                {pest.controlMethods.Biological.length > 0 && (
                  <div className="bg-blue-50 p-6 rounded-3xl border border-blue-300 shadow-inner">
                    <h4 className="font-semibold text-blue-700 mb-4 flex items-center gap-2 select-none text-lg">
                      <Bug size={18} /> Biological
                    </h4>
                    <ul className="list-disc list-inside text-gray-700 text-base space-y-2">
                      {pest.controlMethods.Biological.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Chemical */}
                {pest.controlMethods.Chemical.length > 0 && (
                  <div className="bg-red-50 p-6 rounded-3xl border border-red-300 shadow-inner">
                    <h4 className="font-semibold text-red-700 mb-4 flex items-center gap-2 select-none text-lg">
                      <Skull size={18} /> Chemical
                    </h4>
                    <ul className="list-disc list-inside text-gray-700 text-base space-y-2">
                      {pest.controlMethods.Chemical.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
