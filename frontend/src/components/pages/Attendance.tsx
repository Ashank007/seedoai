import { useState, useEffect, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./customCalendar.css";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URL;

const Attendance = () => {
  const navigate = useNavigate();
  const [attendanceRecords, setAttendanceRecords] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0 });
  const [view, setView] = useState("monthly");

  useEffect(() => {
    const fetchAttendance = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`${BACKEND_URI}/api/v1/faculty/attendance`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });

        const data = await response.json();
        console.log("Backend Data:", data);

        if (Array.isArray(data.message)) {
          const presentDates = new Set(
            data.message.map((record) =>
              moment(record.date, "YYYY-MM-DD hh:mm A").format("YYYY-MM-DD")
            )
          );

          setAttendanceRecords(presentDates);
          processAttendanceData(presentDates, "monthly");
        } else {
          setAttendanceRecords(new Set());
          processAttendanceData(new Set(), "monthly");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAttendance();
  }, []);

  const processAttendanceData = useCallback((presentDates: Set<string>, type: string) => {
    const now = moment();
    const start = now.clone().startOf(type);
    const end = now.clone().endOf(type);
    const periodDays: string[] = [];

    while (start.isSameOrBefore(end, "day")) {
      periodDays.push(start.format("YYYY-MM-DD"));
      start.add(1, "day");
    }

    const totalDays = periodDays.length;
    const presentDays = presentDates.size;
    const absentDays = periodDays.filter(
      (date) => !presentDates.has(date) && moment(date).isBefore(now, "day")
    ).length;

    setStats({ total: totalDays, present: presentDays, absent: absentDays });
  }, []);

  useEffect(() => {
    processAttendanceData(attendanceRecords, view);
  }, [attendanceRecords, view, processAttendanceData]);

  const tileClassName = useCallback(({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const formattedDate = moment(date).format("YYYY-MM-DD");
      const todayDate = moment().format("YYYY-MM-DD");

      console.log("Checking Date:", formattedDate, "Present:", attendanceRecords.has(formattedDate));

      if (formattedDate === todayDate) return "today-day";
      if (attendanceRecords.has(formattedDate)) return "present-day";

      if (moment(formattedDate).isBefore(todayDate)) return "absent-day";
    }
    return "";
  }, [attendanceRecords]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-500 to-orange-500 text-white px-4 py-6 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center gap-2 text-white text-lg font-semibold bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition"
      >
        <ArrowLeft size={22} /> Back
      </button>

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 sm:mb-8">Attendance</h1>

      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6">
        {["monthly", "weekly", "yearly"].map((type) => (
          <button
            key={type}
            onClick={() => setView(type)}
            className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-base sm:text-lg font-semibold transition-all ${
              view === type ? "bg-white text-indigo-700 shadow-lg" : "bg-indigo-600 text-white hover:bg-indigo-500"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 w-full max-w-xs sm:max-w-2xl lg:max-w-4xl">
        <div className="p-4 sm:p-6 rounded-lg bg-white text-indigo-700 text-center shadow-md">
          <h2 className="text-base sm:text-lg font-semibold">Total Days</h2>
          <p className="text-2xl sm:text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="p-4 sm:p-6 rounded-lg bg-green-500 text-white text-center shadow-md">
          <h2 className="text-base sm:text-lg font-semibold">Present</h2>
          <p className="text-2xl sm:text-3xl font-bold">{stats.present}</p>
        </div>
        <div className="p-4 sm:p-6 rounded-lg bg-red-500 text-white text-center shadow-md">
          <h2 className="text-base sm:text-lg font-semibold">Absent</h2>
          <p className="text-2xl sm:text-3xl font-bold">{stats.absent}</p>
        </div>
      </div>

      <div className="p-4 sm:p-6 w-full max-w-md bg-white bg-opacity-10 rounded-lg shadow-md flex justify-center items-center">
        <Calendar tileClassName={tileClassName} className="react-calendar w-full max-w-sm text-black" />
      </div>
    </div>
  );
};

export default Attendance;


