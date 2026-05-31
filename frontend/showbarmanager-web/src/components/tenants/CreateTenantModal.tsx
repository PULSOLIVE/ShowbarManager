import { useState } from "react"
import type { FormEvent } from "react"
import { X } from "lucide-react"
import {
  countryOptions,
  generateSlug,
  languageOptions,
  timezoneOptions,
} from "../../constants/tenantOptions"
import { TenantService } from "../../services/tenant.service"
import type { CreateTenantRequest } from "../../types/tenant.types"

interface CreateTenantModalProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

export function CreateTenantModal({
  open,
  onClose,
  onCreated,
}: CreateTenantModalProps) {
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [country, setCountry] = useState("PT")
  const [currency, setCurrency] = useState("EUR")
  const [language, setLanguage] = useState("pt-PT")
  const [timezone, setTimezone] = useState("Europe/Lisbon")
  const [active, setActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) {
    return null
  }

  function handleNameChange(value: string) {
    setName(value)
    setSlug(generateSlug(value))
  }

  function handleCountryChange(value: string) {
    const selectedCountry = countryOptions.find((item) => item.value === value)

    setCountry(value)

    if (selectedCountry) {
      setCurrency(selectedCountry.currency)
      setLanguage(selectedCountry.language)
      setTimezone(selectedCountry.timezone)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload: CreateTenantRequest = {
        name,
        slug,
        country,
        currency,
        language,
        timezone,
        active,
      }

      await TenantService.create(payload)

      setName("")
      setSlug("")
      setCountry("PT")
      setCurrency("EUR")
      setLanguage("pt-PT")
      setTimezone("Europe/Lisbon")
      setActive(true)

      onCreated()
      onClose()
    } catch {
      setError("Não foi possível criar o ambiente. Verifique os dados e tente novamente.")
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
              Novo ambiente
            </span>

            <h2 className="text-2xl font-bold">
              Criar ambiente
            </h2>

            <p className="text-muted text-sm mt-1">
              Cadastre uma nova empresa/ambiente no ecossistema.
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
          <div>
            <label className="block text-xs text-muted mb-2">
              Nome do ambiente
            </label>

            <input
              className="w-full bg-background border border-border rounded-2xl px-4 py-3 outline-none focus:border-neon"
              placeholder="Ex: Empresa Demo Portugal"
              value={name}
              onChange={(event) => handleNameChange(event.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs text-muted mb-2">
              Slug automático
            </label>

            <input
              className="w-full bg-background border border-border rounded-2xl px-4 py-3 outline-none focus:border-neon"
              placeholder="empresa-demo-portugal"
              value={slug}
              onChange={(event) => setSlug(generateSlug(event.target.value))}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted mb-2">
                País
              </label>

              <select
                className="w-full bg-background border border-border rounded-2xl px-4 py-3 outline-none focus:border-neon"
                value={country}
                onChange={(event) => handleCountryChange(event.target.value)}
                required
              >
                {countryOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label} ({item.value})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-muted mb-2">
                Moeda
              </label>

              <input
                className="w-full bg-background border border-border rounded-2xl px-4 py-3 outline-none focus:border-neon"
                placeholder="EUR"
                value={currency}
                onChange={(event) => setCurrency(event.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs text-muted mb-2">
                Idioma
              </label>

              <select
                className="w-full bg-background border border-border rounded-2xl px-4 py-3 outline-none focus:border-neon"
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                required
              >
                {languageOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-muted mb-2">
                Fuso horário
              </label>

              <select
                className="w-full bg-background border border-border rounded-2xl px-4 py-3 outline-none focus:border-neon"
                value={timezone}
                onChange={(event) => setTimezone(event.target.value)}
                required
              >
                {timezoneOptions.map((group) => (
                  <optgroup key={group.group} label={group.group}>
                    {group.items.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          <label className="flex items-center justify-between bg-background border border-border rounded-2xl px-4 py-3">
            <span className="text-sm text-muted">
              Ambiente ativo
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
            {loading ? "Criando ambiente..." : "Criar ambiente"}
          </button>
        </form>
      </div>
    </div>
  )
}