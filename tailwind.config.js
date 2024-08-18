/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wood: '#DEB887', // Burlywood color
        darkerwood: '#3b2d1a', // Bistre color
        darkwood: '#8C6646', // Example wood color
        gold: '#FFD700',
        cream: '#F5F5DC',
      },
    },
  },
  plugins: [],
}
