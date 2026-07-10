import { useEffect, useMemo, useState } from "react"
import type { FormEvent, ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import { Eye, EyeOff, ShieldCheck, X } from "lucide-react"
import { useTranslation } from "../../hooks/useTranslation"
import { InternationalizationService } from "../../services/internationalization.service"
import { PermissionService } from "../../services/permission.service"
import { ProfileService } from "../../services/profile.service"
import { UserService } from "../../services/user.service"
import { PhoneNumberInput } from "../common/PhoneNumberInput"
import type { Internationalization } from "../../types/internationalization.types"
import type { CreateUserRequest } from "../../types/user.types"

interface CreateUserModalProps {
  open: boolean
  tenantId: string
  onClose: () => void
  onCreated: () => void
}

type CreateUserPayload = CreateUserRequest & {
  profileIds?: string[]
  permissionIds?: string[]
  language?: string | null
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

export function CreateUserModal({
  open,
  tenantId,
  onClose,
  onCreated,
}: CreateUserModalProps) {
  const { t } = useTranslation()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [phoneCountryCode, setPhoneCountryCode] = useState<string | null>("PT")
  const [phoneDialCode, setPhoneDialCode] = useState<string | null>("+351")
  const [password, setPassword] = useState("123456")
  const [role, setRole] = useState("")
  const [language, setLanguage] = useState("")
  const [profileIds, setProfileIds] = useState<string[]>([])
  const [permissionIds, setPermissionIds] = useState<string[]>([])
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: profiles = [] } = useQuery({
    queryKey: ["user-modal-profiles"],
    queryFn: ProfileService.findAll,
    enabled: open,
  })

  const { data: permissions = [] } = useQuery({
    queryKey: ["user-modal-permissions"],
    queryFn: PermissionService.findAll,
    enabled: open,
  })

  const { data: internationalizations = [] } = useQuery({
    queryKey: ["user-modal-languages"],
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
    if (!open) return

    setName("")
    setEmail("")
    setPhone("")
    setPhoneCountryCode("PT")
    setPhoneDialCode("+351")
    setPassword("123456")
    setRole("")
    setLanguage("")
    setProfileIds([])
    setPermissionIds([])
    setShowPassword(false)
    setLoading(false)
    setError(null)
  }, [open])

  useEffect(() => {
    if (!open || role || roleOptions.length === 0) return

    const operatorRole = roleOptions.find((item) => item.value === "OPERATOR")
    setRole(operatorRole ? operatorRole.value : roleOptions[0].value)
  }, [open, role, roleOptions])

  if (!open) {
    return null
  }

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

    if (!tenantId) {
      setError(t("users.tenantNotIdentified"))
      setLoading(false)
      return
    }

    if (!role) {
      setError(t("users.selectMainProfile"))
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError(t("users.passwordMinLength"))
      setLoading(false)
      return
    }

    try {
      const payload: CreateUserPayload = {
        tenantId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || null,
        phoneCountryCode: phone.trim() ? phoneCountryCode : null,
        phoneDialCode: phone.trim() ? phoneDialCode : null,
        password,
        role,
        language: language || null,
        ...(profileIds.length > 0 ? { profileIds } : {}),
        ...(permissionIds.length > 0 ? { permissionIds } : {}),
      }

      await UserService.create(payload)
      onCreated()
      onClose()
    } catch {
      setError(t("users.createError"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="surface-premium w-full max-w-[640px] max-h-[90vh] overflow-y-auto app-scrollbar rounded-2xl p-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <span className="text-xs text-primary font-semibold uppercase tracking-wide">
              {t("users.newAccess")}
            </span>

            <h2 className="text-xl font-bold mt-1">
              {t("users.create")}
            </h2>

            <p className="text-muted text-sm mt-1">
              {t("users.createDescription")}
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
                placeholder={t("users.fullNamePlaceholder")}
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
              <PhoneNumberInput
                placeholder={t("users.phonePlaceholder", "+55 11 99999-9999")}
                value={phone}
                onChange={setPhone}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label={t("users.initialPassword")}>
              <div className="flex items-center field-input px-0 py-0">
                <input
                  className="w-full bg-transparent px-4 py-2.5 outline-none text-sm"
                  placeholder={t("users.initialPassword")}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="w-10 h-10 flex items-center justify-center text-muted hover:text-primary transition"
                  title={
                    showPassword
                      ? t("common.hidePassword")
                      : t("common.showPassword")
                  }
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>

            <Field label={t("users.mainProfile")}>
              <select
                className="field-input"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                required
              >
                {roleOptions.length === 0 && (
                  <option value="">
                    {t("users.noProfileAvailable")}
                  </option>
                )}

                {roleOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label} · {item.value}
                  </option>
                ))}
              </select>
            </Field>
          </div>

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

          <SelectionPanel
            title={t("users.linkedProfiles")}
            description={t("users.linkedProfilesDescription")}
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
            description={t("users.extraPermissionsDescription")}
            emptyLabel={t("users.noActivePermission")}
            items={permissionOptions.map((permission) => ({
              id: permission.id,
              code: permission.code,
              label: `${permission.module} · ${permission.action}`,
            }))}
            selectedIds={permissionIds}
            onToggle={togglePermission}
          />

          {error && (
            <div className="bg-danger/10 border border-danger/30 text-danger rounded-2xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-border bg-background text-sm font-semibold hover:border-primary hover:text-primary transition"
            >
              {t("common.cancel", "Cancelar")}
            </button>

            <button
              type="submit"
              disabled={loading || !role}
              className="px-4 py-2 bg-primary text-white font-semibold rounded-full hover:shadow-neon transition disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {loading ? t("users.creating") : t("users.create")}
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
                    : "bg-card border-border text-muted hover:text-text hover:border-primary/50",
                ].join(" ")}
              >
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={12} />
                  {item.label}
                </span>

                <span
                  className={selected ? "block mt-1 text-white/75" : "block mt-1 text-muted"}
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