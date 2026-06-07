import { useEffect, useMemo, useState } from "react"
import type { FormEvent } from "react"
import { X } from "lucide-react"
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

interface TimezoneOption {
  value: string
  label: string
}

const countryTimezoneOptions: Record<string, TimezoneOption[]> = {
  PT: [
    { value: "Europe/Lisbon", label: "(UTC+00/+01) Europa/Lisboa" },
    { value: "Atlantic/Madeira", label: "(UTC+00/+01) Atlântico/Madeira" },
    { value: "Atlantic/Azores", label: "(UTC-01/+00) Atlântico/Açores" },
  ],
  BR: [
    { value: "America/Noronha", label: "(UTC-02) América/Noronha" },
    { value: "America/Sao_Paulo", label: "(UTC-03) América/São Paulo" },
    { value: "America/Fortaleza", label: "(UTC-03) América/Fortaleza" },
    { value: "America/Cuiaba", label: "(UTC-04) América/Cuiabá" },
    { value: "America/Manaus", label: "(UTC-04) América/Manaus" },
    { value: "America/Rio_Branco", label: "(UTC-05) América/Rio Branco" },
  ],
  ES: [
    { value: "Europe/Madrid", label: "(UTC+01/+02) Europa/Madrid" },
    { value: "Atlantic/Canary", label: "(UTC+00/+01) Atlântico/Canárias" },
  ],
  US: [
    { value: "America/New_York", label: "(UTC-05/-04) América/Nova Iorque" },
    { value: "America/Chicago", label: "(UTC-06/-05) América/Chicago" },
    { value: "America/Denver", label: "(UTC-07/-06) América/Denver" },
    { value: "America/Los_Angeles", label: "(UTC-08/-07) América/Los Angeles" },
    { value: "America/Anchorage", label: "(UTC-09/-08) América/Anchorage" },
    { value: "Pacific/Honolulu", label: "(UTC-10) Pacífico/Honolulu" },
  ],
  FR: [{ value: "Europe/Paris", label: "(UTC+01/+02) Europa/Paris" }],
  DE: [{ value: "Europe/Berlin", label: "(UTC+01/+02) Europa/Berlim" }],
  GB: [{ value: "Europe/London", label: "(UTC+00/+01) Europa/Londres" }],
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

function getCountryOptions(options: Internationalization[]) {
  return Array.from(
    new Map(
      options.map((item) => [
        item.countryCode,
        {
          value: item.countryCode,
          label: item.countryName,
          flag: item.flagEmoji || "🌐",
        },
      ])
    ).values()
  )
}

function getTimezoneOptionsByCountry(country: string) {
  return countryTimezoneOptions[country] || []
}

export function EditTenantModal({
  open,
  tenant,
  internationalizationOptions,
  onClose,
  onUpdated,
}: EditTenantModalProps) {
  if (!open || !tenant) {
    return null
  }

  return (
    <EditTenantModalContent
      tenant={tenant}
      internationalizationOptions={internationalizationOptions}
      onClose={onClose}
      onUpdated={onUpdated}
    />
  )
}

interface EditTenantModalContentProps {
  tenant: Tenant
  internationalizationOptions: Internationalization[]
  onClose: () => void
  onUpdated: () => void
}

function EditTenantModalContent({
  tenant,
  internationalizationOptions,
  onClose,
  onUpdated,
}: EditTenantModalContentProps) {
  const [name, setName] = useState(tenant.name)
  const [slug, setSlug] = useState(tenant.slug)
  const [country, setCountry] = useState(tenant.country)
  const [currency, setCurrency] = useState(tenant.currency)
  const [language, setLanguage] = useState(tenant.language)
  const [timezone, setTimezone] = useState(tenant.timezone)
  const [active, setActive] = useState(tenant.active)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const countryOptions = useMemo(
    () => getCountryOptions(internationalizationOptions),
    [internationalizationOptions]
  )

  const availableLanguageOptions = useMemo(() => {
    return internationalizationOptions.filter((item) => item.countryCode === country)
  }, [country, internationalizationOptions])

  const availableTimezoneOptions = useMemo(() => {
    const countryTimezones = getTimezoneOptionsByCountry(country)

    if (!timezone) {
      return countryTimezones
    }

    const timezoneExists = countryTimezones.some((item) => item.value === timezone)

    if (timezoneExists) {
      return countryTimezones
    }

    return [
      ...countryTimezones,
      {
        value: timezone,
        label: timezone,
      },
    ]
  }, [country, timezone])

  useEffect(() => {
    setName(tenant.name)
    setSlug(tenant.slug)
    setCountry(tenant.country)
    setCurrency(tenant.currency)
    setLanguage(tenant.language)
    setTimezone(tenant.timezone)
    setActive(tenant.active)
    setLoading(false)
    setError(null)
  }, [tenant])

  function handleNameChange(value: string) {
    setName(value)
    setSlug(generateSlug(value))
  }

  function handleCountryChange(value: string) {
    const selectedConfig = internationalizationOptions.find(
      (item) => item.countryCode === value
    )

    const selectedTimezones = getTimezoneOptionsByCountry(value)
    const selectedTimezone =
      selectedTimezones[0]?.value || selectedConfig?.timezone || ""

    setCountry(value)

    if (selectedConfig) {
      setCurrency(selectedConfig.currencyCode)
      setLanguage(selectedConfig.languageCode)
      setTimezone(selectedTimezone)
    }
  }

  function handleLanguageChange(value: string) {
    const selectedConfig = internationalizationOptions.find(
      (item) => item.countryCode === country && item.languageCode === value
    )

    setLanguage(value)

    if (selectedConfig) {
      setCurrency(selectedConfig.currencyCode)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload: UpdateTenantRequest = {
        name: name.trim(),
        slug: slug.trim(),
        country,
        currency: currency.trim().toUpperCase(),
        language,
        timezone,
        active,
      }

      await TenantService.update(tenant.id, payload)

      onUpdated()
      onClose()
    } catch {
      setError("Não foi possível atualizar o ambiente. Verifique os dados e tente novamente.")
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
              Editar ambiente
            </span>

            <h2 className="text-xl font-bold mt-1">
              Alterar ambiente
            </h2>

            <p className="text-muted text-sm mt-1">
              Atualize os dados do ambiente multiempresa.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center hover:border-danger hover:text-danger transition shrink-0"
            title="Fechar"
          >
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block">
            <span className="block text-xs text-muted mb-1.5">
              Nome do ambiente
            </span>

            <input
              className="field-input"
              placeholder="Ex: Empresa Demo Portugal"
              value={name}
              onChange={(event) => handleNameChange(event.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="block text-xs text-muted mb-1.5">
              Slug automático
            </span>

            <input
              className="field-input"
              placeholder="empresa-demo-portugal"
              value={slug}
              onChange={(event) => setSlug(generateSlug(event.target.value))}
              required
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-xs text-muted mb-1.5">
                País
              </span>

              <select
                className="field-input"
                value={country}
                onChange={(event) => handleCountryChange(event.target.value)}
                required
              >
                {!countryOptions.some((item) => item.value === country) && (
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
                Moeda
              </span>

              <input
                className="field-input"
                placeholder="EUR"
                value={currency}
                onChange={(event) => setCurrency(event.target.value.toUpperCase())}
                required
              />
            </label>

            <label className="block">
              <span className="block text-xs text-muted mb-1.5">
                Idioma
              </span>

              <select
                className="field-input"
                value={language}
                onChange={(event) => handleLanguageChange(event.target.value)}
                required
              >
                {!availableLanguageOptions.some(
                  (item) => item.languageCode === language
                ) && (
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
                Fuso horário
              </span>

              <select
                className="field-input"
                value={timezone}
                onChange={(event) => setTimezone(event.target.value)}
                required
              >
                {!availableTimezoneOptions.some(
                  (item) => item.value === timezone
                ) && (
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
              Ambiente ativo
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
            {loading ? "Salvando alterações..." : "Salvar alterações"}
          </button>
        </form>
      </div>
    </div>
  )
}