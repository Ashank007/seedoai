import React, { useEffect, useState } from "react";
import axios from "axios";
import AttendanceTable_Faculty from "../tables/AttendanceTableFaculty";
const BACKEND_URI = import.meta.env.VITE_BACKEND_URL;
const FacultyAttendance: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URI}/api/v1/faculty/getall`,{
        headers:{
	    'ngrok-skip-browser-warning': 'true',  // Skip ngrok warning page
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


  if (loading) return <p>Loading faculty attendance...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return <AttendanceTable_Faculty category="faculty" darkMode={darkMode} data={data} />;
};

export default FacultyAttendance;

