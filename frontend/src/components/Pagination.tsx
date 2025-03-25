
import React from "react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  darkMode: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, setCurrentPage, darkMode }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex gap-2">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => setCurrentPage(i + 1)}
          className={`px-3 py-1 rounded ${
            currentPage === i + 1
              ? "bg-blue-500 text-white"
              : darkMode
              ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};

