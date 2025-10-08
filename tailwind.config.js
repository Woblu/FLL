/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // --- New Violet/Indigo Theme ---
        'primary-bg': '#10081c',      // Deep indigo/violet for the main background
        'ui-bg': '#1c0f33',          // A slightly lighter purple for UI panels, headers, etc.
        'accent': '#9c27b0',          // Bright, saturated purple for highlights and glows
        'text-primary': '#ffffff',    // Pure white for main text
        'text-secondary': '#a0aec0', // A light gray for secondary text
      },
      // Updated text shadow to use the new accent color
      textShadow: {
        'outline': '0 0 8px #9c27b0, -1px -1px 5px #9c27b0, 1px -1px 5px #9c27b0, -1px 1px 5px #9c27b0, 1px 1px 5px #9c27b0',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [
    plugin(function({ addUtilities, theme, e }) {
      const newUtilities = {};
      const textShadows = theme('textShadow');
      if (textShadows) {
        Object.entries(textShadows).forEach(([key, value]) => {
          newUtilities[`.${e(`text-shadow-${key}`)}`] = {
            textShadow: value,
          };
        });
      }
      addUtilities(newUtilities);
    })
  ],
}