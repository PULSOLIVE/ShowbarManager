export const countryOptions = [
  {
    label: "Portugal",
    value: "PT",
    currency: "EUR",
    language: "pt-PT",
    timezone: "Europe/Lisbon",
  },
  {
    label: "Brasil",
    value: "BR",
    currency: "BRL",
    language: "pt-BR",
    timezone: "America/Sao_Paulo",
  },
  {
    label: "Espanha",
    value: "ES",
    currency: "EUR",
    language: "es-ES",
    timezone: "Europe/Madrid",
  },
  {
    label: "Estados Unidos",
    value: "US",
    currency: "USD",
    language: "en-US",
    timezone: "America/New_York",
  },
]

export const languageOptions = [
  { label: "Português (Portugal)", value: "pt-PT" },
  { label: "Português (Brasil)", value: "pt-BR" },
  { label: "Espanhol (Espanha)", value: "es-ES" },
  { label: "Inglês (EUA)", value: "en-US" },
]

export const timezoneOptions = [
  {
    group: "Portugal",
    items: [
      { label: "Europa/Lisboa", value: "Europe/Lisbon" },
      { label: "Atlântico/Açores", value: "Atlantic/Azores" },
      { label: "Atlântico/Madeira", value: "Atlantic/Madeira" },
    ],
  },
  {
    group: "Brasil",
    items: [
      { label: "América/São Paulo", value: "America/Sao_Paulo" },
      { label: "América/Manaus", value: "America/Manaus" },
      { label: "América/Rio Branco", value: "America/Rio_Branco" },
      { label: "América/Fortaleza", value: "America/Fortaleza" },
      { label: "América/Cuiabá", value: "America/Cuiaba" },
    ],
  },
  {
    group: "Europa",
    items: [
      { label: "Europa/Madrid", value: "Europe/Madrid" },
      { label: "Europa/Paris", value: "Europe/Paris" },
      { label: "Europa/Berlim", value: "Europe/Berlin" },
      { label: "Europa/Roma", value: "Europe/Rome" },
      { label: "Europa/Londres", value: "Europe/London" },
    ],
  },
  {
    group: "Estados Unidos",
    items: [
      { label: "América/Nova Iorque", value: "America/New_York" },
      { label: "América/Chicago", value: "America/Chicago" },
      { label: "América/Denver", value: "America/Denver" },
      { label: "América/Los Angeles", value: "America/Los_Angeles" },
    ],
  },
]

export function generateSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export function getLanguageLabel(value: string) {
  return languageOptions.find((item) => item.value === value)?.label || value
}

export function getTimezoneLabel(value: string) {
  for (const group of timezoneOptions) {
    const found = group.items.find((item) => item.value === value)

    if (found) {
      return found.label
    }
  }

  return value
}