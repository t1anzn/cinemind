/**
 * MovieHeader Component
 *
 * Hero section displaying movie title, backdrop, poster, and metadata.
 * Features:
 * - Full-height backdrop image with gradient overlay
 * - Error handling and fallback images for missing backdrops
 * - Responsive layout with mobile/desktop poster positioning
 * - Movie metadata display (rating, year, runtime, tagline)
 * - Color-coded rating badges using utility functions
 * - Debug information in development mode
 * - Graceful error handling for invalid movie data
 *
 * Used at the top of movie detail pages as the primary hero section.
 */

import MoviePoster from "./MoviePoster";
import * as movieDisplayUtils from "../utils/movieDisplayUtils";

export default function MovieHeader({ movie }) {
  console.log("MovieHeader received movie data:", movie); // Debug log

  // Check if movie object is valid
  if (!movie || typeof movie !== "object") {
    console.error("Invalid movie object received:", movie);
    return (
      <div className="relative h-[70vh] bg-slate-900" data-video-container>
        <div
          className="content-wrapper relative h-full flex items-center justify-center z-10"
          data-text-content
        >
          <div className="text-center">
            <h1 className="text-3xl text-white font-bold">
              Movie Data Unavailable
            </h1>
            <p className="text-slate-300 mt-2">
              Could not load movie information
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Handle null or singular link in the string with proper fallback
  const backdropUrls = movie.backdrop_url
    ? movie.backdrop_url.includes(",")
      ? movie.backdrop_url.split(",")
      : [movie.backdrop_url]
    : [];

  // Default backdrop image to use if none is available
  const defaultBackdrop =
    "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";

  // Safely get the first backdrop URL with trimming and fallback
  const backdropUrl =
    backdropUrls.length > 0 && backdropUrls[0]
      ? backdropUrls[0].trim()
      : defaultBackdrop;

  return (
    <div className="relative h-[70vh]" data-video-container>
      <div className="absolute inset-0">
        <div className="w-full h-full">
          <img
            className="w-full h-full object-cover overflow-hidden"
            src={backdropUrl}
            alt={movie.title || "Movie backdrop"}
            onError={(e) => {
              console.log("Image load error, using fallback");
              e.target.src = defaultBackdrop;
              e.target.onerror = null; // Prevent infinite error loop
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        </div>
      </div>

      {/* Debug information (hidden in production) */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute top-0 right-0 bg-black/75 text-xs text-white p-2 z-50">
          <div>Movie ID: {movie.id || "Unknown"}</div>
          <div>
            Data Status:{" "}
            {Object.keys(movie).length ? "Data present" : "Empty object"}
          </div>
        </div>
      )}

      <div
        className="content-wrapper relative h-full flex items-end pb-16 z-10"
        data-text-content
      >
        <div className="flex flex-col md:flex-row gap-8">
          <div className="hidden md:block w-64 flex-shrink-0">
            <MoviePoster movie={movie} />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">
              {movie.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-200 mb-4">
              {movie.vote_average && (
                <div
                  className={`inline-flex items-center text-[15px] px-1.5 py-0.5 font-extrabold tracking-wide ${movieDisplayUtils.formatVoteBadge(
                    parseFloat(movie.vote_average)
                  )}`}
                >
                  {parseFloat(movie.vote_average).toFixed(1)}
                </div>
              )}
              {movie.vote_count && <span>({movie.vote_count} votes)</span>}
              {movie.release_date && (
                <span>
                  {movieDisplayUtils.getReleaseYear(movie.release_date)}
                </span>
              )}
              {movie.runtime && (
                <span>{movieDisplayUtils.formatRuntime(movie.runtime)}</span>
              )}
            </div>
            {/* Movie Tagline */}
            <div class="text-slate-300 text-xl pt-2 tracking-wide">
              {movie.tagline}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
