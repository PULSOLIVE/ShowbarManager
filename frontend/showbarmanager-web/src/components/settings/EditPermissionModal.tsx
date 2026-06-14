import { useEffect, useState } from "react"
import type { FormEvent, ReactNode } from "react"
import { AlertTriangle, CheckCircle2, KeyRound, X } from "lucide-react"
import { useTranslation } from "../../hooks/useTranslation"
import { PermissionService } from "../../services/permission.service"
import type {
  Permission,
  UpdatePermissionRequest,
} from "../../types/permission.types"

interface EditPermissionModalProps {
  open: boolean
  permission: Permission | null
  onClose: () => void
  onUpdated: () => void
}

function normalizePermissionCode(value: string) {
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

export function EditPermissionModal({
  open,
  permission,
  onClose,
  onUpdated,
}: EditPermissionModalProps) {
  const { t } = useTranslation()

  const [permissionId, setPermissionId] = useState("")
  const [permissionCode, setPermissionCode] = useState("")
  const [name, setName] = useState("")
  const [module, setModule] = useState("")
  const [action, setAction] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState(0)
  const [active, setActive] = useState(true)
  const [systemPermission, setSystemPermission] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !permission) {
      return
    }

    setPermissionId(permission.id || "")
    setPermissionCode(permission.code || "")
    setName(permission.name || "")
    setModule(permission.module || "")
    setAction(permission.action || "")
    setDescription(permission.description || "")
    setPriority(Number(permission.priority || 0))
    setActive(Boolean(permission.active))
    setSystemPermission(Boolean(permission.systemPermission))
    setLoading(false)
    setError(null)
  }, [open, permission])

  if (!open || !permission) {
    return null
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    if (!permissionId) {
      setError(t("permissions.permissionNotSelected"))
      setLoading(false)
      return
    }

    const normalizedModule = normalizePermissionCode(module)
    const normalizedAction = normalizePermissionCode(action)

    if (!name.trim()) {
      setError(t("permissions.nameRequired"))
      setLoading(false)
      return
    }

    if (!normalizedModule || !normalizedAction) {
      setError(t("permissions.moduleActionRequired"))
      setLoading(false)
      return
    }

    try {
      const payload: UpdatePermissionRequest = {
        name: name.trim(),
        module: normalizedModule,
        action: normalizedAction,
        description: description.trim(),
        active,
        systemPermission,
        priority,
      }

      await PermissionService.update(permissionId, payload)

      onUpdated()
      onClose()
    } catch {
      setError(t("permissions.updateError"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-[620px] max-h-[90vh] overflow-y-auto app-scrollbar surface-premium rounded-2xl p-4 shadow-neon">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <span className="text-xs text-primary font-semibold uppercase tracking-wide">
              {t("permissions.edit")}
            </span>

            <h2 className="text-xl font-bold mt-1">
              {permissionCode}
            </h2>

            <p className="text-muted text-sm mt-1">
              {t("permissions.editDescription")}
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
          <section className="surface-muted rounded-2xl p-3">
            <div className="flex items-center gap-2 mb-3">
              <KeyRound size={15} className="text-primary" />

              <div>
                <p className="text-sm font-semibold">
                  {t("permissions.identification")}
                </p>

                <p className="text-xs text-muted">
                  {t("permissions.technicalCodeLocked")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label={t("permissions.technicalCode")}>
                <input
                  className="field-input opacity-70 cursor-not-allowed"
                  value={permissionCode}
                  disabled
                />
              </Field>

              <Field label={t("common.name")}>
                <input
                  className="field-input"
                  placeholder={t("permissions.name")}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </Field>
            </div>

            <p className="text-[11px] text-muted mt-2">
              {t("permissions.technicalCodeChangeHint")}
            </p>
          </section>

          <section className="surface-muted rounded-2xl p-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label={t("permissions.module")}>
                <input
                  className="field-input"
                  placeholder="Ex: USERS"
                  value={module}
                  onChange={(event) =>
                    setModule(normalizePermissionCode(event.target.value))
                  }
                  required
                />
              </Field>

              <Field label={t("permissions.action")}>
                <input
                  className="field-input"
                  placeholder="Ex: CREATE"
                  value={action}
                  onChange={(event) =>
                    setAction(normalizePermissionCode(event.target.value))
                  }
                  required
                />
              </Field>

              <Field label={t("common.priority")}>
                <input
                  className="field-input"
                  type="number"
                  placeholder="0"
                  value={priority}
                  onChange={(event) => setPriority(Number(event.target.value))}
                />
              </Field>
            </div>

            <div className="mt-3">
              <Field label={t("common.description")}>
                <textarea
                  className="field-input min-h-24 resize-none"
                  placeholder={t("common.description")}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </Field>
            </div>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ToggleField
              label={t("permissions.active")}
              description={t("permissions.activeDescription")}
              active={active}
              onToggle={() => setActive((value) => !value)}
            />

            <ToggleField
              label={t("permissions.systemPermission")}
              description={t("permissions.systemPermissionDescription")}
              active={systemPermission}
              onToggle={() => setSystemPermission((value) => !value)}
            />
          </section>

          {systemPermission && (
            <Notice
              type="warning"
              message={t("permissions.systemPermissionWarning")}
            />
          )}

          {!active && (
            <Notice
              type="info"
              message={t("permissions.inactivePermissionInfo")}
            />
          )}

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
              disabled={loading || !permissionId}
              className="w-full bg-primary text-white font-semibold py-2.5 rounded-full hover:shadow-neon transition disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {loading ? t("permissions.saving") : t("permissions.saveChanges")}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="block text-xs text-muted mb-1.5">
        {label}
      </span>

      {children}
    </label>
  )
}

function ToggleField({
  label,
  description,
  active,
  onToggle,
}: {
  label: string
  description: string
  active: boolean
  onToggle: () => void
}) {
  return (
    <label className="flex items-center justify-between gap-4 surface-muted rounded-2xl px-4 py-3">
      <span>
        <span className="block text-sm font-medium">
          {label}
        </span>

        <span className="block text-xs text-muted mt-0.5">
          {description}
        </span>
      </span>

      <button
        type="button"
        onClick={onToggle}
        className={[
          "relative w-12 h-7 rounded-full transition-all shrink-0",
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

function Notice({
  type,
  message,
}: {
  type: "info" | "warning"
  message: string
}) {
  const Icon = type === "warning" ? AlertTriangle : CheckCircle2

  return (
    <div
      className={[
        "rounded-2xl px-4 py-3 text-sm border flex items-start gap-2",
        type === "warning"
          ? "bg-warning/10 border-warning/30 text-warning"
          : "bg-primarySoft border-primary/20 text-primary",
      ].join(" ")}
    >
      <Icon size={16} className="shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  )
}