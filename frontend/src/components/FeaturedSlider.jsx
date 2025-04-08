import React, { useState, useEffect, useRef } from "react";
import { extractYouTubeId } from "../utils/youtubeUtils";
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/solid";
import YouTubePlayer from "./YouTubePlayer.jsx";
import {
  getReleaseYear,
  formatVoteBadge,
  formatPopularityBar,
} from "../utils/movieDisplayUtils.jsx";

export default function FeaturedSlider({ featuredMovies = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const intervalRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(100);

  if (featuredMovies.length === 0) {
    return <h1> Loading...</h1>;
  }

  const currentMovie = featuredMovies[currentIndex];
  const videoUrls = currentMovie.video_url.split(","); // Split video_url into an array
  const currentMovieId = extractYouTubeId(videoUrls[0].trim()); // Use the first valid YouTube ID

  // Button handlers
  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? featuredMovies.length - 1 : prevIndex - 1
    );
  };
  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === featuredMovies.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <>
      <div className="relative h-[75vh] overflow-hidden">
        {/* Slider Background */}
        <div className="absolute inset-0 z-10 transition-opacity duration-1000">
          <div className="relative w-full h-full overflow-hidden">
            <YouTubePlayer
              videoId={currentMovieId}
              start={currentMovie.snippetStart || 10}
              end={currentMovie.snippetEnd || 50}
              isMuted={isMuted}
              setIsMuted={setIsMuted}
              containerClassName="w-full h-full scale-150"
              rel={0}
              controls={1}
              fs={0}
            />

            {/* Background Effects */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-black-30 via-transparent to-black/50"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80"></div>
          </div>
        </div>

        {/* Movie Content */}
        <div className="content-wrapper relative h-full flex items-end pb-20 z-20">
          <div className="p-6 rounded-lg max-w-2xl">
            <h1 className="text-5xl font-extralight text-white mb-3 tracking-wider">
              {currentMovie.title}
            </h1>

            {/* Vote Average and Release Year */}
            <div className="flex flex-wrap items-center space-x-4 mb-5 mt-5">
              {currentMovie?.vote_average && (
                <div
                  className={`inline-flex items-center text-[15px] px-1.5 py-0.5 font-extrabold tracking-wide ${formatVoteBadge(
                    currentMovie.vote_average
                  )}`}
                >
                  {currentMovie.vote_average}
                </div>
              )}
              <span className="text-sm tracking-wide font-light text-slate-400">
                {getReleaseYear(currentMovie.release_date)}
              </span>
            </div>

            {/* Overview and Genres */}

            {/* <div className="text-cyan-400 text-sm mb-2">{currentMovie.genres && currentMovie.genres.join(', ')}</div> */}

            {/* Movie Genres List */}
            <div className="flex flex-wrap space-x-2 space-y-2">
              {currentMovie.genres &&
                currentMovie.genres.map((genre, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center justify-center bg-gradient-to-b from-blue-500/50 to-blue-500/30 border-1 border-cyan-400/30 backdrop-blur-sm text-white text-xs font-semibold py-1 px-3 rounded-xl h-8 min-h-[32px] hover:bg-cyan-500/80 transition-all duration-300"
                  >
                    {genre}
                  </span>
                ))}
            </div>
            <p className="text-slate-300/90 mb-6 text-sm max-w-2xl tracking-wide font-light leading-relaxed line-clamp-3">
              {currentMovie.overview}
            </p>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <a
                href={`/movie/${currentMovie.id}`}
                className="group relative inline-flex items-center text-white text-md font-light tracking-wider px-4 py-2 bg-gradient-to-r from-cyan-900/80 to-blue-900/80 rounded-sm border border-cyan-800/50 hover:from-cyan-700/90 hover:to-blue-800/80 transition-colors duration-300 overflow-hidden"
              >
                <span>VIEW DETAILS</span>
              </a>
              <a
                href="#"
                className="group relative inline-flex items-center bg-black/30 text-white/70 text-md font-light tracking-wider px-4 py-2 border rounded-sm border-slate-700/30 hover:border-slate-600/50 hover:text-white transition-all duration-300 backdrop-blur-sm"
              >
                <span>EXPLORE SIMILAR</span>
              </a>
            </div>
            {/* Movie Data Visualization */}
            <div className="mt-8 grid grid-cols-3 gap-10 max-w-md">
              {currentMovie.popularity && (
                <div className="space-y-1">
                  <div className="text-xs text-slate-500 font-light tracking-wider">
                    POPULARITY
                  </div>
                  <p className="text-xs text-slate-300 font-light tracking-wide mb-1">
                    {formatPopularityBar(currentMovie.popularity)}
                  </p>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-200 to-blue-500"
                      style={{
                        width: formatPopularityBar(currentMovie.popularity),
                      }}
                    ></div>
                  </div>
                </div>
              )}
              {currentMovie.runtime && (
                <div className="space-y-1">
                  <div className="text-xs text-slate-500 font-light tracking-wider">
                    RUNTIME
                  </div>
                  <div className="text-slate-300 text-sm font-light">
                    {Math.floor(currentMovie.runtime / 60)}H{" "}
                    {currentMovie.runtime % 60}M
                  </div>
                </div>
              )}

              {currentMovie.original_language && (
                <div className="space-y-1">
                  <div className="text-xs text-slate-500 font-light tracking-wider">
                    LANGUAGE
                  </div>
                  <div className="text-slate-300 text-sm font-light">
                    {currentMovie.original_language.toUpperCase()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <button
          onClick={goToPrev}
          className="absolute left-5 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white hover:text-cyan-500 hover:bg-black border border-slate-700/30 hover:border-cyan-700 hover:border-2 backdrop-blur-sm rounded-full transition-all duration:300 z-50 "
        >
          ❮
        </button>
        <button
          onClick={goToNext}
          className="absolute right-5 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white hover:text-cyan-500 hover:bg-black border border-slate-700/30 hover:border-cyan-700 hover:border-2 backdrop-blur-sm rounded-full transition-all duration:300 z-50 "
        >
          ❯
        </button>

        {/* Toggle Mute Button
        <button
          onClick={toggleMute}
          className="absolute bottom-5 right-5 p-3 bg-black/50 text-white hover:text-cyan-500 hover:bg-black border border-slate-700/30 hover:border-cyan-700 hover:border-2 backdrop-blur-sm rounded-full transition-all duration:300 z-50"
        >
          {isMuted ? (
            <SpeakerXMarkIcon className="h-6 w-6" />
          ) : (
            <SpeakerWaveIcon className="h-6 w-6" />
          )}
        </button> */}
      </div>
    </>
  );
}
