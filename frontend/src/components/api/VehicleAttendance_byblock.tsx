import React, { useEffect, useState } from "react";
import axios from "axios";
import AttendanceTable from "../tables/AttendanceTableVehicle";

const VehicleAttendance: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .post("/api/vehicle-attendance", { category: "vehicle" }) // Send POST request
      .then((response) => {
        setData(response.data);
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

  return <AttendanceTable category="vehicle" darkMode={darkMode} data={data} />;
};

export default VehicleAttendance;

