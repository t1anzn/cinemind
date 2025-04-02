import React, { useState, useEffect } from 'react';

export default function FeaturedSlider({ featuredMovies=[] }) { 
    const [currentIndex, setCurrentIndex] = useState(0);

    if (featuredMovies.length === 0) {
        return <h1> Loading...</h1>
    }

    const currentMovie = featuredMovies[currentIndex];
    console.log("Current movie:", currentMovie)

    const goToPrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? featuredMovies.length - 1 : prevIndex - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === featuredMovies.length - 1 ? 0 : prevIndex + 1));
        
    };

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
        <div className="relative h-[75vh] overflow-hidden">
            
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-black via-black/90 to-black/80"></div>
                <div className="absolute inset-0 z-10 transition-opacity duration-1000">

                </div>
      
                {/* Content */}
                <div className="content-wrapper relative h-full flex items-end pb-20 z-20">
                    <div className="bg-black/60 p-6 rounded-lg max-w-2xl">
                        <h1 className="text-5xl font-extralight text-white mb-3 tracking-wider">{currentMovie.title}</h1>
                        
                        {/* Vote Average and Release Year */}
                        <div className="flex flex-wrap items-center space-x-4 mb-5 mt-5">
                            <div className="inline-flex items-center text-sm px-2 py-1 font-extrabold tracking-wide bg-cyan-700 text-white"> {currentMovie.vote_average} </div>
                            <span className="text-sm tracking-wide font-light text-slate-400">{getReleaseYear(currentMovie.release_date)}</span>
                        </div>

                        {/* Overview and Genres */}
                        <div className="text-cyan-400 text-sm mb-2">{currentMovie.genres && currentMovie.genres.join(', ')}</div>
                        <p className="text-slate-300/90 mb-6 text-sm max-w-2xl tracking-wide font-light leading-relaxed line-clamp-3">{currentMovie.overview}</p>

                        {/* Action Buttons */}
                        <div className="flex space-x-4">
                            <a href="#" className="group relative inline-flex items-center text-white text-md font-light tracking-wider px-4 py-2 bg-gradient-to-r from-cyan-900/80 to-blue-900/80 rounded-sm border border-cyan-800/50 hover:from-cyan-700/90 hover:to-blue-800/80 transition-colors duration-300 overflow-hidden">
                                <span>VIEW DETAILS</span>
                            </a>
                            <a href='#' className="group relative inline-flex items-center bg-black/30 text-white/70 text-md font-light tracking-wider px-4 py-2 border rounded-sm border-slate-700/30 hover:border-slate-600/50 hover:text-white transition-all duration-300 backdrop-blur-sm">
                                <span>EXPLORE SIMILAR</span>
                            </a>
                        </div>
                        {/* Movie Data Visualization */}
                        <div className="mt-8 grid grid-cols-3 gap-10 max-w-md">
                            {currentMovie.popularity && (
                                <div className="space-y-1">
                                    <div className="text-xs text-slate-500 font-light tracking-wider">POPULARITY</div>
                                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                                        style={{ width: `${Math.min(100, currentMovie.popularity/10)}%` }}></div>
                                        </div>
                                </div>
                            )}

                            {currentMovie.runtime && (
                                <div className="space-y-1">
                                    <div className="text-xs text-slate-500 font-light  tracking-wider">RUNTIME</div>
                                    <div className="text-slate-300 text-sm font-light">
                                        {/* Convert runtime from minutes to hours and minutes */}
                                        {Math.floor(currentMovie.runtime / 60)}H {currentMovie.runtime % 60}M
                                    </div>
                                </div>
                            )}

                            {currentMovie.original_language && (
                                <div className="space-y-1">
                                    <div className="text-xs text-slate-500 font-light tracking-wider">LANGUAGE</div>
                                    <div className="text-slate-300 text-sm font-light">
                                        {currentMovie.original_language.toUpperCase()}
                                    </div>
                                </div>
                            )}
                        </div>
                        
                    </div>

                </div>
      
                {/* Navigation */}
                <button onClick={goToPrev} className="absolute left-5 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full z-50">❮</button>
                <button onClick={goToNext} className="absolute right-5 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full z-50">❯</button>
            </div>
        </>
    )
}
