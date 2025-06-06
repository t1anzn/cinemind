/**
 * MovieCardSkeleton Component
 *
 * Loading skeleton placeholder for MovieCard components during data fetching.
 * Features:
 * - Animated pulse effect for visual feedback
 * - Matches exact dimensions and layout of MovieCard
 * - Maintains 2:3 aspect ratio for poster area
 * - Gradient shimmer animation overlay
 * - Placeholder blocks for title and year text
 * - Consistent spacing and styling with actual cards
 * - Smooth opacity transitions for loading states
 *
 * Used in MovieGrid components while movies are being loaded from API.
 */

export default function MovieCardSkeleton() {
  return (
    <div className="animate-pulse group relative min-h-[400px] transition-opacity duration-300 ease-in-out">
      {/* Keep same wrapper as MovieCard */}
      <div className="relative overflow-hidden rounded-lg shadow-md">
        {/* Maintain exact poster dimensions */}
        <div className="aspect-[2/3] w-full min-h-[350px] bg-slate-700/50">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-600/10 to-transparent" />
        </div>
      </div>

      {/* Content area with exact spacing */}
      <div className="mt-4">
        {/* Title skeleton */}
        <div className="h-5 bg-slate-600/50 rounded-md w-[85%] mb-2"></div>
        {/* Year skeleton */}
        <div className="h-4 bg-slate-600/50 rounded-md w-[40%]"></div>
      </div>
    </div>
  );
}
