import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/solid";

export default function MovieReviews({ movie }) {
  if (!movie?.reviews) {
    return <p className="text-gray-500 italic">No reviews available.</p>;
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const PREVIEW_LENGTH = 150;

  // Separate author name from review content, returning an object
  const parseReview = (review) => {
    const [firstLine, ...rest] = review.split("\n"); // Split first line assuming its the name
    return {
      // Return an object with author and content properties
      author: firstLine.trim(),
      content: rest.join("\n").trim(),
    };
  };

  // Processes movie reviews string into an array of structured objects
  const splitReviews = movie.reviews
    .split(/Author:\s*/g)
    .filter(Boolean)
    .map((review) => parseReview(review));

  // Left Button Handler
  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? splitReviews.length - 1 : prev - 1
    );
  };

  // Right Button Handler
  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === splitReviews.length - 1 ? 0 : prev + 1
    );
  };

  const currentReview =
    splitReviews.length > 0
      ? splitReviews[currentIndex]
      : { author: "Unknown", content: "No review available." }; // Fallback if there are no reviews available

  const isLongReview = currentReview.content.length > PREVIEW_LENGTH; // Classifies review as long if over a certain length

  const previewText = isLongReview // Create truncated version of review content if review is long
    ? `${currentReview.content.slice(0, PREVIEW_LENGTH)}...`
    : currentReview.content;

  // Hook to create an event listener to monitor key input to exit focus mode
  // If Escape is pressed and currently in focus mode, it exits focus mode and removes the event listener.
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isFocusMode) {
        setIsFocusMode(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isFocusMode]); // Only runs if isFocusMode changes

  // Hook to prevent background scrolling whilst in focus mode
  useEffect(() => {
    document.body.style.overflow = isFocusMode ? "hidden" : "auto";
  }, [isFocusMode]);

  if (isFocusMode) {
    return (
      <div // Darken background with a fullscreen overlay
        className="fixed inset-0 bg-black/90 z-50 overflow-y-auto"
        onClick={() => setIsFocusMode(false)}
      >
        <div // Centering div that prevents clicks inside the modal from triggering the outer
          className="min-h-screen flex items-center justify-center p-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Focus Content Container */}
          <div className="bg-gradient-to-t from-slate-800/30 to-transparent rounded-xl w-full max-w-3xl p-8 relative shadow-sm shadow-slate-400/20 border-1 backdrop-blur-xs border-white/10">
            <button // Exit button
              onClick={() => setIsFocusMode(false)}
              className="absolute top-2 right-2 text-slate-400 rounded-4xl p-1.5 shadow-black hover:shadow-md hover:bg-blue-500/10 hover:text-cyan-400  transition-all duration-200"
              aria-label="Close"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 mb-6">
              <FaUserCircle className="w-12 h-12 text-blue-400" />
              <div>
                <h3 className="text-lg font-semibold tracking-wide text-white">
                  {currentReview.author}
                </h3>
                <p className="text-slate-400 font-light tracking-wider text-sm">
                  Movie Review
                </p>
              </div>
            </div>

            {/* Review Content - Scrollable content for long reviews */}
            <div className="mb-8 max-h-[60vh] overflow-y-auto pr-2">
              <p className="text-gray-200 whitespace-pre-line font-light leading-relaxed">
                {currentReview.content}
              </p>
            </div>

            {/* Navigation footer of focus container */}
            <div className="flex items-center justify-between mt-4 border-t border-slate-700/80 pt-4">
              {/* Left Arrow Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                className="flex items-center gap-2 ml-1 rounded-4xl p-2 text-blue-400 hover:text-cyan-500  hover:bg-blue-500/10 hover:ml-0 transition-all duration-200"
              >
                <span className="text-xl">
                  <ChevronLeftIcon className="h-6 w-6" />
                </span>
              </button>

              {/* Page Numbers */}
              <span className="text-slate-400 font-light tracking-widest">
                {currentIndex + 1} OF {splitReviews.length}
              </span>

              {/* Right Arrow Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="flex items-center gap-2 mr-1 rounded-4xl p-2 text-blue-400 hover:text-cyan-500  hover:bg-blue-500/10 hover:mr-0 transition-all duration-200"
              >
                <span className="text-xl">
                  <ChevronRightIcon className="h-6 w-6" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Reviews Section not focused
  return (
    <div className="bg-gradient-to-b from-slate-800/30 to-transparent shadow-md shadow-blue-400/50 border border-blue-100/50 rounded-lg p-6 pb-10 mb-4">
      <div className="flex justify-between items-center mb-6 ">
        <h2 className="text-xl text-white font-semibold">Reviews</h2>
        {/* Focus Mode Button */}
        <button
          onClick={() => setIsFocusMode(true)}
          className="text-white hover:text-blue-500 text-sm"
        >
          <ArrowTopRightOnSquareIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Review Content */}
      <div className="relative">
        <div className="bg-gradient-to-b from-slate-800 to-blue-800/10 border border-blue-500/50 p-6">
          {/* User Profile */}
          <div className="flex items-center gap-3 mb-4">
            <FaUserCircle className="w-10 h-10 text-blue-400" />
            <div>
              <h3 className="text-white font-medium">{currentReview.author}</h3>
              <p className="text-slate-400 font-light text-sm">Movie Review</p>
            </div>
          </div>

          {/* Review Text */}
          <p className="text-slate-200 font-light whitespace-pre-line leading-relaxed">
            {isExpanded ? currentReview.content : previewText}
          </p>

          {/* Read More / Show Less button */}
          {isLongReview && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-400 hover:text-blue-300 text-sm mt-4"
            >
              {isExpanded ? "Show Less" : "Read More"}
            </button>
          )}
        </div>

        {/* Left Navigation Arrow */}
        <button
          onClick={handlePrevious}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-500 hover:left-[-15px] transition-all duration-500"
        >
          <ChevronLeftIcon className="h-8 w-8" />
        </button>

        {/* Right Navigation Arrow */}
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-500 hover:right-[-15px] transition-all duration-500"
        >
          <ChevronRightIcon className="h-8 w-8" />
        </button>
      </div>

      {/* Pagination Animation */}
      <div className="flex justify-center mt-4 gap-1">
        {splitReviews.map((_, idx) => (
          <span
            key={idx}
            className={`h-1.5 rounded-full transition-all ${
              idx === currentIndex ? "w-4 bg-blue-500" : "w-1.5 bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
