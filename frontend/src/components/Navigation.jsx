import { useState } from "react";

export default function Navbar() {

  return (
    <header class="sticky top-0 backdrop-blur-md border-b border-slate-800/50 bg-black/70 py-2 shadow-lg shadow-black/50 z-1000">
        
        <div class="content-wrapper flex justify-between items-center ">
          <div class="flex items-center space-x-10 relative">
            
            {/* Logo */}
            <a href="/" class="text-2xl font-light tracking-widest text-white relative group">
            <span className="bg-gradient-to-r from-cyan-200 to-blue-400 bg-clip-text text-transparent">CINE
            <span className="font-bold">MIND</span></span>
            </a>

            {/* <-- Desktop Links --> */}
            <nav class="text-white p-5">
              <div class="hidden md:flex space-x-10"> 
                <a href="/" class="text-white/80 hover:text-cyan-400 transition-colors duration-300 text-sm font-light tracking-wider group relative px-1 py-1">HOME</a>
                <a href="/movies" class="text-white/80 hover:text-cyan-400 transition-colors duration-300 text-sm font-light tracking-wider group relative px-1 py-1">MOVIES</a>
                <a href="#" class="text-white/80 hover:text-cyan-400 transition-colors duration-300 text-sm font-light tracking-wider group relative px-1 py-1">ABOUT</a>
              </div>
            </nav>

            {/* <-- Mobile Menu Button (will be functional later) --> */}
            <button class="md:hidden">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
        </div>
    </header>
  );
}