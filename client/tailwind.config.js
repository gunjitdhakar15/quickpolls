/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#070913',
        darkCard: 'rgba(15, 20, 35, 0.55)',
        glassBg: 'rgba(255, 255, 255, 0.03)',
        glassBorder: 'rgba(255, 255, 255, 0.08)',
        glassBorderBright: 'rgba(255, 255, 255, 0.18)',
        indigoNeon: '#6366f1',
        purpleNeon: '#a855f7',
        cyanNeon: '#14b8a6',
        emeraldNeon: '#10b981',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        neonIndigo: '0 0 25px rgba(99, 102, 241, 0.4)',
        neonPurple: '0 0 25px rgba(168, 85, 247, 0.4)',
        neonCyan: '0 0 25px rgba(20, 184, 166, 0.4)',
        glass: '0 12px 40px 0 rgba(0, 0, 0, 0.5)',
        cardGlow: '0 20px 50px rgba(124, 58, 237, 0.25)',
      },
      backdropBlur: {
        glass: '20px',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #0d9488 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(20, 184, 166, 0.05) 100%)',
      }
    },
  },
  plugins: [],
}
