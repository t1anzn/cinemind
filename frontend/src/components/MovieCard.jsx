import * as movieDisplayUtils from "../../src/utils/movieDisplayUtils"

export default function MovieCard( { movie }){

        // Format Movie release year
        const getReleaseYear = (dateString) => {
            if(!dateString) return 'Unknown';
            try {
                return new Date(dateString).getFullYear();
            } catch (error) {
                return 'Unknown';
            }
        };

    return (
        <>
            <a href={`/movie/${movie.id}`} className="movie-card block group relative">
                {/* Card Container */}
                <div className="relative rounded-sm overflow-hidden transition-all duration-100 shadow-lg shadow-black/50 group-hover:shadow-xl group-hover:shadow-cyan-900/10 border border-slate-800/50 group-hover:border-cyan-800/20">
                
                    {/* Hover Shadow Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                    </div>

                    {/* Movie Poster */}
                    <div className="h-[350px] w-full relative bg-slate-900">
                    <img src={movie.poster_url} alt="Movie Poster" className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>


                </div>

                {/* Movie Info */}
                <div className="py-3 px-1 space-y-1">


                        <span><h3 className="font-light text-white/90 text-sm truncate tracking-wide group-hover:text-cyan-300 transition-colors duration-300">{movie.title}</h3></span>
                        
                        <div className={`inline-flex items-center text-[10px] px-1.5 py-0.5 font-extrabold tracking-wide
                            ${movieDisplayUtils.formatVoteBadge(movie.vote_average)}
                                `}>
                            {movie.vote_average}
                        </div>
                        <span><p className="inline-flex ml-2 text-sm font-light text-slate-400/80 tracking-wider">{getReleaseYear(movie.release_date)}</p></span>
                        
                        
                            
                </div>
            </a>
        </>

    )
}