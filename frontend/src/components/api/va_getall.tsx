import React, { useEffect, useState } from "react";
import axios from "axios";
import AttendanceTable_Vehicle from "../tables/AttendanceTableVehicle";
const BACKEND_URI = import.meta.env.VITE_BACKEND_URL;
const VehicleAttendance: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
	const response = await axios.get(`${BACKEND_URI}/api/v1/vehicle/getall`, {
	  headers: {
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


  if (loading) return <p>Loading vehicle attendance...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return <AttendanceTable_Vehicle category="vehicle" darkMode={darkMode} data={data} />;
};

export default VehicleAttendance;

