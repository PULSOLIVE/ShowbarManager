import { useState } from "react"
import type { FormEvent } from "react"
import { X } from "lucide-react"
import { ProfileService } from "../../services/profile.service"
import type { CreateProfileRequest } from "../../types/profile.types"

interface CreateProfileModalProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

export function CreateProfileModal({
  open,
  onClose,
  onCreated,
}: CreateProfileModalProps) {
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState(0)
  const [active, setActive] = useState(true)
  const [systemProfile, setSystemProfile] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) {
    return null
  }

  function resetForm() {
    setCode("")
    setName("")
    setDescription("")
    setPriority(0)
    setActive(true)
    setSystemProfile(false)
    setError(null)
  }

  function handleClose() {
    resetForm()
    onClose()
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload: CreateProfileRequest = {
        code,
        name,
        description,
        active,
        systemProfile,
        priority,
      }

      await ProfileService.create(payload)
      onCreated()
      handleClose()
    } catch {
      setError("Não foi possível criar o perfil. Verifique os dados.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-[560px] bg-card border border-border rounded-2xl p-6 shadow-neon">
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="text-sm text-neon font-medium">
              Novo perfil
            </span>

            <h2 className="text-2xl font-bold">
              Criar perfil
            </h2>

            <p className="text-muted text-sm mt-1">
              Cadastre um novo perfil de acesso do ecossistema.
            </p>
          </div>

          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:border-red-400 hover:text-red-300 transition"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full bg-background border border-border rounded-2xl px-4 py-3 outline-none focus:border-neon"
            placeholder="Código. Ex: SUPPORT_N1"
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            required
          />

          <input
            className="w-full bg-background border border-border rounded-2xl px-4 py-3 outline-none focus:border-neon"
            placeholder="Nome do perfil"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

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
              label="Perfil ativo"
              active={active}
              onToggle={() => setActive((value) => !value)}
            />

            <ToggleField
              label="Perfil de sistema"
              active={systemProfile}
              onToggle={() => setSystemProfile((value) => !value)}
            />
          </div>

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
            {loading ? "Criando perfil..." : "Criar perfil"}
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