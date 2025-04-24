import { useState, useRef, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export default function CastSlider({ cast }) {
  // Limit cast to a maximum of 15 actors
  const limitedCast = cast && cast.length > 15 ? cast.slice(0, 15) : cast;

  const sliderRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Check if scrolling is needed and update arrow visibility
  const checkScroll = () => {
    if (!sliderRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
  };

  // Initialize scroll check when component mounts or cast changes
  useEffect(() => {
    if (!sliderRef.current || !limitedCast) return;

    // Check if we need to show the right arrow initially
    setTimeout(() => {
      const { scrollWidth, clientWidth } = sliderRef.current;
      setShowRightArrow(scrollWidth > clientWidth);
    }, 200);

    // Add window resize listener
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [limitedCast]);

  // Scroll the slider left or right
  const scroll = (direction) => {
    if (!sliderRef.current) return;

    // Calculate scroll amount based on card width (138px) plus gap (16px)
    const itemWidth = 154;
    const scrollAmount = direction === "left" ? -itemWidth : itemWidth;

    sliderRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });

    setTimeout(checkScroll, 300);
  };

  // Mouse down handler for drag scrolling
  const handleMouseDown = (e) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  // Touch start handler for mobile
  const handleTouchStart = (e) => {
    if (!sliderRef.current || !e.touches[0]) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  // Mouse move handler for drag scrolling
  const handleMouseMove = (e) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Multiplier for faster scrolling
    sliderRef.current.scrollLeft = scrollLeft - walk;
    checkScroll();
  };

  // Touch move handler for mobile
  const handleTouchMove = (e) => {
    if (!isDragging || !sliderRef.current || !e.touches[0]) return;
    const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderRef.current.scrollLeft = scrollLeft - walk;
    checkScroll();
  };

  // Mouse up/leave handler to stop dragging
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Default profile image for cast without photos
  const defaultProfileImg =
    "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";

  return (
    <div className="relative mt-4 mb-8 w-full">
      {/* Left scroll button */}
      {showLeftArrow && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-black hover:scale-120 transition-all duration-300 text-white rounded-full p-1.5 shadow-lg"
          aria-label="Scroll left"
        >
          <ChevronLeftIcon className="h-6 w-6 hover:text-cyan-500 hover:scale-120 transition-all duration-300" />
        </button>
      )}

      {/* Cast slider container */}
      <div
        className="mx-auto overflow-hidden px-6"
        style={{ maxWidth: "100%" }}
      >
        <div
          ref={sliderRef}
          className="flex overflow-x-auto scrollbar-hide gap-4 pb-6 pt-2 px-2"
          onScroll={checkScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleDragEnd}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
            width: "100%",
            margin: "0 auto",
            userSelect: "none", // Prevent text selection
            WebkitUserSelect: "none", // For Safari
            MozUserSelect: "none", // For Firefox
            msUserSelect: "none", // For IE/Edge
            cursor: isDragging ? "grabbing" : "grab",
          }}
        >
          {limitedCast &&
            limitedCast.map((actor, index) => (
              <motion.div
                key={index}
                className="flex-none w-[138px] py-2" // Added py-2 to create space for scaling
                draggable="false" // Prevent dragging of the element
              >
                <div
                  className="bg-gradient-to-b from-blue-500 to-transparent rounded-lg overflow-hidden border hover:scale-110 border-slate-800 hover:border-slate-100 transition-all duration-500"
                  draggable="false" // Also prevent dragging at this level
                >
                  {/* Actor image */}
                  <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w138_and_h175_face${actor.profile_path}`
                        : defaultProfileImg
                    }
                    alt={actor.name}
                    className="w-full h-[175px] object-cover object-center"
                    loading="lazy"
                    draggable="false"
                  />

                  {/* Actor name and character */}
                  <div className="p-3">
                    <p className="text-white font-medium text-sm truncate">
                      {actor.name}
                    </p>
                    <p className="text-slate-400 text-xs truncate">
                      {actor.character}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

          {/* Show a message when cast is truncated */}
          {cast && cast.length > 15 && (
            <motion.div
              className="flex-none w-[138px] py-2" // Added py-2 to match the other cards
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-slate-900/50 rounded-lg overflow-hidden border border-slate-700/50 p-4 text-center h-full flex flex-col justify-center">
                <span className="text-slate-400 text-sm">
                  +{cast.length - 15} more cast members
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Right scroll button */}
      {showRightArrow && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-black transition-all duration-300 hover:scale-120 text-white rounded-full p-1.5 shadow-lg"
          aria-label="Scroll right"
        >
          <ChevronRightIcon className="h-6 w-6 hover:scale-120 hover:text-cyan-500 transition-all duration-300" />
        </button>
      )}
    </div>
  );
}
