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
