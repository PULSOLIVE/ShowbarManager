import { useMemo, useState } from "react"
import type { ReactNode } from "react"
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
import { InternationalizationService } from "../../services/internationalization.service"
import { TenantService } from "../../services/tenant.service"
import { useAuthStore } from "../../store/auth.store"
import { useTranslation } from "../../hooks/useTranslation"
import type { Internationalization } from "../../types/internationalization.types"
import type { Tenant } from "../../types/tenant.types"

function getInternationalizationLabel(
  options: Internationalization[],
  tenant: Tenant,
  field: "country" | "language" | "timezone"
) {
  const found = options.find(
    (item) =>
      item.countryCode === tenant.country &&
      item.languageCode === tenant.language &&
      item.timezone === tenant.timezone
  )

  if (field === "country") {
    const countryFound =
      found || options.find((item) => item.countryCode === tenant.country)

    return countryFound
      ? `${countryFound.flagEmoji || "🌐"} ${countryFound.countryName}`
      : tenant.country
  }

  if (field === "language") {
    const languageFound =
      found || options.find((item) => item.languageCode === tenant.language)

    return languageFound ? languageFound.languageName : tenant.language
  }

  const timezoneFound =
    found || options.find((item) => item.timezone === tenant.timezone)

  return timezoneFound ? timezoneFound.timezoneLabel : tenant.timezone
}

