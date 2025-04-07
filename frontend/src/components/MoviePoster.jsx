import React from "react";

export default function MoviePoster({ movie }) {
  // Split string of URLs into an array and limit to a reasonable number
  const posterUrls = movie.poster_url.split(","); // Limit to the first 10 URLs

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
