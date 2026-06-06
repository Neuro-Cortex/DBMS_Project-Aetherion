import React from 'react';

interface AISuggestionChipsProps {
  suggestions?: string[];
  onSelect?: (suggestion: string) => void;
}

export const AISuggestionChips: React.FC<AISuggestionChipsProps> = ({ suggestions = [], onSelect }) => {
  if (!suggestions.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((s, i) => (
        <button key={i} onClick={() => onSelect?.(s)} className="px-3 py-1 text-sm rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200">
          {s}
        </button>
      ))}
    </div>
  );
};

export default AISuggestionChips;
