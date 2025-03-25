// src/Faculty/processAttendanceData.ts
import { AttendanceRecord, AttendanceType } from "./types";

export interface ProcessedRecord {
  facultyid: string;
  att_type: AttendanceType | "N/A";
  date: string;
}

export const processAttendanceData = (
  data: AttendanceRecord[],
  selectedBlock: string | null,
  searchTerm: string,
  sortField: "facultyid" | "att_type" | "date",
  sortDirection: "asc" | "desc"
): ProcessedRecord[] => {
  console.log("Processing data:", data);
  if (!selectedBlock || data.length === 0) {
    console.log("No selected block or no data, returning empty array");
    return [];
  }

  const lowerSearchTerm = searchTerm.toLowerCase().trim();
  const blockFilteredData = data.filter(record => record.block === selectedBlock);

  console.log("Block filtered data for", selectedBlock, ":", blockFilteredData);

  if (blockFilteredData.length === 0) {
    console.log("No records for selected block:", selectedBlock);
    return [];
  }

  const filtered = blockFilteredData.filter(record => {
    const matchesFacultyId = record.facultyid.toLowerCase().includes(lowerSearchTerm);
    const matchesTimestamp = record.timestamps.some(timestamp =>
      timestamp.date.toLowerCase().includes(lowerSearchTerm) ||
      timestamp.att_type.toLowerCase().includes(lowerSearchTerm)
    );
    return matchesFacultyId || matchesTimestamp || lowerSearchTerm === "";
  });

  const result = filtered.flatMap(record => {
    if (record.timestamps.length === 0) {
      return [{
        facultyid: record.facultyid,
        att_type: "N/A" as AttendanceType,
        date: "No timestamps recorded"
      }];
    }
    return record.timestamps.map(timestamp => ({
      facultyid: record.facultyid,
      att_type: timestamp.att_type,
      date: timestamp.date
    }));
  });

  console.log("Processed data before sort:", result);
  return result.sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case "facultyid":
        comparison = a.facultyid.localeCompare(b.facultyid);
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

