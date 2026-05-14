// src/components/common/SearchBar.tsx

import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  ArrowRight, 
  Clock,
  TrendingUp,
  Mic,
  Filter,
  LucideIcon 
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Badge } from '../ui/Badge';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface SearchSuggestion {
  id: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  category?: string;
  url?: string;
  recent?: boolean;
  type?: 'recent' | 'trending' | 'category';
  text?: string;
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'doctor' | 'hospital' | 'appointment' | 'medicine' | 'article';
  image?: string;
  url: string;
}

export interface SearchBarProps {
  // Basic props
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSearch?: (query: string) => void;
  onResultClick?: (result: SearchResult) => void;
  onSuggestionClick?: (suggestion: SearchSuggestion) => void;
  onVoiceInput?: (transcript: string) => void;
  
  // Data props
  suggestions?: SearchSuggestion[];
  results?: SearchResult[];
  recentSearches?: string[];
  trendingSearches?: string[];
  
  // UI props
  variant?: 'default' | 'glass' | 'gradient' | 'neon' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  showVoiceSearch?: boolean;
  showFilters?: boolean;
  showSuggestions?: boolean;
  
  // State props
  isLoading?: boolean;
  loading?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  voiceEnabled?: boolean;
  
  // Behavior props
  debounceDelay?: number;
  
  // Style props
  className?: string;
  containerClassName?: string;
  
  // Event props
  onFocus?: () => void;
  onBlur?: () => void;
}

// ============================================
// VARIANT STYLES
// ============================================

const variantStyles = {
  default: `
    bg-white dark:bg-gray-800
    border border-gray-300 dark:border-gray-600
    focus-within:border-blue-500 dark:focus-within:border-blue-400
    focus-within:ring-2 focus-within:ring-blue-500/20
    text-gray-900 dark:text-white
  `,
  glass: `
    bg-white/10 dark:bg-gray-900/10
    backdrop-blur-xl backdrop-saturate-150
    border border-white/20 dark:border-gray-700/20
    focus-within:border-cyan-500/50
    focus-within:ring-2 focus-within:ring-cyan-500/20
    text-white placeholder-white/60
  `,
  gradient: `
    bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30
    border border-purple-200 dark:border-purple-800
    focus-within:border-purple-500
    focus-within:ring-2 focus-within:ring-purple-500/20
    text-gray-900 dark:text-white
  `,
  neon: `
    bg-gray-900/90 dark:bg-black/90
    border-2 border-cyan-500/50
    focus-within:border-cyan-400
    focus-within:shadow-[0_0_20px_rgba(6,182,212,0.3)]
    text-cyan-100 placeholder-cyan-300/50
  `,
  minimal: `
    bg-transparent
    border-0 border-b-2 border-gray-300 dark:border-gray-600
    focus:border-indigo-500 focus:ring-0
    text-gray-900 dark:text-white
    rounded-none
  `,
};

const sizeStyles = {
  sm: 'py-1.5 px-3 text-sm rounded-xl',
  md: 'py-2 px-4 text-base rounded-2xl',
  lg: 'py-3 px-5 text-lg rounded-3xl',
};

const iconSizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

