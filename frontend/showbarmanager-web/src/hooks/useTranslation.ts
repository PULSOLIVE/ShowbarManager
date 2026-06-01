import {
  defaultLanguage,
  dictionaries,
} from "../i18n"
import { useLanguageStore } from "../store/language.store"
import type { Dictionary } from "../i18n"

type TranslationPath = string

function getNestedValue(
  dictionary: Dictionary,
  path: TranslationPath
): string | null {
  const keys = path.split(".")
  let current: unknown = dictionary

  for (const key of keys) {
    if (
      typeof current !== "object" ||
      current === null ||
      !(key in current)
    ) {
      return null
    }

    current = (current as Record<string, unknown>)[key]
  }

  return typeof current === "string" ? current : null
}

export function useTranslation() {
  const language = useLanguageStore((state) => state.language)
  const dictionary = dictionaries[language] || dictionaries[defaultLanguage]

  function t(path: TranslationPath) {
    return (
      getNestedValue(dictionary, path) ||
      getNestedValue(dictionaries[defaultLanguage], path) ||
      path
    )
  }

  return {
    t,
    language,
  }
}