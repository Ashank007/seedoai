import React, { useState, useMemo, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { BlockSelector } from "../Faculty/BlockSelector";
import { TableControls } from "../Faculty/TableControls";
import { TableContent } from "../Faculty/TableContent";
import { Pagination } from "../Pagination";
import AttendanceGraph from "../graphs/AttendanceGraphFaculty";
import { setSelectedBlock, getSelectedBlock, subscribeToBlockChanges } from "../context/GlobalBlock";
import { processAttendanceData, type ProcessedRecord } from "../Faculty/processAttendanceData";
import { AttendanceRecord } from "../Faculty/types";

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
  const [selectedFacultyId, setSelectedFacultyId] = useState<string | null>(null);
  const [showGraph, setShowGraph] = useState(false);
  const [selectedBlock, setLocalSelectedBlock] = useState<string | null>(getSelectedBlock());
  const recordsPerPage = 10;

  useEffect(() => {
    const unsubscribe = subscribeToBlockChanges((block) => {
      console.log("AttendanceTable_Staff: Block updated to:", block);
      setLocalSelectedBlock(block);
    });
    return () => unsubscribe();
  }, []);

const blockCounts = useMemo(() => {
  const counts: Record<string, number> = {};
  data.forEach(record => {
    counts[record.block] = (counts[record.block] || 0) + 1;
  });
  return counts;
}, [data]);

  // Extract unique blocks for selection
 const uniqueBlocks = useMemo(() => {
  return Object.keys(blockCounts).length > 0
    ? Object.entries(blockCounts).map(([block, count]) => ({ block, count }))
    : [{ block: "Block-A", count: 0 }, { block: "Block-B", count: 0 }, { block: "Block-C", count: 0 }];
}, [blockCounts]);
  // Process attendance data based on selected block
  const processedData = useMemo(() => processAttendanceData(data, selectedBlock, searchTerm, sortField, sortDirection), 
    [data, selectedBlock, searchTerm, sortField, sortDirection]);

  // Filter out records with "N/A"
  const filteredData = useMemo(() => {
    return processedData.filter(record => record.att_type !== "N/A");
  }, [processedData]);

  // Unique faculty IDs in selected block
  const uniqueFacultyIds = useMemo(() => {
    return Array.from(new Set(data.filter(record => record.block === selectedBlock).map(record => record.facultyid))).sort();
  }, [data, selectedBlock]);


  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const currentData = useMemo(() => {
    console.log("Current data slice:", filteredData.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage));
    return filteredData.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);
  }, [filteredData, currentPage]);

  const graphData = useMemo(() => {
    return processedData.filter(record => record.att_type !== "N/A") as { facultyid: string; att_type: "CheckIn" | "CheckOut"; date: string }[];
  }, [processedData]);

  useEffect(() => {
    setSearchTerm("");
    setCurrentPage(1);
  }, [selectedBlock]);

  const handleSort = (field: typeof sortField) => {
    if (field === sortField) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const exportData = () => {
    const csv = [["Faculty ID", "Type", "Timestamp"], ...processedData.map(record => [record.facultyid, record.att_type, record.date])]
      .map(row => row.join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_${category}_${selectedBlock || "all"}_${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleBlockSelection = (block: string | null) => {
    console.log("Block selected:", block);
    setSelectedBlock(block);
  };

return (
  <div className="space-y-4">
    {selectedBlock ? (
      <>
        {/* Always show back button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleBlockSelection(null)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Blocks
          </button>
          <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
            {selectedBlock} Attendance
          </h2>
        </div>

        {filteredData.length === 0 ? (
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            No attendance records with timestamps found for {selectedBlock}.
          </p>
        ) : (
          <>
            <TableControls
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedFacultyId={selectedFacultyId}
              setSelectedFacultyId={setSelectedFacultyId}
              uniqueFacultyIds={uniqueFacultyIds}
              onExport={exportData}
              onShowGraph={() => setShowGraph(true)}
              darkMode={darkMode}
            />
            <TableContent
              currentData={currentData}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              darkMode={darkMode}
            />
            <div className="flex justify-between items-center mt-4">
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                Showing {(currentPage - 1) * recordsPerPage + 1} to{" "}
                {Math.min(currentPage * recordsPerPage, filteredData.length)} of {filteredData.length} records
              </p>
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                darkMode={darkMode}
              />
            </div>
            {showGraph && (
              <AttendanceGraph
                data={graphData}
                darkMode={darkMode}
                selectedId={selectedFacultyId}
                onClose={() => setShowGraph(false)}
              />
            )}
          </>
        )}
      </>
    ) : (
      <BlockSelector uniqueBlocks={uniqueBlocks} onBlockSelect={handleBlockSelection} darkMode={darkMode} />
    )}
  </div>
);

};

export default AttendanceTable_Staff;


