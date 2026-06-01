import { useEffect, useMemo, useState } from "react"
import type { FormEvent } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  CheckCircle2,
  Edit,
  Globe2,
  Languages,
  Plus,
  RefreshCcw,
  Search,
  Star,
  Trash2,
  X,
  XCircle,
} from "lucide-react"
import { apiClient } from "../../api/apiClient"
import type { ApiResponse } from "../../types/auth.types"

interface Internationalization {
  id: string
  code: string
  countryCode: string
  countryName: string
  languageCode: string
  languageName: string
  currencyCode: string
  currencySymbol: string
  timezone: string
  timezoneLabel: string
  dateFormat: string
  timeFormat: string
  flagEmoji: string | null
  flagIconUrl: string | null
  active: boolean
  systemDefault: boolean
  priority: number
  createdAt: string
  updatedAt: string | null
}

interface InternationalizationPayload {
  code: string
  countryCode: string
  countryName: string
  languageCode: string
  languageName: string
  currencyCode: string
  currencySymbol: string
  timezone: string
  timezoneLabel: string
  dateFormat: string
  timeFormat: string
  flagEmoji: string | null
  flagIconUrl: string | null
  active: boolean
  systemDefault: boolean
  priority: number
}

const InternationalizationService = {
  async list(): Promise<Internationalization[]> {
    const response = await apiClient.get<ApiResponse<Internationalization[]>>(
      "/settings/internationalization"
    )

    return response.data.data
  },

  async create(payload: InternationalizationPayload): Promise<Internationalization> {
    const response = await apiClient.post<ApiResponse<Internationalization>>(
      "/settings/internationalization",
      payload
    )

    return response.data.data
  },

  async update(
    id: string,
    payload: InternationalizationPayload
  ): Promise<Internationalization> {
    const response = await apiClient.put<ApiResponse<Internationalization>>(
      `/settings/internationalization/${id}`,
      payload
    )

    return response.data.data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(
      `/settings/internationalization/${id}`
    )
  },
}

const emptyPayload: InternationalizationPayload = {
  code: "",
  countryCode: "",
  countryName: "",
  languageCode: "",
  languageName: "",
  currencyCode: "",
  currencySymbol: "",
  timezone: "",
  timezoneLabel: "",
  dateFormat: "dd/MM/yyyy",
  timeFormat: "HH:mm",
  flagEmoji: "",
  flagIconUrl: "",
  active: true,
  systemDefault: false,
  priority: 0,
}

function toPayload(item: Internationalization): InternationalizationPayload {
  return {
    code: item.code,
    countryCode: item.countryCode,
    countryName: item.countryName,
    languageCode: item.languageCode,
    languageName: item.languageName,
    currencyCode: item.currencyCode,
    currencySymbol: item.currencySymbol,
    timezone: item.timezone,
    timezoneLabel: item.timezoneLabel,
    dateFormat: item.dateFormat,
    timeFormat: item.timeFormat,
    flagEmoji: item.flagEmoji || "",
    flagIconUrl: item.flagIconUrl || "",
    active: item.active,
    systemDefault: item.systemDefault,
    priority: item.priority,
  }
}

function normalizeCode(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, "_")
}

