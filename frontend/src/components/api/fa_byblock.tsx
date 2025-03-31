import React, { useEffect, useState } from "react";
import axios from "axios";
import AttendanceTable_Staff from "../tables/AttendanceTableFaculty";
import { getSelectedBlock, subscribeToBlockChanges } from "../context/GlobalBlock";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URL;

const FacultyAttendance: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const [data, setData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBlock, setSelectedBlock] = useState<string | null>(getSelectedBlock());

  useEffect(() => {
    const unsubscribe = subscribeToBlockChanges((block) => {
      console.log("FacultyAttendance: Selected block changed to:", block);
      setSelectedBlock(block);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!selectedBlock) {
      setData([]);
      setLoading(false);
      console.log("No block selected, data cleared.");
      return;
    }

    setLoading(true);
    console.log("Fetching data for block:", selectedBlock);
    axios
      .post(`${BACKEND_URI}/faculty/getbyblock`, { block: selectedBlock })
      .then((response) => {
        console.log("API response:", response.data);
        const records = response.data.message || [];
        setData(records);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to load faculty attendance.");
        console.log("API error:", error);
        setLoading(false);
      });
  }, [selectedBlock]);

  if (loading) return <p>Loading faculty attendance...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  console.log("Rendering with data:", data);
  return <AttendanceTable_Staff category="faculty" darkMode={darkMode} data={data} />;
};

interface TimestampEntry {
  att_type: "CheckIn" | "CheckOut";
  date: string;
}

interface AttendanceRecord {
  facultyid: string;
  timestamps: TimestampEntry[];
  block: string;
}

export default FacultyAttendance;

