import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { extractYouTubeId } from "../utils/youtubeUtils";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import YouTubePlayer from "./YouTubePlayer";

export default function MovieMedia({ movie }) {
  const [currentTrailerIndex, setCurrentTrailerIndex] = useState(0);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isPosterFocusMode, setIsPosterFocusMode] = useState(false);
  const [focusedPosterIndex, setFocusedPosterIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true); // Shared mute state
  const [selectedTab, setSelectedTab] = useState(0);
  const [isVideosExpanded, setIsVideosExpanded] = useState(false);
  const [videoPage, setVideoPage] = useState(1);
  const [posterPage, setPosterPage] = useState(1);
  const [backdropPage, setBackdropPage] = useState(1);
  const [isPostersExpanded, setIsPostersExpanded] = useState(false);
  const [isBackdropsExpanded, setIsBackdropsExpanded] = useState(false);
  const [isBackdropFocusMode, setIsBackdropFocusMode] = useState(false);
  const [focusedBackdropIndex, setFocusedBackdropIndex] = useState(0);

  const VIDEOS_PER_PAGE = 8;
  const IMAGES_PER_PAGE = 8;
  const INITIAL_ITEMS = 4;

  const trailerUrls = useMemo(
    () =>
      movie?.video_url
        ? movie.video_url.split(",").map((url) => url.trim())
        : [],
    [movie?.video_url]
  );

  const posterUrls = useMemo(
    () =>
      movie?.poster_url
        ? movie.poster_url.split(",").map((url) => url.trim())
        : [],
    [movie?.poster_url]
  );

  const backdropUrls = useMemo(
    () =>
      movie?.backdrop_url
        ? movie.backdrop_url.split(",").map((url) => url.trim())
        : [],
    [movie?.backdrop_url]
  );

  const openTheaterMode = (index) => {
    const actualIndex = (videoPage - 1) * VIDEOS_PER_PAGE + index; // Map to the full array index
    setCurrentTrailerIndex(actualIndex);
    setIsTheaterMode(true);
  };

  const closeTheaterMode = () => {
    setIsTheaterMode(false);
  };

  const openPosterFocusMode = (index) => {
    const actualIndex = (posterPage - 1) * IMAGES_PER_PAGE + index; // Map to the full array index
    setFocusedPosterIndex(actualIndex);
    setIsPosterFocusMode(true);
  };

  const closePosterFocusMode = () => {
    setIsPosterFocusMode(false);
  };

  const openBackdropFocusMode = (index) => {
    const actualIndex = (backdropPage - 1) * IMAGES_PER_PAGE + index; // Map to the full array index
    setFocusedBackdropIndex(actualIndex);
    setIsBackdropFocusMode(true);
  };

  const closeBackdropFocusMode = () => {
    setIsBackdropFocusMode(false);
  };

  const paginatedVideos = useMemo(() => {
    if (!isVideosExpanded) {
      return trailerUrls.slice(0, INITIAL_ITEMS);
    }
    const start = (videoPage - 1) * VIDEOS_PER_PAGE;
    return trailerUrls.slice(start, start + VIDEOS_PER_PAGE);
  }, [trailerUrls, videoPage, isVideosExpanded]);

  const paginatedPosters = useMemo(() => {
    if (!isPostersExpanded) return posterUrls.slice(0, INITIAL_ITEMS);
    const start = (posterPage - 1) * IMAGES_PER_PAGE;
    return posterUrls.slice(start, start + IMAGES_PER_PAGE);
  }, [posterUrls, posterPage, isPostersExpanded]);

  const paginatedBackdrops = useMemo(() => {
    if (!isBackdropsExpanded) return backdropUrls.slice(0, INITIAL_ITEMS);
    const start = (backdropPage - 1) * IMAGES_PER_PAGE;
    return backdropUrls.slice(start, start + IMAGES_PER_PAGE);
  }, [backdropUrls, backdropPage, isBackdropsExpanded]);

  const totalVideoPages = Math.ceil(trailerUrls.length / VIDEOS_PER_PAGE);
  const totalPosterPages = Math.ceil(posterUrls.length / IMAGES_PER_PAGE);
  const totalBackdropPages = Math.ceil(backdropUrls.length / IMAGES_PER_PAGE);

  const PaginationControls = ({
    currentPage,
    totalPages,
    onPageChange,
    onCollapse,
  }) => (
    <div className="flex items-center justify-center gap-4 mt-4">
      <button
        onClick={onCollapse}
        className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        Show Less
      </button>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 text-slate-400 hover:text-white disabled:opacity-50 disabled:hover:text-slate-400"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        <span className="text-sm text-slate-400">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1 text-slate-400 hover:text-white disabled:opacity-50 disabled:hover:text-slate-400"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="mb-8">
      <TabGroup selectedIndex={selectedTab} onChange={setSelectedTab}>
        <div className="flex items-center justify-between mb-4">
          <TabList className="flex gap-4">
            <Tab
              className={({ selected }) => `
              text-2xl font-light tracking-wider outline-none
              ${selected ? "text-white" : "text-slate-500 hover:text-slate-300"}
            `}
            >
              Videos
            </Tab>
            <Tab
              className={({ selected }) => `
              text-2xl font-light tracking-wider outline-none
              ${selected ? "text-white" : "text-slate-500 hover:text-slate-300"}
            `}
            >
              Posters
            </Tab>
            <Tab
              className={({ selected }) => `
              text-2xl font-light tracking-wider outline-none
              ${selected ? "text-white" : "text-slate-500 hover:text-slate-300"}
            `}
            >
              Backdrops
            </Tab>
          </TabList>
          {selectedTab === 0 && (
            <span className="text-sm text-slate-400 font-light">
              {trailerUrls.length}{" "}
              {trailerUrls.length === 1 ? "trailer" : "trailers"} available
            </span>
          )}
          {selectedTab === 1 && (
            <span className="text-sm text-slate-400 font-light">
              {posterUrls.length}{" "}
              {posterUrls.length === 1 ? "poster" : "posters"} available
            </span>
          )}
          {selectedTab === 2 && (
            <span className="text-sm text-slate-400 font-light">
              {backdropUrls.length}{" "}
              {backdropUrls.length === 1 ? "backdrop" : "backdrops"} available
            </span>
          )}
        </div>

        <TabPanels>
          <TabPanel>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {paginatedVideos.map((url, index) => (
                  <button
                    key={url}
                    onClick={() => openTheaterMode(index)}
                    className="group relative aspect-video bg-slate-900 rounded-lg overflow-hidden"
                  >
                    <img
                      src={`https://img.youtube.com/vi/${extractYouTubeId(
                        url
                      )}/maxresdefault.jpg`}
                      alt={`Trailer ${index + 1}`}
                      className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </button>
                ))}
              </div>

              {trailerUrls.length > INITIAL_ITEMS &&
                (isVideosExpanded ? (
                  <PaginationControls
                    currentPage={videoPage}
                    totalPages={totalVideoPages}
                    onPageChange={setVideoPage}
                    onCollapse={() => {
                      setIsVideosExpanded(false);
                      setVideoPage(1);
                    }}
                  />
                ) : (
                  <button
                    onClick={() => setIsVideosExpanded(true)}
                    className="w-full py-3 flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors"
                  >
                    <span>Show All ({trailerUrls.length})</span>
                    <ChevronDownIcon className="w-5 h-5" />
                  </button>
                ))}
            </div>
          </TabPanel>

          <TabPanel>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                {paginatedPosters.map((url, index) => (
                  <button
                    key={url}
                    onClick={() => openPosterFocusMode(index)}
                    className="group relative aspect-[2/3] bg-slate-900 rounded-lg overflow-hidden"
                  >
                    <img
                      src={url}
                      alt={`Movie poster ${index + 1}`}
                      className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </button>
                ))}
              </div>

              {posterUrls.length > INITIAL_ITEMS &&
                (isPostersExpanded ? (
                  <PaginationControls
                    currentPage={posterPage}
                    totalPages={totalPosterPages}
                    onPageChange={setPosterPage}
                    onCollapse={() => {
                      setIsPostersExpanded(false);
                      setPosterPage(1);
                    }}
                  />
                ) : (
                  <button
                    onClick={() => setIsPostersExpanded(true)}
                    className="w-full py-3 flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors"
                  >
                    <span>Show All ({posterUrls.length})</span>
                    <ChevronDownIcon className="w-5 h-5" />
                  </button>
                ))}
            </div>
          </TabPanel>

          <TabPanel>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {paginatedBackdrops.map((url, index) => (
                  <button
                    key={url}
                    onClick={() => openBackdropFocusMode(index)}
                    className="group relative aspect-video bg-slate-900 rounded-lg overflow-hidden"
                  >
                    <img
                      src={url}
                      alt={`Movie backdrop ${index + 1}`}
                      className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </button>
                ))}
              </div>

              {backdropUrls.length > INITIAL_ITEMS &&
                (isBackdropsExpanded ? (
                  <PaginationControls
                    currentPage={backdropPage}
                    totalPages={totalBackdropPages}
                    onPageChange={setBackdropPage}
                    onCollapse={() => {
                      setIsBackdropsExpanded(false);
                      setBackdropPage(1);
                    }}
                  />
                ) : (
                  <button
                    onClick={() => setIsBackdropsExpanded(true)}
                    className="w-full py-3 flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors"
                  >
                    <span>Show All ({backdropUrls.length})</span>
                    <ChevronDownIcon className="w-5 h-5" />
                  </button>
                ))}
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>

      {isTheaterMode && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onClick={closeTheaterMode} // Close theater mode when clicking on the background
        >
          <div
            className="relative w-full max-w-7xl aspect-video"
            onClick={(e) => e.stopPropagation()} // Prevent closing when interacting with the video
          >
            <YouTubePlayer
              videoId={extractYouTubeId(trailerUrls[currentTrailerIndex])}
              start={0}
              end={null}
              isMuted={isMuted}
              setIsMuted={setIsMuted}
              containerClassName="w-full h-full"
              controls={1}
              rel={0}
              fs={1}
            />
            <button
              onClick={closeTheaterMode}
              className="absolute top-4 right-4 bg-black bg-opacity-50 p-2 rounded-full hover:bg-blue-500/30 hover:text-cyan-500 text-white hover:bg-opacity-75 transition-all duration-300"
            >
              <XMarkIcon className="h-6 w-6 " />
            </button>
          </div>
        </div>
      )}

      {isPosterFocusMode && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-start justify-center p-4 overflow-auto"
          onClick={closePosterFocusMode} // Close focus mode when clicking on the background
        >
          <div
            className="relative w-full max-w-4xl md:max-w-3xl mt-30"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the poster
          >
            <img
              src={posterUrls[focusedPosterIndex]}
              alt={`Focused Poster ${focusedPosterIndex + 1}`}
              className="w-full h-auto object-contain"
            />
            <button
              onClick={closePosterFocusMode}
              className="absolute top-4 right-4 md:top-6 md:right-6 bg-black bg-opacity-50 p-2 rounded-full hover:bg-blue-500/30 hover:text-cyan-500 text-white hover:bg-opacity-75 transition-all duration-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      {isBackdropFocusMode && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-start justify-center p-4 overflow-auto"
          onClick={closeBackdropFocusMode} // Close focus mode when clicking on the background
        >
          <div
            className="relative w-full max-w-4/5 mt-30"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the poster
          >
            <img
              src={backdropUrls[focusedBackdropIndex]}
              alt={`Focused Backdrop ${focusedBackdropIndex + 1}`}
              className="w-full h-auto object-contain"
            />
            <button
              onClick={closeBackdropFocusMode}
              className="absolute top-4 right-4 md:top-6 md:right-6 bg-black bg-opacity-50 p-2 rounded-full hover:bg-blue-500/30 hover:text-cyan-500 text-white hover:bg-opacity-75 transition-all duration-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
