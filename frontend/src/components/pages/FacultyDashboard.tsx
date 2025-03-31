import { LogOut, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URL;

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchName = async () => {
      try {
        const response = await fetch(`${BACKEND_URI}/faculty/name`, {
          headers: { Authorization: `${localStorage.getItem("token")}` },
        });
        const data = await response.json();
        setName(data.message);
      } catch (error) {
        console.error("Error fetching faculty name:", error);
      }
    };
    fetchName();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const cards = [
    { title: "Apply Leave", color: "bg-gradient-to-r from-red-500 to-red-700", path: "/apply-leave" },
    { title: "Status Leave", color: "bg-gradient-to-r from-orange-500 to-orange-700", path: "/status-leave" },
    { title: "Attendance", color: "bg-gradient-to-r from-teal-500 to-teal-700", path: "/attendance" },
  ];

  return (
    <div className="bg-gradient-to-br from-pink-500 to-orange-500 text-white min-h-screen w-full flex flex-col items-center px-4 py-6 sm:px-8 sm:py-8 transition-all duration-300">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full flex flex-col sm:flex-row justify-between items-center p-6 bg-gradient-to-br from-pink-500 to-orange-500 bg-opacity-90 backdrop-blur-md rounded-2xl fixed top-4 left-0 right-0 z-50 shadow-xl border border-gray-700"
      >
        <h2 className="text-xl sm:text-2xl font-semibold text-white px-6 py-3">
          Welcome Back, {name}!
        </h2>

        {/* Centered Title */}
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-4xl sm:text-5xl font-extrabold tracking-wide text-white drop-shadow-md">
          Faculty Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all text-base shadow-md border border-red-400"
        >
          <LogOut size={22} /> Logout
        </button>
      </motion.div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mt-28 sm:mt-32 w-full px-4 sm:px-6">
        {cards.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.08, boxShadow: "0px 12px 30px rgba(255, 255, 255, 0.2)" }}
            transition={{ duration: 0.3 }}
            className={`h-52 sm:h-60 flex flex-col justify-between p-8 rounded-2xl ${item.color} cursor-pointer border border-gray-600 w-full shadow-lg transition-all transform hover:-translate-y-1 hover:scale-105`}
            onClick={() => navigate(item.path)}
          >
            <h3 className="text-2xl sm:text-3xl font-bold tracking-wide drop-shadow-md text-white">
              {item.title}
            </h3>
            <ChevronRight size={36} className="self-end opacity-90 text-white" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FacultyDashboard;


