import React, { useState, useMemo, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { BlockSelector } from "../Student/ClassSelector";
import { TableControls } from "../Student/TableControls";
import { TableContent } from "../Student/TableContent";
import { Pagination } from "../Pagination";
import AttendanceGraph from "../graphs/AttendanceGraphStudent";
import { setSelectedClass, getSelectedClass, subscribeToClassChanges } from "../context/GlobalClass";
import { processAttendanceData, type ProcessedRecord } from "../Student/processAttendanceData";
import { AttendanceRecord } from "../Student/types";

interface Props {
  category: string;
  darkMode: boolean;
  data: AttendanceRecord[];
}

const AttendanceTable_Student: React.FC<Props> = ({ category, darkMode, data }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<"studentid" | "att_type" | "date">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [showGraph, setShowGraph] = useState(false);
  const [selectedClass, setLocalSelectedClass] = useState<string | null>(getSelectedClass());
  const recordsPerPage = 10;

  useEffect(() => {
    const unsubscribe = subscribeToClassChanges((classname) => {
      console.log("AttendanceTable_Student: Class updated to:", classname);
      setLocalSelectedClass(classname);
    });
    return () => unsubscribe();
  }, []);

const classCounts = useMemo(() => {
  const counts: Record<string, number> = {};
  data.forEach(record => {
    counts[record.classname] = (counts[record.classname] || 0) + 1;
  });
  return counts;
}, [data]);

  // Extract unique classes for selection
 const uniqueBlocks = useMemo(() => {
  return Object.keys(classCounts).length > 0
    ? Object.entries(classCounts).map(([classname, count]) => ({ classname, count }))
    : [{ classname: "D-201", count: 0 }, { classname: "D-202", count: 0 }, { classname: "D-203", count: 0 }];
}, [classCounts]);
  // Process attendance data based on selected block
  const processedData = useMemo(() => processAttendanceData(data, selectedClass, searchTerm, sortField, sortDirection), 
    [data, selectedClass, searchTerm, sortField, sortDirection]);

  // Filter out records with "N/A"
  const filteredData = useMemo(() => {
    return processedData.filter(record => record.att_type !== "N/A");
  }, [processedData]);

  // Unique faculty IDs in selected block
  const uniqueStudentIds = useMemo(() => {
    return Array.from(new Set(data.filter(record => record.classname === selectedClass).map(record => record.studentid))).sort();
  }, [data, selectedClass]);


  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const currentData = useMemo(() => {
    console.log("Current data slice:", filteredData.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage));
    return filteredData.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);
  }, [filteredData, currentPage]);

  const graphData = useMemo(() => {
    return processedData.filter(record => record.att_type !== "N/A") as { studentid: string; att_type: "CheckIn" | "CheckOut"; date: string }[];
  }, [processedData]);

  useEffect(() => {
    setSearchTerm("");
    setCurrentPage(1);
  }, [selectedClass]);

  const handleSort = (field: typeof sortField) => {
    if (field === sortField) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const exportData = () => {
    const csv = [["Student ID", "Type", "Timestamp"], ...processedData.map(record => [record.studentid, record.att_type, record.date])]
      .map(row => row.join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_${category}_${selectedClass || "all"}_${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleBlockSelection = (classname: string | null) => {
    console.log("Class selected:", classname);
    setSelectedClass(classname);
  };

  return (
    <div className="space-y-4">
      {selectedClass ? (
        filteredData.length === 0 ? (
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            No attendance records with timestamps found for {selectedClass}.
          </p>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBlockSelection(null)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Classes
              </button>
              <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                {selectedClass} Attendance
              </h2>
            </div>
            <TableControls
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
	      selectedStudentId={selectedStudentId}
              setSelectedStudentId={setSelectedStudentId}
              uniqueStudentIds={uniqueStudentIds}
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
                selectedId={selectedStudentId}
                onClose={() => setShowGraph(false)}
              />
            )}
          </>
        )
      ) : (
        <BlockSelector uniqueClass={uniqueBlocks} onClassSelect={handleBlockSelection} darkMode={darkMode} />
      )}
    </div>
  );
};


export default AttendanceTable_Student;

