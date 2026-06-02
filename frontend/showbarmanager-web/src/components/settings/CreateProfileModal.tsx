import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { X } from "lucide-react"
import { ProfileService } from "../../services/profile.service"
import type { CreateProfileRequest } from "../../types/profile.types"

interface CreateProfileModalProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

function normalizeProfileCode(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s_-]/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/-+/g, "_")
    .replace(/_+/g, "_")
    .toUpperCase()
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

  useEffect(() => {
    if (!open) return
    resetForm()
  }, [open])

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
    setLoading(false)
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

    const normalizedCode = normalizeProfileCode(code)

    if (!normalizedCode) {
      setError("Informe um código válido para o perfil.")
      setLoading(false)
      return
    }

    try {
      const payload: CreateProfileRequest = {
        code: normalizedCode,
        name: name.trim(),
        description: description.trim(),
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
      <div className="w-full max-w-[560px] bg-card border border-border rounded-2xl p-5 shadow-neon">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <span className="text-sm text-neon font-medium">
              Novo perfil
            </span>

            <h2 className="text-xl font-bold mt-1">
              Criar perfil
            </h2>

            <p className="text-muted text-sm mt-1">
              Cadastre um novo perfil de acesso do ecossistema.
            </p>
          </div>

          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center hover:border-red-400 hover:text-red-300 transition shrink-0"
          >
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block">
            <span className="block text-xs text-muted mb-1.5">
              Código
            </span>

            <input
              className="w-full bg-background border border-border rounded-2xl px-4 py-2.5 outline-none focus:border-neon text-sm"
              placeholder="Ex: SUPPORT_N1"
              value={code}
              onChange={(event) => setCode(normalizeProfileCode(event.target.value))}
              required
            />
          </label>

          <label className="block">
            <span className="block text-xs text-muted mb-1.5">
              Nome do perfil
            </span>

            <input
              className="w-full bg-background border border-border rounded-2xl px-4 py-2.5 outline-none focus:border-neon text-sm"
              placeholder="Ex: Suporte Nível 1"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="block text-xs text-muted mb-1.5">
              Descrição
            </span>

            <textarea
              className="w-full bg-background border border-border rounded-2xl px-4 py-2.5 outline-none focus:border-neon min-h-24 text-sm resize-none"
              placeholder="Descrição do perfil"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>

          <label className="block">
            <span className="block text-xs text-muted mb-1.5">
              Prioridade
            </span>

            <input
              className="w-full bg-background border border-border rounded-2xl px-4 py-2.5 outline-none focus:border-neon text-sm"
              type="number"
              placeholder="0"
              value={priority}
              onChange={(event) => setPriority(Number(event.target.value))}
            />
          </label>

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

          {systemProfile && (
            <div className="bg-neon/10 border border-neon/20 text-neon rounded-2xl px-4 py-3 text-sm">
              Perfis de sistema devem ser usados apenas para regras estruturais do ERP.
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
    <label className="flex items-center justify-between bg-background border border-border rounded-2xl px-4 py-2.5">
      <span className="text-sm text-muted">
        {label}
      </span>

      <button
        type="button"
        onClick={onToggle}
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
  )
}