import { create } from "zustand"

export type ThemeMode = "dark" | "light"

interface ThemeState {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
  restoreTheme: () => void
}

function applyTheme(theme: ThemeMode) {
  document.documentElement.setAttribute("data-theme", theme)
  localStorage.setItem("showbar_theme", theme)
}

function isThemeMode(value: string | null): value is ThemeMode {
  return value === "dark" || value === "light"
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: "dark",

  setTheme: (theme) => {
    applyTheme(theme)
    set({ theme })
  },

  toggleTheme: () => {
    const nextTheme = get().theme === "dark" ? "light" : "dark"
    applyTheme(nextTheme)
    set({ theme: nextTheme })
  },

  restoreTheme: () => {
    const storedTheme = localStorage.getItem("showbar_theme")
    const theme = isThemeMode(storedTheme) ? storedTheme : "dark"

    applyTheme(theme)
    set({ theme })
  },
}))