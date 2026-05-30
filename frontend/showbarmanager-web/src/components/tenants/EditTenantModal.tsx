import { useState } from "react"
import type { FormEvent } from "react"
import { X } from "lucide-react"
import { TenantService } from "../../services/tenant.service"
import type { Tenant, UpdateTenantRequest } from "../../types/tenant.types"

interface EditTenantModalProps {
  open: boolean
  tenant: Tenant | null
  onClose: () => void
  onUpdated: () => void
}

export function EditTenantModal({
  open,
  tenant,
  onClose,
  onUpdated,
}: EditTenantModalProps) {
  if (!open || !tenant) {
    return null
  }

  return (
    <EditTenantModalContent
      tenant={tenant}
      onClose={onClose}
      onUpdated={onUpdated}
    />
  )
}

interface EditTenantModalContentProps {
  tenant: Tenant
  onClose: () => void
  onUpdated: () => void
}

function EditTenantModalContent({
  tenant,
  onClose,
  onUpdated,
}: EditTenantModalContentProps) {
  const [name, setName] = useState(tenant.name)
  const [slug, setSlug] = useState(tenant.slug)
  const [country, setCountry] = useState(tenant.country)
  const [currency, setCurrency] = useState(tenant.currency)
  const [language, setLanguage] = useState(tenant.language)
  const [timezone, setTimezone] = useState(tenant.timezone)
  const [active, setActive] = useState(tenant.active)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload: UpdateTenantRequest = {
        name,
        slug,
        country,
        currency,
        language,
        timezone,
        active,
      }

      await TenantService.update(tenant.id, payload)

      onUpdated()
      onClose()
    } catch {
      setError("Não foi possível atualizar o tenant. Verifique os dados e tente novamente.")
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
              Editar ambiente
            </span>

            <h2 className="text-2xl font-bold">
              Alterar tenant
            </h2>

            <p className="text-muted text-sm mt-1">
              Atualize os dados do ambiente multi-tenant.
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
            placeholder="Nome do tenant"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <input
            className="w-full bg-background border border-border rounded-2xl px-4 py-3 outline-none focus:border-neon"
            placeholder="Slug ex: empresa-demo"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              className="bg-background border border-border rounded-2xl px-4 py-3 outline-none focus:border-neon"
              placeholder="País"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              required
            />

            <input
              className="bg-background border border-border rounded-2xl px-4 py-3 outline-none focus:border-neon"
              placeholder="Moeda"
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
              required
            />

            <input
              className="bg-background border border-border rounded-2xl px-4 py-3 outline-none focus:border-neon"
              placeholder="Idioma"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              required
            />

            <input
              className="bg-background border border-border rounded-2xl px-4 py-3 outline-none focus:border-neon"
              placeholder="Timezone"
              value={timezone}
              onChange={(event) => setTimezone(event.target.value)}
              required
            />
          </div>

          <label className="flex items-center justify-between bg-background border border-border rounded-2xl px-4 py-3">
            <span className="text-sm text-muted">Tenant ativo</span>

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