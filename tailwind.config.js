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
        paper: { DEFAULT: '#f3efe6', dark: '#e8e2d4' },
        ink: { DEFAULT: '#1a1814', soft: '#5a554c' },
        red: { DEFAULT: '#d7381e' },
        status: { green: '#3fb950' },
        'todo-amber': '#d29922',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Newsreader', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
