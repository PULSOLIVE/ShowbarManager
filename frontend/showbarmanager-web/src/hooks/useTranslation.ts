import {
  defaultLanguage,
  getDictionary,
  isLanguageCode,
} from "../i18n"
import { useLanguageStore } from "../store/language.store"
import type { Dictionary, LanguageCode } from "../i18n"

type TranslationPath = string

function getNestedValue(dictionary: Dictionary, path: TranslationPath) {
  return path.split(".").reduce<unknown>((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key]
    }

    return undefined
  }, dictionary)
}

export function useTranslation() {
  const language = useLanguageStore((state) => state.language)

  const safeLanguage: LanguageCode = isLanguageCode(language)
    ? language
    : defaultLanguage

  const dictionary = getDictionary(safeLanguage)
  const fallbackDictionary = getDictionary(defaultLanguage)

  function t(path: TranslationPath, fallback?: string) {
    const value =
      getNestedValue(dictionary, path) ||
      getNestedValue(fallbackDictionary, path)

    if (typeof value === "string") {
      return value
    }

    return fallback || path
  }

  return {
    t,
    language: safeLanguage,
  }
}