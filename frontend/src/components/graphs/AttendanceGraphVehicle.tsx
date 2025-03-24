// AttendanceGraph.tsx
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface GraphData {
  vehicleid: string;
  att_type: "CheckIn" | "CheckOut";
  date: string;
}

interface Props {
  data: GraphData[];
  darkMode: boolean;
  selectedId: string | null;
  onClose: () => void; // Callback to close the graph
}

const AttendanceGraph_Vehicle: React.FC<Props> = ({ data, darkMode,selectedId,onClose }) => {
  const graphData = React.useMemo(() => {
    const filteredData = selectedId
      ? data.filter(d => d.vehicleid === selectedId)
      : data;
    const checkIns = filteredData.filter(d => d.att_type === "CheckIn").length;
    const checkOuts = filteredData.filter(d => d.att_type === "CheckOut").length;

    return {
      labels: ["Check Ins", "Check Outs"],
      datasets: [{
        label: "Attendance Count",
        data: [checkIns, checkOuts],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', // CheckIn color
          'rgba(255, 99, 132, 0.6)', // CheckOut color
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      }]
    };
  }, [data]);

  const graphOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: darkMode ? '#e5e7eb' : '#374151',
        }
      },
      title: {
        display: true,
        text: selectedId ? `Entry for ${selectedId}` : 'Overall Entry Statistics',
        color: darkMode ? '#e5e7eb' : '#374151',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: darkMode ? '#e5e7eb' : '#374151',
        },
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        }
      },
      x: {
        ticks: {
          color: darkMode ? '#e5e7eb' : '#374151',
        },
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        }
      }
    }
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}>
      <div className={`p-6 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} max-w-2xl w-full`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`${darkMode ? "text-white" : "text-gray-800"} text-xl font-semibold`}>
	  {selectedId ? `Entry for ${selectedId}` : "Overall Entry Statistics"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        <Bar data={graphData} options={graphOptions} />
      </div>
    </div>
  );
};

export default AttendanceGraph_Vehicle;
