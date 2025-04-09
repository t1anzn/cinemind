import { useEffect, useState } from "react";
import MovieGrid from "./MovieGrid";
import Pagination from "./Pagination";
import SearchBar from "./SearchBar";

export default function MoviePage() {
  const [movies, setMovies] = useState([]);
  const [queryParams, setQueryParams] = useState({ query: "", genre: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch movies with optional query and genre
  const fetchMovies = async (query = "", genre = "", page = 1) => {
    const url = new URL("http://127.0.0.1:5000/results");
    url.searchParams.set("query", query);
    url.searchParams.set("genre", genre);
    url.searchParams.set("page", page);
    url.searchParams.set("per_page", 20);

    const response = await fetch(url);
    const data = await response.json();
    //console.log("Fetched Movies:", data); // Debugging statement
    setMovies(data.movies); // Ensure movies is always an array
    setTotalPages(data.total_pages); // Update total pages from API response
    //console.log("Data.totalPages" + data.total_pages);
  };

  // Fetch movies whenever query/genre/page changes
  useEffect(() => {
    fetchMovies(queryParams.query, queryParams.genre, currentPage);
  }, [queryParams, currentPage]);

  // When search or genre changes
  const handleSearch = ({ query, genre }) => {
    setQueryParams({ query, genre }); // Update query
    setCurrentPage(1);
    fetchMovies(searchTerm, 1);
    console.log("Fetching Movies for Query" + query);
  };

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum); // Update the currentPage state
    fetchMovies(query, pageNum);
    window.scrollTo(0, 150); // Scroll to the top
    console.log("Page Change Triggered:" + pageNum);
  };

  return (
    <div className="content-wrapper py-10">
      <h1 className="text-3xl text-white font-bold mb-8 md:text-4xl">
        Browse Movies
      </h1>
      <SearchBar onSearch={handleSearch} />
      <MovieGrid title="Search Movies" movies={movies} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

