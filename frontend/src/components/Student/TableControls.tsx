import React from "react";
import { Download, Search, BarChart2 } from "lucide-react";

interface TableControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedStudentId: string | null;
  setSelectedStudentId: (id: string | null) => void;
  uniqueStudentIds: string[];
  onExport: () => void;
  onShowGraph: () => void;
  darkMode: boolean;
}

export const TableControls: React.FC<TableControlsProps> = ({
  searchTerm,
  setSearchTerm,
  selectedStudentId,
  setSelectedStudentId,
  uniqueStudentIds,
  onExport,
  onShowGraph,
  darkMode,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="relative flex-1 w-full sm:max-w-xs">
        <Search
          className={`absolute left-3 top-2.5 h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        />
        <input
          type="text"
          placeholder="Search by ID, name, type, or date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`pl-10 pr-4 py-2 w-full rounded-lg border ${
            darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
      </div>
      <div className="flex gap-2 items-center">
        <select
          value={selectedStudentId || ""}
          onChange={(e) => setSelectedStudentId(e.target.value || null)}
          className={`px-4 py-2 rounded-lg border ${
            darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          <option value="">All Students</option>
          {uniqueStudentIds.map(id => (
            <option key={id} value={id}>{id}</option>
          ))}
        </select>
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Download size={20} />
          Export CSV
        </button>
        <button
          onClick={onShowGraph}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <BarChart2 size={20} />
          Show Graph
        </button>
      </div>
    </div>
  );
};

