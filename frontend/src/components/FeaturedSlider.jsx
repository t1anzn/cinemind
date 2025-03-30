import React, { useState, useEffect } from 'react';

export default function FeaturedSlider() { 

    const movies = [
        {
          id: 1,
          title: "Inception",
          genre: "Sci-Fi, Action",
          vote_average: 8.8,
          release_year: 2010,
          overview: "A thief who enters the dreams of others to steal secrets must plant an idea in a target's subconscious.",
          backdropUrl: "/images/inception.jpg",
        },
        {
          id: 2,
          title: "Blade Runner 2045",
          genre: "Sci-Fi, Thriller",
          vote_average: 8.0,
          release_year: 2017,
          overview: "A young blade runner discovers a secret that could destabilize society.",
          backdropUrl: "/images/bladerunner2045.jpg",
        },
        {
          id: 3,
          title: "Interstellar",
          genre: "Sci-Fi, Adventure",
          vote_average: 8.6,
          release_year: 2014,
          overview: "A team of explorers travel through a wormhole in space to ensure humanity's survival.",
          backdropUrl: "/images/interstellar.jpg",
        }
      ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const currentMovie = movies[currentIndex];

    const goToPrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? movies.length - 1 : prevIndex - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === movies.length - 1 ? 0 : prevIndex + 1));
        
    };


    return (
        <>
        <div className="relative h-[75vh] overflow-hidden">
            
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-black via-black/90 to-black/80"></div>
                <div className="absolute inset-0 z-10 transition-opacity duration-1000">
                    <img
                    src={currentMovie.backdropUrl}
                    alt={`${currentMovie.title} backdrop`}
                    className="w-full h-full object-cover opacity-50"
                    />
                </div>
      
                {/* Content */}
                <div className="absolute inset-0 flex items-end pb-16 px-8 z-20">
                    <div className="bg-black/60 p-6 rounded-lg max-w-2xl">
                    <h1 className="text-4xl font-light text-white mb-3">{currentMovie.title}</h1>
                    <div className="text-cyan-400 text-sm mb-2">{currentMovie.genre}</div>
                    <div className="text-slate-300 text-sm mb-2">{currentMovie.release_year}</div>
                    <p className="text-slate-300 text-sm">{currentMovie.overview}</p>
                    </div>
                </div>
      
                {/* Navigation */}
                <button onClick={goToPrev} className="absolute left-5 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full z-50">❮</button>
                <button onClick={goToNext} className="absolute right-5 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full z-50">❯</button>
            </div>
        </>
    )
}
