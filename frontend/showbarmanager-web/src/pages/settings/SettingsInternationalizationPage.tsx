import { useMemo, useState } from "react"
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
  XCircle,
} from "lucide-react"
import { CreateInternationalizationModal } from "../../components/settings/CreateInternationalizationModal"
import { EditInternationalizationModal } from "../../components/settings/EditInternationalizationModal"
import { InternationalizationService } from "../../services/internationalization.service"
import { useTranslation } from "../../hooks/useTranslation"
import type { Internationalization } from "../../types/internationalization.types"

export function SettingsInternationalizationPage() {
  const { t } = useTranslation()

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

  const activeCount = useMemo(() => {
    return data.filter((item) => item.active).length
  }, [data])

  const languageCount = useMemo(() => {
    return new Set(data.map((item) => item.languageCode)).size
  }, [data])

  const countryCount = useMemo(() => {
    return new Set(data.map((item) => item.countryCode)).size
  }, [data])

  const filteredItems = useMemo(() => {
    const searchTerm = search.trim().toLowerCase()

    return data.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        item.code.toLowerCase().includes(searchTerm) ||
        item.countryName.toLowerCase().includes(searchTerm) ||
        item.countryCode.toLowerCase().includes(searchTerm) ||
        item.languageName.toLowerCase().includes(searchTerm) ||
        item.languageCode.toLowerCase().includes(searchTerm) ||
        item.currencyCode.toLowerCase().includes(searchTerm) ||
        item.currencySymbol.toLowerCase().includes(searchTerm) ||
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

  function handleRefresh() {
    refetch()
      .then(() => {
        alert(t("internationalization.listUpdated"))
      })
      .catch(() => {
        alert(t("internationalization.refreshError"))
      })
  }

  function handleEdit(item: Internationalization) {
    setSelectedItem(item)
    setEditOpen(true)
  }

  async function handleDelete(item: Internationalization) {
    if (item.systemDefault) {
      alert(t("internationalization.defaultDeleteBlocked"))
      return
    }

    const confirmed = window.confirm(
      `${t("internationalization.deleteConfirm")} ${item.countryName} / ${item.languageName}?`
    )

    if (!confirmed) {
      return
    }

    try {
      setDeleteLoadingId(item.id)
      await InternationalizationService.delete(item.id)
      await refetch()
    } catch {
      alert(t("internationalization.deleteError"))
    } finally {
      setDeleteLoadingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <section className="surface-premium rounded-2xl p-4 lg:p-5">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-sm text-primary font-semibold">
              <Languages size={16} />
              {t("settings.title")}
            </span>

            <h2 className="text-2xl xl:text-3xl font-bold mt-1">
              {t("internationalization.title")}
            </h2>

            <p className="text-muted mt-2 text-sm max-w-4xl">
              {t("internationalization.subtitle")}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="bg-primary text-white font-semibold px-4 py-2.5 rounded-full hover:shadow-neon transition w-full sm:w-auto flex items-center justify-center gap-2 text-sm"
          >
            <Plus size={16} />
            {t("internationalization.new")}
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 xl:grid-cols-5 gap-3">
        <SummaryCard title={t("common.total")} value={String(data.length)} />
        <SummaryCard title={t("common.active")} value={String(activeCount)} />
        <SummaryCard title={t("internationalization.countries")} value={String(countryCount)} />
        <SummaryCard title={t("internationalization.languages")} value={String(languageCount)} />
        <SummaryCard title={t("common.filtered")} value={String(filteredItems.length)} />
      </section>

      <section className="surface-premium rounded-2xl p-3 flex flex-col xl:flex-row gap-3 xl:items-center xl:justify-between">
        <div className="flex items-center gap-2 bg-background border border-border rounded-full px-4 py-2.5 w-full xl:max-w-md">
          <Search size={15} className="text-muted shrink-0" />

          <input
            className="bg-transparent outline-none text-sm w-full placeholder:text-muted"
            placeholder={t("internationalization.searchPlaceholder")}
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
            <option value="all">{t("common.all")}</option>
            <option value="active">{t("common.active")}</option>
            <option value="inactive">{t("common.inactive")}</option>
            <option value="default">{t("common.default")}</option>
          </select>

          <button
            type="button"
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
          {t("internationalization.loading")}
        </div>
      )}

      {isError && (
        <div className="bg-danger/10 border border-danger/30 text-danger rounded-2xl p-4 text-sm">
          {t("internationalization.error")}
        </div>
      )}

      {!isLoading && !isError && (
        <section className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-3">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="surface-premium rounded-2xl p-4 hover:border-primary/50 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="icon-tile text-lg">
                    {item.flagEmoji || <Globe2 size={18} />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <strong className="text-base truncate">
                        {item.countryName}
                      </strong>

                      {item.systemDefault && (
                        <span className="inline-flex items-center gap-1 text-warning text-xs bg-warning/10 px-2 py-0.5 rounded-full">
                          <Star size={12} />
                          {t("common.default")}
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
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:border-primary hover:text-primary transition"
                    title={t("common.edit")}
                  >
                    <Edit size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleDelete(item).catch(() => {
                        alert(t("messages.unexpectedError"))
                      })
                    }}
                    disabled={deleteLoadingId === item.id || item.systemDefault}
                    className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:border-danger hover:text-danger transition disabled:opacity-50 disabled:cursor-not-allowed"
                    title={t("common.delete")}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <InfoBox
                  label={t("internationalization.languageName")}
                  value={`${item.languageName} (${item.languageCode})`}
                />

                <InfoBox
                  label={t("common.currency")}
                  value={`${item.currencySymbol} ${item.currencyCode}`}
                />

                <InfoBox
                  label={t("internationalization.dateTime")}
                  value={`${item.dateFormat} · ${item.timeFormat}`}
                />

                <InfoBox
                  label={t("common.priority")}
                  value={String(item.priority)}
                />
              </div>

              <div className="mt-3 surface-muted rounded-2xl p-3">
                <div className="flex items-start gap-2">
                  <Globe2 size={15} className="text-primary mt-0.5 shrink-0" />

                  <div className="min-w-0">
                    <p className="text-xs text-muted">
                      {t("common.timezone")}
                    </p>

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
                  <span className="inline-flex items-center gap-2 text-success text-sm">
                    <CheckCircle2 size={15} />
                    {t("common.active")}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 text-danger text-sm">
                    <XCircle size={15} />
                    {t("common.inactive")}
                  </span>
                )}

                <span className="text-xs text-muted">
                  ID: {item.id.slice(0, 8)}
                </span>
              </div>
            </article>
          ))}

          {filteredItems.length === 0 && (
            <div className="xl:col-span-2 2xl:col-span-3 surface-premium rounded-2xl p-8 text-center text-muted">
              {t("internationalization.noResults")}
            </div>
          )}
        </section>
      )}

      <CreateInternationalizationModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => {
          refetch().catch(() => {
            alert(t("internationalization.createdRefreshError"))
          })
        }}
      />

      <EditInternationalizationModal
        open={editOpen}
        internationalization={selectedItem}
        onClose={() => {
          setEditOpen(false)
          setSelectedItem(null)
        }}
        onUpdated={() => {
          refetch().catch(() => {
            alert(t("internationalization.updatedRefreshError"))
          })
        }}
      />
    </div>
  )
}

function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="surface-premium rounded-2xl p-3 hover:border-primary/50 transition">
      <p className="text-[11px] uppercase tracking-wide text-muted">
        {title}
      </p>

      <strong className="text-xl text-primary block mt-1 truncate">
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
    <div className="surface-muted rounded-2xl p-3 min-w-0">
      <p className="text-[11px] uppercase tracking-wide text-muted">
        {label}
      </p>

      <strong className="text-sm block truncate mt-1">
        {value}
      </strong>
    </div>
  )
}