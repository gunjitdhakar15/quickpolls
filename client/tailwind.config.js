/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#090d16',
        darkCard: 'rgba(15, 23, 42, 0.65)',
        brandIndigo: '#6366f1',
        brandViolet: '#4f46e5',
        brandCyan: '#0ea5e9',
        brandEmerald: '#10b981',
        glassBorder: 'rgba(255, 255, 255, 0.08)',
        glassBorderBright: 'rgba(255, 255, 255, 0.16)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        brandGlow: '0 0 25px rgba(99, 102, 241, 0.25)',
        cardGlow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
      backdropBlur: {
        glass: '16px',
      }
    },
  },
  plugins: [],
}
