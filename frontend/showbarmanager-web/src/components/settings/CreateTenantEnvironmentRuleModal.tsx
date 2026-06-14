import { useState } from "react"
import type { FormEvent } from "react"
import { X } from "lucide-react"
import { useTranslation } from "../../hooks/useTranslation"
import { TenantEnvironmentRuleService } from "../../services/tenantEnvironmentRule.service"
import type { CreateTenantEnvironmentRuleRequest } from "../../types/tenantEnvironmentRule.types"

interface CreateTenantEnvironmentRuleModalProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

function normalizeRuleKey(value: string) {
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

export function CreateTenantEnvironmentRuleModal({
  open,
  onClose,
  onCreated,
}: CreateTenantEnvironmentRuleModalProps) {
  const { t } = useTranslation()
  const [ruleKey, setRuleKey] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [enabled, setEnabled] = useState(true)
  const [priority, setPriority] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  function handleNameChange(value: string) {
    setName(value)

    if (!ruleKey.trim()) {
      setRuleKey(normalizeRuleKey(value))
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload: CreateTenantEnvironmentRuleRequest = {
        name: name.trim(),
        description: description.trim(),
        ruleKey: normalizeRuleKey(ruleKey),
        enabled,
        priority,
        systemRule: false,
      }

      await TenantEnvironmentRuleService.create(payload)

      onCreated()
      onClose()
    } catch {
      setError(t("tenantRules.createError"))
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
              {t("tenantRules.multiEnvironments")}
            </span>

            <h2 className="text-xl font-bold mt-1">
              {t("tenantRules.new")}
            </h2>

            <p className="text-muted text-sm mt-1">
              {t("tenantRules.createDescription")}
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
              {t("tenantRules.ruleTitle")}
            </span>

            <input
              className="field-input"
              value={name}
              onChange={(event) => handleNameChange(event.target.value)}
              placeholder={t("tenantRules.ruleTitlePlaceholder")}
              required
            />
          </label>

          <label className="block">
            <span className="block text-xs text-muted mb-1.5">
              {t("tenantRules.ruleCode")}
            </span>

            <input
              className="field-input"
              value={ruleKey}
              onChange={(event) => setRuleKey(normalizeRuleKey(event.target.value))}
              placeholder="ENVIRONMENT_ACTIVE_REQUIRED"
              required
            />
          </label>

          <label className="block">
            <span className="block text-xs text-muted mb-1.5">
              {t("tenantRules.ruleDescription")}
            </span>

            <textarea
              className="field-input min-h-24 resize-y"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder={t("tenantRules.ruleDescriptionPlaceholder")}
              required
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-xs text-muted mb-1.5">
                {t("common.status")}
              </span>

              <input
                className="field-input"
                value={enabled ? t("common.active") : t("common.inactive")}
                readOnly
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

          <label className="flex items-center justify-between surface-muted rounded-2xl px-4 py-2.5">
            <span className="text-sm text-muted">
              {t("tenantRules.activeRule")}
            </span>

            <button
              type="button"
              onClick={() => setEnabled((value) => !value)}
              className={[
                "relative w-12 h-7 rounded-full transition-all",
                enabled ? "bg-primary" : "bg-zinc-700",
              ].join(" ")}
            >
              <span
                className={[
                  "absolute top-1 w-5 h-5 rounded-full bg-white transition-all",
                  enabled ? "left-6" : "left-1",
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
            {loading ? t("tenantRules.saving") : t("tenantRules.create")}
          </button>
        </form>
      </div>
    </div>
  )
}