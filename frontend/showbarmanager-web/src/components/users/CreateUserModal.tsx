import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { Eye, EyeOff, X } from "lucide-react"
import { UserService } from "../../services/user.service"
import type { CreateUserRequest } from "../../types/user.types"

interface CreateUserModalProps {
  open: boolean
  tenantId: string
  onClose: () => void
  onCreated: () => void
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
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    setName("")
    setEmail("")
    setPassword("123456")
    setRole("OPERATOR")
    setShowPassword(false)
    setLoading(false)
    setError(null)
  }, [open])

  if (!open) {
    return null
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
      const payload: CreateUserRequest = {
        tenantId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
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
      <div className="w-full max-w-[520px] bg-card border border-border rounded-2xl p-5 shadow-neon">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <span className="text-sm text-neon font-medium">
              Novo acesso
            </span>

            <h2 className="text-xl font-bold mt-1">
              Criar usuário
            </h2>

            <p className="text-muted text-sm mt-1">
              Cadastre um novo usuário no ambiente atual.
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
              placeholder="Ex: Italo Gonçalves"
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
              placeholder="usuario@empresa.com"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="block text-xs text-muted mb-1.5">
              Senha inicial
            </span>

            <div className="flex items-center bg-background border border-border rounded-2xl focus-within:border-neon">
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
                className="w-10 h-10 flex items-center justify-center text-muted hover:text-neon transition"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          <label className="block">
            <span className="block text-xs text-muted mb-1.5">
              Perfil
            </span>

            <select
              className="w-full bg-background border border-border rounded-2xl px-4 py-2.5 outline-none focus:border-neon text-sm"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              {userRoles.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label} · {item.value}
                </option>
              ))}
            </select>
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
            {loading ? "Criando usuário..." : "Criar usuário"}
          </button>
        </form>
      </div>
    </div>
  )
}