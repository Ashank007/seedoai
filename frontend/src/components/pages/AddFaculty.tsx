import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URL;

export default function FacultyForm() {
  const [formData, setFormData] = useState({
    email: "",
    faculty_id: "",
    block: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e)  => {
    e.preventDefault();
    
    // Simulating a backend error response
    if (!formData.email.includes("@")) {
      setError("Invalid email format. Please enter a valid email.");
      return;
    }
    console.log(formData);
    
    try {
      const response = await fetch(`${BACKEND_URI}/faculty/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }
      
      console.log("Form Data Submitted Successfully:", result);
      navigate("/admin");
    } catch (error) {
      setError(error.message);
    }
    setError("");
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
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Faculty Registration</h2>
        {error && <div className="mb-4 text-red-600 font-semibold text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Faculty ID</label>
            <input
              type="text"
              name="faculty_id"
              placeholder="Enter Faculty ID"
              value={formData.faculty_id}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Block</label>
            <input
              type="text"
              name="block"
              placeholder="Enter Block"
              value={formData.block}
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

