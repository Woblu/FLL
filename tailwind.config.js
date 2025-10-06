/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode based on 'class'
  theme: {
    extend: {
      colors: {
        // --- Custom FLL Colors ---
        fllPink: '#ff00ff',    // A vibrant magenta/fuchsia
        fllCyan: '#00ffff',    // A bright cyan
        fllWhite: '#f0f0f0',   // A slightly off-white, as pure white can be harsh with neons
        fllPurple: '#800080',  // A complementary purple for shadows/accents
        fllDark: '#1a001a',    // A very dark, almost black-purple for backgrounds

        // Original Grayscale/Blue tones (can be removed later if not needed)
        gray: {
          50: '#f8f8f8',
          100: '#f1f1f1',
          200: '#e2e2e2',
          300: '#d1d1d1',
          400: '#b1b1b1',
          500: '#919191',
          600: '#7a7a7a',
          700: '#636363',
          800: '#4c4c4c',
          900: '#353535',
        },
        // Replaced cyan with fllCyan for existing usages
        cyan: {
          50: '#e0f7fa',
          100: '#b2ebf2',
          200: '#80deea',
          300: '#4dd0e1',
          400: '#26c6da',
          500: '#00bcd4',
          600: '#00acc1',
          700: '#0097a7',
          800: '#00838f',
          900: '#006064',
          'DEFAULT': '#00ffff', // Default cyan now maps to fllCyan
        }
      },
      backgroundImage: {
        'fll-gradient': 'linear-gradient(135deg, var(--tw-gradient-stops))',
        'fll-gradient-to-r': 'linear-gradient(to right, var(--tw-gradient-stops))',
        'fll-gradient-to-br': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
      },
      gradientColorStops: theme => ({
        'fll-start': theme('colors.fllPink'),
        'fll-end': theme('colors.fllCyan'),
        'fll-center': theme('colors.fllPurple'),
      }),
      fontFamily: {
        // You can uncomment and replace 'sans' with a custom font
        // 'poppins': ['Poppins', 'sans-serif'], // Example
      },
    },
  },
  plugins: [],
}