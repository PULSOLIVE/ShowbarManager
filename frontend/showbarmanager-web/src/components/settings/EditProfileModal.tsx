import { useEffect, useMemo, useState } from "react"
import type { FormEvent, ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  AlertTriangle,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  X,
} from "lucide-react"
import { useTranslation } from "../../hooks/useTranslation"
import { PermissionService } from "../../services/permission.service"
import { ProfileService } from "../../services/profile.service"
import type { Profile, UpdateProfileRequest } from "../../types/profile.types"

interface EditProfileModalProps {
  open: boolean
  profile: Profile | null
  onClose: () => void
  onUpdated: () => void
}

function translatePermissionPart(value: string, t: (path: string, fallback?: string) => string) {
  const dictionary: Record<string, string> = {
    USERS: t("menu.users"),
    USER: t("users.commonUser"),
    TENANTS: t("menu.tenants"),
    TENANT: t("tenants.title"),
    SETTINGS: t("menu.settings"),
    PROFILES: t("menu.profiles"),
    PROFILE: t("profiles.title"),
    PERMISSIONS: t("menu.permissions"),
    PERMISSION: t("permissions.title"),
    INTERNATIONALIZATION: t("menu.internationalization"),
    SECURITY: t("menu.security"),
    SESSIONS: t("menu.sessions"),
    SESSION: t("sessions.title"),
    AUDIT: t("menu.audit"),
    BRANDING: t("menu.branding"),
    COUNTRIES: t("menu.countries"),
    COUNTRY: t("common.country"),
    FISCAL: t("countries.tax"),
    INTEGRATIONS: t("menu.integrations"),
    INTEGRATION: t("integrations.title"),
    NETWORK: t("menu.network"),
    HARDWARE: t("menu.hardware"),
    POLICIES: t("menu.policies"),
    POLICY: t("policies.title"),
    VIEW: t("common.view", "Visualizar"),
    CREATE: t("common.create"),
    UPDATE: t("common.update"),
    DELETE: t("common.delete"),
    MANAGE: t("common.manage", "Gerir"),
    EXPORT: t("common.export", "Exportar"),
    IMPORT: t("common.import", "Importar"),
    APPROVE: t("common.approve", "Aprovar"),
    CANCEL: t("common.cancel"),
  }

  return dictionary[value] || value
}

function formatPermissionLabel(
  module: string,
  action: string,
  t: (path: string, fallback?: string) => string
) {
  return `${translatePermissionPart(module, t)} · ${translatePermissionPart(action, t)}`
}

