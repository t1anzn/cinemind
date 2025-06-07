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
  const rafRef = useRef(null);

  const initializeLenis = () => {
    if (lenisRef.current) return; // Already initialized

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;
    window.lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }

    rafRef.current = requestAnimationFrame(raf);
  };

  const destroyLenis = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (lenisRef.current) {
      lenisRef.current.destroy();
      lenisRef.current = null;
      window.lenis = null;
    }
  };

  const checkMotionPreference = () => {
    const osReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const manualReducedMotion = document.body.classList.contains(
      "manual-reduced-motion"
    );
    const storedPreference = localStorage.getItem("motion-preference");

    return (
      osReducedMotion || manualReducedMotion || storedPreference === "reduced"
    );
  };

  const handleMotionChange = () => {
    if (checkMotionPreference()) {
      destroyLenis();
    } else {
      if (!lenisRef.current) {
        initializeLenis();
      }
    }
  };

  useEffect(() => {
    // Initialize Lenis if motion is not reduced
    if (!checkMotionPreference()) {
      initializeLenis();
    }

    // Listen for storage changes (when preference is updated)
    window.addEventListener("storage", handleMotionChange);

    // Listen for class changes on body
    const observer = new MutationObserver(handleMotionChange);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Listen for custom events from accessibility panel
    const handleAccessibilityChange = () => {
      setTimeout(handleMotionChange, 50); // Small delay to ensure class changes are applied
    };
    window.addEventListener("accessibilityChanged", handleAccessibilityChange);

    return () => {
      window.removeEventListener("storage", handleMotionChange);
      window.removeEventListener(
        "accessibilityChanged",
        handleAccessibilityChange
      );
      observer.disconnect();
      destroyLenis();
    };
  }, []);

  return <>{children}</>;
}
