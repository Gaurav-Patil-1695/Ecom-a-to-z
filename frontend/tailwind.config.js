import tailwindTokens from './src/config/tailwind.config.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      ...tailwindTokens,
    },
  },
  plugins: [],
};
