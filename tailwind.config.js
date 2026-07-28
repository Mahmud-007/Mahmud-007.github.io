/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a192f',
          800: '#112240',
          700: '#233554',
        },
        slate: {
          light: '#a8b2d1',
          lightest: '#ccd6f6',
        },
        teal: {
          DEFAULT: '#64ffda',
        },
        orange: {
          soft: '#ffaf7b',
        },
        status: {
          green: '#3fb950',
        },
        content: {
          surface: '#0e1f3a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"Roboto Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
