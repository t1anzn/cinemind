import React, { useEffect, useRef } from "react";
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/solid";

export default function YouTubePlayer({
  videoId,
  start = 0,
  end = null,
  isMuted,
  setIsMuted,
  containerClassName = "w-full h-full",
  rel = 0,
  controls = 0,
  fs = 0,
}) {
  const playerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    const initializePlayer = () => {
      // Destroy previous player if it exists
      if (playerRef.current) {
        playerRef.current.destroy();
      }

      // Create a new player instance
      playerRef.current = new window.YT.Player("youtube-player", {
        videoId,
        playerVars: {
          autoplay: 1,
          controls,
          showinfo: 0,
          rel,
          modestbranding: 1,
          start,
          end,
          mute: isMuted ? 1 : 0, // Respect the current isMuted state
          enablejsapi: 1,
          iv_load_policy: 3,
          cc_load_policy: 0,
          fs,
          origin: "https://www.youtube.com",
        },
        events: {
          onReady: (event) => {
            const player = event.target;

            // Set mute state based on the current isMuted value
            if (isMuted) {
              player.mute();
            } else {
              player.unMute();
            }

            player.setVolume(40);

            // Set up the interval to loop the video
            intervalRef.current = setInterval(() => {
              const currentTime = player.getCurrentTime();
              if (end && currentTime >= end) {
                player.seekTo(start); // Loop back to start
              }
            }, 50);
          },
        },
      });
    };

    const checkYTReady = () => {
      if (window.YT && window.YT.Player) {
        initializePlayer();
      } else {
        setTimeout(checkYTReady, 100); // Retry if not ready
      }
    };

    checkYTReady(); // Run the check to initialize the player

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (playerRef.current) {
        playerRef.current.destroy(); // Destroy player instance on unmount
      }
    };
  }, [videoId, start, end]); // Removed isMuted from dependencies to prevent reinitialization

  const toggleMute = () => {
    if (playerRef.current) {
      const player = playerRef.current;
      if (isMuted) {
        player.unMute();
      } else {
        player.mute();
      }
      setIsMuted(!isMuted); // Toggle mute state
    }
  };

  return (
    <>
      <div id="youtube-player" className={containerClassName}></div>
      <button
        onClick={toggleMute}
        className="absolute bottom-15 right-5 p-3 bg-black/50 text-white hover:text-cyan-500 hover:bg-black border border-slate-700/30 hover:border-cyan-700 hover:border-2 backdrop-blur-sm rounded-full transition-all duration-300 z-50"
      >
        {isMuted ? (
          <SpeakerXMarkIcon className="h-6 w-6" />
        ) : (
          <SpeakerWaveIcon className="h-6 w-6" />
        )}
      </button>
    </>
  );
}
