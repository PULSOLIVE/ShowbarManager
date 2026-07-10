import { useEffect, useMemo, useState } from "react"
import type { FormEvent } from "react"
import { X } from "lucide-react"
import { useTranslation } from "../../hooks/useTranslation"
import { TenantService } from "../../services/tenant.service"
import type { Internationalization } from "../../types/internationalization.types"
import type { Tenant, UpdateTenantRequest } from "../../types/tenant.types"

interface EditTenantModalProps {
  open: boolean
  tenant: Tenant | null
  internationalizationOptions: Internationalization[]
  onClose: () => void
  onUpdated: () => void
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
  languageCode: string,
  currentTimezone: string
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

  if (currentTimezone && !map.has(currentTimezone)) {
    map.set(currentTimezone, {
      value: currentTimezone,
      label: currentTimezone,
    })
  }

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

export function EditTenantModal({
  open,
  tenant,
  internationalizationOptions,
  onClose,
  onUpdated,
}: EditTenantModalProps) {
  const { t } = useTranslation()

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
      language,
      timezone
    )
  }, [country, language, timezone, internationalizationOptions])

  useEffect(() => {
    if (!open || !tenant) return

    setName(tenant.name || "")
    setSlug(tenant.slug || "")
    setCountry(tenant.country || "")
    setCurrency(tenant.currency || "")
    setLanguage(tenant.language || "")
    setTimezone(tenant.timezone || "")
    setActive(Boolean(tenant.active))
    setLoading(false)
    setError(null)
  }, [open, tenant])

  if (!open || !tenant) return null

  const currentTenant = tenant

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

      const payload: UpdateTenantRequest = {
        name: name.trim(),
        slug: slug.trim(),
        country: selectedConfig.countryCode,
        currency: selectedConfig.currencyCode,
        language: selectedConfig.languageCode,
        timezone: selectedConfig.timezone,
        active,
      }

      await TenantService.update(currentTenant.id, payload)

      onUpdated()
      onClose()
    } catch (caughtError) {
      setError(getErrorMessage(caughtError, t("tenants.updateError")))
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
              {t("tenants.editTenant")}
            </span>

            <h2 className="text-xl font-bold mt-1">
              {t("tenants.edit")}
            </h2>

            <p className="text-muted text-sm mt-1">
              {t("tenants.editDescription")}
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
                {!countryOptions.some((item) => item.value === country) &&
                  country && (
                    <option value={country}>
                      {country}
                    </option>
                  )}

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
                {!availableLanguageOptions.some(
                  (item) => item.languageCode === language
                ) &&
                  language && (
                    <option value={language}>
                      {language}
                    </option>
                  )}

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
                {!availableTimezoneOptions.some(
                  (item) => item.value === timezone
                ) &&
                  timezone && (
                    <option value={timezone}>
                      {timezone}
                    </option>
                  )}

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
            {loading ? t("tenants.savingChanges") : t("tenants.saveChanges")}
          </button>
        </form>
      </div>
    </div>
  )
}