export function TenantsPage() {
  const { t } = useTranslation()

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

  const { data: internationalizationOptions = [] } = useQuery({
    queryKey: ["internationalization-active"],
    queryFn: InternationalizationService.listActive,
  })

  const activeTenantsCount = useMemo(() => {
    return data.filter((tenant) => tenant.active).length
  }, [data])

  const filteredTenants = useMemo(() => {
    const searchTerm = search.trim().toLowerCase()

    return data.filter((tenant) => {
      const countryLabel = getInternationalizationLabel(
        internationalizationOptions,
        tenant,
        "country"
      ).toLowerCase()

      const languageLabel = getInternationalizationLabel(
        internationalizationOptions,
        tenant,
        "language"
      ).toLowerCase()

      const timezoneLabel = getInternationalizationLabel(
        internationalizationOptions,
        tenant,
        "timezone"
      ).toLowerCase()

      const matchesSearch =
        !searchTerm ||
        tenant.name.toLowerCase().includes(searchTerm) ||
        tenant.slug.toLowerCase().includes(searchTerm) ||
        tenant.country.toLowerCase().includes(searchTerm) ||
        tenant.currency.toLowerCase().includes(searchTerm) ||
        tenant.language.toLowerCase().includes(searchTerm) ||
        tenant.timezone.toLowerCase().includes(searchTerm) ||
        countryLabel.includes(searchTerm) ||
        languageLabel.includes(searchTerm) ||
        timezoneLabel.includes(searchTerm)

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && tenant.active) ||
        (statusFilter === "inactive" && !tenant.active)

      return matchesSearch && matchesStatus
    })
  }, [data, internationalizationOptions, search, statusFilter])

  function handleRefresh() {
    refetch()
      .then(() => {
        alert(t("tenants.listUpdated", t("messages.listUpdated")))
      })
      .catch(() => {
        alert(t("tenants.refreshError", t("tenants.error")))
      })
  }

  function handleEdit(tenant: Tenant) {
    setSelectedTenant(tenant)
    setEditModalOpen(true)
  }

  async function handleDelete(tenant: Tenant) {
    const confirmed = window.confirm(
      `${t("tenants.deleteConfirm", "Deseja realmente excluir o ambiente")} ${tenant.name}?`
    )

    if (!confirmed) return

    try {
      setDeleteLoadingId(tenant.id)
      await TenantService.delete(tenant.id)
      await refetch()
    } catch {
      alert(t("tenants.deleteError", "Não foi possível excluir este ambiente."))
    } finally {
      setDeleteLoadingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <section className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-sm text-primary font-semibold">
            <Building2 size={16} />
            {t("tenants.multiTenants", "Multiambientes")}
          </span>

          <h2 className="text-2xl xl:text-3xl font-bold mt-1">
            {t("tenants.title")}
          </h2>

          <p className="text-muted mt-2 text-sm max-w-4xl">
            {t("tenants.subtitle")}
          </p>
        </div>

        {canManageTenants() && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="bg-primary text-white font-semibold px-4 py-2.5 rounded-full hover:shadow-neon transition w-full sm:w-auto text-sm"
          >
            {t("tenants.new")}
          </button>
        )}
      </section>

      <section className="grid grid-cols-2 xl:grid-cols-3 gap-3">
        <SummaryCard title={t("common.total")} value={String(data.length)} icon={<Building2 size={18} />} />
        <SummaryCard title={t("common.active")} value={String(activeTenantsCount)} icon={<CheckCircle2 size={18} />} />
        <SummaryCard title={t("common.filtered")} value={String(filteredTenants.length)} icon={<Search size={18} />} />
      </section>

      <section className="surface-premium rounded-2xl p-3 flex flex-col xl:flex-row gap-3 xl:items-center xl:justify-between">
        <div className="flex items-center gap-2 bg-background border border-border rounded-full px-4 py-2.5 w-full xl:max-w-md">
          <Search size={15} className="text-muted shrink-0" />

          <input
            className="bg-transparent outline-none text-sm w-full placeholder:text-muted"
            placeholder={t("tenants.searchPlaceholder", "Buscar por nome, slug, país, idioma ou fuso...")}
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
            <option value="all">{t("common.all", "Todos")}</option>
            <option value="active">{t("common.active")}</option>
            <option value="inactive">{t("common.inactive")}</option>
          </select>

          <button
            onClick={handleRefresh}
            className="bg-background border border-border px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition text-sm"
          >
            <RefreshCcw size={15} className={isFetching ? "animate-spin" : ""} />
            {t("common.refresh")}
          </button>
        </div>
      </section>

      {isLoading && (
        <div className="surface-premium rounded-2xl p-4 text-muted text-sm">
          {t("tenants.loading")}
        </div>
      )}

      {isError && (
        <div className="bg-danger/10 border border-danger/30 text-danger rounded-2xl p-4 text-sm">
          {t("tenants.error")}
        </div>
      )}

      {!isLoading && !isError && (
        <section className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-3">
          {filteredTenants.map((tenant) => (
            <article
              key={tenant.id}
              className="surface-premium rounded-2xl p-4 hover:border-primary/50 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="icon-tile">
                    <Building2 size={20} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-base font-semibold truncate">
                      {tenant.name}
                    </h3>

                    <p className="text-xs text-muted mt-1 truncate">
                      {tenant.slug}
                    </p>
                  </div>
                </div>

                {tenant.active ? (
                  <span className="inline-flex items-center gap-1 text-success text-xs shrink-0">
                    <CheckCircle2 size={14} />
                    {t("common.active")}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-danger text-xs shrink-0">
                    <XCircle size={14} />
                    {t("common.inactive")}
                  </span>
                )}
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <InfoBox
                  label={t("common.country")}
                  value={getInternationalizationLabel(
                    internationalizationOptions,
                    tenant,
                    "country"
                  )}
                />

                <InfoBox label={t("common.currency")} value={tenant.currency} />

                <InfoBox
                  label={t("common.language")}
                  value={getInternationalizationLabel(
                    internationalizationOptions,
                    tenant,
                    "language"
                  )}
                />

                <InfoBox
                  label={t("common.timezone")}
                  value={getInternationalizationLabel(
                    internationalizationOptions,
                    tenant,
                    "timezone"
                  )}
                  icon={<Globe2 size={14} className="text-primary" />}
                />
              </div>

              <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-3">
                <p className="text-xs text-muted">
                  ID: {tenant.id.slice(0, 8)}
                </p>

                {canManageTenants() && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(tenant)}
                      className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:border-primary hover:text-primary transition"
                      title={t("common.edit")}
                    >
                      <Edit size={14} />
                    </button>

                    <button
                      onClick={() => {
                        handleDelete(tenant).catch(() => {
                          alert(t("messages.unexpectedError"))
                        })
                      }}
                      disabled={deleteLoadingId === tenant.id}
                      className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:border-danger hover:text-danger transition disabled:opacity-50 disabled:cursor-not-allowed"
                      title={t("common.delete")}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}

          {filteredTenants.length === 0 && (
            <div className="xl:col-span-2 2xl:col-span-3 surface-premium rounded-2xl p-8 text-center text-muted">
              {t("tenants.noResults")}
            </div>
          )}
        </section>
      )}

      <CreateTenantModal
        open={createModalOpen}
        internationalizationOptions={internationalizationOptions}
        onClose={() => setCreateModalOpen(false)}
        onCreated={() => {
          refetch().catch(() => {
            alert(t("tenants.createdRefreshError", "Ambiente criado, mas não foi possível atualizar a lista."))
          })
        }}
      />

      <EditTenantModal
        open={editModalOpen}
        tenant={selectedTenant}
        internationalizationOptions={internationalizationOptions}
        onClose={() => {
          setEditModalOpen(false)
          setSelectedTenant(null)
        }}
        onUpdated={() => {
          refetch().catch(() => {
            alert(t("tenants.updatedRefreshError", "Ambiente atualizado, mas não foi possível atualizar a lista."))
          })
        }}
      />
    </div>
  )
}

function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string
  value: string
  icon: ReactNode
}) {
  return (
    <div className="surface-premium rounded-2xl p-3 hover:border-primary/50 transition">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-muted">
            {title}
          </p>

          <strong className="text-xl text-primary block mt-1 truncate">
            {value}
          </strong>
        </div>

        <div className="icon-tile">
          {icon}
        </div>
      </div>
    </div>
  )
}

function InfoBox({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon?: ReactNode
}) {
  return (
    <div className="surface-muted rounded-2xl p-3 min-w-0">
      <p className="text-[11px] uppercase tracking-wide text-muted">
        {label}
      </p>

      <div className="flex items-center gap-2 mt-1 min-w-0">
        {icon}

        <strong className="text-sm block truncate">
          {value}
        </strong>
      </div>
    </div>
  )
}