/** @type {import('tailwindcss').Config} */
// Legacy v3-style mirror of the tokens in src/styles/global.css (@theme is the source of truth).
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/templates/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: '#fafaf8', dark: '#ececea' },
        ink: { DEFAULT: '#111214', soft: '#4a4d52' },
        accent: { DEFAULT: '#1d3fd6' },
        status: { green: '#3fb950' },
        'todo-amber': '#d29922',
      },
      fontFamily: {
        display: ['"Archivo Variable"', 'Archivo', 'sans-serif'],
        body: ['"Source Serif 4"', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
