/**
 * YouTube API Loader Utility
 * 
 * This module provides a utility function for dynamically loading the YouTube IFrame API
 * in a React application. It handles asynchronous loading and ensures the API is only
 * loaded once, preventing duplicate script tags and API conflicts.
 * 
 * Key Features:
 * - Dynamic script injection for YouTube IFrame API
 * - Promise-based API ready detection
 * - Prevents duplicate API loading
 * - Global callback handling for API initialization
 */

export function loadYouTubeAPI() {
  if (window.YT) return Promise.resolve(window.YT);

  return new Promise((resolve) => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    
    window.onYouTubeIframeAPIReady = () => {
      resolve(window.YT);
    };

    document.head.appendChild(tag);
  });
}
