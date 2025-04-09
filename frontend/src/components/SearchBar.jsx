import { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";

export default function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSuggestionClicked, setIsSuggestionClicked] = useState(false);

  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);

  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");

  // Fetch genres
  useEffect(() => {
    fetch("http://127.0.0.1:5000/genres")
      .then((res) => res.json())
      .then(setGenres);
  }, []);

  // Fetch distinct original languages from movies table
  useEffect(() => {
    fetch("http://127.0.0.1:5000/movies")
      .then((res) => res.json())
      .then((data) => {
        const uniqueLangs = [
          ...new Set(data.movies.map((m) => m.original_language)),
        ].filter(Boolean);
        setLanguages(["", ...uniqueLangs]);
      });
  }, []);

  // Fetch search suggestions
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({
        query: searchTerm,
        genres: selectedGenres,
        language: selectedLanguage,
      });
    }
    setIsSuggestionClicked(true);
    setSuggestions([]);
  };

  const handleSuggestionClick = (movie) => {
    setSearchTerm(movie.title);
    setSuggestions([]);
    setIsSuggestionClicked(true);
  };

  const toggleGenre = (id) => {
    const updated =
      selectedGenres.includes(id)
        ? selectedGenres.filter((g) => g !== id)
        : [...selectedGenres, id];
    setSelectedGenres(updated);
  };

  const removeGenre = (id) => {
    setSelectedGenres((prev) => prev.filter((g) => g !== id));
  };

  const clearLanguage = () => setSelectedLanguage("");

  // Auto-update grid on filter change
  useEffect(() => {
    onSearch({
      query: searchTerm,
      genres: selectedGenres,
      language: selectedLanguage,
    });
  }, [selectedGenres, selectedLanguage]);

  return (
    <div className="relative mx-auto max-w-xl mb-8 space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Search input */}
        <div className="relative group">
          <input
            type="text"
            placeholder="SEARCH MOVIES..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

        {/* Multi-select Genres */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {genres.map((genre) => (
            <label
              key={genre.id}
              className={`cursor-pointer text-sm px-3 py-1 rounded-full border transition-all ${
                selectedGenres.includes(genre.id)
                  ? "bg-cyan-600 text-white border-cyan-600"
                  : "bg-slate-800 text-slate-300 border-slate-700"
              }`}
              onClick={() => toggleGenre(genre.id)}
            >
              {genre.name}
            </label>
          ))}
        </div>

        {/* Language Dropdown */}
        <select
          className="w-full px-4 py-2 bg-black/60 text-white border border-slate-700 rounded-lg focus:outline-none"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          <option value="">All Languages</option>
          {languages.map(
            (lang) =>
              lang && (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              )
          )}
        </select>
      </form>

      {/* Pills for selected filters */}
      <div className="flex flex-wrap gap-2 pt-2">
        {selectedGenres.map((id) => {
          const genre = genres.find((g) => g.id === id);
          return (
            <span
              key={id}
              className="bg-cyan-700 text-white text-xs px-3 py-1 rounded-full flex items-center gap-2"
            >
              {genre?.name}
              <XMarkIcon
                className="h-4 w-4 cursor-pointer"
                onClick={() => removeGenre(id)}
              />
            </span>
          );
        })}

        {selectedLanguage && (
          <span className="bg-cyan-700 text-white text-xs px-3 py-1 rounded-full flex items-center gap-2">
            {selectedLanguage.toUpperCase()}
            <XMarkIcon className="h-4 w-4 cursor-pointer" onClick={clearLanguage} />
          </span>
        )}
      </div>

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
