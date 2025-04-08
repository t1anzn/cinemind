import React from "react";

export default function MoviePoster({ movie }) {
  // Handle null, single entry, or multiple poster_url values
  const posterUrls = movie.poster_url
    ? movie.poster_url.includes(",")
      ? movie.poster_url
          .split(",")
          .map((url) => url.trim())
          .slice(0, 10)
      : [movie.poster_url.trim()] // Wrap single entry in an array
    : [];

  return (
    <>
      {/* Movie Poster */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <div className="block overflow-hidden">
          <img
            className="w-full rounded-md shadow-xl"
            src={posterUrls[0].trim()} // Use first URL and trim
            alt={`${movie.title} Poster`}
          />
        </div>
      </div>
    </>
  );
}
