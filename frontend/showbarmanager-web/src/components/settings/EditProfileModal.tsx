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
        name,
        description,
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
      <div className="w-full max-w-[560px] bg-card border border-border rounded-2xl p-6 shadow-neon">
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="text-sm text-neon font-medium">
              Editar perfil
            </span>

            <h2 className="text-2xl font-bold">
              {profileCode}
            </h2>

            <p className="text-muted text-sm mt-1">
              Atualize os dados do perfil selecionado.
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
            value={profileCode}
            disabled
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