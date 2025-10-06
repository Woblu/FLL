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
        // --- New Bright Neon Theme ---
        'bg-pink': '#FF1D89',     // Main background neon pink
        'bg-cyan': '#00FFFF',      // Secondary background neon cyan
        'gd-purple': '#4D0075',   // A deep purple for outlines and dark UI
        'gd-black': '#0D021A',    // Dark, purple-tinted black for UI panels
        'gd-pink': '#F900B8',     // A saturated pink for highlights and accents
      },
      // Define the text shadow values in the theme
      textShadow: {
        'outline-purple': '0 0 5px #4D0075, -1px -1px 3px #4D0075, 1px -1px 3px #4D0075, -1px 1px 3px #4D0075, 1px 1px 3px #4D0075',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [
    // Custom plugin to generate text-shadow utilities
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