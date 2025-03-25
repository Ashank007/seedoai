import React from "react";

interface ClassSelectorProps {
  uniqueClass: { classname: string; count: number }[];
  onClassSelect: (classname: string | null) => void;
  darkMode: boolean;
}

export const BlockSelector: React.FC<ClassSelectorProps> = ({ uniqueClass, onClassSelect, darkMode }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {uniqueClass.map(({ classname, count }) => (
          <button
            key={classname}
            onClick={() => onClassSelect(classname)}
            className={`relative p-8 rounded-2xl overflow-hidden w-full 
              ${darkMode 
                ? "bg-gradient-to-br from-indigo-900 to-purple-800 hover:from-indigo-700 hover:to-purple-700" 
                : "bg-gradient-to-br from-teal-100 to-cyan-100 hover:from-teal-200 hover:to-cyan-200"
              } shadow-lg hover:shadow-2xl transform hover:-translate-y-2 
              transition-all duration-300 flex flex-col items-center justify-center min-h-[200px]`}
          >
            {/* Subtle Background Pattern */}
            <div className={`absolute inset-0 opacity-10 ${
              darkMode 
                ? "bg-[url('data:image/svg+xml,%3Csvg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23fff\" fill-opacity=\"0.3\"%3E%3Cpath d=\"M0 0h24v24H0z\"/%3E%3C/g%3E%3C/svg%3E')]" 
                : "bg-[url('data:image/svg+xml,%3Csvg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%2366b2b2\" fill-opacity=\"0.3\"%3E%3Cpath d=\"M0 0h24v24H0z\"/%3E%3C/g%3E%3C/svg%3E')]"
            }`} />

            {/* Icon Circle */}
            <div
              className={`relative w-20 h-20 rounded-full flex items-center justify-center mb-6 
                ${darkMode 
                  ? "bg-gradient-to-br from-indigo-600 to-purple-600" 
                  : "bg-gradient-to-br from-teal-400 to-cyan-400"
                } group-hover:scale-110 transition-all duration-300 shadow-lg ring-4 
                ${darkMode ? "ring-indigo-800/50" : "ring-teal-300/50"}`}
            >
              <span
                className={`text-3xl font-extrabold tracking-tight 
                  ${darkMode ? "text-indigo-100" : "text-teal-900"}`}
              >
                {classname.split("-")[1] || classname}
              </span>
            </div>

            {/* Block Name */}
            <h3
              className={`relative text-3xl font-bold text-center tracking-wide mb-3
                ${darkMode 
                  ? "text-indigo-200 group-hover:text-indigo-50" 
                  : "text-teal-900 group-hover:text-teal-800"
                } transition-colors duration-200`}
            >
              {classname}
              {/* Subtle Underline Effect */}
              <span
                className={`absolute bottom-0 left-1/2 w-0 h-1 
                  ${darkMode ? "bg-indigo-400/70" : "bg-teal-500/70"} 
                  group-hover:w-full group-hover:left-0 transition-all duration-300`}
              />
            </h3>

            {/* Faculty Count */}
            <p className={`${darkMode ? "text-yellow-400" : "text-blue-400"} text-xl font-semibold`}>
              {count} {count === 1 ? "Student" : "Students"}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};


