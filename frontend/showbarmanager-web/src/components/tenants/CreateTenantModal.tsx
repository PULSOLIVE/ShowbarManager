import { useEffect, useMemo, useState } from "react"
import type { FormEvent } from "react"
import { X } from "lucide-react"
import { useTranslation } from "../../hooks/useTranslation"
import { TenantService } from "../../services/tenant.service"
import type { Internationalization } from "../../types/internationalization.types"
import type { CreateTenantRequest } from "../../types/tenant.types"

interface CreateTenantModalProps {
  open: boolean
  internationalizationOptions: Internationalization[]
  onClose: () => void
  onCreated: () => void
}

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string
    }
  }
}

function getErrorMessage(error: unknown, fallback: string) {
  const apiError = error as ApiErrorResponse
  return apiError.response?.data?.message || fallback
}

function generateSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

function sortInternationalizations(options: Internationalization[]) {
  return [...options]
    .filter((item) => item.active)
    .sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority
      return a.countryName.localeCompare(b.countryName)
    })
}

function getDefaultInternationalization(options: Internationalization[]) {
  const activeOptions = sortInternationalizations(options)
  return activeOptions.find((item) => item.systemDefault) || activeOptions[0]
}

function getCountryOptions(options: Internationalization[]) {
  const map = new Map<string, { value: string; label: string; flag: string }>()

  sortInternationalizations(options).forEach((item) => {
    if (!map.has(item.countryCode)) {
      map.set(item.countryCode, {
        value: item.countryCode,
        label: item.countryName,
        flag: item.flagEmoji || "🌐",
      })
    }
  })

  return Array.from(map.values())
}

function getLanguageOptionsByCountry(
  options: Internationalization[],
  countryCode: string
) {
  const map = new Map<string, Internationalization>()

  sortInternationalizations(options)
    .filter((item) => item.countryCode === countryCode)
    .forEach((item) => {
      if (!map.has(item.languageCode)) {
        map.set(item.languageCode, item)
      }
    })

  return Array.from(map.values())
}

function getTimezoneOptionsByCountryAndLanguage(
  options: Internationalization[],
  countryCode: string,
  languageCode: string
) {
  const map = new Map<string, { value: string; label: string }>()

  sortInternationalizations(options)
    .filter(
      (item) =>
        item.countryCode === countryCode && item.languageCode === languageCode
    )
    .forEach((item) => {
      if (!map.has(item.timezone)) {
        map.set(item.timezone, {
          value: item.timezone,
          label: item.timezoneLabel,
        })
      }
    })

  return Array.from(map.values())
}

function findFirstConfigByCountry(
  options: Internationalization[],
  countryCode: string
) {
  return sortInternationalizations(options).find(
    (item) => item.countryCode === countryCode
  )
}

function findFirstConfigByCountryAndLanguage(
  options: Internationalization[],
  countryCode: string,
  languageCode: string
) {
  return sortInternationalizations(options).find(
    (item) =>
      item.countryCode === countryCode && item.languageCode === languageCode
  )
}

function findConfigByCountryLanguageAndTimezone(
  options: Internationalization[],
  countryCode: string,
  languageCode: string,
  timezone: string
) {
  return sortInternationalizations(options).find(
    (item) =>
      item.countryCode === countryCode &&
      item.languageCode === languageCode &&
      item.timezone === timezone
  )
}

