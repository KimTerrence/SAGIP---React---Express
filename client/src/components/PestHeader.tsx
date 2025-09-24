import { LayoutGrid, List } from "lucide-react";

interface PestHeaderControlsProps {
  search: string;
  setSearch: (value: string) => void;
  filter: string;
  setFilter: (value: string) => void;
  view: "card" | "list";
  setView: (value: "card" | "list") => void;
}

export default function PestHeader({
  search,
  setSearch,
  filter,
  setFilter,
  view,
  setView,
}: PestHeaderControlsProps) {
  const options = ["All", "Corn", "Palay"];

  // toggle function
  const toggleView = () => {
    setView(view === "card" ? "list" : "card");
  };

  return (
    <div className="flex-1 flex flex-wrap items-center gap-3 justify-between">
      {/* Search + Filter side by side */}
      <div className="flex items-center gap-2 w-4/6 sm:w-auto">
        {/* Search */}
        <input
          type="text"
          placeholder="Search pests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 w-10 sm:w-64 p-2 border rounded-lg shadow-sm"
        />

        {/* Filter (mobile dropdown, desktop buttons) */}
        {/* Mobile dropdown */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded-lg md:hidden"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        {/* Desktop buttons */}
        <div className="hidden md:flex gap-2">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-4 py-2 rounded-lg border transition ${
                filter === opt
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* View toggle */}
      <button
        onClick={toggleView}
        className="p-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
        title={view === "card" ? "Switch to List View" : "Switch to Card View"}
      >
        {view === "card" ? <List size={18} /> : <LayoutGrid size={18} />}
        
      </button>
    </div>
  );
}
