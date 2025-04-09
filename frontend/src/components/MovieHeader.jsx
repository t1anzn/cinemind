import MoviePoster from "./MoviePoster";
import * as movieDisplayUtils from "../utils/movieDisplayUtils";

export default function MovieHeader({ movie }) {
  // Handle null or singular link in the string
  const backdropUrls = movie.backdrop_url
    ? movie.backdrop_url.includes(",")
      ? movie.backdrop_url.split(",")
      : [movie.backdrop_url]
    : [];

  return (
    <div className="relative h-[70vh]">
      <div className="absolute inset-0 bg-black">
        <div className="w-full h-full">
          <img
            className="w-full h-full object-cover overflow-hidden"
            src={backdropUrls[0].trim()}
            alt={movie.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-black/60"></div>
        </div>
      </div>
      <div className="content-wrapper relative h-full flex items-end pb-16 z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="hidden md:block w-64 flex-shrink-0">
            <MoviePoster movie={movie} />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">
              {movie.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-400 mb-4">
              {movie.vote_average && (
                <div
                  className={`inline-flex items-center text-[15px] px-1.5 py-0.5 font-extrabold tracking-wide ${movieDisplayUtils.formatVoteBadge(
                    parseFloat(movie.vote_average)
                  )}`}
                >
                  {parseFloat(movie.vote_average).toFixed(1)}{" "}
                  {/* Format display to 1 decimal */}
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
