// src/components/common/SmartSearch.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'doctor' | 'hospital' | 'medicine' | 'article' | 'user';
  title: string;
  subtitle: string;
  icon: string;
  url: string;
}

export const SmartSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const trendingSearches = [
    'Blood Donation',
    'Paracetamol',
    'Dr. Sarah Wilson',
    'City Hospital',
    'Pregnancy Tips'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.length > 2) {
      // Simulate search
      const mockResults: SearchResult[] = [
        {
          id: '1',
          type: 'doctor',
          title: 'Dr. Sarah Wilson',
          subtitle: 'Cardiologist - City Hospital',
          icon: '👨‍⚕️',
          url: '/doctors/1'
        },
        {
          id: '2',
          type: 'medicine',
          title: 'Paracetamol 500mg',
          subtitle: 'Pain Relief - Available at 5 pharmacies',
          icon: '💊',
          url: '/medicines/1'
        },
        {
          id: '3',
          type: 'hospital',
          title: 'City General Hospital',
          subtitle: '4.5 ⭐ - 2.5 km away',
          icon: '🏥',
          url: '/hospitals/1'
        }
      ];
      setResults(mockResults);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const handleSelect = (result: SearchResult) => {
    // Add to recent searches
    setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    setQuery('');
    setIsOpen(false);
    // Navigate to result
    window.location.href = result.url;
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search doctors, hospitals, medicines..."
          className="w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setIsOpen(false); }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl border overflow-hidden">
          {results.length > 0 ? (
            <div className="py-2">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className="w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3"
                >
                  <span className="text-2xl">{result.icon}</span>
                  <div className="text-left">
                    <p className="font-medium">{result.title}</p>
                    <p className="text-xs text-gray-500">{result.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : query.length > 0 ? (
            <div className="p-4 text-center text-gray-500">
              No results found for "{query}"
            </div>
          ) : (
            <div className="p-4">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-gray-500 mb-2 flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> Recent
                  </h4>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              )}

              {/* Trending */}
              <div>
                <h4 className="text-xs font-medium text-gray-500 mb-2 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" /> Trending
                </h4>
                {trendingSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    🔥 {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartSearch;