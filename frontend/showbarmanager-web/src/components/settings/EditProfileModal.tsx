import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { X } from "lucide-react"
import { ProfileService } from "../../services/profile.service"
import type { Profile, UpdateProfileRequest } from "../../types/profile.types"

interface EditProfileModalProps {
  open: boolean
  profile: Profile | null
  onClose: () => void
  onUpdated: () => void
}

export function EditProfileModal({
  open,
  profile,
  onClose,
  onUpdated,
}: EditProfileModalProps) {
  const [profileId, setProfileId] = useState("")
  const [profileCode, setProfileCode] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState(0)
  const [active, setActive] = useState(true)
  const [systemProfile, setSystemProfile] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !profile) {
      return
    }

    setProfileId(profile.id || "")
    setProfileCode(profile.code || "")
    setName(profile.name || "")
    setDescription(profile.description || "")
    setPriority(Number(profile.priority || 0))
    setActive(Boolean(profile.active))
    setSystemProfile(Boolean(profile.systemProfile))
    setLoading(false)
    setError(null)
  }, [open, profile])

  if (!open || !profile) {
    return null
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    if (!profileId) {
      setError("Perfil não selecionado.")
      setLoading(false)
      return
    }

    try {
      const payload: UpdateProfileRequest = {
        name: name.trim(),
        description: description.trim(),
        active,
        systemProfile,
        priority,
      }

      await ProfileService.update(profileId, payload)

      onUpdated()
      onClose()
    } catch {
      setError("Não foi possível atualizar o perfil.")
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
              Editar perfil
            </span>

            <h2 className="text-xl font-bold mt-1">
              {profileCode}
            </h2>

            <p className="text-muted text-sm mt-1">
              Atualize os dados do perfil selecionado.
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
              Código
            </span>

            <input
              className="w-full bg-background border border-border rounded-2xl px-4 py-2.5 outline-none opacity-70 text-sm"
              value={profileCode}
              disabled
            />
          </label>

          <label className="block">
            <span className="block text-xs text-muted mb-1.5">
              Nome do perfil
            </span>

            <input
              className="w-full bg-background border border-border rounded-2xl px-4 py-2.5 outline-none focus:border-neon text-sm"
              placeholder="Nome do perfil"
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
              placeholder="Descrição"
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
              Este perfil está marcado como sistema. Alterações podem impactar regras internas.
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !profileId}
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