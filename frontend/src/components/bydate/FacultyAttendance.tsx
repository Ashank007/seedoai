import React, { useEffect, useState } from "react";
import axios from "axios";
import AttendanceTable from "../AttendanceTable";

const FacultyAttendance: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .post("/api/faculty-attendance", { category: "faculty" }) // Send POST request
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to load faculty attendance.");
	console.log(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading faculty attendance...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return <AttendanceTable category="faculty" darkMode={darkMode} data={data} />;
};

export default FacultyAttendance;

