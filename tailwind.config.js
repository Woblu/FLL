/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // --- Angelicide Theme Colors ---
        'gd-pink': '#F900B8',     // A vibrant, saturated neon pink
        'gd-purple': '#4D0075',   // A deep purple for backgrounds and accents
        'gd-cyan': '#00F2FF',      // A piercing cyan for highlights
        'gd-white': '#F0F0F8',    // A very light, slightly cool off-white
        'gd-black': '#0D021A',    // A dark, purple-tinted black for the base
        'gd-gray': '#A095B8',     // A muted purple-gray for secondary text
      },
      dropShadow: {
        'glow-pink': '0 0 12px rgba(249, 0, 184, 0.7)',
        'glow-cyan': '0 0 12px rgba(0, 242, 255, 0.7)',
        'glow-purple': '0 0 12px rgba(77, 0, 117, 0.9)',
        'glow-white': '0 0 10px rgba(240, 240, 248, 0.5)',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.85, transform: 'scale(1.02)' },
        },
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      fontFamily: {
        // The Poppins font is a good fit, so let's define it explicitly
        'poppins': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}