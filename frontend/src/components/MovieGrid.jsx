import { FilmIcon } from '@heroicons/react/24/solid';
import MovieCard from './MovieCard';

export default function MovieGrid({title}){
    return (
        <>
            <div className="py-8 relative space-y-8 ">
                {title &&(
                    <div className="relative">
                        <h2 className="text-2xl font-light tracking-wider text-white/90 pb-4 border-b border-cyan-900/30 flex items-center">
                            <span className="bg-cyan-500/10 text-cyan-400 w-8 h-8 inline-flex items-center justify-center rounded-full mr-3 shadow-inner shadow-cyan-900/10">
                                <FilmIcon className="h-4 w-4" />
                            </span>
                            {title}
                        </h2>
                    </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-8">
                    <MovieCard />
                    <MovieCard />
                    <MovieCard />
                    <MovieCard />
                    <MovieCard />
                    <MovieCard />
                    <MovieCard />
                    <MovieCard />
                    <MovieCard />
                    <MovieCard />
                </div>
                
            </div>
        </>
    )
}