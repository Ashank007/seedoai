import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ProcessedRecord } from "./processAttendanceData";

interface TableContentProps {
  currentData: ProcessedRecord[];
  sortField: "studentid" | "att_type" | "date";
  sortDirection: "asc" | "desc";
  onSort: (field: "studentid" | "att_type" | "date") => void;
  darkMode: boolean;
}

export const TableContent: React.FC<TableContentProps> = ({
  currentData,
  sortField,
  sortDirection,
  onSort,
  darkMode,
}) => {
  const headers = [
    { label: "Student ID", field: "studentid" },
    { label: "Type", field: "att_type" },
    { label: "Timestamp", field: "date" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className={`w-full ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
        <thead>
          <tr className={darkMode ? "bg-gray-800" : "bg-gray-50"}>
            {headers.map(({ label, field }) => (
              <th
                key={field}
                className="px-6 py-3 text-left cursor-pointer"
                onClick={() => onSort(field as "studentid" | "att_type" | "date")}
              >
                <div className="flex items-center gap-2">
                  {label}
                  {sortField === field && (sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {currentData.length > 0 ? (
            currentData.map((record, index) => (
              <tr
                key={`${record.studentid}-${record.date}-${index}`}
                className={`${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"}`}
              >
                <td className="px-6 py-4">{record.studentid}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      record.att_type === "CheckIn" ? "bg-green-100 text-green-800" :
                      record.att_type === "CheckOut" ? "bg-red-100 text-red-800" :
                      "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {record.att_type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {record.date !== "No timestamps recorded" ? new Date(record.date).toLocaleString() : record.date}
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
  );
}
