import { createRequire } from "node:module"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

const require = createRequire(import.meta.url)
const packageJson = require("./package.json")

export default defineConfig({
  plugins: [react()],
  define: {
    "import.meta.env.VITE_APP_VERSION": JSON.stringify(packageJson.version),
  },
})