import React, { useEffect, useState } from "react";
import axios from "axios";
import AttendanceTable from "../tables/AttendanceTableStudent";

const ClassroomAttendance: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .post("/api/classroom-attendance", { category: "classroom" }) // Send POST request with payload
      .then((response) => {
        setData(response.data);
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

  return <AttendanceTable category="classroom" darkMode={darkMode} data={data} />;
};

export default ClassroomAttendance;

