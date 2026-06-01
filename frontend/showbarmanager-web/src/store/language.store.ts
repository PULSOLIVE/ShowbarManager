import { create } from "zustand"
import {
  availableLanguages,
  defaultLanguage,
} from "../i18n"
import type { LanguageCode } from "../i18n"

interface LanguageState {
  language: LanguageCode
  availableLanguages: typeof availableLanguages
  setLanguage: (language: LanguageCode) => void
  restoreLanguage: () => void
}

function isLanguageCode(value: string | null): value is LanguageCode {
  return availableLanguages.some((language) => language.value === value)
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: defaultLanguage,
  availableLanguages,

  setLanguage: (language) => {
    localStorage.setItem("showbar_language", language)
    set({ language })
  },

  restoreLanguage: () => {
    const storedLanguage = localStorage.getItem("showbar_language")

    if (isLanguageCode(storedLanguage)) {
      set({ language: storedLanguage })
      return
    }

    localStorage.setItem("showbar_language", defaultLanguage)
    set({ language: defaultLanguage })
  },
}))