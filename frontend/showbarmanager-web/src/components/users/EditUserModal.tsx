import { useEffect, useMemo, useState } from "react"
import type { FormEvent, ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import { ShieldCheck, X } from "lucide-react"
import { PermissionService } from "../../services/permission.service"
import { ProfileService } from "../../services/profile.service"
import { UserService } from "../../services/user.service"
import type { UpdateUserRequest, User } from "../../types/user.types"

interface EditUserModalProps {
  open: boolean
  user: User | null
  onClose: () => void
  onUpdated: () => void
}

const fallbackUserRoles = [
  { value: "ADMIN_MASTER", label: "Administrador Master" },
  { value: "DEVELOPER_MASTER", label: "Desenvolvedor Master" },
  { value: "SUPPORT_N1", label: "Suporte Nível 1" },
  { value: "SUPPORT_N2", label: "Suporte Nível 2" },
  { value: "SUPPORT_N3", label: "Suporte Nível 3" },
  { value: "COMPLIANCE", label: "Compliance" },
  { value: "AUDITOR", label: "Auditor" },
  { value: "TENANT_ADMIN", label: "Administrador do Ambiente" },
  { value: "EVENT_ADMIN", label: "Administrador de Evento" },
  { value: "FINANCIAL_MANAGER", label: "Gestor Financeiro" },
  { value: "TICKET_MANAGER", label: "Gestor de Bilheteria" },
  { value: "SECURITY_MANAGER", label: "Gestor de Segurança" },
  { value: "HEALTH_MANAGER", label: "Gestor de Saúde" },
  { value: "LOGISTICS_MANAGER", label: "Gestor de Logística" },
  { value: "BAR_MANAGER", label: "Gestor de Bar" },
  { value: "TECHNICAL_MANAGER", label: "Gestor Técnico" },
  { value: "OPERATOR", label: "Operador" },
]

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
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [role, setRole] = useState(
    user.roles.length > 0 ? user.roles[0] : "OPERATOR"
  )
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
      return fallbackUserRoles
    }

    return profileOptions.map((profile) => ({
      value: profile.code,
      label: profile.name,
    }))
  }, [profileOptions])

  useEffect(() => {
    setName(user.name)
    setEmail(user.email)
    setRole(user.roles.length > 0 ? user.roles[0] : "OPERATOR")
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
      const payload: UpdateUserRequest = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        active,
        profileIds,
        permissionIds,
      }

      await UserService.update(user.id, payload)

      onUpdated()
      onClose()
    } catch {
      setError(
        "Não foi possível atualizar o usuário. Verifique os dados e tente novamente."
      )
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
              Editar acesso
            </span>

            <h2 className="text-xl font-bold mt-1">
              Alterar usuário
            </h2>

            <p className="text-muted text-sm mt-1">
              Atualize dados, perfil principal, status e permissões.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-cardSoft border border-border flex items-center justify-center hover:border-danger hover:text-danger transition shrink-0"
            title="Fechar"
          >
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Nome completo">
              <input
                className="field-input"
                placeholder="Nome completo"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </Field>

            <Field label="E-mail">
              <input
                className="field-input"
                placeholder="usuario@empresa.com"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Perfil principal">
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

            <label className="flex items-center justify-between bg-cardSoft border border-border rounded-2xl px-4 py-2.5 sm:mt-5">
              <span className="text-sm text-muted">
                Usuário ativo
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
          </div>

          <SelectionPanel
            title="Perfis vinculados"
            description="Perfis adicionais além do perfil principal."
            emptyLabel="Nenhum perfil ativo encontrado."
            items={profileOptions.map((profile) => ({
              id: profile.id,
              code: profile.code,
              label: profile.name,
            }))}
            selectedIds={profileIds}
            onToggle={toggleProfile}
          />

          <SelectionPanel
            title="Permissões extras"
            description="Permissões individuais aplicadas diretamente ao usuário."
            emptyLabel="Nenhuma permissão ativa encontrada."
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
              Este usuário possui marcação master. Altere com cuidado.
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
            {loading ? "Salvando alterações..." : "Salvar alterações"}
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