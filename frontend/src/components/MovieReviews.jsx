import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/solid";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw"; // Import the plugin

export default function MovieReviews({ movie }) {
  if (!movie?.reviews) {
    return <p className="text-gray-500 italic">No reviews available.</p>;
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFocusMode, setIsFocusMode] = useState(false);

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
      <div className="fixed inset-0 bg-black/90 z-50 overflow-hidden pt-5 sm:pt-15">
        <div className="h-screen flex">
          {/* Main Content */}
          <div className="flex-1 p-8 pt-20 overflow-y-auto">
            {" "}
            {/* Added pt-20 for navbar space */}
            {/* Review Content */}
            <div className="max-w-3xl mx-auto relative">
              <div className="bg-gradient-to-t from-slate-800/30 to-transparent rounded-xl p-8 shadow-sm shadow-slate-400/20 border border-white/10 backdrop-blur-xs">
                {/* Exit Button */}
                <button
                  onClick={() => setIsFocusMode(false)}
                  className="relative left-165 text-slate-400 rounded-2xl p-2 hover:bg-blue-500/10 hover:text-cyan-400 transition-all duration-200 bg-slate-800/50 backdrop-blur-sm"
                  aria-label="Close"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <FaUserCircle className="w-12 h-12 text-blue-400" />
                  <div>
                    <h3 className="text-lg font-semibold tracking-wide text-white">
                      {currentReview.author}
                    </h3>
                    <p className="text-slate-400 font-light tracking-wider text-sm">
                      Review {currentIndex + 1} of {splitReviews.length}
                    </p>
                  </div>
                </div>

                <div className="text-gray-200 whitespace-pre-line font-light leading-relaxed">
                  <ReactMarkdown
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      p: ({ node, ...props }) => (
                        <p {...props} className="mb-4" />
                      ),
                      em: ({ node, ...props }) => (
                        <em {...props} className="italic text-gray-300" />
                      ),
                    }}
                  >
                    {currentReview.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Sidebar */}
          <div className="w-96 border-l border-slate-700/50 bg-gradient-to-b from-blue-400/10 to-transparent backdrop-blur-sm pt-10">
            <div className="p-6 border-b border-slate-700/50">
              <h2 className="text-lg font-semibold text-white">All Reviews</h2>
              <p className="text-slate-400 text-sm">
                {splitReviews.length} reviews
              </p>
            </div>

            <div className="overflow-y-auto h-[calc(100vh-9rem)]">
              {splitReviews.map((review, idx) => (
                <button
                  key={`sidebar-review-${idx}`}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-full p-4 text-left border-b border-slate-700/30 transition-all duration-200 ${
                    idx === currentIndex
                      ? "bg-blue-500/10 border-l-4 border-l-blue-500"
                      : "hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <FaUserCircle className="w-5 h-5 text-blue-400" />
                    <h3 className="font-medium text-white">{review.author}</h3>
                  </div>
                  <p className="text-slate-400 text-sm line-clamp-2">
                    {review.content.slice(0, 100)}...
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Reviews Section not focused
  return (
    <div className="bg-gradient-to-b from-slate-800/30 to-transparent shadow-md shadow-blue-400/50 border border-blue-100/50 rounded-lg">
      <div className="flex justify-between items-center p-6 border-b border-slate-700/50">
        <div>
          <h2 className="text-lg font-semibold text-white">Reviews</h2>
          <p className="text-slate-400 text-sm">
            {splitReviews.length}{" "}
            {splitReviews.length === 1 ? "review" : "reviews"}
          </p>
        </div>
        <button
          onClick={() => setIsFocusMode(true)}
          className="text-slate-400 hover:text-blue-400 rounded-lg p-2 hover:bg-blue-500/10 transition-all duration-200"
        >
          <ArrowTopRightOnSquareIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Review Content */}
      <div className="relative px-16 py-6">
        {/* Left Navigation Arrow */}
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-500/10 hover:text-blue-400 transition-all duration-300 hover:-translate-x-1"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>

        {/* Review Content Container */}
        <div className="bg-gradient-to-b from-slate-800/50 to-blue-900/20 border border-blue-500/30 rounded-lg p-6 h-[400px] overflow-y-auto">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-700/30">
            <FaUserCircle className="w-10 h-10 text-blue-400" />
            <div>
              <h3 className="text-white font-medium">{currentReview.author}</h3>
              <p className="text-slate-400 font-light text-sm">Movie Review</p>
            </div>
          </div>

          <div className="min-h-[200px] text-slate-200">
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              components={{
                p: ({ node, ...props }) => (
                  <p {...props} className="font-light leading-relaxed mb-4" />
                ),
                em: ({ node, ...props }) => (
                  <em {...props} className="italic opacity-90" />
                ),
                strong: ({ node, ...props }) => (
                  <strong {...props} className="font-semibold" />
                ),
                // Add default styling for any other elements
                div: ({ node, ...props }) => (
                  <div {...props} className="mb-4" />
                ),
              }}
            >
              {currentReview.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Right Navigation Arrow */}
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-500/10 hover:text-blue-400 transition-all duration-300 hover:translate-x-1"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-1 pb-6">
        {splitReviews.map((_, idx) => (
          <span
            key={`pagination-dot-${idx}`} // Add a unique key for each child in the list
            className={`h-1.5 rounded-full transition-all ${
              idx === currentIndex ? "w-4 bg-blue-500" : "w-1.5 bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
