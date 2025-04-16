import React, { useEffect, useState } from "react";
import axios from "axios";
import AttendanceTable_Student from "../tables/AttendanceTableStudent";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URL;

const ClassroomAttendance: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
	const response = await axios.get(`${BACKEND_URI}/api/v1/student/getall`, {
	  headers: {
	    'Accept': 'application/json',  // Ensure the response is expected as JSON
	  }
	});
        setData(response.data.message);
      } catch (error) {
        setError("Failed to load classroom attendance.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading classroom attendance...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <AttendanceTable_Student
      category="classroom"
      darkMode={darkMode}
      data={data}
    />
  );
};

export default ClassroomAttendance;