export function SettingsInternationalizationPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Internationalization | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null)

  const {
    data = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["internationalizations"],
    queryFn: InternationalizationService.list,
  })

  const filteredItems = useMemo(() => {
    const searchTerm = search.toLowerCase()

    return data.filter((item) => {
      const matchesSearch =
        item.code.toLowerCase().includes(searchTerm) ||
        item.countryName.toLowerCase().includes(searchTerm) ||
        item.languageName.toLowerCase().includes(searchTerm) ||
        item.currencyCode.toLowerCase().includes(searchTerm) ||
        item.timezoneLabel.toLowerCase().includes(searchTerm) ||
        item.timezone.toLowerCase().includes(searchTerm)

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && item.active) ||
        (statusFilter === "inactive" && !item.active) ||
        (statusFilter === "default" && item.systemDefault)

      return matchesSearch && matchesStatus
    })
  }, [data, search, statusFilter])

  function handleEdit(item: Internationalization) {
    setSelectedItem(item)
    setEditOpen(true)
  }

  async function handleDelete(item: Internationalization) {
    if (item.systemDefault) {
      alert("A configuração padrão do sistema não pode ser excluída.")
      return
    }

    const confirmed = window.confirm(
      `Deseja realmente excluir ${item.countryName} / ${item.languageName}?`
    )

    if (!confirmed) return

    try {
      setDeleteLoadingId(item.id)
      await InternationalizationService.delete(item.id)
      await refetch()
    } catch {
      alert("Não foi possível excluir esta configuração.")
    } finally {
      setDeleteLoadingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <section className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-sm text-neon font-semibold">
            <Languages size={16} />
            Configurações
          </span>

          <h2 className="text-2xl xl:text-3xl font-bold mt-1">
            Internacionalização
          </h2>

          <p className="text-muted mt-2 text-sm max-w-4xl">
            Gestão dinâmica de países, idiomas, moedas, fusos horários, formatos
            regionais e bandeiras do ShowbarManager.
          </p>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="bg-neon text-black font-semibold px-4 py-2.5 rounded-full hover:shadow-neon transition w-full sm:w-auto flex items-center justify-center gap-2 text-sm"
        >
          <Plus size={16} />
          Nova configuração
        </button>
      </section>

      <section className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <SummaryCard title="Total" value={String(data.length)} />
        <SummaryCard
          title="Ativas"
          value={String(data.filter((item) => item.active).length)}
        />
        <SummaryCard
          title="Padrão"
          value={data.find((item) => item.systemDefault)?.code || "-"}
        />
        <SummaryCard title="Filtradas" value={String(filteredItems.length)} />
      </section>

      <section className="bg-card border border-border rounded-2xl p-3 flex flex-col xl:flex-row gap-3 xl:items-center xl:justify-between">
        <div className="flex items-center gap-2 bg-background border border-border rounded-full px-4 py-2.5 w-full xl:max-w-md">
          <Search size={15} className="text-muted shrink-0" />

          <input
            className="bg-transparent outline-none text-sm w-full placeholder:text-muted"
            placeholder="Buscar por país, idioma, moeda ou fuso..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <select
            className="bg-background border border-border rounded-full px-4 py-2.5 outline-none text-sm"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
            <option value="default">Padrão</option>
          </select>

          <button
            onClick={() => {
              refetch().catch(() => {
                alert("Não foi possível atualizar a lista.")
              })
            }}
            className="bg-background border border-border px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:border-neon transition text-sm"
          >
            <RefreshCcw size={15} className={isFetching ? "animate-spin" : ""} />
            Atualizar
          </button>
        </div>
      </section>

      {isLoading && (
        <div className="bg-card border border-border rounded-2xl p-4 text-muted text-sm">
          Carregando configurações internacionais...
        </div>
      )}

      {isError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl p-4 text-sm">
          Não foi possível carregar as configurações internacionais. Verifique se
          a API está online e se a sessão está ativa.
        </div>
      )}

      {!isLoading && !isError && (
        <section className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-3">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="bg-card border border-border rounded-2xl p-4 hover:border-neon/60 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-background border border-border flex items-center justify-center text-xl shrink-0">
                    {item.flagEmoji || "🌐"}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <strong className="text-base truncate">
                        {item.countryName}
                      </strong>

                      {item.systemDefault && (
                        <span className="inline-flex items-center gap-1 text-yellow-300 text-xs bg-yellow-300/10 border border-yellow-300/20 px-2 py-0.5 rounded-full">
                          <Star size={12} />
                          Padrão
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-muted mt-1">
                      {item.code} · {item.countryCode}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleEdit(item)}
                    className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:border-neon hover:text-neon transition"
                    title="Editar"
                  >
                    <Edit size={14} />
                  </button>

                  <button
                    onClick={() => {
                      handleDelete(item).catch(() => {
                        alert("Erro inesperado ao excluir configuração.")
                      })
                    }}
                    disabled={deleteLoadingId === item.id || item.systemDefault}
                    className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:border-red-400 hover:text-red-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Excluir"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <InfoBox label="Idioma" value={`${item.languageName} (${item.languageCode})`} />
                <InfoBox label="Moeda" value={`${item.currencySymbol} ${item.currencyCode}`} />
                <InfoBox label="Data/Hora" value={`${item.dateFormat} · ${item.timeFormat}`} />
                <InfoBox label="Prioridade" value={String(item.priority)} />
              </div>

              <div className="mt-3 bg-background border border-border rounded-2xl p-3">
                <div className="flex items-start gap-2">
                  <Globe2 size={15} className="text-neon mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted">Fuso horário</p>
                    <strong className="text-sm block truncate">
                      {item.timezoneLabel}
                    </strong>
                    <p className="text-xs text-muted truncate">
                      {item.timezone}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-3">
                {item.active ? (
                  <span className="inline-flex items-center gap-2 text-neon text-sm">
                    <CheckCircle2 size={15} />
                    Ativo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 text-red-300 text-sm">
                    <XCircle size={15} />
                    Inativo
                  </span>
                )}

                <span className="text-xs text-muted">
                  ID: {item.id.slice(0, 8)}
                </span>
              </div>
            </article>
          ))}

          {filteredItems.length === 0 && (
            <div className="xl:col-span-2 2xl:col-span-3 bg-card border border-border rounded-2xl p-8 text-center text-muted">
              Nenhuma configuração internacional encontrada.
            </div>
          )}
        </section>
      )}

      <InternationalizationModal
        open={createOpen}
        title="Criar configuração"
        initialData={emptyPayload}
        onClose={() => setCreateOpen(false)}
        onSubmit={async (payload) => {
          await InternationalizationService.create(payload)
          await refetch()
          setCreateOpen(false)
        }}
      />

      <InternationalizationModal
        open={editOpen}
        title="Editar configuração"
        initialData={selectedItem ? toPayload(selectedItem) : emptyPayload}
        onClose={() => {
          setEditOpen(false)
          setSelectedItem(null)
        }}
        onSubmit={async (payload) => {
          if (!selectedItem) return

          await InternationalizationService.update(selectedItem.id, payload)
          await refetch()
          setEditOpen(false)
          setSelectedItem(null)
        }}
      />
    </div>
  )
}

