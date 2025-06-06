/**
 * MoviePoster Component
 *
 * Responsive movie poster display with fixed width and shadow styling.
 * Hidden on mobile, visible on medium+ screens. Uses keyposter_url for optimized loading.
 *
 * Used in MovieHeader component as part of the hero section layout.
 */

export default function MoviePoster({ movie }) {
  return (
    <>
      {/* Movie Poster */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <div className="block overflow-hidden">
          <img
            className="w-full rounded-md shadow-xl"
            src={movie.keyposter_url}
            alt={`${movie.title} Poster`}
          />
        </div>
      </div>
    </>
  );
}
