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
        // --- Corrected Neon Theme ---
        'brand-pink': '#FF00FF',     // Pure Neon Pink for the main background
        'brand-cyan': '#00FFFF',     // Neon cyan for gradients/accents
        'brand-purple': '#4D0075',  // A deep purple for outlines and dark UI
        'brand-black': '#000000',     // Pure Black for dark mode background
        'fll-dark': '#0D021A',     // Dark, purple-tinted black for UI panels
        'fll-pink': '#F900B8',      // A saturated pink for highlights
      },
      textShadow: {
        'outline-purple': '0 0 5px #4D0075, -1px -1px 3px #4D0075, 1px -1px 3px #4D0075, -1px 1px 3px #4D0075, 1px 1px 3px #4D0075',
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