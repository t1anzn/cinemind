import React, { useState, useEffect, useRef } from 'react';
import { extractYouTubeId } from '../utils/youtubeUtils';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';
import { getReleaseYear, formatVoteBadge } from '../utils/movieDisplayUtils';

export default function FeaturedSlider({ featuredMovies=[] }) { 
    const [currentIndex, setCurrentIndex] = useState(0);
    const playerRef = useRef(null);
    const playerContainerRef = useRef(null);
    const intervalRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true)   

    
    if (featuredMovies.length === 0) {
        return <h1> Loading...</h1>
    }

    const currentMovie = featuredMovies[currentIndex];
    const currentMovieId = extractYouTubeId(currentMovie.video_url);

    // Button handlers
    const goToPrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? featuredMovies.length - 1 : prevIndex - 1));
    };
    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === featuredMovies.length - 1 ? 0 : prevIndex + 1));
    };

    // Load YouTube Iframe API if not already loaded
    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        // Clean up player when component unmounts
        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, []);

    // Function to initialize the player
    const initializePlayer = () => {
        const start = currentMovie.snippetStart || 10;  
        const end = currentMovie.snippetEnd || 50;  

        // Destroy previous player if it exists
        if(playerRef.current) {  
            playerRef.current.destroy();
        }
        
        // Create a new player instance  
        playerRef.current = new window.YT.Player('player', {
            videoId: currentMovieId,
            playerVars: {
                autoplay: 1,
                controls: 0,
                showinfo: 0,
                rel: 0,
                start: start,
                end: end,
                mute: isMuted ? 1 : 0, //Mute if isMuted is true
            },
            events: {
                onReady: (event) => {
                    event.target.playVideo();
                    if (isMuted) { 
                        event.target.mute();
                    } else { 
                        event.target.unMute();
                    }

                    // Set up the interval to loop the video
                    intervalRef.current = setInterval(() => {
                        const currentTime = event.target.getCurrentTime();
                        if (currentTime >= end) {
                            event.target.seekTo(start); // Loop back to start   
                        }
                    }, 50);
                },
            },
        });
    };

      // Effect to handle movie change and YouTube API readiness
      useEffect(() => {
        const checkYTReady = () => { 
            if(window.YT && window.YT.Player) { 
                initializePlayer();  
            } else { 
                setTimeout(checkYTReady, 100); // Retry if not ready
            }
            
        };

        checkYTReady(); // Run the check to initialize the player

        // Cleanup when the movie changes or component unmounts
        return () => { 
            if(intervalRef.current) {
                clearInterval(intervalRef.current); 
            }
            if(playerRef.current) { 
                playerRef.current.destroy(); // Destroy player instance on unmount  
            }
        };
      }, [currentMovie]);     

      // Mute Toggle whilst playing  
      const toggleMute = () => { 
        if(playerRef.current) {  
            const player = playerRef.current; 
            if(isMuted) {  
                player.unMute(); 
            } else { 
                player.mute();
            }
        }
        setIsMuted(!isMuted); // Toggle mute state
      };




    return (
        <>
        <div className="relative h-[75vh] overflow-hidden">

            {/* Slider Background */}
            <div className="absolute inset-0 z-10 transition-opacity duration-1000">
                <div className="relative w-full h-full overflow-hidden">
                    {/* Backdrop Image */}
                    {/* <img
                    src={"https://cdn2.nbcuni.com/NBCUniversal/2024-07/dm4-blogroll-1719790355961.jpg?VersionId=o81CDkGmYnsyvA6FTQlECKrTeIOuISdk"}
                    alt={`${currentMovie.title} Backdrop Image`}
                    className={"w-full h-full object-cover scale-110"}
                    /> */}
                    {/* <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/watch?v=-9HT0l9HV4c"
                            frameBorder="0"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full object-cover"
                            title="Movie Trailer"
                        ></iframe> */}

                        {/* <iframe
                            width="100%"
                            height="100%" 
                            src="https://www.youtube.com/embed/jc86EFjLFV4?start=10&autoplay=1&loop=1&playlist=jc86EFjLFV4&rel=0&modestbranding=1&controls=0&showinfo=0"
                            title="YouTube video player"
                            frameborder="0"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;"
                            referrerpolicy="strict-origin-when-cross-origin"
                            className="w-full h-full object-cover scale-140"
                            allowfullscreen>
                        </iframe> */}

                        <div id="player" ref={playerContainerRef} className="w-full h-full scale-150"></div>

                    {/* Background Effects */}
                    <div className="absolute inset-0 z-0 bg-gradient-to-b from-black-30 via-transparent to-black/50"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80"></div>
                </div>
            </div>


                {/* Movie Content */}
                <div className="content-wrapper relative h-full flex items-end pb-20 z-20">
                    <div className="p-6 rounded-lg max-w-2xl">
                        <h1 className="text-5xl font-extralight text-white mb-3 tracking-wider">{currentMovie.title}</h1>
                        
                        {/* Vote Average and Release Year */}
                        <div className="flex flex-wrap items-center space-x-4 mb-5 mt-5">
                            {currentMovie?.vote_average && (
                            <div
                            class={`inline-flex items-center text-[15px] px-1.5 py-0.5 font-extrabold tracking-wide ${formatVoteBadge(currentMovie.vote_average)}`}
                            >
                            {currentMovie.vote_average}
                            </div>
                            )}
                            <span className="text-sm tracking-wide font-light text-slate-400">{getReleaseYear(currentMovie.release_date)}</span>
                        </div>

                        {/* Overview and Genres */}
                        <div className="text-cyan-400 text-sm mb-2">{currentMovie.genres && currentMovie.genres.join(', ')}</div>
                        <p className="text-slate-300/90 mb-6 text-sm max-w-2xl tracking-wide font-light leading-relaxed line-clamp-3">{currentMovie.overview}</p>

                        {/* Action Buttons */}
                        <div className="flex space-x-4">
                                <a href={`/movie/${currentMovie.id}`} className="group relative inline-flex items-center text-white text-md font-light tracking-wider px-4 py-2 bg-gradient-to-r from-cyan-900/80 to-blue-900/80 rounded-sm border border-cyan-800/50 hover:from-cyan-700/90 hover:to-blue-800/80 transition-colors duration-300 overflow-hidden">
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
                <button onClick={goToPrev} className="absolute left-5 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white hover:text-cyan-500 hover:bg-black border border-slate-700/30 hover:border-cyan-700 hover:border-2 backdrop-blur-sm rounded-full transition-all duration:300 z-50 ">❮</button>
                <button onClick={goToNext} className="absolute right-5 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white hover:text-cyan-500 hover:bg-black border border-slate-700/30 hover:border-cyan-700 hover:border-2 backdrop-blur-sm rounded-full transition-all duration:300 z-50 ">❯</button>

                {/* Toggle Mute Button */} 
                <button onClick={toggleMute}   
                        className="absolute bottom-5 right-5 p-3 bg-black/50 text-white hover:text-cyan-500 hover:bg-black border border-slate-700/30 hover:border-cyan-700 hover:border-2 backdrop-blur-sm rounded-full transition-all duration:300 z-50"
                >
                    {isMuted ? 
                    <SpeakerXMarkIcon className="h-6 w-6"/>
                     :
                    <SpeakerWaveIcon className="h-6 w-6"/>
                    }
                </button>
            </div>
        </>
    )
}
