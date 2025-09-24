import { useState, useRef } from "react";
import {
  Grid,
  List,
  Download,
  CheckSquare,
  XSquare,
  XCircle,
} from "lucide-react";

const images = [
  { id: 1, filename: "forest.jpg", category: "Nature", url: "https://source.unsplash.com/400x300/?nature,forest" },
  { id: 2, filename: "dog.jpg", category: "Animals", url: "https://source.unsplash.com/400x300/?dog" },
  { id: 3, filename: "mountain.jpg", category: "Nature", url: "https://source.unsplash.com/400x300/?mountain" },
  { id: 4, filename: "tech.jpg", category: "Tech", url: "https://source.unsplash.com/400x300/?technology" },
  { id: 5, filename: "cat.jpg", category: "Animals", url: "https://source.unsplash.com/400x300/?cat" },
  { id: 6, filename: "river.jpg", category: "Nature", url: "https://source.unsplash.com/400x300/?river" },
  { id: 7, filename: "computer.jpg", category: "Tech", url: "https://source.unsplash.com/400x300/?computer" },
  { id: 8, filename: "bird.jpg", category: "Animals", url: "https://source.unsplash.com/400x300/?bird" },
];

export default function Data() {
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);

  const filteredImages =
    filter === "All" ? images : images.filter((img) => img.category === filter);

  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseDown = (id: number) => {
    pressTimer.current = setTimeout(() => {
      setSelectionMode(true);
      toggleSelect(id);
    }, 500);
  };

  const handleMouseUp = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelected(filteredImages.map((img) => img.id));
  const unselectAll = () => setSelected([]);

  const cancelSelection = () => {
    setSelectionMode(false);
    setSelected([]);
  };

  const downloadSelected = () => {
    const files = images
      .filter((img) => selected.includes(img.id))
      .map((img) => img.filename);
    alert(`Downloading files: \n${files.join(", ")}`);
  };

  return (
    <div className="p-6">
      {/* Header Controls */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="All">All</option>
          <option value="Nature">Nature</option>
          <option value="Animals">Animals</option>
          <option value="Tech">Tech</option>
        </select>

        <button
          onClick={() => setView("grid")}
          className={`p-2 rounded ${view === "grid" ? "bg-gray-200" : ""}`}
        >
          <Grid size={20} />
        </button>
        <button
          onClick={() => setView("list")}
          className={`p-2 rounded ${view === "list" ? "bg-gray-200" : ""}`}
        >
          <List size={20} />
        </button>

        {selectionMode && (
          <>
            <button
              onClick={selectAll}
              className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg"
            >
              <CheckSquare size={18} /> Select All
            </button>
            <button
              onClick={unselectAll}
              className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg"
            >
              <XSquare size={18} /> Unselect All
            </button>
            <button
              onClick={cancelSelection}
              className="flex items-center gap-1 px-3 py-2 bg-gray-500 text-white rounded-lg"
            >
              <XCircle size={18} /> Cancel
            </button>
          </>
        )}

        {selected.length > 0 && (
          <button
            onClick={downloadSelected}
            className="flex items-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-lg"
          >
            <Download size={18} /> Download ({selected.length})
          </button>
        )}
      </div>

      {/* Image List */}
      <div
        className={
          view === "grid"
            ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            : "flex flex-col gap-3"
        }
      >
        {filteredImages.map((img) =>
          view === "grid" ? (
            // ✅ Grid Card
            <div
              key={img.id}
              className={`relative border rounded-lg overflow-hidden cursor-pointer group transition-all duration-300 ${
                selected.includes(img.id) ? "ring-4 ring-blue-500" : ""
              }`}
              onClick={() => selectionMode && toggleSelect(img.id)}
              onMouseDown={() => handleMouseDown(img.id)}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img
                src={img.url}
                alt={img.filename}
                className="w-full h-40 object-cover transform group-hover:scale-105 transition duration-300"
                draggable={false}
              />
              <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-sm px-2 py-1 truncate">
                {img.filename}
              </div>
            </div>
          ) : (
            // ✅ List Row
            <div
              key={img.id}
              className={`flex items-center gap-4 border rounded-lg p-2 cursor-pointer transition ${
                selected.includes(img.id) ? "ring-4 ring-blue-500" : ""
              }`}
              onClick={() => selectionMode && toggleSelect(img.id)}
              onMouseDown={() => handleMouseDown(img.id)}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img
                src={img.url}
                alt={img.filename}
                className="w-20 h-20 object-cover rounded-md"
                draggable={false}
              />
              <span className="text-sm font-medium truncate">{img.filename}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
