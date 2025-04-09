import { useEffect, useState } from "react";
import MovieGrid from "./MovieGrid";
import Pagination from "./Pagination";
import SearchBar from "./SearchBar";

export default function MoviePage() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [queryParams, setQueryParams] = useState({
    query: "",
    genres: "",
    language: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch movies with optional query and genre
  const fetchMovies = async (
    query = "",
    genres = [],
    language = "",
    page = 1
  ) => {
    setIsLoading(true);
    try {
      const url = new URL("http://127.0.0.1:5000/results");
      url.searchParams.set("query", query);
      genres.forEach((g) => url.searchParams.append("genre", g)); // support multiple genres
      url.searchParams.set("language", language);
      url.searchParams.set("page", page);
      url.searchParams.set("per_page", 20);

      // Add minimum loading time with Promise.all
      const [data] = await Promise.all([
        fetch(url).then((res) => res.json()),
        new Promise((resolve) => setTimeout(resolve, 100)), // minimum loading time
      ]);

      setMovies(data.movies);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setIsLoading(false); // Set loading false after fetch completes
    }
  };

  // Fetch movies whenever query/genre/page changes
  useEffect(() => {
    fetchMovies(
      queryParams.query,
      queryParams.genres,
      queryParams.language,
      currentPage
    );
  }, [queryParams, currentPage]);

  // When search or genre changes
  const handleSearch = ({ query, genres, language }) => {
    setIsLoading(true); // Set loading true before fetch
    setQueryParams({ query, genres, language }); // Update query
    setCurrentPage(1);

    console.log("Fetching Movies for Query" + query);
  };

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum); // Update the currentPage state
    // fetchMovies(query, pageNum);
    window.scrollTo({ top: 300, behavior: "smooth" });
    console.log("Page Change Triggered:" + pageNum);
  };

  return (
    <div className="content-wrapper py-10">
      <h1 className="text-3xl text-white font-bold mb-8 md:text-4xl">
        Browse Movies
      </h1>
      <SearchBar onSearch={handleSearch} />
      <MovieGrid title="Search Movies" movies={movies} isLoading={isLoading} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
