/**
 * Navigation Component
 *
 * Sticky header navigation with responsive mobile menu.
 * Features:
 * - Sticky positioning with backdrop blur and transparency effects
 * - Gradient logo styling with hover animations
 * - Desktop horizontal navigation with hover effects
 * - Mobile hamburger menu with slide-out sidebar
 * - Backdrop overlay with click-to-close functionality
 *
 * Used site-wide as the primary navigation interface.
 */

import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 backdrop-blur-md border-b border-slate-800/50 bg-black/70 py-2 shadow-lg shadow-black/50 z-1000">
      <div className="content-wrapper flex justify-between items-center ">
        <div className="flex items-center space-x-10 relative w-full">
          {/* Logo */}
          <a
            href="/"
            className="text-2xl font-light tracking-widest text-white relative group pl-12 md:pl-0"
          >
            <span className="bg-gradient-to-r from-cyan-200 to-blue-400 bg-clip-text text-transparent">
              CINE
              <span className="font-bold">MIND</span>
            </span>
          </a>

          {/* Desktop Links */}
          <nav className="text-white p-5">
            <div className="hidden md:flex space-x-10">
              <a
                href="/"
                className="text-white/80 hover:text-cyan-400 transition-colors duration-300 text-sm font-light tracking-wider group relative px-1 py-1"
              >
                HOME
              </a>
              <a
                href="/movies"
                className="text-white/80 hover:text-cyan-400 transition-colors duration-300 text-sm font-light tracking-wider group relative px-1 py-1"
              >
                MOVIES
              </a>
              <a
                href="/about"
                className="text-white/80 hover:text-cyan-400 transition-colors duration-300 text-sm font-light tracking-wider group relative px-1 py-1"
              >
                ABOUT
              </a>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 text-white z-[1001]"
        aria-label="Open navigation menu"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16m-7 6h7"
          ></path>
        </svg>
      </button>

      {/* Sidebar and Backdrop */}
      {/* Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[1000] md:hidden"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-slate-900/80 z-[1001] transform transition-transform duration-300 md:hidden
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ boxShadow: menuOpen ? "2px 0 16px rgba(0,0,0,0.3)" : "none" }}
      >
        <button
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
          aria-label="Close navigation menu"
          onClick={() => setMenuOpen(false)}
        >
          <svg
            className="w-7 h-7"
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
        <nav className="flex flex-col mt-20 space-y-8 px-8">
          <a
            href="/"
            className="text-white text-xl font-light tracking-wider hover:text-cyan-400 transition-colors duration-300"
            onClick={() => setMenuOpen(false)}
          >
            HOME
          </a>
          <a
            href="/movies"
            className="text-white text-xl font-light tracking-wider hover:text-cyan-400 transition-colors duration-300"
            onClick={() => setMenuOpen(false)}
          >
            MOVIES
          </a>
          <a
            href="/about"
            className="text-white text-xl font-light tracking-wider hover:text-cyan-400 transition-colors duration-300"
            onClick={() => setMenuOpen(false)}
          >
            ABOUT
          </a>
        </nav>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease;
        }
      `}</style>
    </header>
  );
}
