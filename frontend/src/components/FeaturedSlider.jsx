import React, { useState, useEffect } from 'react';

export default function FeaturedSlider() { 
    const [movies, setMovies] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        fetch("http://127.0.0.1:5000/featured")
            .then((response) => response.json())
            .then((data) => {
                console.log("Fetched movies:", data);
                setMovies(data);
                setCurrentIndex(0);
            })
            .catch((error) => console.error("Error fetching movies:", error));
    }, []);


    if (movies.length === 0) {
        return <h1> Loading...</h1>
    }

    const currentMovie = movies[currentIndex];
    console.log("Current movie:", currentMovie.title)

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

                </div>
      
                {/* Content */}
                <div className="absolute inset-0 flex items-end pb-16 px-8 z-20">
                    <div className="bg-black/60 p-6 rounded-lg max-w-2xl">
                    <h1 className="text-4xl font-light text-white mb-3">{currentMovie.title}</h1>
                    <div className="text-cyan-400 text-sm mb-2">{currentMovie.genres && currentMovie.genres.join(', ')}</div>
                    <div className="text-slate-300 text-sm mb-2">{currentMovie.release_date}</div>
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
