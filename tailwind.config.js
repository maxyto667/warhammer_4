/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#fdfbf7',
          100: '#fbf7ee',
          200: '#f5edd7',
          300: '#eddcb8',
          400: '#dfc593',
          500: '#cca76a',
          600: '#b88c4d',
          700: '#946c3b',
          800: '#6c4e2b',
          900: '#422f1a',
        },
        imperial: {
          gold: '#c59b27',
          'gold-light': '#dfbe5c',
          'gold-dark': '#8a6b12',
          red: '#7b1818',
          'red-dark': '#4e0d0d',
          'red-seal': '#9e1b1b',
          iron: '#2a2d34',
          'iron-light': '#484f5d',
        },
        grim: {
          950: '#0b0c0e',
          900: '#121417',
          850: '#181b20',
          800: '#20242b',
          700: '#2d333d',
          600: '#434b58',
          500: '#616c7e',
        }
      },
      fontFamily: {
        heading: ['"Cinzel Decorative"', '"Cinzel"', 'Georgia', 'serif'],
        subheading: ['"Cinzel"', 'Georgia', 'serif'],
        body: ['"Alegreya"', '"Crimson Text"', 'Georgia', 'serif'],
        mono: ['"Cinzel"', 'monospace'],
      },
      boxShadow: {
        'parchment': '0 4px 20px rgba(66, 47, 26, 0.15), 0 0 0 1px rgba(184, 140, 77, 0.3)',
        'grim': '0 4px 25px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(197, 155, 39, 0.25)',
        'seal': '0 3px 10px rgba(123, 24, 24, 0.5), inset 0 -2px 4px rgba(0,0,0,0.4)',
        'gold-glow': '0 0 15px rgba(197, 155, 39, 0.35)',
      }
    },
  },
  plugins: [],
}
