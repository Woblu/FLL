import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext'; // Import useTheme hook

export default function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out
                  ${isDarkMode ? 'bg-gray-700' : 'bg-yellow-400'}`}
      aria-pressed={isDarkMode}
      aria-label="Toggle dark mode"
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                    ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`}
      />
      <span className={`absolute left-1 ${isDarkMode ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
        <Sun size={16} className="text-white" />
      </span>
      <span className={`absolute right-1 ${isDarkMode ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
        <Moon size={16} className="text-white" />
      </span>
    </button>
  );
}