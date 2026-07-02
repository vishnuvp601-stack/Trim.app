/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropFilter: {
        'blur-lg': 'blur(20px)',
      },
      colors: {
        glass: {
          // Dark mode colors
          light: 'rgba(255, 255, 255, 0.2)',
          lighter: 'rgba(255, 255, 255, 0.15)',
          border: 'rgba(255, 255, 255, 0.1)',
          // Light mode colors
          'light-mode': 'rgba(255, 255, 255, 0.6)',
          'lighter-light': 'rgba(255, 255, 255, 0.8)',
          'border-light': 'rgba(148, 163, 184, 0.3)',
          'light-light': 'rgba(255, 255, 255, 0.7)',
        },
      },
      borderRadius: {
        glass: '24px',
      },
    },
  },
  plugins: [],
};

module.exports = config;
