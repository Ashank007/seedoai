import React, { useEffect, useState } from "react";
import axios from "axios";
import AttendanceTable from "../tables/AttendanceTableStudent";
import { getSelectedClass, subscribeToClassChanges } from "../context/GlobalClass";

const BACKENDURI = "http://localhost:9000/api/v1";

const ClassroomAttendance: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const [data, setData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedClass, setSelectedClass] = useState<string | null>(getSelectedClass());

useEffect(() => {
    const unsubscribe = subscribeToClassChanges((classroom) => {
      console.log("FacultyAttendance: Selected block changed to:", classroom);
      setSelectedClass(classroom);
    });
    return () => unsubscribe();
  }, []);

 
  useEffect(() => {
    if (!selectedClass) {
      setData([]);
      setLoading(false);
      console.log("No class selected, data cleared.");
      return;
    }
    axios
      .post(`${BACKENDURI}/student/getbyclass`, { classname: selectedClass }) // Send POST request with payload
      .then((response) => {
        const records = response.data.message || [];
        setData(records);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to load classroom attendance.");
	console.log(error);
        setLoading(false);
      });
  }, [selectedClass]);

  if (loading) return <p>Loading classroom attendance...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return <AttendanceTable category="classroom" darkMode={darkMode} data={data} />;
};

interface TimestampEntry {
  att_type: "CheckIn" | "CheckOut";
  date: string;
}

interface AttendanceRecord {
  studentid: string;
  timestamps: TimestampEntry[];
  classname: string;
}

export default ClassroomAttendance;

