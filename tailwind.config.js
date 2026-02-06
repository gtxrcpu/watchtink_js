/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        sage: {
            50: '#f6f7f6',
            100: '#eaedea',
            200: '#d5dad5',
            300: '#b4beb4',
            400: '#8f9d8f',
            500: '#6f806f',
            600: '#586658',
            700: '#485248',
            800: '#3c433c',
            900: '#333833',
            950: '#1a1d1a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
