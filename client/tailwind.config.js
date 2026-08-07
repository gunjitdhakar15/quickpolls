/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#3b0764', // Deep Royal Violet background
        violetBg: '#4c1d95',
        violetCard: 'rgba(255, 255, 255, 0.08)',
        peachPink: '#fb7185',
        peachRose: '#f472b6',
        pastelPeach: '#fca5a5',
        glassBorder: 'rgba(255, 255, 255, 0.18)',
        glassBorderBright: 'rgba(255, 255, 255, 0.35)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        peachGlow: '0 10px 30px rgba(251, 113, 133, 0.4)',
        violetGlow: '0 15px 40px rgba(76, 29, 149, 0.6)',
        meshCard: '0 20px 50px rgba(0, 0, 0, 0.35)',
      },
      backdropBlur: {
        glass: '20px',
      },
      backgroundImage: {
        'peach-gradient': 'linear-gradient(135deg, #fca5a5 0%, #f472b6 50%, #fb7185 100%)',
        'violet-mesh': 'radial-gradient(circle at 50% 30%, rgba(251, 113, 133, 0.25) 0%, transparent 60%), radial-gradient(circle at 10% 80%, rgba(147, 51, 234, 0.4) 0%, transparent 50%)',
      }
    },
  },
  plugins: [],
}
