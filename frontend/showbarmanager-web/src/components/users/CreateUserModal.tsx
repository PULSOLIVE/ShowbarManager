import { useState } from "react"
import type { FormEvent } from "react"
import { X } from "lucide-react"
import { UserService } from "../../services/user.service"
import type { CreateUserRequest } from "../../types/user.types"

interface CreateUserModalProps {
  open: boolean
  tenantId: string
  onClose: () => void
  onCreated: () => void
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) {
    return null
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    if (!tenantId) {
      setError("Tenant não identificado. Faça login novamente.")
      setLoading(false)
      return
    }

    try {
      const payload: CreateUserRequest = {
        tenantId,
        name,
        email,
        password,
        role,
      }

      await UserService.create(payload)

      setName("")
      setEmail("")
      setPassword("123456")
      setRole("OPERATOR")

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
      <div className="w-full max-w-[520px] bg-card border border-border rounded-2xl p-6 shadow-neon">
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="text-sm text-neon font-medium">
              Novo acesso
            </span>

            <h2 className="text-2xl font-bold">
              Criar usuário
            </h2>

            <p className="text-muted text-sm mt-1">
              Cadastre um novo usuário no tenant atual.
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

          <input
            className="w-full bg-background border border-border rounded-2xl px-4 py-3 outline-none focus:border-neon"
            placeholder="Senha inicial"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
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
            {loading ? "Criando usuário..." : "Criar usuário"}
          </button>
        </form>
      </div>
    </div>
  )
}