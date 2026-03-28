/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "#0D0D0D",
        offwhite: "#F5F0E8",
        gold: "#C9A84C",
        sage: "#6B8F71",
      },
      fontFamily: {
        playfair: ["'Playfair Display'", "serif"],
        sans: ["'DM Sans'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'subtle-pulse': 'subtlePulse 3s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        subtlePulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
