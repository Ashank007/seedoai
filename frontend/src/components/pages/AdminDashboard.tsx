import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const pages = [
  { title: "Leaves", path: "/leaverequests", color: "bg-gradient-to-r from-red-500 to-red-700" },
  { title: "Smart Dashboard", path: "/smart-dashboard", color: "bg-gradient-to-r from-blue-500 to-blue-700" },
  { title: "Add Faculty", path: "/add-faculty", color: "bg-gradient-to-r from-green-500 to-green-700" },
  { title: "Add Student", path: "/add-student", color: "bg-gradient-to-r from-purple-500 to-purple-700" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-700 text-white min-h-screen w-full flex flex-col items-center px-4 py-6 sm:px-8 sm:py-8 transition-all duration-300">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 shadow-lg border-b border-gray-600 bg-gray-800 bg-opacity-90 backdrop-blur-md flex justify-between items-center p-5 px-8 w-full"
      >
        <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
        <div className="flex gap-4">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              navigate("/");
            }}
            className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </motion.div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-24 sm:mt-32 w-full max-w-5xl px-4">
        {pages.map(({ title, path, color }, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, boxShadow: "0px 12px 30px rgba(255, 255, 255, 0.2)" }}
            transition={{ duration: 0.3 }}
            className={`h-52 sm:h-60 flex flex-col justify-between p-8 rounded-2xl ${color} cursor-pointer border border-gray-600 w-full shadow-lg transition-all transform hover:-translate-y-1`}
            onClick={() => navigate(path)}
          >
            <h3 className="text-2xl sm:text-3xl font-bold tracking-wide drop-shadow-md text-white">
              {title}
            </h3>
            <ChevronRight size={36} className="self-end opacity-90 text-white" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}


