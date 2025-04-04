import React, { useEffect, useState } from "react";
import axios from "axios";
import AttendanceTable_Student from "../tables/AttendanceTableStudent";
const BACKEND_URI = import.meta.env.VITE_BACKEND_URL;
const ClassroomAttendance: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${BACKEND_URI}/student/getall`)
      .then((response) => {
        setData(response.data.message);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to load classroom attendance.");
	console.log(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading classroom attendance...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return <AttendanceTable_Student category="classroom" darkMode={darkMode} data={data} />;
};

export default ClassroomAttendance;

