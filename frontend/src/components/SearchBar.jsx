import { useState, useEffect }from "react";
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { ChevronRightIcon } from '@heroicons/react/24/solid'

export default function Searchbar(){
const [searchTerm, setSearchTerm] = useState('');
const [isSearching, setIsSearching] = useState(false);
const [isFocused, setIsFocused] = useState(false);
const [isTyping, setIsTyping] = useState(false);



  // Handle form submission
    const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    };

    // Handle input changes
    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        setIsTyping(true);
        clearTimeout(window.searchTypingTimeout);
        window.searchTypingTimeout = setTimeout(() => {
            setIsTyping(false);
            }, 1000);
        };



    return (
        <>
        <div className="relative mx-auto max-w-xl mb-8">

            <form onSubmit={handleSubmit} className="relative">
                <div className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r from-cyan-900/20 via-blue/20 to-cyan-900/20 rounded-lg blur-sm transition-opacity duration-300 ${isFocused || isTyping ? 'opacity-100' : 'opacity-0'}`}></div>
                    
                    <input
                    type="text"
                    className={`w-full px-5 py-3 pl-12 pr-24 text-white bg-black/60 backdrop-blur-md border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-700 placeholder-slate-500 transition-all duration-300 font-light tracking-wide shadow-inner shadow-black/50 ${isFocused ? 'shadow-cyan-900/20' : ''}`}            
                    placeholder="SEARCH MOVIES..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    />

                    <div className="absolute inset-y-6 left-0 flex items-center pl-3.5 pointer-events-none">
                        <span className="text-slate-400 inline-flex">
                            <MagnifyingGlassIcon className="h-5 w-5" />
                        </span>
                    </div>

                    <button
                    type="submit"
                    className={`absolute right-2 inset-y-2 px-5 py-2 text-xs tracking-wide font-light text-white transition-all duration-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:ring-opacity-50 uppercase flex items-center
                        ${searchTerm && !isSearching
                            ? 'bg-gradient-to-r from-cyan-900 to-blue-900 hover:from-cyan-800 hover:to-blue-800'
                            : 'bg-slate-800/70 text-slate-500 cursor-not-allowed'
                        }`}
                    >
                    <span>Search</span>    
                    <span className="text-white inline-flex ml-1.5">
                        <ChevronRightIcon className="h-4 w-4" />
                    </span>
                    </button>
                </div>
            </form>
        </div>
        </>
    )
}