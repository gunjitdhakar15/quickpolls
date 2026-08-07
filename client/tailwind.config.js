/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#06070a',
        darkCard: 'rgba(10, 13, 20, 0.75)',
        cyberBlack: '#0a0b10',
        electricEmerald: '#00F5A0',
        cyberCyan: '#00D2FF',
        cyberAmber: '#FFB800',
        glassBorder: 'rgba(0, 245, 160, 0.12)',
        glassBorderBright: 'rgba(0, 245, 160, 0.35)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        neonEmerald: '0 0 25px rgba(0, 245, 160, 0.35)',
        neonCyan: '0 0 25px rgba(0, 210, 255, 0.35)',
        neonAmber: '0 0 25px rgba(255, 184, 0, 0.35)',
        cyberCard: '0 12px 40px rgba(0, 0, 0, 0.8)',
        cyberGlow: '0 0 35px rgba(0, 245, 160, 0.2)',
      },
      backdropBlur: {
        cyber: '24px',
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #0a0b10 0%, #0d121c 50%, #06181b 100%)',
        'emerald-gradient': 'linear-gradient(135deg, #00F5A0 0%, #00D2FF 100%)',
        'card-cyber': 'linear-gradient(135deg, rgba(0, 245, 160, 0.12) 0%, rgba(0, 210, 255, 0.04) 100%)',
      }
    },
  },
  plugins: [],
}
