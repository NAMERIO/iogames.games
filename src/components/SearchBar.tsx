import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };
  const clearSearch = () => {
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  };
  return (
    <form 
      onSubmit={handleSubmit} 
      className={`relative w-full max-w-md transition-all duration-300 ${isFocused ? 'scale-105' : ''}`}
    >
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search games... (Ctrl+K)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full py-2 pl-10 pr-10 bg-gray-800 text-white rounded-lg focus:outline-none transition-all duration-300 ${
            isFocused 
              ? 'ring-2 ring-indigo-500 bg-gray-700' 
              : 'hover:bg-gray-700'
          }`}
        />
        <button
          type="submit"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        >
          <Search className={`h-5 w-5 transition-colors duration-300 ${isFocused ? 'text-indigo-400' : ''}`} />
        </button>
        
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      {isFocused && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 mr-8">
          Press Enter to search
        </div>
      )}
    </form>
  );
};

export default SearchBar;