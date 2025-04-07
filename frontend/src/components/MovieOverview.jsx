export default function MovieOverview({ movie }){
  return (
    <div className="col-span-1 md:col-span-2">
      <h2 className="text-2xl text-white font-bold mb-4">Overview</h2>
      <p className="text-white text-lg font-light mb-4">{movie.overview}</p>
      <h3 className="text-xl text-white font-bold mb-4">Cast</h3>
      <div className="flex flex-wrap gap-2">
        {movie.cast &&
          movie.cast.map((actor, index) => (
            <span
              key={index}
              className="inline-flex items-center justify-center bg-gradient-to-b from-slate-800/50 to-transparent text-white text-sm font-light py-1 px-3 rounded-lg border-1 border-gray-600"
            >
              {actor}
            </span>
          ))}
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
};