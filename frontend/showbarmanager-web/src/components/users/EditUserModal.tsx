import { useEffect, useMemo, useState } from "react"
import type { FormEvent, ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import { ShieldCheck, X } from "lucide-react"
import { useTranslation } from "../../hooks/useTranslation"
import { InternationalizationService } from "../../services/internationalization.service"
import { PermissionService } from "../../services/permission.service"
import { ProfileService } from "../../services/profile.service"
import { UserService } from "../../services/user.service"
import { PhoneNumberInput } from "../common/PhoneNumberInput"
import type { Internationalization } from "../../types/internationalization.types"
import type { UpdateUserRequest, User } from "../../types/user.types"

interface EditUserModalProps {
  open: boolean
  user: User | null
  onClose: () => void
  onUpdated: () => void
}

type UpdateUserPayload = UpdateUserRequest & {
  language?: string | null
}

type UserWithLanguage = User & {
  language?: string | null
  languageCode?: string | null
}

const fallbackUserRoles = [
  "ADMIN_MASTER",
  "DEVELOPER_MASTER",
  "SUPPORT_N1",
  "SUPPORT_N2",
  "SUPPORT_N3",
  "COMPLIANCE",
  "AUDITOR",
  "TENANT_ADMIN",
  "EVENT_ADMIN",
  "FINANCIAL_MANAGER",
  "TICKET_MANAGER",
  "SECURITY_MANAGER",
  "HEALTH_MANAGER",
  "LOGISTICS_MANAGER",
  "BAR_MANAGER",
  "TECHNICAL_MANAGER",
  "OPERATOR",
]

function getUserLanguage(user: User) {
  const userWithLanguage = user as UserWithLanguage

  return userWithLanguage.language || userWithLanguage.languageCode || ""
}

function buildLanguageOptions(items: Internationalization[]) {
  const map = new Map<string, Internationalization>()

  items
    .filter((item) => item.active)
    .forEach((item) => {
      if (!map.has(item.languageCode)) {
        map.set(item.languageCode, item)
      }
    })

  return Array.from(map.values()).sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority
    return a.languageName.localeCompare(b.languageName)
  })
}

export function EditUserModal({
  open,
  user,
  onClose,
  onUpdated,
}: EditUserModalProps) {
  if (!open || !user) {
    return null
  }

  return (
    <EditUserModalContent
      open={open}
      user={user}
      onClose={onClose}
      onUpdated={onUpdated}
    />
  )
}

interface EditUserModalContentProps {
  open: boolean
  user: User
  onClose: () => void
  onUpdated: () => void
}

