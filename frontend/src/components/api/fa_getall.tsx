import React, { useEffect, useState } from "react";
import axios from "axios";
import AttendanceTable_Faculty from "../tables/AttendanceTableFaculty";
const BACKEND_URI = import.meta.env.VITE_BACKEND_URL;
const FacultyAttendance: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${BACKEND_URI}/faculty/getall`)
      .then((response) => {
        setData(response.data.message);
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

  return <AttendanceTable_Faculty category="faculty" darkMode={darkMode} data={data} />;
};

export default FacultyAttendance;

