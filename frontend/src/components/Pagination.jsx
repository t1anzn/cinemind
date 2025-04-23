import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  //console.log("Pagination Props:", { currentPage, totalPages });
  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const range = 2;

    let start = Math.max(currentPage - range, 1);
    let end = Math.min(currentPage + range, totalPages);

    if (start > 2) {
      pageNumbers.push(
        <button
          key="start"
          onClick={() => goToPage(1)}
          className="w-10 h-10 text-center mx-1 bg-transparent text-white rounded-lg border border-blue-400/0 hover:border-blue-400 transition-all duration-300"
        >
          1
        </button>
      );
      pageNumbers.push(
        <span
          key="ellipsis-start"
          className="w-10 h-10 text-white text-center flex items-center justify-center"
        >
          ...
        </span>
      );
    }

    for (let i = start; i <= end; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`w-10 h-10 text-center mx-1 rounded-lg flex items-center justify-center transition-all duration-300 ${
            i === currentPage
              ? "bg-blue-400 text-white border border-blue-400"
              : "bg-transparent text-white border border-blue-400/0 hover:border-blue-400"
          }`}
        >
          {i}
        </button>
      );
    }

    if (end < totalPages - 1) {
      pageNumbers.push(
        <span
          key="ellipsis-end"
          className="w-10 h-10 text-white text-center flex items-center justify-center"
        >
          ...
        </span>
      );
      pageNumbers.push(
        <button
          key="end"
          onClick={() => goToPage(totalPages)}
          className="w-10 h-10 text-center mx-1 bg-transparent text-white rounded-lg border border-blue-400/0 hover:border-blue-400 transition-all duration-300"
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex justify-center mt-8 items-center gap-4">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1 ? true : false}
        className="px-4 py-2 bg-transparent text-white rounded-lg tracking-widest border border-blue-400/0 hover:border-blue-400 hover:text-blue-400 shadow hover:shadow-sm hover:shadow-cyan-400 transition-all duration-300 disabled:opacity-50"
      >
        <ChevronLeftIcon className="w-6 h-6" />
      </button>
      <div className="flex justify-center items-center min-w-[360px] gap-1">
        {getPageNumbers()}
      </div>
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages ? true : false}
        className="px-4 py-2 bg-transparent text-white rounded-lg tracking-widest border border-blue-400/0 hover:border-blue-400 hover:text-blue-400 shadow hover:shadow-sm hover:shadow-cyan-400 transition-all duration-300 disabled:opacity-50"
      >
        <ChevronRightIcon className="w-6 h-6" />
      </button>
    </div>
  );
}
