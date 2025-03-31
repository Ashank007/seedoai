import { useState, useEffect } from "react";
import { ArrowLeft, Link as LinkIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URL;

const StatusLeave = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${BACKEND_URI}/faculty/allleaves`, {
      method: "GET",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Leave Requests Response:", data);
        if (Array.isArray(data.message)) {
          setLeaveRequests(data.message);
        } else {
          console.error("Unexpected API response:", data);
          setLeaveRequests([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLeaveRequests([]);
      });
  }, []);

  const filteredLeaves = leaveRequests.filter((leave) => {
    return (
      (filterStatus === "all" ||
        leave.leavestatus.toLowerCase() === filterStatus.toLowerCase()) &&
      leave.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-pink-500 to-orange-500 text-white px-6 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center gap-2 text-white text-lg font-semibold bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition"
      >
        <ArrowLeft size={22} /> Back
      </button>
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8">Leave Status</h1>

      {/* Search & Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full max-w-lg">
        <input
          type="text"
          placeholder="🔍 Search by reason..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 rounded-lg bg-white text-gray-900 text-base shadow-md focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full sm:w-48 p-3 rounded-lg bg-white text-gray-900 text-base shadow-md focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
        >
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Leave Requests Table */}
      <div className="w-full max-w-4xl bg-white bg-opacity-20 backdrop-blur-md p-6 rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full text-left text-base border-collapse rounded-lg overflow-hidden">
          <thead>
            <tr className="border-b border-white/30 text-lg font-semibold bg-white bg-opacity-10">
              <th className="py-3 px-4">Reason</th>
              <th className="py-3 px-4">Start Date</th>
              <th className="py-3 px-4">End Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Proof</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.length > 0 ? (
              filteredLeaves.map((leave, index) => (
                <tr
                  key={index}
                  className={`border-t border-white/20 ${
                    index % 2 === 0 ? "bg-white bg-opacity-10" : ""
                  } hover:bg-white/20 transition`}
                >
                  <td className="py-3 px-4">{leave.reason}</td>
                  <td className="py-3 px-4">{leave.startdate}</td>
                  <td className="py-3 px-4">{leave.enddate}</td>

		<td
		  className={`py-3 px-4 font-semibold ${
		    leave.leavestatus.toLowerCase() === "accepted"
		      ? "text-green-600 text-opacity-90"
		      : leave.leavestatus.toLowerCase() === "pending"
		      ? "text-yellow-300 text-opacity-90"
		      : "text-red-600 text-opacity-90"
		  }`}
		>
		  {leave.leavestatus}
		</td>

                 <td className="py-3 px-4 text-center">
                    {leave.proof ? (
                      <a
                        href={leave.proof}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium bg-white/20 text-white rounded-lg hover:bg-white/30 transition"
                      >
                        <LinkIcon size={16} /> View
                      </a>
                    ) : (
                      <span className="text-gray-300">No Proof</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-lg">
                  No leave requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatusLeave;


