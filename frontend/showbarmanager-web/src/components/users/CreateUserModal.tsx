import { useEffect, useMemo, useState } from "react"
import type { FormEvent, ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import { Eye, EyeOff, ShieldCheck, X } from "lucide-react"
import { PermissionService } from "../../services/permission.service"
import { ProfileService } from "../../services/profile.service"
import { UserService } from "../../services/user.service"
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

export function CreateUserModal({
  open,
  tenantId,
  onClose,
  onCreated,
}: CreateUserModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("123456")
  const [role, setRole] = useState("OPERATOR")
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

  const profileOptions = useMemo(() => {
    return profiles
      .filter((profile) => profile.active)
      .sort((a, b) => a.priority - b.priority)
  }, [profiles])

  const permissionOptions = useMemo(() => {
    return permissions
      .filter((permission) => permission.active)
      .sort((a, b) => a.module.localeCompare(b.module))
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
    if (!open) return

    setName("")
    setEmail("")
    setPassword("123456")
    setRole("OPERATOR")
    setProfileIds([])
    setPermissionIds([])
    setShowPassword(false)
    setLoading(false)
    setError(null)
  }, [open])

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
      setError("Ambiente não identificado. Faça login novamente.")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("A senha inicial precisa ter pelo menos 6 caracteres.")
      setLoading(false)
      return
    }

    try {
      const payload: CreateUserPayload = {
        tenantId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
        ...(profileIds.length > 0 ? { profileIds } : {}),
        ...(permissionIds.length > 0 ? { permissionIds } : {}),
      }

      await UserService.create(payload)
      onCreated()
      onClose()
    } catch {
      setError("Não foi possível criar o usuário. Verifique os dados e tente novamente.")
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
              Novo acesso
            </span>

            <h2 className="text-xl font-bold mt-1">
              Criar usuário
            </h2>

            <p className="text-muted text-sm mt-1">
              Cadastre o usuário, perfil principal e permissões adicionais.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-cardSoft border border-border flex items-center justify-center hover:border-danger hover:text-danger transition shrink-0"
          >
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Nome completo">
              <input
                className="field-input"
                placeholder="Ex: Italo Gonçalves"
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
            <Field label="Senha inicial">
              <div className="flex items-center field-input px-0 py-0">
                <input
                  className="w-full bg-transparent px-4 py-2.5 outline-none text-sm"
                  placeholder="Senha inicial"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="w-10 h-10 flex items-center justify-center text-muted hover:text-primary transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>

            <Field label="Perfil principal">
              <select
                className="field-input"
                value={role}
                onChange={(event) => setRole(event.target.value)}
              >
                {roleOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label} · {item.value}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <SelectionPanel
            title="Perfis vinculados"
            description="Selecione perfis adicionais para este usuário."
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
            description="Permissões individuais além dos perfis vinculados."
            emptyLabel="Nenhuma permissão ativa encontrada."
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-semibold py-2.5 rounded-full hover:shadow-neon transition disabled:opacity-60 disabled:cursor-not-allowed text-sm"
          >
            {loading ? "Criando usuário..." : "Criar usuário"}
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
                    : "bg-card border-border text-muted hover:text-text hover:border-primary/50",
                ].join(" ")}
              >
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={12} />
                  {item.label}
                </span>

                <span className={selected ? "block mt-1 text-white/75" : "block mt-1 text-muted"}>
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