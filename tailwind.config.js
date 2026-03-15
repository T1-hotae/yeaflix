/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cinema: {
          bg: '#0d0d0d',
          card: '#1a1a2e',
          surface: '#16213e',
          accent: '#e94560',
          gold: '#e50914',
          muted: '#8892a4',
        },
      },
    },
  },
  plugins: [],
};
