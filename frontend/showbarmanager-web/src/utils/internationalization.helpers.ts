import type { Internationalization } from "../types/internationalization.types"

export function normalizeInternationalizationCode(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s_-]/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/-+/g, "_")
    .replace(/_+/g, "_")
    .toUpperCase()
}

export function makeInternationalizationCode(
  countryCode: string,
  languageCode: string
) {
  const languagePart = languageCode.split("-")[0] || languageCode

  return normalizeInternationalizationCode(`${countryCode}_${languagePart}`)
}

export function getUniqueCountries(items: Internationalization[]) {
  const map = new Map<string, Internationalization>()

  items
    .filter((item) => item.active)
    .forEach((item) => {
      if (!map.has(item.countryCode)) {
        map.set(item.countryCode, item)
      }
    })

  return Array.from(map.values()).sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority
    return a.countryName.localeCompare(b.countryName)
  })
}

export function getCountryConfigurations(
  items: Internationalization[],
  countryCode: string
) {
  return items
    .filter(
      (item) =>
        item.active &&
        item.countryCode.toLowerCase() === countryCode.toLowerCase()
    )
    .sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority
      return a.languageName.localeCompare(b.languageName)
    })
}

export function getTimezoneOptions(
  items: Internationalization[],
  countryCode: string
) {
  const map = new Map<string, Internationalization>()

  getCountryConfigurations(items, countryCode).forEach((item) => {
    if (!map.has(item.timezone)) {
      map.set(item.timezone, item)
    }
  })

  return Array.from(map.values())
}

export function buildPayloadFromConfig(config: Internationalization) {
  return {
    code: config.code,
    countryCode: config.countryCode,
    countryName: config.countryName,
    languageCode: config.languageCode,
    languageName: config.languageName,
    currencyCode: config.currencyCode,
    currencySymbol: config.currencySymbol,
    timezone: config.timezone,
    timezoneLabel: config.timezoneLabel,
    dateFormat: config.dateFormat,
    timeFormat: config.timeFormat,
    flagEmoji: config.flagEmoji || "",
    flagIconUrl: config.flagIconUrl || "",
    priority: config.priority,
  }
}