export function CreateTenantModal({
  open,
  internationalizationOptions,
  onClose,
  onCreated,
}: CreateTenantModalProps) {
  const { t } = useTranslation()
  const defaultConfig = getDefaultInternationalization(internationalizationOptions)

  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [country, setCountry] = useState("")
  const [currency, setCurrency] = useState("")
  const [language, setLanguage] = useState("")
  const [timezone, setTimezone] = useState("")
  const [active, setActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const countryOptions = useMemo(
    () => getCountryOptions(internationalizationOptions),
    [internationalizationOptions]
  )

  const availableLanguageOptions = useMemo(() => {
    return getLanguageOptionsByCountry(internationalizationOptions, country)
  }, [country, internationalizationOptions])

  const availableTimezoneOptions = useMemo(() => {
    return getTimezoneOptionsByCountryAndLanguage(
      internationalizationOptions,
      country,
      language
    )
  }, [country, language, internationalizationOptions])

  useEffect(() => {
    if (!open) return

    setName("")
    setSlug("")
    setCountry(defaultConfig?.countryCode || "")
    setCurrency(defaultConfig?.currencyCode || "")
    setLanguage(defaultConfig?.languageCode || "")
    setTimezone(defaultConfig?.timezone || "")
    setActive(true)
    setLoading(false)
    setError(null)
  }, [defaultConfig, open])

  if (!open) return null

  function handleNameChange(value: string) {
    setName(value)
    setSlug(generateSlug(value))
  }

  function handleCountryChange(value: string) {
    const selectedConfig = findFirstConfigByCountry(
      internationalizationOptions,
      value
    )

    setCountry(value)

    if (selectedConfig) {
      setCurrency(selectedConfig.currencyCode)
      setLanguage(selectedConfig.languageCode)
      setTimezone(selectedConfig.timezone)
    } else {
      setCurrency("")
      setLanguage("")
      setTimezone("")
    }
  }

  function handleLanguageChange(value: string) {
    const selectedConfig = findFirstConfigByCountryAndLanguage(
      internationalizationOptions,
      country,
      value
    )

    setLanguage(value)

    if (selectedConfig) {
      setCurrency(selectedConfig.currencyCode)
      setTimezone(selectedConfig.timezone)
    } else {
      setCurrency("")
      setTimezone("")
    }
  }

  function handleTimezoneChange(value: string) {
    const selectedConfig = findConfigByCountryLanguageAndTimezone(
      internationalizationOptions,
      country,
      language,
      value
    )

    setTimezone(value)

    if (selectedConfig) {
      setCurrency(selectedConfig.currencyCode)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const selectedConfig = findConfigByCountryLanguageAndTimezone(
        internationalizationOptions,
        country,
        language,
        timezone
      )

      if (!selectedConfig) {
        setError(t("tenants.validCombinationRequired"))
        setLoading(false)
        return
      }

      const payload: CreateTenantRequest = {
        name: name.trim(),
        slug: slug.trim(),
        country: selectedConfig.countryCode,
        currency: selectedConfig.currencyCode,
        language: selectedConfig.languageCode,
        timezone: selectedConfig.timezone,
        active,
      }

      await TenantService.create(payload)

      onCreated()
      onClose()
    } catch (caughtError) {
      setError(getErrorMessage(caughtError, t("tenants.createError")))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-[620px] max-h-[92vh] overflow-y-auto app-scrollbar surface-premium rounded-2xl p-5">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <span className="text-sm text-primary font-medium">
              {t("tenants.newTenant")}
            </span>

            <h2 className="text-xl font-bold mt-1">
              {t("tenants.create")}
            </h2>

            <p className="text-muted text-sm mt-1">
              {t("tenants.createDescription")}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center hover:border-danger hover:text-danger transition shrink-0"
            title={t("common.close")}
          >
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block">
            <span className="block text-xs text-muted mb-1.5">
              {t("tenants.name")}
            </span>

            <input
              className="field-input"
              placeholder={t("tenants.tenantNamePlaceholder")}
              value={name}
              onChange={(event) => handleNameChange(event.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="block text-xs text-muted mb-1.5">
              {t("tenants.slug")}
            </span>

            <input
              className="field-input"
              placeholder={t("tenants.slugPlaceholder")}
              value={slug}
              onChange={(event) => setSlug(generateSlug(event.target.value))}
              required
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-xs text-muted mb-1.5">
                {t("tenants.country")}
              </span>

              <select
                className="field-input"
                value={country}
                onChange={(event) => handleCountryChange(event.target.value)}
                required
              >
                <option value="">{t("tenants.selectCountry")}</option>

                {countryOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.flag} {item.label} ({item.value})
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="block text-xs text-muted mb-1.5">
                {t("tenants.currency")}
              </span>

              <input
                className="field-input"
                placeholder="EUR"
                value={currency}
                readOnly
                required
              />
            </label>

            <label className="block">
              <span className="block text-xs text-muted mb-1.5">
                {t("tenants.language")}
              </span>

              <select
                className="field-input"
                value={language}
                onChange={(event) => handleLanguageChange(event.target.value)}
                required
              >
                <option value="">{t("tenants.selectLanguage")}</option>

                {availableLanguageOptions.map((item) => (
                  <option key={`${item.id}-language`} value={item.languageCode}>
                    {item.languageName}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="block text-xs text-muted mb-1.5">
                {t("tenants.timezone")}
              </span>

              <select
                className="field-input"
                value={timezone}
                onChange={(event) => handleTimezoneChange(event.target.value)}
                required
              >
                <option value="">{t("tenants.selectTimezone")}</option>

                {availableTimezoneOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="flex items-center justify-between surface-muted rounded-2xl px-4 py-2.5">
            <span className="text-sm text-muted">
              {t("tenants.active")}
            </span>

            <button
              type="button"
              onClick={() => setActive((value) => !value)}
              className={[
                "relative w-12 h-7 rounded-full transition-all",
                active ? "bg-primary" : "bg-zinc-700",
              ].join(" ")}
            >
              <span
                className={[
                  "absolute top-1 w-5 h-5 rounded-full bg-white transition-all",
                  active ? "left-6" : "left-1",
                ].join(" ")}
              />
            </button>
          </label>

          {error && (
            <div className="bg-danger/10 border border-danger/30 text-danger rounded-2xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || internationalizationOptions.length === 0}
            className="w-full bg-primary text-white font-semibold py-3 rounded-full hover:shadow-neon transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? t("tenants.creating") : t("tenants.create")}
          </button>
        </form>
      </div>
    </div>
  )
}