export interface Internationalization {
  id: string
  code: string
  countryCode: string
  countryName: string
  languageCode: string
  languageName: string
  currencyCode: string
  currencySymbol: string
  timezone: string
  timezoneLabel: string
  dateFormat: string
  timeFormat: string
  flagEmoji: string | null
  flagIconUrl: string | null
  active: boolean
  systemDefault: boolean
  priority: number
  createdAt: string
  updatedAt: string | null
}

export interface CreateInternationalizationRequest {
  code: string
  countryCode: string
  countryName: string
  languageCode: string
  languageName: string
  currencyCode: string
  currencySymbol: string
  timezone: string
  timezoneLabel: string
  dateFormat: string
  timeFormat: string
  flagEmoji: string | null
  flagIconUrl: string | null
  active: boolean
  systemDefault: boolean
  priority: number
}

export interface UpdateInternationalizationRequest {
  code: string
  countryCode: string
  countryName: string
  languageCode: string
  languageName: string
  currencyCode: string
  currencySymbol: string
  timezone: string
  timezoneLabel: string
  dateFormat: string
  timeFormat: string
  flagEmoji: string | null
  flagIconUrl: string | null
  active: boolean
  systemDefault: boolean
  priority: number
}