/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B2942',
        secondary: '#D4A574',
        cream: '#FFF5E6',
        brown: '#5C3D2E',
      }
    },
  },
  plugins: [],
}
