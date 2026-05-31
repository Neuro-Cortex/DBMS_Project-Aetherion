import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// TYPES
// ============================================
interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: Option[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  multiple?: boolean;
  searchable?: boolean;
  disabled?: boolean;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================
export const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = 'Select...',
      label,
      error,
      multiple = false,
      searchable = false,
      disabled = false,
      className,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    // close on outside click
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // safe checks
    const isMultiple = multiple && Array.isArray(value);

    const selectedOption = !multiple
      ? options.find((opt) => opt.value === value)
      : null;

    const selectedValues: string[] = isMultiple ? value : [];

    const filteredOptions = searchable
      ? options.filter((opt) =>
          opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;

    const handleSelect = (optionValue: string) => {
      if (multiple) {
        const current = selectedValues;

        const newValues = current.includes(optionValue)
          ? current.filter((v) => v !== optionValue)
          : [...current, optionValue];

        onChange?.(newValues);
      } else {
        onChange?.(optionValue);
        setIsOpen(false);
      }
    };

    const removeValue = (optionValue: string) => {
      if (!multiple) return;

      const newValues = selectedValues.filter((v) => v !== optionValue);
      onChange?.(newValues);
    };

    return (
      <div ref={containerRef} className={clsx('relative', className)}>
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {label}
          </label>
        )}

        {/* Select Box */}
        <div
          ref={ref}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          className={clsx(
            'w-full min-h-[44px] px-4 py-2.5 border rounded-xl bg-white dark:bg-gray-800 cursor-pointer transition-all',
            'flex items-center gap-2 flex-wrap',
            error ? 'border-red-300' : 'border-gray-300 dark:border-gray-600',
            disabled && 'opacity-50 cursor-not-allowed',
            isOpen && 'ring-2 ring-blue-500 border-transparent'
          )}
        >
          {/* MULTI SELECT */}
          {multiple ? (
            selectedValues.length > 0 ? (
              selectedValues.map((val) => {
                const opt = options.find((o) => o.value === val);

                return (
                  <span
                    key={val}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg text-sm"
                  >
                    {opt?.label}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeValue(val);
                      }}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )
          ) : (
            <span
              className={
                selectedOption
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-400'
              }
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          )}

          {/* Arrow */}
          <ChevronDown
            className={clsx(
              'ml-auto w-5 h-5 text-gray-400 transition-transform',
              isOpen && 'rotate-180'
            )}
          />
        </div>

        {/* Error */}
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden"
            >
              {/* Search */}
              {searchable && (
                <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}

              {/* Options */}
              <div className="max-h-60 overflow-y-auto">
                {filteredOptions.map((option) => {
                  const isSelected = multiple
                    ? selectedValues.includes(option.value)
                    : value === option.value;

                  return (
                    <div
                      key={option.value}
                      onClick={() =>
                        !option.disabled && handleSelect(option.value)
                      }
                      className={clsx(
                        'px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center gap-2',
                        option.disabled
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700',
                        isSelected &&
                          'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                      )}
                    >
                      {multiple && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          readOnly
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      )}
                      {option.label}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;