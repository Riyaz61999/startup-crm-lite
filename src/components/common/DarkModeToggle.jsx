import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const DarkModeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 ${
        isDarkMode ? 'bg-[#2D4236]' : 'bg-primary/15'
      }`}
      aria-label="Toggle Dark Mode"
    >
      <span className="sr-only">Toggle Dark Mode</span>
      
      {/* Background icons for visual flair */}
      <div className="absolute inset-0 flex items-center justify-between px-1.5 w-full">
        <Moon className="h-4 w-4 text-primary" />
        <Sun className="h-4 w-4 text-accent" />
      </div>

      {/* The sliding toggle thumb */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute left-0.5 flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out ${
          isDarkMode ? 'translate-x-6 bg-[#18241D]' : 'translate-x-0'
        }`}
      >
        {isDarkMode ? (
          <Moon className="h-3.5 w-3.5 text-primary" />
        ) : (
          <Sun className="h-3.5 w-3.5 text-accent" />
        )}
      </span>
    </button>
  );
};

export default DarkModeToggle;
