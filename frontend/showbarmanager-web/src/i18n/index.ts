import ptPT from "./locales/pt-PT"
import ptBR from "./locales/pt-BR"
import enUS from "./locales/en-US"
import esES from "./locales/es-ES"
import enCA from "./locales/en-CA"
import enGB from "./locales/en-GB"
import esAR from "./locales/es-AR"
import esPY from "./locales/es-PY"
import frFR from "./locales/fr-FR"
import frCA from "./locales/fr-CA"
import deDE from "./locales/de-DE"
import zhCN from "./locales/zh-CN"
import jaJP from "./locales/ja-JP"
import arAE from "./locales/ar-AE"
import ruRU from "./locales/ru-RU"
import idID from "./locales/id-ID"
import hiIN from "./locales/hi-IN"
import bnBD from "./locales/bn-BD"
import itIT from "./locales/it-IT"
import elGR from "./locales/el-GR"
import nlNL from "./locales/nl-NL"
import daDK from "./locales/da-DK"
import bgBG from "./locales/bg-BG"
import ukUA from "./locales/uk-UA"
import koKR from "./locales/ko-KR"
import type { Dictionary } from "../types/dictionary.types"

export const availableLanguages = [
  { label: "Português (Portugal)", value: "pt-PT", flag: "🇵🇹" },
  { label: "Português (Brasil)", value: "pt-BR", flag: "🇧🇷" },
  { label: "English (United States)", value: "en-US", flag: "🇺🇸" },
  { label: "English (Canada)", value: "en-CA", flag: "🇨🇦" },
  { label: "English (United Kingdom)", value: "en-GB", flag: "🇬🇧" },
  { label: "Español (España)", value: "es-ES", flag: "🇪🇸" },
  { label: "Español (Argentina)", value: "es-AR", flag: "🇦🇷" },
  { label: "Español (Paraguay)", value: "es-PY", flag: "🇵🇾" },
  { label: "Français", value: "fr-FR", flag: "🇫🇷" },
  { label: "Français (Canada)", value: "fr-CA", flag: "🇨🇦" },
  { label: "Deutsch", value: "de-DE", flag: "🇩🇪" },
  { label: "Italiano", value: "it-IT", flag: "🇮🇹" },
  { label: "中文 / Mandarim", value: "zh-CN", flag: "🇨🇳" },
  { label: "日本語 / Japonês", value: "ja-JP", flag: "🇯🇵" },
  { label: "العربية / Árabe", value: "ar-AE", flag: "🇦🇪" },
  { label: "Русский / Russo", value: "ru-RU", flag: "🇷🇺" },
  { label: "Bahasa Indonesia", value: "id-ID", flag: "🇮🇩" },
  { label: "हिन्दी / Hindi", value: "hi-IN", flag: "🇮🇳" },
  { label: "বাংলা / Bengali", value: "bn-BD", flag: "🇧🇩" },
  { label: "Ελληνικά / Grego", value: "el-GR", flag: "🇬🇷" },
  { label: "Nederlands / Holandês", value: "nl-NL", flag: "🇳🇱" },
  { label: "Dansk / Dinamarquês", value: "da-DK", flag: "🇩🇰" },
  { label: "Български / Búlgaro", value: "bg-BG", flag: "🇧🇬" },
  { label: "Українська / Ucraniano", value: "uk-UA", flag: "🇺🇦" },
  { label: "한국어 / Coreano", value: "ko-KR", flag: "🇰🇷" },
] as const

export type LanguageCode = (typeof availableLanguages)[number]["value"]

export type { Dictionary }

function completeDictionary(dictionary: Partial<Dictionary>): Dictionary {
  return {
    ...enUS,
    ...dictionary,
    app: { ...enUS.app, ...dictionary.app },
    common: { ...enUS.common, ...dictionary.common },
    menu: { ...enUS.menu, ...dictionary.menu },
    topbar: { ...enUS.topbar, ...dictionary.topbar },
    auth: { ...enUS.auth, ...dictionary.auth },
    status: { ...enUS.status, ...dictionary.status },
    actions: { ...enUS.actions, ...dictionary.actions },
    dashboard: { ...enUS.dashboard, ...dictionary.dashboard },
    settings: { ...enUS.settings, ...dictionary.settings },
    roles: { ...enUS.roles, ...dictionary.roles },
    users: { ...enUS.users, ...dictionary.users },
    tenants: { ...enUS.tenants, ...dictionary.tenants },
    tenantRules: { ...enUS.tenantRules, ...dictionary.tenantRules },
    profiles: { ...enUS.profiles, ...dictionary.profiles },
    permissions: { ...enUS.permissions, ...dictionary.permissions },
    internationalization: {
      ...enUS.internationalization,
      ...dictionary.internationalization,
    },
    integrations: { ...enUS.integrations, ...dictionary.integrations },
    network: { ...enUS.network, ...dictionary.network },
    policies: { ...enUS.policies, ...dictionary.policies },
    security: { ...enUS.security, ...dictionary.security },
    countries: { ...enUS.countries, ...dictionary.countries },
    audit: { ...enUS.audit, ...dictionary.audit },
    branding: { ...enUS.branding, ...dictionary.branding },
    hardware: { ...enUS.hardware, ...dictionary.hardware },
    sessions: { ...enUS.sessions, ...dictionary.sessions },
    messages: { ...enUS.messages, ...dictionary.messages },
  } as Dictionary
}

export const dictionaries: Record<LanguageCode, Dictionary> = {
  "pt-PT": completeDictionary(ptPT),
  "pt-BR": completeDictionary(ptBR),
  "en-US": completeDictionary(enUS),
  "en-CA": completeDictionary(enCA),
  "en-GB": completeDictionary(enGB),
  "es-ES": completeDictionary(esES),
  "es-AR": completeDictionary(esAR),
  "es-PY": completeDictionary(esPY),
  "fr-FR": completeDictionary(frFR),
  "fr-CA": completeDictionary(frCA),
  "de-DE": completeDictionary(deDE),
  "it-IT": completeDictionary(itIT),
  "zh-CN": completeDictionary(zhCN),
  "ja-JP": completeDictionary(jaJP),
  "ar-AE": completeDictionary(arAE),
  "ru-RU": completeDictionary(ruRU),
  "id-ID": completeDictionary(idID),
  "hi-IN": completeDictionary(hiIN),
  "bn-BD": completeDictionary(bnBD),
  "el-GR": completeDictionary(elGR),
  "nl-NL": completeDictionary(nlNL),
  "da-DK": completeDictionary(daDK),
  "bg-BG": completeDictionary(bgBG),
  "uk-UA": completeDictionary(ukUA),
  "ko-KR": completeDictionary(koKR),
}

export const defaultLanguage: LanguageCode = "pt-PT"

export function isLanguageCode(
  value: string | null | undefined
): value is LanguageCode {
  return Boolean(value && value in dictionaries)
}

export function getDictionary(language: string | null | undefined): Dictionary {
  if (isLanguageCode(language)) {
    return dictionaries[language]
  }

  return dictionaries[defaultLanguage]
}