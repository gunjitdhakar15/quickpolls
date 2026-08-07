/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#090a0f',
        glassBg: 'rgba(15, 18, 30, 0.4)',
        glassBorder: 'rgba(255, 255, 255, 0.08)',
        indigoNeon: '#5850ec',
        emeraldNeon: '#10b981',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        neonIndigo: '0 0 20px rgba(88, 80, 236, 0.35)',
        neonEmerald: '0 0 20px rgba(16, 185, 129, 0.35)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        glass: '16px',
      }
    },
  },
  plugins: [],
}
