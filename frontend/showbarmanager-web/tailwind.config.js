/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050816",
        card: "#0B1120",
        neon: "#39FF14",
        border: "#1E293B",
        text: "#E2E8F0",
        muted: "#94A3B8",
      },
      borderRadius: {
        xl2: "20px",
      },
      boxShadow: {
        neon: "0 0 20px rgba(57,255,20,0.35)",
      },
    },
  },
  plugins: [],
}