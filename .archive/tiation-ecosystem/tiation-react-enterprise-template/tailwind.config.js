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
        // Tiation brand colors
        'tiation-cyan': '#00FFFF',
        'tiation-magenta': '#FF00FF',
        'tiation-dark': '#0A0A0A',
        'tiation-gray': '#1A1A1A',
        // Gradient variants
        'neon-cyan': {
          50: '#E6FFFF',
          100: '#B3FFFF',
          200: '#80FFFF',
          300: '#4DFFFF',
          400: '#1AFFFF',
          500: '#00FFFF',
          600: '#00E6E6',
          700: '#00CCCC',
          800: '#00B3B3',
          900: '#009999',
        },
        'neon-magenta': {
          50: '#FFE6FF',
          100: '#FFB3FF',
          200: '#FF80FF',
          300: '#FF4DFF',
          400: '#FF1AFF',
          500: '#FF00FF',
          600: '#E600E6',
          700: '#CC00CC',
          800: '#B300B3',
          900: '#990099',
        },
      },
      fontFamily: {
        'tiation': ['Quicksand', 'system-ui', 'sans-serif'],
        'display': ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon-cyan': '0 0 5px #00FFFF, 0 0 10px #00FFFF, 0 0 15px #00FFFF',
        'neon-magenta': '0 0 5px #FF00FF, 0 0 10px #FF00FF, 0 0 15px #FF00FF',
        'neon-gradient': '0 0 5px #00FFFF, 0 0 10px #FF00FF, 0 0 15px #00FFFF',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      animation: {
        'pulse-neon': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'gradient': 'gradient 6s ease infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00FFFF, 0 0 10px #00FFFF, 0 0 15px #00FFFF' },
          '100%': { boxShadow: '0 0 10px #FF00FF, 0 0 20px #FF00FF, 0 0 30px #FF00FF' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'tiation-gradient': 'linear-gradient(135deg, #00FFFF 0%, #FF00FF 100%)',
        'tiation-gradient-reversed': 'linear-gradient(135deg, #FF00FF 0%, #00FFFF 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
