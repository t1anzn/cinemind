import { useEffect, useState } from "react";
import MovieGrid from "./MovieGrid";  // Assuming MovieGrid is another React component
import Pagination from "./Pagination"; // Assuming Pagination is another React component
import SearchBar from "./SearchBar";

export default function MoviePage() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMovies = async (page) => {
    const response = await fetch(`http://127.0.0.1:5000/movies?page=${page}&limit=20`);
    const data = await response.json();
    setMovies(data.movies);
    setTotalPages(data.total_pages);
  };

  // Initial fetch
  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage]);

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum); //Update the currentPage state
    window.scrollTo(0, 150); // Scroll to the top
  }

  return (
    <div className="content-wrapper py-10">
      <h1 className="text-3xl text-white font-bold mb-8 md:text-4xl">
        Browse Movies
      </h1>
      <SearchBar client:only />
      <MovieGrid title="Search Movies" movies={movies} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};