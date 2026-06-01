import ptPT from "./pt-PT"
import ptBR from "./pt-BR"
import enUS from "./en-US"
import esES from "./es-ES"

export const availableLanguages = [
  { label: "Português (Portugal)", value: "pt-PT", flag: "🇵🇹" },
  { label: "Português (Brasil)", value: "pt-BR", flag: "🇧🇷" },
  { label: "English (United States)", value: "en-US", flag: "🇺🇸" },
  { label: "Español (España)", value: "es-ES", flag: "🇪🇸" },
] as const

export const dictionaries = {
  "pt-PT": ptPT,
  "pt-BR": ptBR,
  "en-US": enUS,
  "es-ES": esES,
}

export type LanguageCode = keyof typeof dictionaries

export type Dictionary = typeof ptPT

export const defaultLanguage: LanguageCode = "pt-PT"