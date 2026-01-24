/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#ff4d94", // Home Pink
        "login-primary": "#f49d25", // Login Orange
        "settings-primary": "#8b5cf6", // Account Settings Purple
        "diary-accent": "#E88D7D", // Diary Rose
        "music-accent": "#ff2d55", // Music Red
        "muted-rose": "#C58F8F",
        "background-light": "#f8f7f5",
        "background-dark": "#221a10",
        "ios-bg": "rgba(255, 255, 255, 0.08)",
        "ios-border": "rgba(255, 255, 255, 0.12)",
        "ios-card-bg": "rgba(255, 255, 255, 0.65)",
      },
      fontFamily: {
        "serif": ["Newsreader", "Playfair Display", "serif"],
        "display": ["Newsreader", "Plus Jakarta Sans", "serif"],
        "sans": ["Inter", "system-ui", "-apple-system", "sans-serif"],
        "handwritten": ["'La Belle Aurore'", "cursive"]
      },
      borderRadius: {
        "ios": "1.25rem", // 20px
        "ios-md": "1.375rem", // 22px
        "ios-lg": "1.5rem", // 24px
        "ios-xl": "2.25rem", // 36px
        "ios-2xl": "3rem", // 48px
        "ios-full": "9999px",
        "ios-inner": "14px",
        "polaroid": "4px",
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