function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-3 hover:border-neon/70 transition">
      <p className="text-[11px] uppercase tracking-wide text-muted">
        {title}
      </p>

      <strong className="text-xl text-neon block mt-1 truncate">
        {value}
      </strong>
    </div>
  )
}

function InfoBox({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="bg-background border border-border rounded-2xl p-3 min-w-0">
      <p className="text-[11px] uppercase tracking-wide text-muted">
        {label}
      </p>

      <strong className="text-sm block truncate mt-1">
        {value}
      </strong>
    </div>
  )
}

interface InternationalizationModalProps {
  open: boolean
  title: string
  initialData: InternationalizationPayload
  onClose: () => void
  onSubmit: (payload: InternationalizationPayload) => Promise<void>
}

function InternationalizationModal({
  open,
  title,
  initialData,
  onClose,
  onSubmit,
}: InternationalizationModalProps) {
  const [form, setForm] = useState<InternationalizationPayload>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setForm(initialData)
      setError(null)
      setLoading(false)
    }
  }, [initialData, open])

  if (!open) return null

  function updateField<K extends keyof InternationalizationPayload>(
    field: K,
    value: InternationalizationPayload[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await onSubmit({
        ...form,
        code: normalizeCode(form.code),
        countryCode: form.countryCode.trim().toUpperCase(),
        currencyCode: form.currencyCode.trim().toUpperCase(),
        flagEmoji: form.flagEmoji?.trim() || null,
        flagIconUrl: form.flagIconUrl?.trim() || null,
      })
    } catch {
      setError("Não foi possível salvar a configuração. Verifique os dados e tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-[820px] max-h-[90vh] overflow-y-auto bg-card border border-border rounded-2xl p-5 shadow-neon">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <span className="text-sm text-neon font-medium">
              Internacionalização
            </span>

            <h2 className="text-xl font-bold mt-1">
              {title}
            </h2>

            <p className="text-muted text-sm mt-1">
              Configure país, idioma, moeda, fuso horário e formato regional.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center hover:border-red-400 hover:text-red-300 transition shrink-0"
          >
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormGroup title="Identificação">
            <TextField
              label="Código"
              placeholder="PT_PT"
              value={form.code}
              onChange={(value) => updateField("code", value)}
              required
            />

            <TextField
              label="Código do país"
              placeholder="PT"
              value={form.countryCode}
              onChange={(value) => updateField("countryCode", value)}
              required
            />

            <TextField
              label="País"
              placeholder="Portugal"
              value={form.countryName}
              onChange={(value) => updateField("countryName", value)}
              required
            />
          </FormGroup>

          <FormGroup title="Idioma e moeda">
            <TextField
              label="Código do idioma"
              placeholder="pt-PT"
              value={form.languageCode}
              onChange={(value) => updateField("languageCode", value)}
              required
            />

            <TextField
              label="Idioma"
              placeholder="Português (Portugal)"
              value={form.languageName}
              onChange={(value) => updateField("languageName", value)}
              required
            />

            <TextField
              label="Código da moeda"
              placeholder="EUR"
              value={form.currencyCode}
              onChange={(value) => updateField("currencyCode", value)}
              required
            />

            <TextField
              label="Símbolo"
              placeholder="€"
              value={form.currencySymbol}
              onChange={(value) => updateField("currencySymbol", value)}
              required
            />
          </FormGroup>

          <FormGroup title="Fuso e formatos">
            <TextField
              label="Timezone técnico"
              placeholder="Europe/Lisbon"
              value={form.timezone}
              onChange={(value) => updateField("timezone", value)}
              required
            />

            <TextField
              label="Nome do timezone"
              placeholder="Europa/Lisboa"
              value={form.timezoneLabel}
              onChange={(value) => updateField("timezoneLabel", value)}
              required
            />

            <TextField
              label="Formato da data"
              placeholder="dd/MM/yyyy"
              value={form.dateFormat}
              onChange={(value) => updateField("dateFormat", value)}
              required
            />

            <TextField
              label="Formato da hora"
              placeholder="HH:mm"
              value={form.timeFormat}
              onChange={(value) => updateField("timeFormat", value)}
              required
            />
          </FormGroup>

          <FormGroup title="Bandeira e controle">
            <TextField
              label="Bandeira"
              placeholder="🇵🇹"
              value={form.flagEmoji || ""}
              onChange={(value) => updateField("flagEmoji", value)}
            />

            <TextField
              label="URL do ícone"
              placeholder="https://..."
              value={form.flagIconUrl || ""}
              onChange={(value) => updateField("flagIconUrl", value)}
            />

            <TextField
              label="Prioridade"
              placeholder="1"
              type="number"
              value={String(form.priority)}
              onChange={(value) => updateField("priority", Number(value))}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ToggleField
                label="Configuração ativa"
                value={form.active}
                onChange={() => updateField("active", !form.active)}
              />

              <ToggleField
                label="Padrão do sistema"
                value={form.systemDefault}
                onChange={() => updateField("systemDefault", !form.systemDefault)}
              />
            </div>
          </FormGroup>

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
            {loading ? "Salvando..." : "Salvar configuração"}
          </button>
        </form>
      </div>
    </div>
  )
}

function FormGroup({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <fieldset className="bg-background border border-border rounded-2xl p-4">
      <legend className="px-2 text-xs uppercase tracking-wide text-muted">
        {title}
      </legend>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {children}
      </div>
    </fieldset>
  )
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  required?: boolean
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs text-muted">
        {label}
      </span>

      <input
        className="w-full bg-card border border-border rounded-2xl px-4 py-2.5 outline-none focus:border-neon text-sm"
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
      />
    </label>
  )
}

function ToggleField({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: () => void
}) {
  return (
    <label className="flex items-center justify-between bg-card border border-border rounded-2xl px-4 py-2.5">
      <span className="text-sm text-muted">{label}</span>

      <button
        type="button"
        onClick={onChange}
        className={[
          "relative w-12 h-7 rounded-full transition-all",
          value ? "bg-neon" : "bg-zinc-700",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-1 w-5 h-5 rounded-full bg-white transition-all",
            value ? "left-6" : "left-1",
          ].join(" ")}
        />
      </button>
    </label>
  )
}