/**
 * MovieOverview Component
 *
 * Content section displaying movie synopsis, cast, and production details.
 * Features:
 * - Movie plot overview with formatted typography
 * - Includes the CastSlider component for displaying cast members
 * - Production information (language, countries, spoken languages)
 * - Responsive column layout for mobile/desktop
 * - Consistent spacing and typography hierarchy
 * - Integration with cast details from API data
 * - Fallback handling for missing cast information
 *
 * Used in movie detail pages as the main content area.
 */

import CastSlider from "./CastSlider";

export default function MovieOverview({ movie }) {
  return (
    <div className="col-span-1 md:col-span-2">
      <h2 className="text-2xl text-white font-bold mb-4">Overview</h2>
      <p className="text-white text-lg font-light mb-4">{movie.overview}</p>
      <h3 className="text-xl text-white font-bold mb-0 mt-8">Cast</h3>
      <div className="flex flex-wrap gap-2">
        <CastSlider cast={movie.cast_details || []} client:only />
      </div>
      <div className="flex flex-nowrap items-start space-x-16 text-slate-400 mt-6 mb-4">
        <div>
          <h3 className="text-xl whitespace-nowrap text-white font-bold mb-4">
            Original Language
          </h3>
          <p className="text-white font-light text-xl mb-10">
            {movie.original_language.toUpperCase()}
          </p>
        </div>
        <div>
          <h3 className="text-xl whitespace-nowrap text-white font-bold mb-4">
            Production Countries
          </h3>
          <p className="text-white font-light text-xl mb-10">
            {movie.production_countries.join(", ")}
          </p>
        </div>
        <div>
          <h3 className="text-xl whitespace-nowrap text-white font-bold mb-4">
            Spoken Languages
          </h3>
          <p className="text-white font-light text-xl mb-10">
            {movie.spoken_languages.join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
}
