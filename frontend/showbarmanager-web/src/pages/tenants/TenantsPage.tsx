import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  Building2,
  CheckCircle2,
  Edit,
  Globe2,
  RefreshCcw,
  Search,
  Trash2,
  XCircle,
} from "lucide-react"
import { CreateTenantModal } from "../../components/tenants/CreateTenantModal"
import { EditTenantModal } from "../../components/tenants/EditTenantModal"
import {
  getLanguageLabel,
  getTimezoneLabel,
} from "../../constants/tenantOptions"
import { TenantService } from "../../services/tenant.service"
import { useAuthStore } from "../../store/auth.store"
import type { Tenant } from "../../types/tenant.types"

export function TenantsPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null)

  const canManageTenants = useAuthStore((state) => state.canManageTenants)

  const {
    data = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["tenants"],
    queryFn: TenantService.list,
  })

  const filteredTenants = useMemo(() => {
    return data.filter((tenant) => {
      const searchTerm = search.toLowerCase()

      const matchesSearch =
        tenant.name.toLowerCase().includes(searchTerm) ||
        tenant.slug.toLowerCase().includes(searchTerm) ||
        tenant.country.toLowerCase().includes(searchTerm) ||
        tenant.currency.toLowerCase().includes(searchTerm) ||
        tenant.language.toLowerCase().includes(searchTerm) ||
        tenant.timezone.toLowerCase().includes(searchTerm)

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && tenant.active) ||
        (statusFilter === "inactive" && !tenant.active)

      return matchesSearch && matchesStatus
    })
  }, [data, search, statusFilter])

  function handleEdit(tenant: Tenant) {
    setSelectedTenant(tenant)
    setEditModalOpen(true)
  }

  async function handleDelete(tenant: Tenant) {
    const confirmed = window.confirm(
      `Deseja realmente excluir o ambiente ${tenant.name}?`
    )

    if (!confirmed) {
      return
    }

    try {
      setDeleteLoadingId(tenant.id)
      await TenantService.delete(tenant.id)
      await refetch()
    } catch {
      alert("Não foi possível excluir este ambiente.")
    } finally {
      setDeleteLoadingId(null)
    }
  }

  return (
    <div className="space-y-5">
      <section className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-sm text-neon font-semibold">
            <Building2 size={16} />
            Multiempresa
          </span>

          <h2 className="text-3xl xl:text-4xl font-bold mt-1">
            Ambientes
          </h2>

          <p className="text-muted mt-2 text-sm xl:text-base">
            Gestão de empresas, clientes e ambientes isolados do ecossistema.
          </p>
        </div>

        {canManageTenants() && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="bg-neon text-black font-semibold px-5 py-3 rounded-full hover:shadow-neon transition w-full sm:w-auto"
          >
            Novo ambiente
          </button>
        )}
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs uppercase tracking-wide text-muted">
            Total
          </p>

          <strong className="text-3xl text-neon">
            {data.length}
          </strong>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs uppercase tracking-wide text-muted">
            Ativos
          </p>

          <strong className="text-3xl text-neon">
            {data.filter((tenant) => tenant.active).length}
          </strong>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs uppercase tracking-wide text-muted">
            Filtrados
          </p>

          <strong className="text-3xl text-neon">
            {filteredTenants.length}
          </strong>
        </div>
      </section>

      <section className="bg-card border border-border rounded-2xl p-4 flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between">
        <div className="flex items-center gap-2 bg-background border border-border rounded-full px-4 py-3 w-full xl:max-w-md">
          <Search size={16} className="text-muted" />

          <input
            className="bg-transparent outline-none text-sm w-full placeholder:text-muted"
            placeholder="Buscar por nome, slug, país, idioma ou fuso..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            className="bg-background border border-border rounded-full px-4 py-3 outline-none text-sm"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>

          <button
            onClick={() => {
              refetch().catch(() => {
                alert("Não foi possível atualizar os ambientes.")
              })
            }}
            className="bg-background border border-border px-4 py-3 rounded-full flex items-center justify-center gap-2 hover:border-neon transition text-sm"
          >
            <RefreshCcw size={16} className={isFetching ? "animate-spin" : ""} />
            Atualizar
          </button>
        </div>
      </section>

      {isLoading && (
        <div className="bg-card border border-border rounded-2xl p-5 text-muted">
          Carregando ambientes...
        </div>
      )}

      {isError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl p-5">
          Não foi possível carregar os ambientes. Verifique se a API está online e se a sessão está ativa.
        </div>
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
          {filteredTenants.map((tenant) => (
            <div
              key={tenant.id}
              className="bg-card border border-border rounded-2xl p-5 hover:border-neon/70 hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-white/5 border border-border flex items-center justify-center shrink-0">
                    <Building2 className="text-neon" size={21} />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">
                      {tenant.name}
                    </h3>

                    <p className="text-sm text-muted">
                      {tenant.slug}
                    </p>
                  </div>
                </div>

                <div>
                  {tenant.active ? (
                    <span className="inline-flex items-center gap-2 text-neon text-sm">
                      <CheckCircle2 size={16} />
                      Ativo
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-red-300 text-sm">
                      <XCircle size={16} />
                      Inativo
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 text-sm mb-4">
                <div className="bg-background border border-border rounded-2xl p-3">
                  <p className="text-xs text-muted">
                    País
                  </p>

                  <strong>
                    {tenant.country}
                  </strong>
                </div>

                <div className="bg-background border border-border rounded-2xl p-3">
                  <p className="text-xs text-muted">
                    Moeda
                  </p>

                  <strong>
                    {tenant.currency}
                  </strong>
                </div>

                <div className="bg-background border border-border rounded-2xl p-3">
                  <p className="text-xs text-muted">
                    Idioma
                  </p>

                  <strong>
                    {getLanguageLabel(tenant.language)}
                  </strong>
                </div>

                <div className="bg-background border border-border rounded-2xl p-3">
                  <p className="text-xs text-muted">
                    Fuso horário
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    <Globe2 size={15} className="text-neon" />

                    <strong className="truncate">
                      {getTimezoneLabel(tenant.timezone)}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <p className="text-xs text-muted">
                  ID: {tenant.id.slice(0, 8)}
                </p>

                {canManageTenants() && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(tenant)}
                      className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center hover:border-neon hover:text-neon transition"
                      title="Alterar"
                    >
                      <Edit size={15} />
                    </button>

                    <button
                      onClick={() => {
                        handleDelete(tenant).catch(() => {
                          alert("Erro inesperado ao excluir ambiente.")
                        })
                      }}
                      disabled={deleteLoadingId === tenant.id}
                      className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center hover:border-red-400 hover:text-red-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Excluir"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredTenants.length === 0 && (
            <div className="2xl:col-span-2 bg-card border border-border rounded-2xl p-8 text-center text-muted">
              Nenhum ambiente encontrado com os filtros atuais.
            </div>
          )}
        </div>
      )}

      <CreateTenantModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={() => {
          refetch().catch(() => {
            alert("Ambiente criado, mas não foi possível atualizar a lista.")
          })
        }}
      />

      <EditTenantModal
        open={editModalOpen}
        tenant={selectedTenant}
        onClose={() => {
          setEditModalOpen(false)
          setSelectedTenant(null)
        }}
        onUpdated={() => {
          refetch().catch(() => {
            alert("Ambiente atualizado, mas não foi possível atualizar a lista.")
          })
        }}
      />
    </div>
  )
}