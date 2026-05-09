/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        saffron:  { DEFAULT: '#E8631A', light: '#F28C4E', dark: '#C4511A' },
        earth:    { DEFAULT: '#6B4226', light: '#8B5E3C', dark: '#4A2D18' },
        cream:    { DEFAULT: '#FDF6EC', dark: '#F5E6D0' },
        forest:   { DEFAULT: '#2D5016', light: '#4A7A28' },
        gold:     { DEFAULT: '#C9963B', light: '#E4B86A', dark: '#A07828' },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"Lato"', 'sans-serif'],
        mono:    ['"Courier Prime"', 'monospace'],
      },
      backgroundImage: {
        'weave': "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C9963B' fill-opacity='0.06'%3E%3Crect x='0' y='0' width='10' height='10'/%3E%3Crect x='10' y='10' width='10' height='10'/%3E%3C/g%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'certificate': '0 0 0 1px #C9963B, 0 0 0 4px #FDF6EC, 0 0 0 5px #C9963B',
        'warm': '0 4px 24px rgba(107, 66, 38, 0.15)',
        'warm-lg': '0 8px 40px rgba(107, 66, 38, 0.20)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-up': 'slideUp 0.5s ease forwards',
        'stamp': 'stamp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        stamp:   { from: { opacity: 0, transform: 'scale(1.4) rotate(-8deg)' }, to: { opacity: 1, transform: 'scale(1) rotate(-8deg)' } },
      },
    },
  },
  plugins: [],
}
