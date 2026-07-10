import { useState } from "react"
import { AlertTriangle, X } from "lucide-react"
import { useTranslation } from "../../hooks/useTranslation"
import { TenantEnvironmentRuleService } from "../../services/tenantEnvironmentRule.service"
import type { TenantEnvironmentRule } from "../../types/tenantEnvironmentRule.types"

interface DeleteTenantEnvironmentRuleModalProps {
  open: boolean
  rule: TenantEnvironmentRule | null
  onClose: () => void
  onDeleted: () => void
}

export function DeleteTenantEnvironmentRuleModal({
  open,
  rule,
  onClose,
  onDeleted,
}: DeleteTenantEnvironmentRuleModalProps) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open || !rule) return null

  const currentRule = rule

  async function handleDelete() {
    setLoading(true)
    setError(null)

    try {
      await TenantEnvironmentRuleService.delete(currentRule.id)

      onDeleted()
      onClose()
    } catch {
      setError(t("tenantRules.deleteError"))
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
              <AlertTriangle size={19} className="text-danger" />
            </div>

            <div>
              <span className="text-sm text-danger font-medium">
                {t("tenantRules.delete")}
              </span>

              <h2 className="text-xl font-bold mt-1">
                {t("tenantRules.confirmDelete")}
              </h2>

              <p className="text-muted text-sm mt-1">
                {t("tenantRules.deleteDescription")}
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

        <div className="surface-muted rounded-2xl p-4 mb-4">
          <p className="text-xs text-muted">
            {t("tenantRules.rule")}
          </p>

          <strong className="text-sm block mt-1">
            {currentRule.name}
          </strong>

          <p className="text-xs text-muted mt-1">
            {currentRule.ruleKey}
          </p>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/30 text-danger rounded-2xl px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-background border border-border text-muted font-semibold py-2.5 rounded-full hover:border-primary hover:text-primary transition text-sm"
          >
            {t("common.cancel")}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="w-full bg-danger text-white font-semibold py-2.5 rounded-full hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed text-sm"
          >
            {loading ? t("tenantRules.deleting") : t("tenantRules.delete")}
          </button>
        </div>
      </div>
    </div>
  )
}