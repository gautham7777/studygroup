/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#4f46e5',
        'secondary': '#10b981',
        'background': '#f8fafc',
        'surface': '#ffffff',
        'on-surface': '#1f2937',
        'on-primary': '#ffffff',
        'on-secondary': '#ffffff',
      }
    }
  },
  plugins: [],
}
