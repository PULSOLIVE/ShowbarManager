import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { Plus, X } from "lucide-react"
import { useTranslation } from "../../hooks/useTranslation"
import { CountryFiscalRuleService } from "../../services/countryFiscalRule.service"
import type {
  CountryFiscalRule,
  UpdateCountryFiscalRuleRequest,
} from "../../types/countryFiscalRule.types"

interface EditCountryModalProps {
  open: boolean
  country: CountryFiscalRule | null
  onClose: () => void
  onUpdated: () => void
}

function normalizeFields(fields: string[]) {
  return Array.from(
    new Set(fields.map((field) => field.trim()).filter(Boolean))
  )
}

function getErrorMessage(error: unknown, fallback: string) {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response
  ) {
    const data = error.response.data as { message?: string }

    if (data.message) {
      return data.message
    }
  }

  return fallback
}

export function EditCountryModal({
  open,
  country,
  onClose,
  onUpdated,
}: EditCountryModalProps) {
  const { t } = useTranslation()

  const [countryCode, setCountryCode] = useState("")
  const [countryName, setCountryName] = useState("")
  const [taxName, setTaxName] = useState("")
  const [description, setDescription] = useState("")
  const [fields, setFields] = useState<string[]>([""])
  const [active, setActive] = useState(true)
  const [priority, setPriority] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !country) return

    setCountryCode(country.countryCode || "")
    setCountryName(country.countryName || "")
    setTaxName(country.taxName || "")
    setDescription(country.description || "")
    setFields(country.fields?.length ? country.fields : [""])
    setActive(Boolean(country.active))
    setPriority(Number(country.priority || 0))
    setLoading(false)
    setError(null)
  }, [country, open])

  if (!open || !country) return null

  const currentCountry = country

  function handleFieldChange(index: number, value: string) {
    setFields((current) =>
      current.map((field, currentIndex) =>
        currentIndex === index ? value : field
      )
    )
  }

  function handleAddField() {
    setFields((current) => [...current, ""])
  }

  function handleRemoveField(index: number) {
    setFields((current) => {
      const nextFields = current.filter((_, currentIndex) => currentIndex !== index)
      return nextFields.length > 0 ? nextFields : [""]
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!currentCountry.id) {
        setError(t("countries.ruleIdNotFound"))
        return
      }

      const normalizedFields = normalizeFields(fields)

      if (normalizedFields.length === 0) {
        setError(t("countries.requiredFieldMissing"))
        return
      }

      const payload: UpdateCountryFiscalRuleRequest = {
        countryCode: countryCode.trim().toUpperCase(),
        countryName: countryName.trim(),
        taxName: taxName.trim(),
        description: description.trim(),
        fields: normalizedFields,
        active,
        priority,
      }

      await CountryFiscalRuleService.update(currentCountry.id, payload)

      onUpdated()
      onClose()
    } catch (err) {
      setError(getErrorMessage(err, t("countries.updateError")))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-[720px] max-h-[92vh] overflow-y-auto app-scrollbar surface-premium rounded-2xl p-5">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <span className="text-sm text-primary font-medium">
              {t("countries.title")}
            </span>

            <h2 className="text-xl font-bold mt-1">
              {t("countries.editFiscalCountry")}
            </h2>

            <p className="text-muted text-sm mt-1">
              {t("countries.editDescription")}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-xs text-muted mb-1.5">
                {t("internationalization.countryCode")}
              </span>

              <input
                className="field-input"
                value={countryCode}
                onChange={(event) => setCountryCode(event.target.value.toUpperCase())}
                placeholder="PT"
                maxLength={2}
                required
              />
            </label>

            <label className="block">
              <span className="block text-xs text-muted mb-1.5">
                {t("countries.countryName")}
              </span>

              <input
                className="field-input"
                value={countryName}
                onChange={(event) => setCountryName(event.target.value)}
                placeholder="Portugal"
                required
              />
            </label>

            <label className="block">
              <span className="block text-xs text-muted mb-1.5">
                {t("countries.fiscalRule")}
              </span>

              <input
                className="field-input"
                value={taxName}
                onChange={(event) => setTaxName(event.target.value)}
                placeholder="IVA / SAF-T PT"
                required
              />
            </label>

            <label className="block">
              <span className="block text-xs text-muted mb-1.5">
                {t("common.priority")}
              </span>

              <input
                className="field-input"
                type="number"
                value={priority}
                onChange={(event) => setPriority(Number(event.target.value))}
                required
              />
            </label>
          </div>

          <label className="block">
            <span className="block text-xs text-muted mb-1.5">
              {t("common.description")}
            </span>

            <textarea
              className="field-input min-h-24 resize-y"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder={t("countries.descriptionPlaceholder")}
              required
            />
          </label>

          <div className="surface-muted rounded-2xl p-3 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-muted">
                {t("countries.requiredFields")}
              </span>

              <button
                type="button"
                onClick={handleAddField}
                className="bg-background border border-border px-3 py-1.5 rounded-full flex items-center gap-2 hover:border-primary hover:text-primary transition text-xs"
              >
                <Plus size={13} />
                {t("countries.addField")}
              </button>
            </div>

            {fields.map((field, index) => (
              <div key={`field-${index}`} className="flex items-center gap-2">
                <input
                  className="field-input"
                  value={field}
                  onChange={(event) => handleFieldChange(index, event.target.value)}
                  placeholder="Ex: NIF/NIPC"
                  required={index === 0}
                />

                <button
                  type="button"
                  onClick={() => handleRemoveField(index)}
                  className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center hover:border-danger hover:text-danger transition shrink-0"
                  title={t("countries.removeField")}
                >
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>

          <label className="flex items-center justify-between surface-muted rounded-2xl px-4 py-2.5">
            <span className="text-sm text-muted">
              {t("countries.activeRule")}
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
            disabled={loading}
            className="w-full bg-primary text-white font-semibold py-3 rounded-full hover:shadow-neon transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? t("countries.saving") : t("countries.saveChanges")}
          </button>
        </form>
      </div>
    </div>
  )
}