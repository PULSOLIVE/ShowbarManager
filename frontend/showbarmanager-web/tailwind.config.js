/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        card: "var(--color-card)",
        cardSoft: "var(--color-card-soft)",
        neon: "var(--color-neon)",
        border: "var(--color-border)",
        text: "var(--color-text)",
        muted: "var(--color-muted)",
      },
      borderRadius: {
        xl2: "20px",
      },
      boxShadow: {
        neon: "var(--shadow-neon)",
      },
    },
  },
  plugins: [],
}