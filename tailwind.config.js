/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'customGreen': '#1cc88a',
        'customSkyBlue': '#87CEEB',
        'customDarkGreen': '#198754',
        'dropDown': '#2d6a4f',
        'hoverBar': '#1b4332',

        'custom-gray': '#2d2d2d', // Dark Gray (charcoal)
        'custom-light-green': '#4caf50', // Lighter Green (for subtle matching)
      },
      boxShadow: {
        'bottom': '0 10px 30px rgba(0, 0, 0, 255)',  // Large black shadow only at the bottom
      },
      animation: {
        'gradient-wave': 'wave 1s ease-in-out infinite',
        'slide-in-left': 'slide-in-left 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.5s ease-out',
        swipeDown: 'swipeDown 0.5s ease-in-out forwards',
        fadeIn: 'fadeIn 0.5s ease-in-out forwards',
      },
      keyframes: {
        wave: {
          '0%': {
            opacity: '0.7',
            zIndex: '100',
            transform: 'translateX(100%)',
            filter: 'blur(0.05rem)', // Apply blur effect
          },
          '100%': {
            opacity: '0.9',
            zIndex: '100',
            transform: 'translateX(0)',
            filter: 'blur(0.05rem)', // Keep blur effect consistent
          },
        },

        'slide-in-left': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0', z: '100' },
          '100%': { opacity: '1', z: '100' },
        },
        swipeDown: {
          '0%': {
            transform: 'translateY(-15%)', // Start above the viewport
            opacity: '0', // Fully transparent
          },
          '100%': {
            transform: 'translateY(0)', // End in its original position
            opacity: '1', // Fully opaque
          },
        },
      }, height: {
        'screen-xl': 'calc(100vh - 200px)', // Example, adjust as needed
      }, boxShadow: {
        'r-xl': '0 10px 10px rgba(0, 0, 0, 0.4)',  // Custom shadow with black color
      },
    },
  },
  plugins: [],
};



