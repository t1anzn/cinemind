/**
 * MovieDetails Component
 *
 * Static information card displaying core movie metadata and ratings.
 * Features:
 * - Release date with formatted display using utility functions
 * - Runtime conversion to hours and minutes format
 * - Movie status and production information
 * - Color-coded user rating badge with dynamic styling
 * - Visual popularity indicator with progress bar
 * - Responsive card layout with gradient styling
 * - Consistent typography and spacing patterns
 *
 * Used in movie detail page sidebar for essential movie information.
 */

import * as movieDisplayUtils from "../utils/movieDisplayUtils";

export default function MovieDetails({ movie }) {
  return (
    <>
      <div className="bg-gradient-to-b from-slate-800/30 to-transparent shadow-md shadow-blue-400/50 border border-blue-100/50 rounded-lg p-6 pb-10 mb-4 h-fit">
        <h2 className="text-2xl text-white font-bold mb-4 mt-0">
          Movie Details
        </h2>
        <h3 className="text-sm text-slate-400 font-normal tracking-wider mb-1">
          Release Date
        </h3>
        <p className="text-white mb-4">
          {movieDisplayUtils.getReleaseFullDate(movie.release_date)}
        </p>
        <h3 className="text-sm text-slate-400 font-normal tracking-wider mb-1">
          Runtime
        </h3>
        <p className="text-white mb-4">
          {movie?.runtime && (
            <span>{movieDisplayUtils.formatRuntime(movie.runtime)}</span>
          )}
        </p>
        <h3 className="text-sm text-slate-400 font-normal tracking-wider mb-1">
          Status
        </h3>
        <p className="text-white mb-4">{movie.status}</p>
        <h3 className="text-sm text-slate-400 font-normal tracking-wider mb-1">
          User Rating
        </h3>
        {movie?.vote_average && (
          <div
            className={`inline-flex items-center text-[15px] px-1.5 py-0.5 font-extrabold tracking-wide mb-4 ${movieDisplayUtils.formatVoteBadge(
              parseFloat(movie.vote_average)
            )}`}
          >
            {parseFloat(movie.vote_average).toFixed(1)}{" "}
          </div>
        )}
        <h3 className="text-sm text-slate-400 font-normal tracking-wider mb-1">
          Popularity
        </h3>

        <p className="text-xs text-slate-300 font-light tracking-wide mb-1">
          {movieDisplayUtils.formatPopularityBar(movie.popularity)}
        </p>
        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-200 to-blue-500"
            style={{
              width: movieDisplayUtils.formatPopularityBar(movie.popularity),
            }}
          ></div>
        </div>
      </div>
    </>
  );
}