// ============================================
// SEARCH BAR COMPONENT
// ============================================

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({
    placeholder = 'Search doctors, hospitals, medicines...',
    value: externalValue,
    defaultValue = '',
    onChange,
    onSearch,
    onResultClick,
    onSuggestionClick,
    onVoiceInput,
    suggestions = [],
    results = [],
    recentSearches = [],
    trendingSearches = [],
    variant = 'default',
    size = 'md',
    fullWidth = false,
    showVoiceSearch = true,
    showFilters = true,
    showSuggestions = true,
    isLoading = false,
    loading = false,
    disabled = false,
    autoFocus = false,
    voiceEnabled = true,
    debounceDelay = 300,
    className,
    containerClassName,
    onFocus,
    onBlur,
  }, ref) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [isFocused, setIsFocused] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout>();

    const value = externalValue !== undefined ? externalValue : internalValue;
    const isLoaded = isLoading || loading;

    // Debounced search
    useEffect(() => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      if (onChange) {
        debounceTimerRef.current = setTimeout(() => {
          onChange(value);
        }, debounceDelay);
      }

      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
      };
    }, [value, debounceDelay, onChange]);

    // Close dropdown on outside click
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setShowDropdown(false);
          setIsFocused(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (externalValue === undefined) {
        setInternalValue(newValue);
      }
      setShowDropdown(newValue.length > 0);
    };

    const handleSearch = () => {
      if (value.trim()) {
        onSearch?.(value);
        setShowDropdown(false);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    };

    const handleClear = () => {
      if (externalValue === undefined) {
        setInternalValue('');
      }
      onChange?.('');
      inputRef.current?.focus();
      setShowDropdown(false);
    };

    const handleVoiceSearch = () => {
      if (!voiceEnabled) return;
      
      setIsListening(true);
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (externalValue === undefined) {
            setInternalValue(transcript);
          }
          onChange?.(transcript);
          onVoiceInput?.(transcript);
          setIsListening(false);
          onSearch?.(transcript);
        };
        
        recognition.onerror = () => {
          setIsListening(false);
        };
        
        recognition.start();
      } else {
        alert('Voice search is not supported in your browser');
        setIsListening(false);
      }
    };

    const handleSuggestionClick = (suggestion: SearchSuggestion) => {
      const suggestionText = suggestion.text || suggestion.title;
      if (externalValue === undefined) {
        setInternalValue(suggestionText);
      }
      onChange?.(suggestionText);
      onSuggestionClick?.(suggestion);
      onSearch?.(suggestionText);
      setShowDropdown(false);
    };

    const handleResultClick = (result: SearchResult) => {
      onResultClick?.(result);
      setShowDropdown(false);
    };

    // Filter and group suggestions
    const filteredSuggestions = suggestions.filter(s =>
      (s.text || s.title).toLowerCase().includes(value.toLowerCase())
    );

    const groupedSuggestions = filteredSuggestions.reduce((acc, suggestion) => {
      const category = suggestion.category || 'General';
      if (!acc[category]) acc[category] = [];
      acc[category].push(suggestion);
      return acc;
    }, {} as Record<string, SearchSuggestion[]>);

    const hasDropdown = showDropdown && (
      filteredSuggestions.length > 0 || 
      results.length > 0 || 
      (recentSearches.length > 0 && !value) ||
      (trendingSearches.length > 0 && !value)
    );

    return (
      <div
        ref={containerRef}
        className={twMerge('relative', fullWidth && 'w-full', containerClassName)}
      >
        {/* Search Input Container */}
        <div
          className={clsx(
            'flex items-center gap-2 transition-all duration-200',
            variantStyles[variant],
            isFocused && 'ring-2 ring-opacity-50',
            disabled && 'opacity-60 cursor-not-allowed',
            fullWidth && 'w-full'
          )}
        >
          {/* Search Icon */}
          <div className="flex-shrink-0 pl-3">
            <Search className={clsx(
              iconSizeStyles[size],
              isFocused ? 'text-blue-500' : 'text-gray-400'
            )} />
          </div>

          {/* Input Field */}
          <input
            ref={(node) => {
              if (typeof ref === 'function') ref(node);
              else if (ref) ref.current = node;
              inputRef.current = node;
            }}
            type="text"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setIsFocused(true);
              setShowDropdown(value.length > 0);
              onFocus?.();
            }}
            onBlur={() => {
              setTimeout(() => {
                if (!containerRef.current?.contains(document.activeElement)) {
                  setIsFocused(false);
                  setShowDropdown(false);
                  onBlur?.();
                }
              }, 150);
            }}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus={autoFocus}
            className={clsx(
              'flex-1 bg-transparent outline-none',
              'text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500',
              sizeStyles[size],
              disabled && 'cursor-not-allowed'
            )}
          />

          {/* Loading Indicator */}
          {isLoaded && (
            <div className="flex-shrink-0">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Clear Button */}
          {value && !disabled && !isLoaded && (
            <button
              type="button"
              onClick={handleClear}
              className="flex-shrink-0 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition"
            >
              <X className={clsx('text-gray-400 hover:text-gray-600', iconSizeStyles[size])} />
            </button>
          )}

          {/* Voice Search Button */}
          {showVoiceSearch && voiceEnabled && !disabled && (
            <button
              type="button"
              onClick={handleVoiceSearch}
              className={clsx(
                'flex-shrink-0 p-1 rounded-full transition',
                isListening 
                  ? 'text-red-500 animate-pulse bg-red-500/10' 
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              )}
            >
              <Mic className={iconSizeStyles[size]} />
            </button>
          )}

          {/* Filters Button */}
          {showFilters && !disabled && (
            <button
              type="button"
              className="flex-shrink-0 p-1 mr-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
            >
              <Filter className={iconSizeStyles[size]} />
            </button>
          )}

          {/* Search Button */}
          <button
            type="button"
            onClick={handleSearch}
            className={clsx(
              'flex-shrink-0 p-1 mr-2 rounded-full transition',
              'text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'
            )}
          >
            <ArrowRight className={iconSizeStyles[size]} />
          </button>
        </div>

        {/* Dropdown Suggestions/Results */}
        <AnimatePresence>
          {hasDropdown && showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={clsx(
                'absolute top-full left-0 right-0 mt-2',
                'bg-white dark:bg-gray-800',
                'border border-gray-200 dark:border-gray-700',
                'rounded-xl shadow-lg overflow-hidden z-50 max-h-96 overflow-y-auto',
                variant === 'glass' && 'backdrop-blur-xl bg-white/10 dark:bg-gray-900/10'
              )}
            >
              {/* Suggestions by category */}
              {Object.entries(groupedSuggestions).length > 0 && (
                <div className="py-2">
                  {Object.entries(groupedSuggestions).map(([category, items]) => (
                    <div key={category}>
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                        {category}
                      </div>
                      {items.map((suggestion) => {
                        const Icon = suggestion.icon || Search;
                        const suggestionText = suggestion.text || suggestion.title;
                        return (
                          <button
                            key={suggestion.id}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-3"
                          >
                            <Icon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{suggestionText}</span>
                            {suggestion.description && (
                              <span className="text-xs text-gray-400 ml-auto">{suggestion.description}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}

              {/* Results */}
              {results.length > 0 && (
                <div className="py-2 border-t border-gray-100 dark:border-gray-700">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Results
                  </div>
                  {results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{result.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{result.description}</p>
                      <Badge variant="info" size="xs" className="mt-1">
                        {result.type}
                      </Badge>
                    </button>
                  ))}
                </div>
              )}

              {/* Recent Searches */}
              {recentSearches.length > 0 && !value && (
                <div className="py-2 border-t border-gray-100 dark:border-gray-700">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Recent
                  </div>
                  {recentSearches.map((search, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (externalValue === undefined) {
                          setInternalValue(search);
                        }
                        onChange?.(search);
                        onSearch?.(search);
                        setShowDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-3"
                    >
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{search}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Trending Searches */}
              {trendingSearches.length > 0 && !value && (
                <div className="py-2 border-t border-gray-100 dark:border-gray-700">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-2">
                    <TrendingUp className="w-3 h-3" />
                    Trending
                  </div>
                  {trendingSearches.map((search, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (externalValue === undefined) {
                          setInternalValue(search);
                        }
                        onChange?.(search);
                        onSearch?.(search);
                        setShowDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-3"
                    >
                      <TrendingUp className="w-4 h-4 text-orange-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{search}</span>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';

// ============================================
// DEFAULT EXPORT
// ============================================

export default SearchBar;