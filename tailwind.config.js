/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        "primary-hover": "var(--color-primary-hover)",
        surface: "var(--color-surface)",
        background: "var(--color-background)",
        border: "var(--color-border)",
        "text-main": "var(--color-text-main)",
        "text-muted": "var(--color-text-muted)",
      },
    },
  },
  plugins: [],
}
