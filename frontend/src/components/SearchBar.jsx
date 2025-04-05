import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, ChevronRightIcon } from '@heroicons/react/20/solid'; // Heroicons

export default function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    // Fetch suggestions as user types
    useEffect(() => {
        if (searchTerm.length > 1) {
            setIsTyping(true);
            fetch(`http://127.0.0.1:5000/movies/suggest?query=${searchTerm}`)
                .then(res => res.json())
                .then(setSuggestions)
                .finally(() => setIsTyping(false));
        } else {
            setSuggestions([]);
        }
    }, [searchTerm]);

    // Handle input change
    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const match = suggestions.find(
            (m) => m.title.toLowerCase() === searchTerm.toLowerCase()
        );

        console.log(match);

        if (match) {
            setIsSearching(true);
            // Native navigation works best with Astro
            window.location.href = `/movie/${match.id}`;
        }
    };

    return (
        <div className="relative mx-auto max-w-xl mb-8">
            <form onSubmit={handleSubmit} className="relative">
                <div className="relative group">
                    <div className={`absolute inset-0 bg-gradient-to-r from-cyan-900/20 via-blue/20 to-cyan-900/20 rounded-lg blur-sm transition-opacity duration-300 ${isFocused || isTyping ? 'opacity-100' : 'opacity-0'}`} />
                    
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
                        disabled={!searchTerm || isSearching}
                    >
                        <span>Search</span>
                        <span className="text-white inline-flex ml-1.5">
                            <ChevronRightIcon className="h-4 w-4" />
                        </span>
                    </button>
                </div>
            </form>

            {/* Suggestions dropdown */}
            {suggestions.length > 0 && (
                <ul className="absolute z-10 bg-gray-900 text-white w-full mt-1 rounded max-h-48 overflow-y-auto">
                    {suggestions.map(movie => (
                        <li 
                            key={movie.id} 
                            onClick={() => setSearchTerm(movie.title)}
                            className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                        >
                            {movie.title}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

