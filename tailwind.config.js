//** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#25283D',
        'primary-light': '#9CAEA9',
        'secondary-light': '#CAD3D0',
        'highlight': "#FFBA49",
        'neutral': "#E8E6DA"
      }
    }
  },
  plugins: [],
}

