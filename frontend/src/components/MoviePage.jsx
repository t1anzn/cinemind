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

  // Fetch movies with all filters
  const fetchMovies = async (
    query = "",
    genres = [],
    language = "",
    page = 1,
    sort_by = "popularity",
    order = "desc"
  ) => {
    setIsLoading(true);
    try {
      const url = new URL("http://127.0.0.1:5000/results");
      url.searchParams.set("query", query);
      genres.forEach((g) => url.searchParams.append("genre", g));
      url.searchParams.set("language", language);
      url.searchParams.set("sort_by", sort_by);
      url.searchParams.set("order", order);
      url.searchParams.set("page", page);
      url.searchParams.set("per_page", 20);

      const [data] = await Promise.all([
        fetch(url).then((res) => res.json()),
        new Promise((resolve) => setTimeout(resolve, 100)),
      ]);

      setMovies(data.movies);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const { query, genres, language, sort_by, order } = queryParams;
    fetchMovies(query, genres, language, currentPage, sort_by, order);
  }, [queryParams, currentPage]);

  const handleSearch = ({ query, genres, language, sort_by, order }) => {
    setIsLoading(true);
    setQueryParams({ query, genres, language, sort_by, order });
    setCurrentPage(1);
    console.log("Search triggered with:", query, genres, language, sort_by, order);
  };

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    window.scrollTo({ top: 300, behavior: "smooth" });
    console.log("Page Change Triggered:", pageNum);
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
