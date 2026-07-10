/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        card: "var(--color-card)",
        cardSoft: "var(--color-card-soft)",
        text: "var(--color-text)",
        muted: "var(--color-muted)",
        border: "var(--color-border)",

        primary: "var(--color-primary, #2563eb)",
        primarySoft: "var(--color-primary-soft, rgba(37, 99, 235, 0.12))",
        accent: "var(--color-accent, #38bdf8)",
        success: "var(--color-success, #22c55e)",
        warning: "var(--color-warning, #f59e0b)",
        danger: "var(--color-danger, #ef4444)",

        neon: "var(--color-primary, #2563eb)",
      },
      borderRadius: {
        xl2: "20px",
      },
      boxShadow: {
        neon: "var(--shadow-neon)",
        soft: "var(--shadow-soft, 0 18px 45px rgba(15, 23, 42, 0.14))",
        card: "var(--shadow-card, 0 10px 30px rgba(15, 23, 42, 0.12))",
      },
    },
  },
  plugins: [],
}