function EditUserModalContent({
  open,
  user,
  onClose,
  onUpdated,
}: EditUserModalContentProps) {
  const { t } = useTranslation()

  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [phone, setPhone] = useState(user.phone ?? "")
  const [role, setRole] = useState(
    user.roles.length > 0 ? user.roles[0] : "OPERATOR"
  )
  const [language, setLanguage] = useState(getUserLanguage(user))
  const [profileIds, setProfileIds] = useState<string[]>(user.profileIds ?? [])
  const [permissionIds, setPermissionIds] = useState<string[]>(
    user.permissionIds ?? []
  )
  const [active, setActive] = useState(user.active)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: profiles = [] } = useQuery({
    queryKey: ["user-edit-modal-profiles"],
    queryFn: ProfileService.findAll,
    enabled: open,
  })

  const { data: permissions = [] } = useQuery({
    queryKey: ["user-edit-modal-permissions"],
    queryFn: PermissionService.findAll,
    enabled: open,
  })

  const { data: internationalizations = [] } = useQuery({
    queryKey: ["user-edit-modal-languages"],
    queryFn: InternationalizationService.listActive,
    enabled: open,
  })

  const languageOptions = useMemo(() => {
    return buildLanguageOptions(internationalizations)
  }, [internationalizations])

  const profileOptions = useMemo(() => {
    return profiles
      .filter((profile) => profile.active)
      .sort((a, b) => a.priority - b.priority)
  }, [profiles])

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

  const roleOptions = useMemo(() => {
    if (profileOptions.length === 0) {
      return fallbackUserRoles.map((value) => ({
        value,
        label: t(`roles.${value}`, value),
      }))
    }

    return profileOptions.map((profile) => ({
      value: profile.code,
      label: profile.name,
    }))
  }, [profileOptions, t])

  useEffect(() => {
    setName(user.name)
    setEmail(user.email)
    setPhone(user.phone ?? "")
    setRole(user.roles.length > 0 ? user.roles[0] : "OPERATOR")
    setLanguage(getUserLanguage(user))
    setProfileIds(user.profileIds ?? [])
    setPermissionIds(user.permissionIds ?? [])
    setActive(user.active)
    setLoading(false)
    setError(null)
  }, [user])

  function toggleProfile(profileId: string) {
    setProfileIds((current) =>
      current.includes(profileId)
        ? current.filter((item) => item !== profileId)
        : [...current, profileId]
    )
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

    try {
      const payload: UpdateUserPayload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || null,
        role,
        active,
        language: language || null,
        profileIds,
        permissionIds,
      }

      await UserService.update(user.id, payload)

      onUpdated()
      onClose()
    } catch {
      setError(t("users.updateError"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-[640px] max-h-[90vh] overflow-y-auto app-scrollbar surface-premium rounded-2xl p-4 shadow-neon">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <span className="text-xs text-primary font-semibold uppercase tracking-wide">
              {t("users.editAccess")}
            </span>

            <h2 className="text-xl font-bold mt-1">
              {t("users.edit")}
            </h2>

            <p className="text-muted text-sm mt-1">
              {t("users.editDescription")}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-cardSoft border border-border flex items-center justify-center hover:border-danger hover:text-danger transition shrink-0"
            title={t("common.close")}
          >
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label={t("users.fullName")}>
              <input
                className="field-input"
                placeholder={t("users.fullName")}
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </Field>

            <Field label={t("common.email")}>
              <input
                className="field-input"
                placeholder={t("users.emailPlaceholder")}
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </Field>
            <Field label={t("common.phone", "Telefone")}>
              <input
                className="field-input"
                placeholder={t("users.phonePlaceholder", "+55 11 99999-9999")}
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label={t("users.mainProfile")}>
              <select
                className="field-input"
                value={role}
                onChange={(event) => setRole(event.target.value)}
              >
                {!roleOptions.some((item) => item.value === role) && (
                  <option value={role}>
                    {role}
                  </option>
                )}

                {roleOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label} · {item.value}
                  </option>
                ))}
              </select>
            </Field>

            <Field label={t("users.userLanguage")}>
              <select
                className="field-input"
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
              >
                <option value="">
                  {t("users.useTenantLanguage")}
                </option>

                {languageOptions.map((item) => (
                  <option key={item.languageCode} value={item.languageCode}>
                    {item.flagEmoji || "🌐"} {item.languageName} · {item.languageCode}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <label className="flex items-center justify-between bg-cardSoft border border-border rounded-2xl px-4 py-2.5">
            <span className="text-sm text-muted">
              {t("users.activeUser")}
            </span>

            <button
              type="button"
              onClick={() => setActive((value) => !value)}
              className={[
                "relative w-12 h-7 rounded-full transition-all",
                active ? "bg-primary" : "bg-border",
              ].join(" ")}
            >
              <span
                className={[
                  "absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow-card",
                  active ? "left-6" : "left-1",
                ].join(" ")}
              />
            </button>
          </label>

          <SelectionPanel
            title={t("users.linkedProfiles")}
            description={t("users.linkedProfilesEditDescription")}
            emptyLabel={t("users.noActiveProfile")}
            items={profileOptions.map((profile) => ({
              id: profile.id,
              code: profile.code,
              label: profile.name,
            }))}
            selectedIds={profileIds}
            onToggle={toggleProfile}
          />

          <SelectionPanel
            title={t("users.extraPermissions")}
            description={t("users.extraPermissionsEditDescription")}
            emptyLabel={t("users.noActivePermission")}
            items={permissionOptions.map((permission) => ({
              id: permission.id,
              code: permission.code,
              label: `${permission.module} · ${permission.action}`,
            }))}
            selectedIds={permissionIds}
            onToggle={togglePermission}
          />

          {user.masterUser && (
            <div className="bg-primarySoft border border-primary/20 text-primary rounded-2xl px-4 py-3 text-sm">
              {t("users.masterWarning")}
            </div>
          )}

          {error && (
            <div className="bg-danger/10 border border-danger/30 text-danger rounded-2xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-semibold py-2.5 rounded-full hover:shadow-neon transition disabled:opacity-60 disabled:cursor-not-allowed text-sm"
          >
            {loading ? t("users.savingChanges") : t("users.saveChanges")}
          </button>
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
    <div className="bg-cardSoft border border-border rounded-2xl p-3 shadow-card">
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

      <div className="max-h-32 overflow-y-auto app-scrollbar grid grid-cols-1 sm:grid-cols-2 gap-2 pr-1">
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
                    ? "bg-primary text-white border-primary font-semibold shadow-card"
                    : "bg-card border-border text-muted hover:text-text hover:border-primary/60",
                ].join(" ")}
              >
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={12} />
                  {item.label}
                </span>

                <span
                  className={[
                    "block mt-1",
                    selected ? "text-white/75" : "text-muted",
                  ].join(" ")}
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
    </div>
  )
}