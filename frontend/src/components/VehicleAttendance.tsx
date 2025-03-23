import React, { useEffect, useState } from "react";
import axios from "axios";
import AttendanceTable_Vehicle from "./tables/AttendanceTableVehicle";
const BACKENDURI = "http://localhost:9000";
const VehicleAttendance: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${BACKENDURI}/api/v1/vehicle/getall`)
      .then((response) => {
        setData(response.data.message);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to load vehicle attendance.");
	console.log(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading vehicle attendance...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return <AttendanceTable_Vehicle category="vehicle" darkMode={darkMode} data={data} />;
};

export default VehicleAttendance;

