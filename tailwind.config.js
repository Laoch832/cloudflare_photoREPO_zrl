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
        "home-primary": "#ff4d94",
        "login-primary": "#f49d25",
        "profile-primary": "#8b5cf6",
        "background-light": "#f8f7f5",
        "background-dark": "#221a10",
        "ios-bg": "rgba(255, 255, 255, 0.08)",
        "ios-border": "rgba(255, 255, 255, 0.12)",
      },
      fontFamily: {
        "serif": ["Newsreader", "Playfair Display", "serif"],
        "display": ["Plus Jakarta Sans", "Newsreader", "serif"],
        "sans": ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        "ios": "1.25rem",
        "ios-lg": "1.75rem",
        "ios-full": "9999px",
        "ios-inner": "14px",
      },
    },
  },
  plugins: [],
}
