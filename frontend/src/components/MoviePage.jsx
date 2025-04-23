import { useEffect, useState } from "react";
import MovieGrid from "./MovieGrid";
import Pagination from "./Pagination";
import SearchBar from "./SearchBar";
import MovieAnalytics from "./MovieAnalytics";

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
  const [activeTab, setActiveTab] = useState("movies");
  // Analytics data states
  const [analyticsData, setAnalyticsData] = useState([]);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  // Genre data for analytics
  const [genreMap, setGenreMap] = useState({});
  const [moviesWithGenres, setMoviesWithGenres] = useState([]);

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

  // Fetch all genres to create a mapping of genre IDs to names
  const fetchGenres = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/genres");
      const genres = await response.json();

      // Create a mapping of genre ID to genre name
      const mapping = {};
      genres.forEach((genre) => {
        mapping[genre.id] = genre.name;
      });

      setGenreMap(mapping);
      return mapping;
    } catch (error) {
      console.error("Error fetching genres:", error);
      return {};
    }
  };

  // Fetch movie genres for each movie in the analytics data
  const fetchMovieGenres = async (movies, genreMapping) => {
    try {
      const moviesWithGenreData = await Promise.all(
        movies.map(async (movie) => {
          try {
            const response = await fetch(
              `http://127.0.0.1:5000/movies/${movie.id}`
            );
            const fullMovieData = await response.json();

            return {
              ...movie,
              genres: fullMovieData.genres || [],
            };
          } catch (err) {
            console.warn(`Could not fetch genres for movie ${movie.id}`, err);
            return movie;
          }
        })
      );

      setMoviesWithGenres(moviesWithGenreData);
      return moviesWithGenreData;
    } catch (error) {
      console.error("Error fetching movie genres:", error);
      return movies;
    }
  };

  // Fetch top rated movies for analytics
  const fetchAnalyticsData = async () => {
    if (analyticsData.length > 0) return; // Avoid fetching if already fetched

    setIsLoadingAnalytics(true);
    try {
      // 1. First, fetch genre mapping
      const genreMapping = await fetchGenres();

      // 2. Fetch movie data
      const url = new URL("http://127.0.0.1:5000/results");
      url.searchParams.set("query", ""); // Empty query to get all movies
      url.searchParams.set("sort_by", "vote_average"); // Sort by rating
      url.searchParams.set("order", "desc"); // Highest rated first
      url.searchParams.set("page", 1); // First page
      url.searchParams.set("per_page", 1000); // Get 1000 results

      const response = await fetch(url);
      const data = await response.json();
      const movies = data.movies || [];

      setAnalyticsData(movies);

      // 3. Fetch genre data for each movie and enhance the movie objects
      fetchMovieGenres(movies, genreMapping);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  // Update effect to only depend on page changes
  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage, queryParams]); // Add queryParams as dependency

  // Fetch analytics data when the tab is switched to "analytics"
  useEffect(() => {
    if (activeTab === "analytics") {
      fetchAnalyticsData();
    }
  }, [activeTab]);

  // When search or filters change
  const handleSearch = (params) => {
    setCurrentPage(1); // Reset to first page
    setQueryParams(params); // Update all query params at once
  };

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum); // Update the currentPage state
    window.scrollTo({ top: 300, behavior: "smooth" });
    console.log("Page Change Triggered:" + pageNum);
  };

  // Handle tab switching
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="content-wrapper w-full max-w-full py-10">
      <h1 className="text-3xl text-white font-bold mb-8 md:text-4xl">
        Browse Movies
      </h1>

      {/* Tab Navigation */}
      <div className="flex mb-6 border-b border-gray-700">
        <button
          className={`px-4 py-2 font-light text-xl tracking-wide ${
            activeTab === "movies"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => handleTabChange("movies")}
        >
          MOVIES
        </button>
        <button
          className={`px-4 py-2 font-light text-xl tracking-wide ${
            activeTab === "analytics"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => handleTabChange("analytics")}
        >
          ANALYTICS
        </button>
      </div>

      {activeTab === "movies" ? (
        <>
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
        </>
      ) : (
        <MovieAnalytics
          analyticsData={
            moviesWithGenres.length > 0 ? moviesWithGenres : analyticsData
          }
          isLoading={isLoadingAnalytics}
          genreMap={genreMap}
        />
      )}
    </div>
  );
}
