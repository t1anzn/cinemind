import { FilmIcon } from "@heroicons/react/24/solid";
import MovieCard from "./MovieCard";
import MovieCardSkeleton from "./MovieCardSkeleton";
import { useEffect } from "react";

export default function MovieGrid({
  title,
  tagline,
  movies = [],
  isLoading = false,
}) {
  const skeletonArray = Array(20).fill(null);

  return (
    <>
      <div className="py-8 relative space-y-8">
        {title && (
          <div className="relative space-y-2">
            <h2 className="text-2xl font-light tracking-wider text-white/90 flex items-center">
              <span
                className="bg-gradient-to-br from-cyan-600 to-blue-500 text-white
              w-10 h-10 inline-flex items-center justify-center rounded-full mr-3 
              shadow-lg shadow-cyan-900/20 backdrop-blur-sm"
              >
                <FilmIcon className="h-5 w-5" />
              </span>
              {title}
            </h2>
            {tagline && (
              <p className="text-slate-400 text-sm ml-11 pb-4 border-b border-cyan-900/30 font-light tracking-wide">
                {tagline}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-8 min-h-[800px]">
          {isLoading
            ? skeletonArray.map((_, index) => (
                <div key={`skeleton-${index}`} className="min-h-[400px]">
                  <MovieCardSkeleton />
                </div>
              ))
            : movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        </div>
      </div>
    </>
  );
}
