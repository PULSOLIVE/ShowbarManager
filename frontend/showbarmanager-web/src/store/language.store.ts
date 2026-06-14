import { create } from "zustand"
import {
  availableLanguages,
  defaultLanguage,
  isLanguageCode,
} from "../i18n"
import type { LanguageCode } from "../i18n"

interface LanguageState {
  language: LanguageCode
  availableLanguages: typeof availableLanguages
  setLanguage: (language: string | null | undefined) => void
  restoreLanguage: () => void
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: defaultLanguage,
  availableLanguages,

  setLanguage: (language) => {
    const safeLanguage: LanguageCode =
      typeof language === "string" && isLanguageCode(language)
        ? language
        : defaultLanguage

    localStorage.setItem("showbar_language", safeLanguage)
    set({ language: safeLanguage })
  },

  restoreLanguage: () => {
    const storedLanguage = localStorage.getItem("showbar_language")

    const safeLanguage: LanguageCode =
      typeof storedLanguage === "string" && isLanguageCode(storedLanguage)
        ? storedLanguage
        : defaultLanguage

    localStorage.setItem("showbar_language", safeLanguage)
    set({ language: safeLanguage })
  },
}))