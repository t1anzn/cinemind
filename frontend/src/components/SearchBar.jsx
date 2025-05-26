import { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  ChevronRightIcon,
  XMarkIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/20/solid";
import CustomSelect from "./CustomSelect";

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

  const [sortField, setSortField] = useState("popularity");
  const [sortOrder, setSortOrder] = useState("desc");

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
        const languageOptions = [
          { value: "", label: "All Languages" },
          ...uniqueLangs.map((lang) => ({
            value: lang,
            label: lang.toUpperCase(),
          })),
        ];
        setLanguages(languageOptions);
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
        sort_by: sortField,
        order: sortOrder,
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
    const updated = selectedGenres.includes(id)
      ? selectedGenres.filter((g) => g !== id)
      : [...selectedGenres, id];
    setSelectedGenres(updated);
  };

  const removeGenre = (id) => {
    setSelectedGenres((prev) => prev.filter((g) => g !== id));
  };

  const clearLanguage = () => setSelectedLanguage("");

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedGenres([]);
    clearLanguage();
    setSortField("popularity");
    setSortOrder("desc");
  };

  // Auto-update grid on filter/sort change
  useEffect(() => {
    onSearch({
      query: searchTerm,
      genres: selectedGenres,
      language: selectedLanguage,
      sort_by: sortField,
      order: sortOrder,
    });
  }, [selectedGenres, selectedLanguage, sortField, sortOrder]);

  const sortOrderOptions = [
    {
      value: "desc",
      label: "Descending",
      icon: <ArrowDownIcon className="h-4 w-4 text-slate-400" />,
    },
    {
      value: "asc",
      label: "Ascending",
      icon: <ArrowUpIcon className="h-4 w-4 text-slate-400" />,
    },
  ];

  const sortFieldOptions = [
    { value: "popularity", label: "Popularity" },
    { value: "vote_count", label: "Vote Count" },
    { value: "vote_average", label: "Rating" },
    { value: "runtime", label: "Runtime" },
    { value: "release_date", label: "Release Year" },
    { value: "title", label: "Alphabetical" },
  ];

  return (
    <div className="relative mx-auto w-full max-w-full mb-8 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
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

        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-gradient-to-b from-slate-800/30 to-transparent shadow-md shadow-blue-400/50 border border-blue-100/50 rounded-lg p-6 ">
          {/* Genre Selection */}
          <div className="space-y-3">
            <h3 className="text-slate-300 text-sm font-medium uppercase tracking-wider">
              Genres
            </h3>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <button
                  type="button"
                  key={genre.id}
                  onClick={() => toggleGenre(genre.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 
                hover:-translate-y-0.5 ${
                  selectedGenres.includes(genre.id)
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-900/50"
                    : "bg-slate-800/80 text-slate-400 hover:bg-slate-700/80 hover:text-slate-200"
                }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sort & Language Controls */}
          <div className="space-y-3">
            <h3 className="text-slate-300 text-sm font-medium uppercase tracking-wider">
              Sort & Filter
            </h3>
            <div className="space-y-3">
              <CustomSelect
                value={selectedLanguage}
                onChange={setSelectedLanguage}
                options={languages}
              />

              <div className="grid grid-cols-2 gap-3">
                <CustomSelect
                  value={sortField}
                  onChange={setSortField}
                  options={sortFieldOptions}
                />

                <CustomSelect
                  value={sortOrder}
                  onChange={setSortOrder}
                  options={sortOrderOptions}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-slate-400 font-light tracking-wide hover:text-blue-400 hover:-translate-y-0.5 transition-all duration-200"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </form>

      {/* Active Filters */}
      {(selectedGenres.length > 0 || selectedLanguage) && (
        <div className="flex flex-wrap items-center gap-2 pt-2 animate-[fadeIn_0.2s_ease-in-out]">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider opacity-0 animate-[fadeSlideIn_0.3s_ease-out_0.1s_forwards]">
            Active Filters:
          </span>
          {selectedGenres.map((id, index) => {
            const genre = genres.find((g) => g.id === id);
            return (
              <span
                key={id}
                className="bg-blue-800/40 hover:bg-blue-500 text-slate-200 text-xs px-3 py-1.5 rounded-full 
                flex items-center gap-2 border border-cyan-500/20 transition-all duration-300
                opacity-0 scale-95 animate-[fadeSlideIn_0.3s_ease-out_forwards] hover:-translate-y-0.5"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {genre?.name}
                <XMarkIcon
                  className="h-3.5 w-3.5 cursor-pointer hover:text-white hover:scale-110 transition-transform duration-200"
                  onClick={() => removeGenre(id)}
                />
              </span>
            );
          })}
          {selectedLanguage && (
            <span
              className="bg-cyan-900/50 hover:bg-cyan-800 text-cyan-100 text-xs px-3 py-1.5 rounded-full 
              flex items-center gap-2 border border-cyan-500/20 transition-all duration-300
              opacity-0 scale-95 animate-[fadeSlideIn_0.3s_ease-out_forwards] hover:-translate-y-0.5"
              style={{ animationDelay: `${selectedGenres.length * 0.1}s` }}
            >
              {selectedLanguage.toUpperCase()}
              <XMarkIcon
                className="h-3.5 w-3.5 cursor-pointer hover:text-white hover:scale-110 transition-transform duration-200"
                onClick={clearLanguage}
              />
            </span>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(-5px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
