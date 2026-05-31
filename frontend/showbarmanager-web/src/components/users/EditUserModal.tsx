import { useState } from "react"
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
  const [name, setName] = useState<string>(user.name)
  const [email, setEmail] = useState<string>(user.email)
  const [role, setRole] = useState<string>(
    user.roles.length > 0 ? user.roles[0] : "OPERATOR"
  )
  const [active, setActive] = useState<boolean>(user.active)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload: UpdateUserRequest = {
        name,
        email,
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
      <div className="w-full max-w-[520px] bg-card border border-border rounded-2xl p-6 shadow-neon">
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="text-sm text-neon font-medium">
              Editar acesso
            </span>

            <h2 className="text-2xl font-bold">
              Alterar usuário
            </h2>

            <p className="text-muted text-sm mt-1">
              Atualize os dados, perfil e status do usuário.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:border-red-400 hover:text-red-300 transition"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full bg-background border border-border rounded-2xl px-4 py-3 outline-none focus:border-neon"
            placeholder="Nome completo"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <input
            className="w-full bg-background border border-border rounded-2xl px-4 py-3 outline-none focus:border-neon"
            placeholder="E-mail"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <select
            className="w-full bg-background border border-border rounded-2xl px-4 py-3 outline-none focus:border-neon"
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            {userRoles.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <label className="flex items-center justify-between bg-background border border-border rounded-2xl px-4 py-3">
            <span className="text-sm text-muted">
              Usuário ativo
            </span>

            <button
              type="button"
              onClick={() => setActive((value) => !value)}
              className={[
                "relative w-14 h-8 rounded-full transition-all",
                active ? "bg-neon" : "bg-zinc-700",
              ].join(" ")}
            >
              <span
                className={[
                  "absolute top-1 w-6 h-6 rounded-full bg-white transition-all",
                  active ? "left-7" : "left-1",
                ].join(" ")}
              />
            </button>
          </label>

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