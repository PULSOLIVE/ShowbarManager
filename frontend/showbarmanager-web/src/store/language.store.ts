import { create } from "zustand"
import {
  availableLanguages,
  defaultLanguage,
  isLanguageCode,
} from "../i18n"
import type { LanguageCode } from "../i18n"

const STORAGE_KEY = "showbar_language"

function readStoredLanguage(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function saveStoredLanguage(language: LanguageCode) {
  try {
    localStorage.setItem(STORAGE_KEY, language)
  } catch {
    // Mantém o estado em memória caso o navegador bloqueie o localStorage.
  }
}

function getInitialLanguage(): LanguageCode {
  const storedLanguage = readStoredLanguage()

  if (isLanguageCode(storedLanguage)) {
    return storedLanguage
  }

  saveStoredLanguage(defaultLanguage)
  return defaultLanguage
}

interface LanguageState {
  language: LanguageCode
  availableLanguages: typeof availableLanguages
  setLanguage: (language: string | null | undefined) => void
  restoreLanguage: () => void
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: getInitialLanguage(),
  availableLanguages,

  setLanguage: (language) => {
    const safeLanguage: LanguageCode = isLanguageCode(language)
      ? language
      : defaultLanguage

    saveStoredLanguage(safeLanguage)
    set({ language: safeLanguage })
  },

  restoreLanguage: () => {
    const safeLanguage = getInitialLanguage()

    saveStoredLanguage(safeLanguage)
    set({ language: safeLanguage })
  },
}))