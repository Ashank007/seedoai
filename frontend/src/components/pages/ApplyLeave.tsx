import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URL;

const ApplyLeave = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState({
    reason: "",
    startDate: "",
    endDate: "",
    proofFile: null as File | null,
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, proofFile: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.proofFile || !formData.reason || !formData.startDate || !formData.endDate) {
      toast.error("Please fill all fields and select a file.");
      return;
    }

    setUploading(true);
    const token = localStorage.getItem("token");
    const fileData = new FormData();

    fileData.append("reason", formData.reason);
    fileData.append("startdate", formData.startDate);
    fileData.append("enddate", formData.endDate);
    fileData.append("file", formData.proofFile);

    try {
      const response = await fetch(`${BACKEND_URI}/api/v1/faculty/addleave`, {
        method: "POST",
        headers: { Authorization: `${token}` },
        body: fileData,
      });

      const result = await response.json();
      console.log("Upload Response:", result);

      if (result.status === true) {
        toast.success(result.message);
        setFormData({ reason: "", startDate: "", endDate: "", proofFile: null });

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        toast.error(result.message || "Upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("File upload failed.");
    }

    setUploading(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-pink-500 to-orange-500 text-white px-6 py-8">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center gap-2 text-white text-lg font-semibold bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition"
      >
        <ArrowLeft size={22} /> Back
      </button>

      <h1 className="text-3xl md:text-4xl font-extrabold mb-8">Apply Leave</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-20 backdrop-blur-md p-6 sm:p-8 rounded-xl w-full max-w-sm sm:max-w-md md:max-w-lg flex flex-col gap-6 shadow-lg"
      >
        <div>
          <label className="block text-lg font-semibold mb-2">Reason</label>
          <input
            type="text"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg text-gray-900 text-base border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-lg font-semibold mb-2">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg text-gray-900 text-base border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-lg font-semibold mb-2">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg text-gray-900 text-base border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-lg font-semibold mb-2">Upload Proof</label>
          <div className="relative w-full">
            <input
              type="file"
              onChange={handleFileChange}
              ref={fileInputRef}
              required
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white text-gray-900 text-base font-medium shadow-md hover:bg-gray-200 transition">
              <Upload size={20} /> {formData.proofFile ? formData.proofFile.name : "Choose a file"}
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={uploading}
          className={`w-full flex items-center justify-center gap-2 ${
            uploading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
          } text-white py-3 rounded-lg font-semibold transition text-base`}
        >
          {uploading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3m-3 3l-3-3"
                ></path>
              </svg>
              Uploading...
            </>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  );
};

export default ApplyLeave;


