import { useState } from 'react';
import { Users, GraduationCap, Car, Moon, Sun, ArrowLeft } from 'lucide-react';
import StudentAttendance from './components/ClassroomAttendance';
import EmployeeAttendance from './components/FacultyAttendance';
import VehicleAttendance from './components/VehicleAttendance';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    {
      id: 'employee',
      title: 'Staff Attendance',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      id: 'student',
      title: 'Student Attendance',
      icon: GraduationCap,
      color: 'bg-green-500',
    },
    {
      id: 'vehicle',
      title: 'Vehicle Attendance',
      icon: Car,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div
      className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}
    >
      {/* Header */}
      <header
        className={`fixed top-0 w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md z-10`}
      >
        <div className='container mx-auto px-4 h-14 flex items-center justify-between'>
          <div className='flex items-center space-x-2 '>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className='p-2 rounded-full hover:bg-gray-100'
              >
                <ArrowLeft
                  className={darkMode ? 'text-white' : 'text-gray-700'}
                />
              </button>
            )}
            <h1
              className={`text-xl text-center font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}
            >
              Seedo AI
            </h1>
          </div>
          <div className='flex items-center space-x-4'>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className='p-2 rounded-full hover:bg-gray-100'
            >
              {darkMode ? (
                <Sun className='text-white' />
              ) : (
                <Moon className='text-gray-700' />
              )}
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
                className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <div
                  className={`${category.color} w-20 h-20 rounded-full flex items-center justify-center mb-4`}
                >
                  <category.icon className='text-white' size={24} />
                </div>
                <h2
                  className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}
                >
                  {category.title}
                </h2>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
