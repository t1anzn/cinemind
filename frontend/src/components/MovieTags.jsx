export default function MovieTags({ movie }) {
  return (
    <>
      <div class="bg-gradient-to-b from-slate-800/30 to-transparent shadow-md shadow-blue-400/50 border border-blue-100/50 rounded-lg p-6 pb-10 mb-4 h-fit">
        <h3 class="text-sm text-slate-400 font-normal tracking-wider mb-3">
          Genres
        </h3>

        <div class="flex flex-wrap space-x-2 space-y-2 mb-4">
          {movie.genres &&
            movie.genres.map((genre, index) => (
              <span class="inline-flex items-center justify-center bg-gradient-to-b from-blue-600/20 to-transparent text-white text-xs font-semibold py-1 px-3 rounded-xl border-1 border-blue-400/50 h-8 min-h-[32px] hover:bg-cyan-500 transition-all duration-300">
                {genre}
              </span>
            ))}
        </div>
        <h3 class="text-sm text-slate-400 font-normal tracking-wider mb-3">
          Keywords
        </h3>
        <div class="flex flex-wrap space-x-2 space-y-2">
          {movie.keywords &&
            movie.keywords.map((keyword, index) => (
              <span class="inline-flex items-center justify-center bg-gradient-to-b from-slate-600/50 to-slate-600/20 border border-slate-600/30 text-white tracking-wider text-xs font-light py-1 px-3 rounded-xl h-8 min-h-[32px] hover:bg-slate-300/50 transition-all duration-300">
                {keyword}
              </span>
            ))}
        </div>
      </div>
    </>
  );
}
