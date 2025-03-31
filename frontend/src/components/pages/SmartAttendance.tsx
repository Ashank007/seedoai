import { useState, useEffect } from 'react';
import { Users, GraduationCap, Car, Moon, Sun, ArrowLeft } from 'lucide-react';
import StudentAttendance from '../api/ca_getall';
import EmployeeAttendance from '../api/fa_getall';
import VehicleAttendance from '../api/va_getall';
import axios from 'axios';
const BACKEND_URI = import.meta.env.VITE_BACKEND_URL;

function SmartAttendance() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [counts, setCounts] = useState<{ [key: string]: number }>({
  employee: 0,
  student: 0,
  vehicle: 0
});


  const categories = [
    {
      id: 'employee',
      title: 'Staff Attendance',
      icon: Users,
      color: 'bg-blue-500',
      apiEndpoint: `${BACKEND_URI}/faculty/getcount`
    },
    {
      id: 'student',
      title: 'Student Attendance',
      icon: GraduationCap,
      color: 'bg-green-500',
      apiEndpoint: `${BACKEND_URI}/student/getcount`

    },
    {
      id: 'vehicle',
      title: 'Vehicle Parking',
      icon: Car,
      color: 'bg-purple-500',
      apiEndpoint: `${BACKEND_URI}/vehicle/getcount`
    },
  ];

useEffect(() => {
    const fetchCounts = async () => {
      try {
        const newCounts = { ...counts };
        
        for (const category of categories) {
          const response = await axios.get(category.apiEndpoint);
          const data = response.data; // Axios puts the response body in .data
          if (data.status) {
            newCounts[category.id] = data.message;
          } else {
            console.warn(`Failed to fetch count for ${category.id}`);
            newCounts[category.id] = 0;
          }
        }
        
        setCounts(newCounts);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header remains unchanged */}

<header className={`fixed top-0 w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md z-10`}>
  <div className='container mx-auto px-4 h-14 flex items-center justify-between'>
    <div className='flex items-center space-x-2'>
      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className='p-2 rounded-full hover:bg-gray-100'
      >
        <ArrowLeft className={darkMode ? 'text-white' : 'text-gray-700'} />
      </button>

      {selectedCategory && (
        <button
          onClick={() => setSelectedCategory(null)}
          className='p-2 rounded-full hover:bg-gray-100'
        >
          <ArrowLeft className={darkMode ? 'text-white' : 'text-gray-700'} />
        </button>
      )}
      <h1 className={`text-xl text-center font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Seedo AI
      </h1>
    </div>

    {/* Logout and Dark Mode Toggle */}
    <div className='flex items-center space-x-4'>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className='p-2 rounded-full hover:bg-gray-100'
      >
        {darkMode ? <Sun className='text-white' /> : <Moon className='text-gray-700' />}
      </button>

      {/* Logout Button */}
      <button
        onClick={() => {
          localStorage.removeItem('token'); // Remove token from localStorage
          window.location.href = '/'; // Redirect to login page
        }}
        className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-300'
      >
        Logout
      </button>
    </div>
  </div>
</header>

	      {/* Main Content */}
      <main className='container mx-auto px-4 pt-24 pb-16'>
        {selectedCategory ? (
          selectedCategory === 'student' ? (
            <StudentAttendance darkMode={darkMode} />
          ) : selectedCategory === 'employee' ? (
            <EmployeeAttendance darkMode={darkMode} />
          ) : selectedCategory === 'vehicle' ? (
            <VehicleAttendance darkMode={darkMode} />
          ) : null
        ) : (

	<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
	  {categories.map((category) => (
	    <button
	      key={category.id}
	      onClick={() => setSelectedCategory(category.id)}
	      className={`relative p-6 rounded-lg overflow-hidden ${
		darkMode ? 'bg-gray-800' : 'bg-white'
	      } shadow-lg hover:shadow-xl transition-all duration-300 group min-h-[290px] flex flex-col justify-between`}
	    >
	      {/* Gradient Overlay */}
	      <div
		className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${
		  counts[category.id] === 0
		    ? 'bg-gradient-to-br from-red-500/30 to-red-600/30'
		    : 'bg-gradient-to-br from-green-500/30 to-green-600/30'
		}`}
	      ></div>

	      {/* Icon Container */}
	      <div
		className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-300 shadow-md`}
	      >
		<category.icon className='text-white' size={20} />
	      </div>

	      {/* Title */}
	      <h2
		className={`text-lg font-semibold mb-3 text-center ${
		  darkMode ? 'text-white' : 'text-gray-800'
		} group-hover:text-opacity-90 transition-colors duration-200`}
	      >
		{category.title}
	      </h2>

	      {/* Count Section */}
	      <div
		className={`relative px-4 py-3 rounded-md mx-auto w-full text-center ${
		  counts[category.id] === 0
		    ? darkMode
		      ? 'bg-red-500/10'
		      : 'bg-red-400/10'
		    : darkMode
		    ? 'bg-green-500/10'
		    : 'bg-green-400/10'
		} group-hover:scale-[1.02] transition-transform duration-300 shadow-sm`}
	      >
		<div
		  className={`absolute inset-0 rounded-md border border-opacity-30 group-hover:border-opacity-50 transition-all duration-300 ${
		    counts[category.id] === 0
		      ? 'border-red-500'
		      : 'border-green-500'
		  } group-hover:animate-[pulse_1.5s_infinite]`}
		></div>
		<div className='flex items-center justify-center space-x-2'>
		  {/* Count Number */}
		  <span
		    className={`text-6xl font-extrabold ${
		      counts[category.id] === 0
			? darkMode
			  ? 'text-red-400'
			  : 'text-red-600'
			: darkMode
			? 'text-green-400'
			: 'text-green-600'
		    } drop-shadow-sm`}
		  >
		    {counts[category.id] ?? (
		      <span className='inline-flex items-center space-x-1 animate-pulse'>
			<span className='w-2 h-2 bg-current rounded-full animate-[bounce_0.6s_infinite] [animation-delay:0s]'></span>
			<span className='w-2 h-2 bg-current rounded-full animate-[bounce_0.6s_infinite] [animation-delay:0.2s]'></span>
			<span className='w-2 h-2 bg-current rounded-full animate-[bounce_0.6s_infinite] [animation-delay:0.4s]'></span>
		      </span>
		    )}
		  </span>
		  {/* Status Indicator */}
		  <span
		    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
		      counts[category.id] === 0
			? darkMode
			  ? 'bg-red-500/20 text-red-300'
			  : 'bg-red-400/20 text-red-600'
			: darkMode
			? 'bg-green-500/20 text-green-300'
			: 'bg-green-400/20 text-green-600'
		    }`}
		  >
                    {category.id === "vehicle" ? 'Parked' : (counts[category.id] === 0 ? 'Absent' : 'Present')}
		  </span>
		</div>
	      </div>
	    </button>
	  ))}
	</div>
        )}
      </main>
    </div>
  );
}

export default SmartAttendance;
