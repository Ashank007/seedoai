import React, { useState, useMemo } from "react";
import { Download, Search, ChevronDown, ChevronUp, BarChart2 } from "lucide-react";
import AttendanceGraph from "../graphs/AttendanceGraphFaculty";
type AttendanceType = "CheckIn" | "CheckOut";

interface TimestampEntry {
  att_type: AttendanceType;
  date: string;
}

interface AttendanceRecord {
  facultyid: string;
  timestamps: TimestampEntry[];
}

interface Props {
  category: string;
  darkMode: boolean;
  data: AttendanceRecord[];
}

const AttendanceTable_Staff: React.FC<Props> = ({ category, darkMode, data }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<"facultyid" | "att_type" | "date">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFacultyId, setSelectedFacultyId] = useState<string | null>(null); // New state for selected ID
  const [showGraph, setShowGraph] = useState(false); // State to toggle graph
  const recordsPerPage = 10;

  // Memoized filtered and flattened data
  const processedData = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    
    const filtered = data.filter(record => {
      const matchesFacultyId = record.facultyid.toLowerCase().includes(lowerSearchTerm);
      const matchesTimestamp = record.timestamps.some(timestamp => 
        timestamp.date.toLowerCase().includes(lowerSearchTerm) ||
        timestamp.att_type.toLowerCase().includes(lowerSearchTerm)
      );
      return matchesFacultyId || matchesTimestamp;
    });

    return filtered
      .flatMap(record => 
        record.timestamps.map(timestamp => ({
          facultyid: record.facultyid,
          att_type: timestamp.att_type,
          date: timestamp.date
        }))
      )
      .sort((a, b) => {
        let comparison = 0;
        switch (sortField) {
          case "facultyid":
            comparison = a.facultyid.localeCompare(b.facultyid);
            break;
          case "att_type":
            comparison = a.att_type.localeCompare(b.att_type);
            break;
          case "date":
            comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
            break;
        }
        return sortDirection === "asc" ? comparison : -comparison;
      });
  }, [data, searchTerm, sortField, sortDirection]);

   // Get unique student IDs for the dropdown
  const uniqueFacultyIds = useMemo(() => {
    return Array.from(new Set(data.map(record => record.facultyid))).sort();
  }, [data]);


  // Reset page to 1 when search term changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(processedData.length / recordsPerPage);
  const currentData = useMemo(() => 
    processedData.slice(
      (currentPage - 1) * recordsPerPage,
      currentPage * recordsPerPage
    ),
    [processedData, currentPage]
  );

  const handleSort = (field: typeof sortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const exportData = () => {
    const csv = [
      ["Student ID","Type", "Timestamp"],
      ...processedData.map(record => [
        record.facultyid,
        record.att_type,
        record.date
      ])
    ]
    .map(row => row.join(","))
    .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_${category}_${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className={`absolute left-3 top-2.5 h-5 w-5 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`} />
          <input
            type="text"
            placeholder="Search by ID, name, type, or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 pr-4 py-2 w-full rounded-lg border ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
        <div className="flex gap-2 items-center">
          <select
            value={selectedFacultyId || ""}
            onChange={(e) => setSelectedFacultyId(e.target.value || null)}
            className={`px-4 py-2 rounded-lg border ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">All Faculties</option>
            {uniqueFacultyIds.map(id => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
          <button
            onClick={exportData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Download size={20} />
            Export CSV
          </button>
          <button
            onClick={() => setShowGraph(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <BarChart2 size={20} />
            Show Graph
          </button>
        </div>
 
      </div>

      <div className="overflow-x-auto">
        <table className={`w-full ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
          <thead>
            <tr className={darkMode ? "bg-gray-800" : "bg-gray-50"}>
              {[
                { label: "Faculty ID", field: "facultyid" },
                { label: "Type", field: "att_type" },
                { label: "Timestamp", field: "date" }
              ].map(({ label, field }) => (
                <th
                  key={field}
                  className="px-6 py-3 text-left cursor-pointer"
                  onClick={() => handleSort(field as typeof sortField)}
                >
                  <div className="flex items-center gap-2">
                    {label}
                    {sortField === field && (
                      sortDirection === "asc" ? 
                        <ChevronUp size={16} /> : 
                        <ChevronDown size={16} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentData.length > 0 ? (
              currentData.map((record, index) => (
                <tr
                  key={`${record.facultyid}-${record.date}-${index}`}
                  className={`${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"}`}
                >
                  <td className="px-6 py-4">{record.facultyid}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        record.att_type === "CheckIn"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {record.att_type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {record.date ? new Date(record.date).toLocaleString() : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center">
                  No matching records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
          Showing {(currentPage - 1) * recordsPerPage + 1} to{" "}
          {Math.min(currentPage * recordsPerPage, processedData.length)} of{" "}
          {processedData.length} records
        </p>
        {totalPages > 1 && (
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : darkMode
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
      {showGraph && (
        <AttendanceGraph
          data={processedData}
          darkMode={darkMode}
	  selectedId={selectedFacultyId}
          onClose={() => setShowGraph(false)}
        />
      )}
    </div>
  );
};

export default AttendanceTable_Staff;

