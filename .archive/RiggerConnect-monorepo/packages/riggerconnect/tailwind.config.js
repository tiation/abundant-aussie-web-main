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
          50: '#fef7f0',
          100: '#fde9d1',
          200: '#fbd4a6',
          300: '#f8b775',
          400: '#f49245',
          500: '#f27318',
          600: '#e3570e',
          700: '#bc420e',
          800: '#963715',
          900: '#783014',
        },
      },
    },
  },
  plugins: [],
}

