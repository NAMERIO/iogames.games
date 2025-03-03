import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pageNumbers = [];
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  return (
    <div className="flex justify-center items-center space-x-2 mt-8 animate-fade-in">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-md transition-all ${
          currentPage === 1
            ? 'text-gray-500 cursor-not-allowed'
            : 'text-white hover:bg-gray-700 btn-hover-effect'
        }`}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={`px-3 py-1 rounded-md transition-all ${
              currentPage === 1
                ? 'bg-indigo-600 text-white animate-glow'
                : 'text-white hover:bg-gray-700 btn-hover-effect'
            }`}
          >
            1
          </button>
          {startPage > 2 && <span className="text-gray-400">...</span>}
        </>
      )}
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-3 py-1 rounded-md transition-all ${
            currentPage === number
              ? 'bg-indigo-600 text-white animate-glow'
              : 'text-white hover:bg-gray-700 btn-hover-effect'
          }`}
        >
          {number}
        </button>
      ))}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="text-gray-400">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className={`px-3 py-1 rounded-md transition-all ${
              currentPage === totalPages
                ? 'bg-indigo-600 text-white animate-glow'
                : 'text-white hover:bg-gray-700 btn-hover-effect'
            }`}
          >
            {totalPages}
          </button>
        </>
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-md transition-all ${
          currentPage === totalPages
            ? 'text-gray-500 cursor-not-allowed'
            : 'text-white hover:bg-gray-700 btn-hover-effect'
        }`}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Pagination;