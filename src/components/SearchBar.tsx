"use client";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Cari barang, kategori, lokasi, atau nama..." }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    // Real-time search on input change
    onSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-full h-[48px] sm:h-[52px]">
      <div className="relative w-full h-full group">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full h-full px-3 sm:px-4 pl-10 sm:pl-12 pr-10 sm:pr-12 border-2 rounded-xl focus:outline-none transition-all duration-300 text-gray-900 placeholder:text-gray-400 text-sm sm:text-base shadow-sm hover:shadow-md font-medium"
          style={{
            borderColor: isFocused ? 'rgba(17, 77, 145)' : '#e5e7eb',
            backgroundColor: isFocused ? 'rgba(17, 77, 145, 0.02)' : 'white'
          }}
        />
        <div 
          className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300"
          style={{ color: isFocused ? 'rgba(17, 77, 145)' : '#9ca3af' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              onSearch("");
            }}
            className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-200 bg-gray-100 hover:bg-red-50 rounded-full p-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        {/* Search indicator */}
        {query && (
          <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
        )}
      </div>
    </form>
  );
}
