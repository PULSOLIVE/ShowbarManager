import { useEffect, useMemo, useState } from "react"
import type { FormEvent, ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import { X } from "lucide-react"
import { useTranslation } from "../../hooks/useTranslation"
import { InternationalizationService } from "../../services/internationalization.service"
import type {
  CreateInternationalizationRequest,
  Internationalization,
} from "../../types/internationalization.types"
import {
  buildPayloadFromConfig,
  getCountryConfigurations,
  getTimezoneOptions,
  getUniqueCountries,
  makeInternationalizationCode,
  normalizeInternationalizationCode,
} from "../../utils/internationalization.helpers"

interface CreateInternationalizationModalProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

export function CreateInternationalizationModal({
  open,
  onClose,
  onCreated,
}: CreateInternationalizationModalProps) {
  const { t } = useTranslation()

  const [code, setCode] = useState("")
  const [countryCode, setCountryCode] = useState("")
  const [countryName, setCountryName] = useState("")
  const [languageCode, setLanguageCode] = useState("")
  const [languageName, setLanguageName] = useState("")
  const [currencyCode, setCurrencyCode] = useState("")
  const [currencySymbol, setCurrencySymbol] = useState("")
  const [timezone, setTimezone] = useState("")
  const [timezoneLabel, setTimezoneLabel] = useState("")
  const [dateFormat, setDateFormat] = useState("dd/MM/yyyy")
  const [timeFormat, setTimeFormat] = useState("HH:mm")
  const [flagEmoji, setFlagEmoji] = useState("")
  const [flagIconUrl, setFlagIconUrl] = useState("")
  const [active, setActive] = useState(true)
  const [systemDefault, setSystemDefault] = useState(false)
  const [priority, setPriority] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: activeInternationalizations = [] } = useQuery({
    queryKey: ["create-internationalization-active"],
    queryFn: InternationalizationService.listActive,
    enabled: open,
  })

  const countryOptions = useMemo(() => {
    return getUniqueCountries(activeInternationalizations)
  }, [activeInternationalizations])

  const countryConfigurations = useMemo(() => {
    return getCountryConfigurations(activeInternationalizations, countryCode)
  }, [activeInternationalizations, countryCode])

  const timezoneOptions = useMemo(() => {
    return getTimezoneOptions(activeInternationalizations, countryCode)
  }, [activeInternationalizations, countryCode])

  useEffect(() => {
    if (!open) return

    setCode("")
    setCountryCode("")
    setCountryName("")
    setLanguageCode("")
    setLanguageName("")
    setCurrencyCode("")
    setCurrencySymbol("")
    setTimezone("")
    setTimezoneLabel("")
    setDateFormat("dd/MM/yyyy")
    setTimeFormat("HH:mm")
    setFlagEmoji("")
    setFlagIconUrl("")
    setActive(true)
    setSystemDefault(false)
    setPriority(0)
    setLoading(false)
    setError(null)
  }, [open])

  if (!open) return null

  function applyConfiguration(config: Internationalization) {
    const payload = buildPayloadFromConfig(config)

    setCode(makeInternationalizationCode(payload.countryCode, payload.languageCode))
    setCountryCode(payload.countryCode)
    setCountryName(payload.countryName)
    setLanguageCode(payload.languageCode)
    setLanguageName(payload.languageName)
    setCurrencyCode(payload.currencyCode)
    setCurrencySymbol(payload.currencySymbol)
    setTimezone(payload.timezone)
    setTimezoneLabel(payload.timezoneLabel)
    setDateFormat(payload.dateFormat)
    setTimeFormat(payload.timeFormat)
    setFlagEmoji(payload.flagEmoji)
    setFlagIconUrl(payload.flagIconUrl)
    setPriority(payload.priority)
  }

  function handleCountryChange(value: string) {
    const selected = getCountryConfigurations(
      activeInternationalizations,
      value
    )[0]

    if (selected) {
      applyConfiguration(selected)
      return
    }

    setCountryCode(value)
  }

  function handleLanguageChange(value: string) {
    const selected = countryConfigurations.find(
      (item) => item.languageCode === value
    )

    if (selected) {
      applyConfiguration(selected)
      return
    }

    setLanguageCode(value)
  }

  function handleTimezoneChange(value: string) {
    const selected = timezoneOptions.find((item) => item.timezone === value)

    setTimezone(value)
    setTimezoneLabel(selected?.timezoneLabel || value)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload: CreateInternationalizationRequest = {
        code: normalizeInternationalizationCode(code),
        countryCode: countryCode.trim().toUpperCase(),
        countryName: countryName.trim(),
        languageCode: languageCode.trim(),
        languageName: languageName.trim(),
        currencyCode: currencyCode.trim().toUpperCase(),
        currencySymbol: currencySymbol.trim(),
        timezone: timezone.trim(),
        timezoneLabel: timezoneLabel.trim(),
        dateFormat: dateFormat.trim() || "dd/MM/yyyy",
        timeFormat: timeFormat.trim() || "HH:mm",
        flagEmoji: flagEmoji.trim() || null,
        flagIconUrl: flagIconUrl.trim() || null,
        active,
        systemDefault,
        priority,
      }

      await InternationalizationService.create(payload)

      onCreated()
      onClose()
    } catch {
      setError(t("internationalization.createError"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-[820px] max-h-[90vh] overflow-y-auto app-scrollbar surface-premium rounded-2xl p-4 shadow-neon">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <span className="text-xs text-primary font-semibold uppercase tracking-wide">
              {t("internationalization.title")}
            </span>

            <h2 className="text-xl font-bold mt-1">
              {t("internationalization.create")}
            </h2>

            <p className="text-muted text-sm mt-1">
              {t("internationalization.createDescription")}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroup title={t("internationalization.countryIdentification")}>
            <SelectField
              label={t("internationalization.registeredCountry")}
              value={countryCode}
              onChange={handleCountryChange}
              options={[
                { label: t("internationalization.selectCountry"), value: "" },
                ...countryOptions.map((item) => ({
                  label: `${item.flagEmoji || "🌐"} ${item.countryName} (${item.countryCode})`,
                  value: item.countryCode,
                })),
              ]}
              required
            />

            <SelectField
              label={t("internationalization.countryLanguage")}
              value={languageCode}
              onChange={handleLanguageChange}
              options={[
                { label: t("internationalization.selectLanguage"), value: "" },
                ...countryConfigurations.map((item) => ({
                  label: `${item.languageName} · ${item.languageCode}`,
                  value: item.languageCode,
                })),
              ]}
              required
            />

            <TextField label={t("internationalization.code")} value={code} onChange={setCode} placeholder="PT_PT" required />
            <TextField label={t("internationalization.countryCode")} value={countryCode} onChange={setCountryCode} placeholder="PT" required />
            <TextField label={t("internationalization.countryName")} value={countryName} onChange={setCountryName} placeholder="Portugal" required />
          </FormGroup>

          <FormGroup title={t("internationalization.languageCurrency")}>
            <TextField label={t("internationalization.languageCode")} value={languageCode} onChange={setLanguageCode} placeholder="pt-PT" required />
            <TextField label={t("internationalization.languageName")} value={languageName} onChange={setLanguageName} placeholder="Português (Portugal)" required />
            <TextField label={t("internationalization.currencyCode")} value={currencyCode} onChange={setCurrencyCode} placeholder="EUR" required />
            <TextField label={t("internationalization.currencySymbol")} value={currencySymbol} onChange={setCurrencySymbol} placeholder="€" required />
          </FormGroup>

          <FormGroup title={t("internationalization.timezoneFormats")}>
            <SelectField
              label={t("internationalization.timezone")}
              value={timezone}
              onChange={handleTimezoneChange}
              options={[
                { label: t("internationalization.selectTimezone"), value: "" },
                ...timezoneOptions.map((item) => ({
                  label: `${item.timezoneLabel} · ${item.timezone}`,
                  value: item.timezone,
                })),
              ]}
              required
            />

            <TextField label={t("internationalization.timezoneLabel")} value={timezoneLabel} onChange={setTimezoneLabel} placeholder="Europa/Lisboa" required />
            <TextField label={t("internationalization.dateFormat")} value={dateFormat} onChange={setDateFormat} placeholder="dd/MM/yyyy" required />
            <TextField label={t("internationalization.timeFormat")} value={timeFormat} onChange={setTimeFormat} placeholder="HH:mm" required />
          </FormGroup>

          <FormGroup title={t("internationalization.flagControl")}>
            <TextField label={t("internationalization.flagEmoji")} value={flagEmoji} onChange={setFlagEmoji} placeholder="🇵🇹" />
            <TextField label={t("internationalization.flagIconUrl")} value={flagIconUrl} onChange={setFlagIconUrl} placeholder="https://..." />
            <TextField label={t("common.priority")} value={String(priority)} onChange={(value) => setPriority(Number(value))} placeholder="0" type="number" required />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ToggleField label={t("internationalization.active")} active={active} onToggle={() => setActive((value) => !value)} />
              <ToggleField label={t("internationalization.systemDefault")} active={systemDefault} onToggle={() => setSystemDefault((value) => !value)} />
            </div>
          </FormGroup>

          {error && (
            <div className="bg-danger/10 border border-danger/30 text-danger rounded-2xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto bg-background border border-border text-muted font-semibold px-5 py-2.5 rounded-full hover:border-danger hover:text-danger transition text-sm"
            >
              {t("common.cancel")}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-semibold py-2.5 rounded-full hover:shadow-neon transition disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {loading ? t("internationalization.saving") : t("internationalization.saveConfiguration")}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function FormGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="surface-muted rounded-2xl p-4">
      <legend className="px-2 text-xs uppercase tracking-wide text-muted">
        {title}
      </legend>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {children}
      </div>
    </fieldset>
  )
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  required?: boolean
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs text-muted">{label}</span>

      <input
        className="field-input"
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
      />
    </label>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
  required = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ label: string; value: string }>
  required?: boolean
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs text-muted">{label}</span>

      <select
        className="field-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
      >
        {options.map((option) => (
          <option key={`${label}-${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function ToggleField({
  label,
  active,
  onToggle,
}: {
  label: string
  active: boolean
  onToggle: () => void
}) {
  return (
    <label className="flex items-center justify-between surface-muted rounded-2xl px-4 py-2.5">
      <span className="text-sm text-muted">{label}</span>

      <button
        type="button"
        onClick={onToggle}
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
  )
}