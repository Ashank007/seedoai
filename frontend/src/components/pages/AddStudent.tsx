import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentForm() {
  const [formData, setFormData] = useState({
    student_id: "",
    classname: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    console.log("Form Data Submitted:", formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 p-4">
      <div className="w-full max-w-md p-6 bg-white shadow-2xl rounded-3xl transition-transform transform hover:scale-105 relative">
        <button 
          onClick={() => navigate("/admin")} 
          className="absolute top-4 left-4 text-gray-600 hover:text-gray-900 text-2xl"
        >
          ←
        </button>
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Student Registration</h2>
        {error && <div className="mb-4 text-red-600 font-semibold text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
        <div>
            <label className="block text-gray-600 mb-1">Student ID</label>
            <input
              type="text"
              name="facultyId"
              placeholder="Enter Student ID"
              value={formData.student_id}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">ClassName</label>
            <input
              type="text"
              name="block"
              placeholder="Enter Class Name"
              value={formData.classname}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
            />
          </div>
          <button type="submit" className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all">Submit</button>
        </form>
      </div>
    </div>
  );
}

