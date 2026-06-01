import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { X } from "lucide-react"
import { UserService } from "../../services/user.service"
import type { UpdateUserRequest, User } from "../../types/user.types"

interface EditUserModalProps {
  open: boolean
  user: User | null
  onClose: () => void
  onUpdated: () => void
}

const userRoles = [
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
      user={user}
      onClose={onClose}
      onUpdated={onUpdated}
    />
  )
}

interface EditUserModalContentProps {
  user: User
  onClose: () => void
  onUpdated: () => void
}

function EditUserModalContent({
  user,
  onClose,
  onUpdated,
}: EditUserModalContentProps) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [role, setRole] = useState(
    user.roles.length > 0 ? user.roles[0] : "OPERATOR"
  )
  const [active, setActive] = useState(user.active)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setName(user.name)
    setEmail(user.email)
    setRole(user.roles.length > 0 ? user.roles[0] : "OPERATOR")
    setActive(user.active)
    setLoading(false)
    setError(null)
  }, [user])

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
      }

      await UserService.update(user.id, payload)

      onUpdated()
      onClose()
    } catch {
      setError("Não foi possível atualizar o usuário. Verifique os dados e tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-[520px] bg-card border border-border rounded-2xl p-5 shadow-neon">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <span className="text-sm text-neon font-medium">
              Editar acesso
            </span>

            <h2 className="text-xl font-bold mt-1">
              Alterar usuário
            </h2>

            <p className="text-muted text-sm mt-1">
              Atualize os dados, perfil e status do usuário.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center hover:border-red-400 hover:text-red-300 transition shrink-0"
          >
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block">
            <span className="block text-xs text-muted mb-1.5">
              Nome completo
            </span>

            <input
              className="w-full bg-background border border-border rounded-2xl px-4 py-2.5 outline-none focus:border-neon text-sm"
              placeholder="Nome completo"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="block text-xs text-muted mb-1.5">
              E-mail
            </span>

            <input
              className="w-full bg-background border border-border rounded-2xl px-4 py-2.5 outline-none focus:border-neon text-sm"
              placeholder="E-mail"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="block text-xs text-muted mb-1.5">
              Perfil principal
            </span>

            <select
              className="w-full bg-background border border-border rounded-2xl px-4 py-2.5 outline-none focus:border-neon text-sm"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              {!userRoles.some((item) => item.value === role) && (
                <option value={role}>
                  {role}
                </option>
              )}

              {userRoles.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label} · {item.value}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center justify-between bg-background border border-border rounded-2xl px-4 py-2.5">
            <span className="text-sm text-muted">
              Usuário ativo
            </span>

            <button
              type="button"
              onClick={() => setActive((value) => !value)}
              className={[
                "relative w-12 h-7 rounded-full transition-all",
                active ? "bg-neon" : "bg-zinc-700",
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

          {user.masterUser && (
            <div className="bg-neon/10 border border-neon/20 text-neon rounded-2xl px-4 py-3 text-sm">
              Este usuário possui marcação master. Altere com cuidado.
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neon text-black font-semibold py-3 rounded-full hover:shadow-neon transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Salvando alterações..." : "Salvar alterações"}
          </button>
        </form>
      </div>
    </div>
  )
}