import { useEffect, useState } from "react";
import MovieGrid from "./MovieGrid";
import Pagination from "./Pagination";
import SearchBar from "./SearchBar";

export default function MoviePage() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [queryParams, setQueryParams] = useState({
    query: "",
    genres: [],
    language: "",
    sort_by: "popularity",
    order: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  console.log();
  // Fetch movies with optional query and genre
  const fetchMovies = async (page = 1) => {
    setIsLoading(true);
    try {
      const url = new URL("http://127.0.0.1:5000/results");
      url.searchParams.set("query", queryParams.query);
      queryParams.genres.forEach((g) => url.searchParams.append("genre", g));
      url.searchParams.set("language", queryParams.language);
      url.searchParams.set("sort_by", queryParams.sort_by);
      url.searchParams.set("order", queryParams.order);
      url.searchParams.set("page", page);
      url.searchParams.set("per_page", 20);

      // Add minimum loading time with Promise.all
      const [data] = await Promise.all([
        fetch(url).then((res) => res.json()),
        new Promise((resolve) => setTimeout(resolve, 700)), // minimum loading time
      ]);

      setMovies(data.movies);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setIsLoading(false); // Set loading false after fetch completes
    }
  };

  // Update effect to only depend on page changes
  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage, queryParams]); // Add queryParams as dependency

  // When search or filters change
  const handleSearch = (params) => {
    setCurrentPage(1); // Reset to first page
    setQueryParams(params); // Update all query params at once
  };

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum); // Update the currentPage state
    // fetchMovies(query, pageNum);
    window.scrollTo({ top: 300, behavior: "smooth" });
    console.log("Page Change Triggered:" + pageNum);
  };

  return (
    <div className="content-wrapper w-full max-w-full py-10">
      <h1 className="text-3xl text-white font-bold mb-8 md:text-4xl">
        Browse Movies
      </h1>
      <SearchBar onSearch={handleSearch} />
      <div className="w-full max-w-full overflow-x-auto">
        <MovieGrid
          title="Search Movies"
          movies={movies}
          isLoading={isLoading}
        />
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
