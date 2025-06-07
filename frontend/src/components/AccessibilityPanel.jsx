/**
 * AccessibilityPanel Component
 *
 * Comprehensive accessibility controls panel providing site-wide customization options.
 * Features:
 * - Motion reduction controls with OS preference detection
 * - Dynamic font size adjustment (75%-150%) with live preview
 * - High contrast mode with automatic style injection
 * - Dyslexia-friendly font selection (OpenDyslexic, Arial, Comic Sans, etc.)
 * - Settings persistence via localStorage with OS integration
 * - Real-time style application without page reload
 * - Reset functionality to restore OS/browser defaults
 * - Contact form navigation with smooth scrolling
 * - Full keyboard navigation and screen reader support
 * - Responsive design optimized for mobile and desktop
 *
 * Integrates with site-wide accessibility preferences and provides immediate
 * visual feedback for all accessibility modifications across the platform.
 */

import React, { useEffect, useState } from "react";

export default function AccessibilityPanel({ isOpen, onClose }) {
  const [motionReduced, setMotionReduced] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState("none");

  // Font options for dyslexia support
  const dyslexiaFontOptions = [
    {
      value: "none",
      label: "Default font",
      description: "Inter (site default)",
    },
    {
      value: "opendyslexic",
      label: "OpenDyslexic",
      description: "Specialized dyslexia font",
    },
    { value: "arial", label: "Arial", description: "Clean, widely available" },
    {
      value: "comic",
      label: "Comic Sans MS",
      description: "Casual, rounded letters",
    },
    {
      value: "verdana",
      label: "Verdana",
      description: "Large, clear characters",
    },
    { value: "tahoma", label: "Tahoma", description: "Condensed, readable" },
  ];

  // Initialize settings from localStorage
  useEffect(() => {
    const osReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const osHighContrast = window.matchMedia(
      "(prefers-contrast: high)"
    ).matches;

    const motionPref = localStorage.getItem("motion-preference");
    const fontPref = localStorage.getItem("font-size-preference") || "100";
    const contrastPref =
      localStorage.getItem("contrast-preference") ||
      (osHighContrast ? "high" : "normal");
    const dyslexiaPref =
      localStorage.getItem("dyslexia-font-preference") || "none";

    setMotionReduced(
      motionPref === "reduced" || (motionPref === null && osReducedMotion)
    );
    setFontSize(parseInt(fontPref));
    setHighContrast(contrastPref === "high");
    setDyslexiaFont(dyslexiaPref);

    // Apply settings immediately on mount
    if (contrastPref === "high") {
      document.body.classList.add("high-contrast");

      // Apply inline styles immediately on mount
      setTimeout(() => {
        const allElements = document.querySelectorAll(
          "*:not(img):not([data-video-container] *):not([data-video-container])"
        );
        allElements.forEach((el) => {
          if (!el.closest("[data-video-container]") && el.tagName !== "IMG") {
            el.style.setProperty("background-color", "#000000", "important");
            el.style.setProperty("color", "#ffffff", "important");
            el.style.setProperty("border-color", "#ffffff", "important");
          }
        });

        // Handle text content in video containers
        const textElements = document.querySelectorAll(
          "[data-text-content] *:not(img)"
        );
        textElements.forEach((el) => {
          el.style.setProperty("color", "#ffffff", "important");
          el.style.setProperty("border-color", "#ffffff", "important");
          if (el.tagName !== "IMG") {
            el.style.setProperty(
              "background-color",
              "transparent",
              "important"
            );
          }
        });
      }, 200);
    }

    if (dyslexiaPref !== "none") {
      document.body.classList.add(`dyslexia-friendly-${dyslexiaPref}`);
    }

    if (motionPref === "reduced" || (motionPref === null && osReducedMotion)) {
      document.body.classList.add("manual-reduced-motion");
      window.currentMotionReduced = true;
    }

    document.documentElement.style.fontSize = fontPref + "%";
  }, []);

  // Handle motion preference change
  const handleMotionChange = (e) => {
    const reduced = e.target.checked;
    setMotionReduced(reduced);

    if (reduced) {
      document.body.classList.add("manual-reduced-motion");
    } else {
      document.body.classList.remove("manual-reduced-motion");
    }

    localStorage.setItem("motion-preference", reduced ? "reduced" : "full");
    window.currentMotionReduced = reduced;

    // Dispatch custom event to notify SmoothScroll component
    window.dispatchEvent(new CustomEvent("accessibilityChanged"));

    // Force immediate visibility for scroll elements when reduced motion is enabled
    if (reduced) {
      const scrollElements = document.querySelectorAll(".scroll-animate");
      scrollElements.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.classList.add("animate");
      });

      // Disable movie card hover animations
      const movieCards = document.querySelectorAll(
        '.movie-card, [class*="hover:scale"], [class*="group-hover:scale"]'
      );
      movieCards.forEach((card) => {
        card.style.transform = "none !important";
        card.style.transition = "none !important";
      });
    }
  };

  // Handle font size change with debouncing to prevent layout jitter
  const handleFontSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setFontSize(size);

    // Don't apply changes immediately while dragging to prevent layout shifts
    if (e.type === "input") {
      // Only update the display value while dragging
      return;
    }

    // Apply the font size change
    document.documentElement.style.fontSize = size + "%";
    localStorage.setItem("font-size-preference", size.toString());
  };

  // Handle final font size change when user stops dragging
  const handleFontSizeCommit = (e) => {
    const size = parseInt(e.target.value);
    document.documentElement.style.fontSize = size + "%";
    localStorage.setItem("font-size-preference", size.toString());
  };

  // Handle contrast change
  const handleContrastChange = (e) => {
    const high = e.target.checked;
    setHighContrast(high);

    if (high) {
      document.body.classList.add("high-contrast");

      // Immediately apply inline styles to force update
      setTimeout(() => {
        const allElements = document.querySelectorAll(
          "*:not(img):not([data-video-container] *):not([data-video-container])"
        );
        allElements.forEach((el) => {
          if (!el.closest("[data-video-container]") && el.tagName !== "IMG") {
            el.style.setProperty("background-color", "#000000", "important");
            el.style.setProperty("color", "#ffffff", "important");
            el.style.setProperty("border-color", "#ffffff", "important");
          }
        });

        // Handle text content in video containers
        const textElements = document.querySelectorAll(
          "[data-text-content] *:not(img)"
        );
        textElements.forEach((el) => {
          el.style.setProperty("color", "#ffffff", "important");
          el.style.setProperty("border-color", "#ffffff", "important");
          if (el.tagName !== "IMG") {
            el.style.setProperty(
              "background-color",
              "transparent",
              "important"
            );
          }
        });
      }, 10);
    } else {
      document.body.classList.remove("high-contrast");

      // Remove inline styles
      setTimeout(() => {
        const allElements = document.querySelectorAll("*");
        allElements.forEach((el) => {
          el.style.removeProperty("background-color");
          el.style.removeProperty("color");
          el.style.removeProperty("border-color");
        });
      }, 10);
    }

    localStorage.setItem("contrast-preference", high ? "high" : "normal");

    window.dispatchEvent(
      new CustomEvent("accessibilityChanged", {
        detail: { highContrast: high },
      })
    );
  };

  // Handle dyslexia font change
  const handleDyslexiaFontChange = (e) => {
    const selectedFont = e.target.value;
    setDyslexiaFont(selectedFont);

    // Remove all dyslexia font classes
    const dyslexiaClasses = [
      "dyslexia-friendly",
      "dyslexia-friendly-opendyslexic",
      "dyslexia-friendly-arial",
      "dyslexia-friendly-comic",
      "dyslexia-friendly-verdana",
      "dyslexia-friendly-tahoma",
    ];

    dyslexiaClasses.forEach((cls) => document.body.classList.remove(cls));

    // Add the selected font class
    if (selectedFont !== "none") {
      document.body.classList.add(`dyslexia-friendly-${selectedFont}`);
    }

    localStorage.setItem("dyslexia-font-preference", selectedFont);

    // Force a re-render to apply font changes
    document.body.style.fontFamily = ""; // Reset and trigger reflow
    setTimeout(() => {
      document.body.style.fontFamily = ""; // Ensure changes are applied
    }, 50);
  };

  // Reset all settings
  const handleReset = () => {
    const osReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const osHighContrast = window.matchMedia(
      "(prefers-contrast: high)"
    ).matches;

    setMotionReduced(osReducedMotion);
    setFontSize(100);
    setHighContrast(osHighContrast);
    setDyslexiaFont("none");

    // Apply reset changes
    if (osReducedMotion) {
      document.body.classList.add("manual-reduced-motion");
    } else {
      document.body.classList.remove("manual-reduced-motion");
    }

    document.documentElement.style.fontSize = "100%";

    if (osHighContrast) {
      document.body.classList.add("high-contrast");

      // Apply inline styles for high contrast when resetting to OS preference
      setTimeout(() => {
        const allElements = document.querySelectorAll(
          "*:not(img):not([data-video-container] *):not([data-video-container])"
        );
        allElements.forEach((el) => {
          if (!el.closest("[data-video-container]") && el.tagName !== "IMG") {
            el.style.setProperty("background-color", "#000000", "important");
            el.style.setProperty("color", "#ffffff", "important");
            el.style.setProperty("border-color", "#ffffff", "important");
          }
        });

        // Handle text content in video containers
        const textElements = document.querySelectorAll(
          "[data-text-content] *:not(img)"
        );
        textElements.forEach((el) => {
          el.style.setProperty("color", "#ffffff", "important");
          el.style.setProperty("border-color", "#ffffff", "important");
          if (el.tagName !== "IMG") {
            el.style.setProperty(
              "background-color",
              "transparent",
              "important"
            );
          }
        });
      }, 10);
    } else {
      document.body.classList.remove("high-contrast");

      // Remove inline styles when disabling high contrast
      setTimeout(() => {
        const allElements = document.querySelectorAll("*");
        allElements.forEach((el) => {
          el.style.removeProperty("background-color");
          el.style.removeProperty("color");
          el.style.removeProperty("border-color");
        });
      }, 10);
    }

    // Remove all dyslexia font classes
    const dyslexiaClasses = [
      "dyslexia-friendly",
      "dyslexia-friendly-opendyslexic",
      "dyslexia-friendly-arial",
      "dyslexia-friendly-comic",
      "dyslexia-friendly-verdana",
      "dyslexia-friendly-tahoma",
    ];
    dyslexiaClasses.forEach((cls) => document.body.classList.remove(cls));

    // Handle movie card animations based on reset state
    if (osReducedMotion) {
      const movieCards = document.querySelectorAll(
        '.movie-card, [class*="hover:scale"], [class*="group-hover:scale"]'
      );
      movieCards.forEach((card) => {
        card.style.transform = "none !important";
        card.style.transition = "none !important";
      });
    }

    // Clear localStorage
    localStorage.removeItem("motion-preference");
    localStorage.removeItem("font-size-preference");
    localStorage.removeItem("contrast-preference");
    localStorage.removeItem("dyslexia-font-preference");

    window.currentMotionReduced = osReducedMotion;

    // Dispatch custom event to notify SmoothScroll component
    window.dispatchEvent(new CustomEvent("accessibilityChanged"));

    // Force font reset
    document.body.style.fontFamily = "";
    setTimeout(() => {
      document.body.style.fontFamily = "";
    }, 50);
  };

  // Handle contact link click
  const handleContactClick = (e) => {
    e.preventDefault();

    // Close the accessibility panel first
    onClose();

    // Always navigate to the about page with the contact hash
    // This ensures proper page loading and scrolling
    window.location.href = "/about#contact";
  };

  return (
    <div
      id="accessibility-panel"
      className={`fixed top-16 right-4 w-80 bg-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-xl transition-all duration-200 ease-in-out z-[100] overflow-y-auto overflow-x-hidden ${
        isOpen
          ? "opacity-100 visible"
          : "opacity-0 invisible pointer-events-none"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4 w-full">
        {/* Panel Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white truncate pr-2">
            Accessibility Options
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors flex-shrink-0"
            aria-label="Close accessibility panel"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Motion Preferences */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-white mb-2">Motion</h3>
          <div className="space-y-2">
            <label className="flex items-center justify-between">
              <span className="text-slate-300 text-sm pr-2 flex-1">
                Reduce animations
              </span>
              <input
                type="checkbox"
                checked={motionReduced}
                onChange={handleMotionChange}
                className="w-4 h-4 bg-slate-800 border border-slate-600 rounded focus:ring-cyan-500 focus:ring-2 flex-shrink-0"
              />
            </label>
            <p className="text-xs text-slate-400 leading-relaxed">
              Minimizes motion and animations that may cause discomfort
            </p>
          </div>
        </div>

        {/* Font Size */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-white mb-2">Text Size</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">Font size</span>
              <span className="text-cyan-400 font-mono text-sm min-w-[3rem] text-right">
                {fontSize}%
              </span>
            </div>
            <div className="px-1 w-full">
              <input
                type="range"
                min="75"
                max="150"
                step="5"
                value={fontSize}
                onInput={handleFontSizeChange}
                onChange={handleFontSizeCommit}
                onMouseUp={handleFontSizeCommit}
                onTouchEnd={handleFontSizeCommit}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500 slider-custom"
                style={{
                  background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${
                    ((fontSize - 75) / 75) * 100
                  }%, #334155 ${((fontSize - 75) / 75) * 100}%, #334155 100%)`,
                }}
              />
            </div>
            {/* Labels positioned to match actual slider positions */}
            <div className="relative px-1 h-4 w-full">
              <div className="flex absolute w-full">
                <span className="text-xs text-slate-400 absolute left-0 transform -translate-x-1/2">
                  75%
                </span>
                <span className="text-xs text-slate-400 absolute left-1/3 transform -translate-x-1/2">
                  100%
                </span>
                <span className="text-xs text-slate-400 absolute left-2/3 transform -translate-x-1/2">
                  125%
                </span>
                <span className="text-xs text-slate-400 absolute right-0 transform translate-x-1/2">
                  150%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contrast */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-white mb-2">Contrast</h3>
          <div className="space-y-2">
            <label className="flex items-center justify-between">
              <span className="text-slate-300 text-sm pr-2 flex-1">
                High contrast mode
              </span>
              <input
                type="checkbox"
                checked={highContrast}
                onChange={handleContrastChange}
                className="w-4 h-4 bg-slate-800 border border-slate-600 rounded focus:ring-cyan-500 focus:ring-2 flex-shrink-0"
              />
            </label>
            <p className="text-xs text-slate-400 leading-relaxed">
              Uses black and white colors with bold borders for maximum
              visibility
            </p>
          </div>
        </div>

        {/* Dyslexia Support with Font Selection */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-white mb-2">
            Reading Support
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">
                Dyslexia-friendly font
              </span>
            </div>
            <select
              value={dyslexiaFont}
              onChange={handleDyslexiaFontChange}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {dyslexiaFontOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {/* Show description for selected font */}
            {dyslexiaFont !== "none" && (
              <p className="text-xs text-cyan-300 leading-relaxed">
                {
                  dyslexiaFontOptions.find((opt) => opt.value === dyslexiaFont)
                    ?.description
                }
              </p>
            )}
            <p className="text-xs text-slate-400 leading-relaxed">
              Fonts with improved spacing and readability features
            </p>
          </div>
        </div>

        {/* Reset Button */}
        <div className="pt-3 border-t border-slate-700">
          <button
            onClick={handleReset}
            className="w-full px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm rounded-lg transition-colors duration-200 border border-slate-600"
          >
            Reset to Default
          </button>
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-slate-700">
          <p className="text-xs text-slate-400 text-center leading-relaxed">
            Need help?{" "}
            <a
              href="/about#contact"
              onClick={handleContactClick}
              className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
            >
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
