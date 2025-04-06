import React from "react";

export default function MoviePoster({ movie }) {
  return (
    <>
      {/* Movie Poster */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <div className="block overflow-hidden">
          <img
            className="w-full rounded-md shadow-xl"
            src={movie.poster_url}
            alt={`${movie.title} Poster`}
          />
        </div>
      </div>
    </>
  );
}
