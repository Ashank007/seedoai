
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type LeaveRequest = {
  _id: string;
  reason: string;
  startdate: string;
  enddate: string;
  leavestatus: "Pending" | "Accepted" | "Rejected";
  proof: string;
  appliedby: { name?: string };
};

const BACKEND_URI = import.meta.env.VITE_BACKEND_URL;
const LeaveRequests = () => {
  const [data, setData] = useState<LeaveRequest[]>([]);

  useEffect(() => {
    fetch(`${BACKEND_URI}/admin/getall`)
      .then((res) => res.json())
      .then((result) => {
        if (result.status) {
          setData(result.message.flat());
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const updateLeaveStatus = (id: string, status: "Pending" | "Accepted" | "Rejected") => {
    fetch(`${BACKEND_URI}/admin/update-leave`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ leaveId: id, leaveStatus: status }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status) {
          setData((prevData) =>
            prevData.map((leave) =>
              leave._id === id ? { ...leave, leavestatus: status } : leave
            )
          );
          toast.success("Leave status updated successfully!");
        } else {
          toast.error("Failed to update leave status");
        }
      })
      .catch((error) => {
        console.error("Error updating leave status:", error);
        toast.error("An error occurred while updating leave status");
      });
  };

  const getStatusColor = (status: "Pending" | "Accepted" | "Rejected") => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500";
      case "Accepted":
        return "bg-green-500";
      case "Rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="p-6 min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-600 to-gray-300">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className="w-full max-w-4xl flex justify-between items-center mb-6 bg-white p-4 shadow-lg rounded-xl">
        <button 
          onClick={() => window.history.back()} 
          className="px-4 py-2 bg-blue-700 text-white rounded-lg shadow-md hover:bg-blue-800 transition">
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Leave Requests</h1>
        <div></div>
      </div>
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.length > 0 ? (
          data.map((leave) => (
            <div key={leave._id} className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 flex flex-col hover:shadow-2xl transition">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-800">{leave.reason}</h2>
                <select
                  value={leave.leavestatus}
                  onChange={(e) => updateLeaveStatus(leave._id, e.target.value as "Pending" | "Accepted" | "Rejected")}
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 bg-gray-100 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500 hover:bg-gray-200 transition">
                  <option value="Pending" className="text-yellow-600">Pending</option>
                  <option value="Accepted" className="text-green-600">Accepted</option>
                  <option value="Rejected" className="text-red-600">Rejected</option>
                </select>
              </div>
              <p className="text-gray-600 text-sm mb-2">
                <strong>Duration:</strong> {leave.startdate} - {leave.enddate}
              </p>
              <p className="text-gray-800 font-medium mb-3">Applied By: {leave.appliedby.name || "N/A"}</p>
              <div className={`px-4 py-2 rounded-full text-sm font-medium text-white text-center ${getStatusColor(leave.leavestatus)}`}>{leave.leavestatus}</div>
              <a 
                href={leave.proof} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-auto px-4 py-2 text-center border border-gray-300 rounded-lg text-blue-700 hover:bg-blue-200 transition">
                View Proof
              </a>
            </div>
          ))
        ) : (
          <p className="text-gray-200 text-center text-lg">No leave requests found.</p>
        )}
      </div>
    </div>
  );
};

export default LeaveRequests;


