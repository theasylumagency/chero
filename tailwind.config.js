/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-outfit)", "ui-sans-serif", "system-ui"],
        serif: ["var(--font-playfair)", "ui-serif", "Georgia"],
      },
      colors: {
        chero: {
          900: '#050B10',
          800: '#0A151C',
          700: '#0F212E',
          accent: '#CCA876', // Sophisticated gold/bronze
          light: '#F5F2EB'
        }
      },
      animation: {
        'fade-in-up': 'fadeInUp 1s ease-out forwards',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanOnce': 'scanOnce 2s ease-out forwards',
        'lockIn': 'lockIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scanOnce: {
          '0%': { transform: 'translateY(0)', opacity: '0' },
          '15%': { opacity: '0.6' },
          '60%': { opacity: '0.2' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' },
        },
        lockIn: {
          '0%': { opacity: '0', transform: 'translateY(15px) scale(0.98)', filter: 'blur(10px)' },
          '60%': { opacity: '1', filter: 'blur(1px)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)', filter: 'blur(0)' },
        }
      }
    },
  },
  plugins: [],
};