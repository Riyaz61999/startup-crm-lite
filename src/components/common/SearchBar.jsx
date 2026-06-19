import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

/**
 * Debounced search input with magnifying glass and clear button.
 *
 * @param {Object} props
 * @param {string} props.value - Controlled debounced search value from parent.
 * @param {function(string): void} props.onChange - Called after 300ms debounce when input changes.
 * @returns {React.JSX.Element}
 */
const SearchBar = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState(value);
  const isClearingRef = useRef(false);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (isClearingRef.current) {
      isClearingRef.current = false;
      return;
    }

    const timer = setTimeout(() => {
      onChange(inputValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, onChange]);

  const handleClear = () => {
    isClearingRef.current = true;
    setInputValue('');
    onChange('');
  };

  return (
    <div className="relative flex-1 max-w-md">
      <Search
        className="w-4 h-4 text-text-gray dark:text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="text"
        placeholder="Search by name, company, or email..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full pl-10 pr-10 py-2 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
        aria-label="Search leads by name, company, or email"
      />
      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-gray dark:text-gray-400 hover:text-text-dark dark:hover:text-white p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
