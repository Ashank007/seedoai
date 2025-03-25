
// src/Student/processAttendanceData.ts
import { AttendanceRecord, AttendanceType } from "./types";

export interface ProcessedRecord {
  studentid: string;
  att_type: AttendanceType | "N/A";
  date: string;
}

export const processAttendanceData = (
  data: AttendanceRecord[],
  selectedClass: string | null,
  searchTerm: string,
  sortField: "studentid" | "att_type" | "date",
  sortDirection: "asc" | "desc"
): ProcessedRecord[] => {
  console.log("Processing data:", data);
  if (!selectedClass || data.length === 0) {
    console.log("No selected class or no data, returning empty array");
    return [];
  }

  const lowerSearchTerm = searchTerm.toLowerCase().trim();
  const classFilteredData = data.filter(record => record.classname === selectedClass);

  console.log("Block filtered data for", selectedClass, ":", classFilteredData);

  if (classFilteredData.length === 0) {
    console.log("No records for selected block:", selectedClass);
    return [];
  }

  const filtered = classFilteredData.filter(record => {
    const matchesStudentId = record.studentid.toLowerCase().includes(lowerSearchTerm);
    const matchesTimestamp = record.timestamps.some(timestamp =>
      timestamp.date.toLowerCase().includes(lowerSearchTerm) ||
      timestamp.att_type.toLowerCase().includes(lowerSearchTerm)
    );
    return matchesStudentId || matchesTimestamp || lowerSearchTerm === "";
  });

  const result = filtered.flatMap(record => {
    if (record.timestamps.length === 0) {
      return [{
        studentid: record.studentid,
        att_type: "N/A" as AttendanceType,
        date: "No timestamps recorded"
      }];
    }
    return record.timestamps.map(timestamp => ({
      studentid: record.studentid,
      att_type: timestamp.att_type,
      date: timestamp.date
    }));
  });

  console.log("Processed data before sort:", result);
  return result.sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case "studentid":
        comparison = a.studentid.localeCompare(b.studentid);
        break;
      case "att_type":
        comparison = a.att_type.localeCompare(b.att_type);
        break;
      case "date":
        comparison = (a.date === "No timestamps recorded" ? 0 : new Date(a.date).getTime()) - 
                     (b.date === "No timestamps recorded" ? 0 : new Date(b.date).getTime());
        break;
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });
};
