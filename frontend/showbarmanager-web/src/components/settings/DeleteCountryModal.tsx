import { useState } from "react"
import { AlertTriangle, X } from "lucide-react"
import { useTranslation } from "../../hooks/useTranslation"
import { CountryFiscalRuleService } from "../../services/countryFiscalRule.service"
import type { CountryFiscalRule } from "../../types/countryFiscalRule.types"

interface DeleteCountryModalProps {
  open: boolean
  country: CountryFiscalRule | null
  onClose: () => void
  onDeleted: () => void
}

export function DeleteCountryModal({
  open,
  country,
  onClose,
  onDeleted,
}: DeleteCountryModalProps) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open || !country) return null

  const currentCountry = country

  async function handleDelete() {
    setLoading(true)
    setError(null)

    try {
      await CountryFiscalRuleService.delete(currentCountry.id)

      onDeleted()
      onClose()
    } catch {
      setError(t("countries.deleteError"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-[520px] surface-premium rounded-2xl p-5">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-danger/10 border border-danger/30 flex items-center justify-center shrink-0">
              <AlertTriangle size={20} className="text-danger" />
            </div>

            <div>
              <span className="text-sm text-danger font-medium">
                {t("countries.deleteFiscalRule")}
              </span>

              <h2 className="text-xl font-bold mt-1">
                {t("countries.deleteCountry")}
              </h2>

              <p className="text-muted text-sm mt-1">
                {t("countries.deleteDescription")}
              </p>
            </div>
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

        <div className="surface-muted rounded-2xl p-4">
          <p className="text-sm text-muted">
            {t("countries.country")}
          </p>

          <strong className="text-lg block mt-1">
            {currentCountry.countryName}
          </strong>

          <p className="text-sm text-muted mt-1">
            {currentCountry.countryCode} · {currentCountry.taxName}
          </p>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/30 text-danger rounded-2xl px-4 py-3 text-sm mt-4">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto bg-background border border-border text-muted font-semibold px-5 py-2.5 rounded-full hover:border-primary hover:text-primary transition text-sm"
          >
            {t("common.cancel")}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="w-full bg-danger text-white font-semibold py-2.5 rounded-full hover:shadow-neon transition disabled:opacity-60 disabled:cursor-not-allowed text-sm"
          >
            {loading ? t("countries.deleting") : t("countries.confirmDelete")}
          </button>
        </div>
      </div>
    </div>
  )
}