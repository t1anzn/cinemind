import { useEffect, useState } from "react";
import MovieGrid from "./MovieGrid";
import Pagination from "./Pagination";
import SearchBar from "./SearchBar";

export default function MoviePage() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMovies = async (query = "", page = 1) => {
    const response = await fetch(
      `http://127.0.0.1:5000/results?query=${query}&page=${page}&per_page=20`
    );
    const data = await response.json();
    //console.log("Fetched Movies:", data); // Debugging statement
    setMovies(data.movies); // Ensure movies is always an array
    setTotalPages(data.total_pages); // Update total pages from API response
    //console.log("Data.totalPages" + data.total_pages);
  };

  // Initial fetch
  useEffect(() => {
    fetchMovies(query, currentPage);
  }, [query, currentPage]);

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum); // Update the currentPage state
    fetchMovies(query, pageNum);
    window.scrollTo(0, 150); // Scroll to the top
    console.log("Page Change Triggered:" + pageNum);
  };

  const handleSearch = (searchTerm) => {
    setQuery(searchTerm); // Update query
    setCurrentPage(1);
    fetchMovies(searchTerm, 1);
    console.log("Fetching Movies for Query" + query);
  };

  return (
    <div className="content-wrapper py-10">
      <h1 className="text-3xl text-white font-bold mb-8 md:text-4xl">
        Browse Movies
      </h1>
      <SearchBar onSearch={handleSearch} client:only />
      <MovieGrid title="Search Movies" movies={movies} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
