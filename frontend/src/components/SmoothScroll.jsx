/**
 * SmoothScroll Component
 *
 * Wrapper component providing smooth scrolling behavior using Lenis library.
 * Features:
 * - Exponential ease-out scrolling animation with 1.2s duration
 * - Optimized for desktop with smooth scrolling disabled on touch devices
 * - Continuous animation frame loop for smooth performance
 * - Proper cleanup on component unmount to prevent memory leaks
 * - Configurable mouse and touch multipliers for scroll sensitivity
 *
 * Used as a layout wrapper to enhance scrolling experience site-wide.
 */

import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis smooth scrolling
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential ease out
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false, // Disable smooth scrolling on touch devices (better performance)
      touchMultiplier: 2,
      infinite: false,
    });

    // Create a callback for RAF (request animation frame)
    function raf(time) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }

    // Start the animation frame loop
    requestAnimationFrame(raf);

    // Clean up on component unmount
    return () => {
      lenisRef.current?.destroy();
    };
  }, []);

  return children;
}
