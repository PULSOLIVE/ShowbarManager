import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { X } from "lucide-react"
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

export function EditPermissionModal({
  open,
  permission,
  onClose,
  onUpdated,
}: EditPermissionModalProps) {
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
      setError("Permissão não selecionada.")
      setLoading(false)
      return
    }

    try {
      const payload: UpdatePermissionRequest = {
        name,
        module,
        action,
        description,
        active,
        systemPermission,
        priority,
      }

      await PermissionService.update(permissionId, payload)
      onUpdated()
      onClose()
    } catch {
      setError("Não foi possível atualizar a permissão.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-[620px] bg-card border border-border rounded-2xl p-6 shadow-neon">
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="text-sm text-neon font-medium">
              Editar permissão
            </span>

            <h2 className="text-2xl font-bold">
              {permissionCode}
            </h2>

            <p className="text-muted text-sm mt-1">
              Atualize os dados da permissão selecionada.
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
            className="w-full bg-background border border-border rounded-2xl px-4 py-3 outline-none opacity-70"
            value={permissionCode}
            disabled
          />

          <input
            className="w-full bg-background border border-border rounded-2xl px-4 py-3 outline-none focus:border-neon"
            placeholder="Nome da permissão"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              className="w-full bg-background border border-border rounded-2xl px-4 py-3 outline-none focus:border-neon"
              placeholder="Módulo"
              value={module}
              onChange={(event) => setModule(event.target.value.toUpperCase())}
              required
            />

            <input
              className="w-full bg-background border border-border rounded-2xl px-4 py-3 outline-none focus:border-neon"
              placeholder="Ação"
              value={action}
              onChange={(event) => setAction(event.target.value.toUpperCase())}
              required
            />
          </div>

          <textarea
            className="w-full bg-background border border-border rounded-2xl px-4 py-3 outline-none focus:border-neon min-h-28"
            placeholder="Descrição"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          <input
            className="w-full bg-background border border-border rounded-2xl px-4 py-3 outline-none focus:border-neon"
            type="number"
            placeholder="Prioridade"
            value={priority}
            onChange={(event) => setPriority(Number(event.target.value))}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ToggleField
              label="Permissão ativa"
              active={active}
              onToggle={() => setActive((value) => !value)}
            />

            <ToggleField
              label="Permissão de sistema"
              active={systemPermission}
              onToggle={() => setSystemPermission((value) => !value)}
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !permissionId}
            className="w-full bg-neon text-black font-semibold py-3 rounded-full hover:shadow-neon transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Salvando..." : "Salvar alterações"}
          </button>
        </form>
      </div>
    </div>
  )
}

function ToggleField({
  label,
  active,
  onToggle,
}: {
  label: string
  active: boolean
  onToggle: () => void
}) {
  return (
    <label className="flex items-center justify-between bg-background border border-border rounded-2xl px-4 py-3">
      <span className="text-sm text-muted">
        {label}
      </span>

      <button
        type="button"
        onClick={onToggle}
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
  )
}