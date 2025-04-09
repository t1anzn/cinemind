import { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";

export default function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSuggestionClicked, setIsSuggestionClicked] = useState(false);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");

  // Fetch genres on mount
  useEffect(() => {
    fetch("http://127.0.0.1:5000/genres")
      .then((res) => res.json())
      .then((data) =>
        setGenres([{ id: "", name: "All Genres" }, ...data])
      );
  }, []);

  // Fetch suggestions
  useEffect(() => {
    if (isSuggestionClicked) {
      setIsSuggestionClicked(false);
      return;
    }

    if (searchTerm.length > 1) {
      setIsTyping(true);
      fetch(`http://127.0.0.1:5000/movies/suggest?query=${searchTerm}`)
        .then((res) => res.json())
        .then(setSuggestions)
        .finally(() => setIsTyping(false));
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ query: searchTerm, genre: selectedGenre });
    }
    setIsSuggestionClicked(true);
    setSuggestions([]);
    const match = suggestions.find(
      (m) => m.title.toLowerCase() === searchTerm.toLowerCase()
    );

    if (match) setIsSearching(true);
  };

  const handleSuggestionClick = (movie) => {
    setSearchTerm(movie.title);
    setSuggestions([]);
    setIsSuggestionClicked(true);
  };

  return (
    <div className="relative mx-auto max-w-xl mb-8 space-y-4">
      <form onSubmit={handleSubmit} className="relative space-y-2">
        <div className="relative group">
          {/* Search input */}
          <input
            type="text"
            placeholder="SEARCH MOVIES..."
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`w-full px-5 py-3 pl-12 pr-24 text-white bg-black/60 backdrop-blur-md border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-700 placeholder-slate-500 transition-all duration-300 font-light tracking-wide shadow-inner shadow-black/50 ${
              isFocused ? "shadow-cyan-900/20" : ""
            }`}
          />

          <div className="absolute inset-y-6 left-0 flex items-center pl-3.5 pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
          </div>

          <button
            type="submit"
            className={`absolute right-2 inset-y-2 px-5 py-2 text-xs tracking-wide font-light text-white transition-all duration-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:ring-opacity-50 uppercase flex items-center ${
              searchTerm && !isSearching
                ? "bg-gradient-to-r from-cyan-900 to-blue-900 hover:from-cyan-800 hover:to-blue-800"
                : "bg-slate-800/70 text-slate-500 cursor-not-allowed"
            }`}
            disabled={!searchTerm || isSearching}
          >
            <span>Search</span>
            <ChevronRightIcon className="h-4 w-4 ml-1.5" />
          </button>
        </div>

        {/* Genre Dropdown */}
        <select
          className="w-full px-4 py-2 bg-black/60 text-white border border-slate-700 rounded-lg focus:outline-none"
          value={selectedGenre}
          onChange={(e) => {
            const newGenre = e.target.value;
            setSelectedGenre(newGenre);
            onSearch({ query: searchTerm, genre: newGenre }); // auto-update grid
          }}
        >
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </form>

      {/* Suggestions dropdown */}
      {suggestions.length > 0 && (
        <ul
          className="absolute z-10 bg-gradient-to-b from-gray-900/10 to-gray-900 backdrop-blur-sm text-white w-full mt-1 rounded max-h-48 overflow-y-auto"
          onMouseDown={(e) => e.preventDefault()}
        >
          {suggestions.map((movie) => (
            <li
              key={movie.id}
              onClick={() => handleSuggestionClick(movie)}
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