export function EditProfileModal({
  open,
  profile,
  onClose,
  onUpdated,
}: EditProfileModalProps) {
  const { t } = useTranslation()

  const [profileId, setProfileId] = useState("")
  const [profileCode, setProfileCode] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState(0)
  const [active, setActive] = useState(true)
  const [systemProfile, setSystemProfile] = useState(false)
  const [permissionIds, setPermissionIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: permissions = [] } = useQuery({
    queryKey: ["profile-edit-modal-permissions"],
    queryFn: PermissionService.findAll,
    enabled: open,
  })

  const permissionOptions = useMemo(() => {
    return permissions
      .filter((permission) => permission.active)
      .sort((a, b) => {
        const moduleCompare = a.module.localeCompare(b.module)

        if (moduleCompare !== 0) {
          return moduleCompare
        }

        return a.action.localeCompare(b.action)
      })
  }, [permissions])

  useEffect(() => {
    if (!open || !profile) {
      return
    }

    setProfileId(profile.id || "")
    setProfileCode(profile.code || "")
    setName(profile.name || "")
    setDescription(profile.description || "")
    setPriority(Number(profile.priority || 0))
    setActive(Boolean(profile.active))
    setSystemProfile(Boolean(profile.systemProfile))
    setPermissionIds(profile.permissionIds ?? [])
    setLoading(false)
    setError(null)
  }, [open, profile])

  if (!open || !profile) {
    return null
  }

  function togglePermission(permissionId: string) {
    setPermissionIds((current) =>
      current.includes(permissionId)
        ? current.filter((item) => item !== permissionId)
        : [...current, permissionId]
    )
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    if (!profileId) {
      setError(t("profiles.profileNotSelected"))
      setLoading(false)
      return
    }

    if (!name.trim()) {
      setError(t("profiles.nameRequired"))
      setLoading(false)
      return
    }

    try {
      const payload: UpdateProfileRequest = {
        name: name.trim(),
        description: description.trim(),
        active,
        systemProfile,
        priority,
        permissionIds,
      }

      await ProfileService.update(profileId, payload)

      onUpdated()
      onClose()
    } catch {
      setError(t("profiles.updateError"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-[680px] max-h-[90vh] overflow-y-auto app-scrollbar surface-premium rounded-2xl p-4 shadow-neon">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <span className="text-xs text-primary font-semibold uppercase tracking-wide">
              {t("profiles.edit")}
            </span>

            <h2 className="text-xl font-bold mt-1">
              {profileCode}
            </h2>

            <p className="text-muted text-sm mt-1">
              {t("profiles.editDescription")}
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
              <ShieldCheck size={15} className="text-primary" />

              <div>
                <p className="text-sm font-semibold">
                  {t("profiles.identification")}
                </p>

                <p className="text-xs text-muted">
                  {t("profiles.technicalCodeLocked")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label={t("profiles.technicalCode")}>
                <input
                  className="field-input opacity-70 cursor-not-allowed"
                  value={profileCode}
                  disabled
                />
              </Field>

              <Field label={t("profiles.name")}>
                <input
                  className="field-input"
                  placeholder={t("profiles.name")}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </Field>
            </div>

            <p className="text-[11px] text-muted mt-2">
              {t("profiles.technicalCodeChangeHint")}
            </p>
          </section>

          <section className="surface-muted rounded-2xl p-3">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-3">
              <Field label={t("common.description")}>
                <textarea
                  className="field-input min-h-24 resize-none"
                  placeholder={t("common.description")}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
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
          </section>

          <SelectionPanel
            title={t("profiles.permissions")}
            description={t("profiles.permissionsDescription")}
            emptyLabel={t("profiles.noActivePermissions")}
            items={permissionOptions.map((permission) => ({
              id: permission.id,
              code: permission.code,
              label: formatPermissionLabel(permission.module, permission.action, t),
            }))}
            selectedIds={permissionIds}
            onToggle={togglePermission}
          />

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ToggleField
              label={t("profiles.active")}
              description={t("profiles.activeDescription")}
              active={active}
              onToggle={() => setActive((value) => !value)}
            />

            <ToggleField
              label={t("profiles.systemProfile")}
              description={t("profiles.systemProfileDescription")}
              active={systemProfile}
              onToggle={() => setSystemProfile((value) => !value)}
            />
          </section>

          {systemProfile && (
            <Notice
              type="warning"
              message={t("profiles.systemProfileWarning")}
            />
          )}

          {!active && (
            <Notice
              type="info"
              message={t("profiles.inactiveProfileInfo")}
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
              disabled={loading || !profileId}
              className="w-full bg-primary text-white font-semibold py-2.5 rounded-full hover:shadow-neon transition disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {loading ? t("profiles.saving") : t("profiles.saveChanges")}
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

function SelectionPanel({
  title,
  description,
  emptyLabel,
  items,
  selectedIds,
  onToggle,
}: {
  title: string
  description: string
  emptyLabel: string
  items: Array<{
    id: string
    code: string
    label: string
  }>
  selectedIds: string[]
  onToggle: (id: string) => void
}) {
  return (
    <section className="surface-muted rounded-2xl p-3">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div>
          <p className="text-sm font-semibold">
            {title}
          </p>

          <p className="text-xs text-muted mt-0.5">
            {description}
          </p>
        </div>

        <span className="text-xs text-primary font-semibold">
          {selectedIds.length}
        </span>
      </div>

      <div className="max-h-36 overflow-y-auto app-scrollbar grid grid-cols-1 sm:grid-cols-2 gap-2 pr-1">
        {items.length > 0 ? (
          items.map((item) => {
            const selected = selectedIds.includes(item.id)

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onToggle(item.id)}
                className={[
                  "text-left rounded-xl border px-3 py-2 transition text-xs",
                  selected
                    ? "bg-primary text-white border-primary font-semibold"
                    : "bg-card border-border text-muted hover:text-text hover:border-primary/60",
                ].join(" ")}
              >
                <span className="flex items-center gap-1.5">
                  <KeyRound size={12} />
                  {item.label}
                </span>

                <span
                  className={
                    selected
                      ? "block mt-1 text-white/75"
                      : "block mt-1 text-muted"
                  }
                >
                  {item.code}
                </span>
              </button>
            )
          })
        ) : (
          <span className="text-xs text-muted">
            {emptyLabel}
          </span>
        )}
      </div>
    </section>
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