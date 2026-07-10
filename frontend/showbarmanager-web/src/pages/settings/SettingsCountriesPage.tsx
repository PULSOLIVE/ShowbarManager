import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  Edit,
  Flag,
  Globe2,
  Plus,
  RefreshCcw,
  Save,
  Trash2,
} from "lucide-react"
import { CreateCountryModal } from "../../components/settings/CreateCountryModal"
import { DeleteCountryModal } from "../../components/settings/DeleteCountryModal"
import { EditCountryModal } from "../../components/settings/EditCountryModal"
import { CountryFiscalRuleService } from "../../services/countryFiscalRule.service"
import { InternationalizationService } from "../../services/internationalization.service"
import { useTranslation } from "../../hooks/useTranslation"
import type { CountryFiscalRule } from "../../types/countryFiscalRule.types"
import type { Internationalization } from "../../types/internationalization.types"

function getInternationalizationByCountry(
  options: Internationalization[],
  countryCode: string
) {
  return options.find((item) => item.countryCode === countryCode)
}

export function SettingsCountriesPage() {
  const { t } = useTranslation()
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<CountryFiscalRule | null>(null)

  const {
    data: fiscalRules = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["country-fiscal-rules"],
    queryFn: CountryFiscalRuleService.list,
  })

  const { data: internationalizationOptions = [] } = useQuery({
    queryKey: ["settings-countries-internationalization"],
    queryFn: InternationalizationService.listActive,
  })

  const countries = useMemo(() => {
    return fiscalRules
      .slice()
      .sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority
        return a.countryName.localeCompare(b.countryName)
      })
  }, [fiscalRules])

  function handleRefresh() {
    refetch().catch(() => {
      alert(t("countries.refreshError"))
    })
  }

  function handleEdit(country: CountryFiscalRule) {
    setSelectedCountry(country)
    setEditOpen(true)
  }

  function handleDelete(country: CountryFiscalRule) {
    setSelectedCountry(country)
    setDeleteOpen(true)
  }

  return (
    <div className="space-y-4">
      <section className="surface-premium rounded-2xl p-4 lg:p-5">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-sm text-primary font-semibold">
              <Globe2 size={16} />
              {t("settings.title")}
            </span>

            <h2 className="text-2xl xl:text-3xl font-bold mt-1">
              {t("countries.title")}
            </h2>

            <p className="text-muted mt-2 text-sm max-w-4xl">
              {t("countries.subtitle")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="bg-cardSoft border border-border px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition text-sm"
            >
              <Plus size={15} />
              {t("countries.newCountry")}
            </button>

            <button
              type="button"
              onClick={handleRefresh}
              className="bg-cardSoft border border-border px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition text-sm"
            >
              <RefreshCcw size={15} className={isFetching ? "animate-spin" : ""} />
              {t("common.refresh")}
            </button>

            <button
              type="button"
              onClick={handleRefresh}
              className="bg-primary text-white font-semibold px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:shadow-neon transition text-sm"
            >
              <Save size={15} />
              {t("countries.saveRules")}
            </button>
          </div>
        </div>
      </section>

      {isLoading && (
        <div className="surface-premium rounded-2xl p-4 text-muted text-sm">
          {t("countries.loading")}
        </div>
      )}

      {isError && (
        <div className="bg-danger/10 border border-danger/30 text-danger rounded-2xl p-4 text-sm">
          {t("countries.error")}
        </div>
      )}

      {!isLoading && !isError && (
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          {countries.map((country) => (
            <CountryCard
              key={country.id}
              country={country}
              internationalization={getInternationalizationByCountry(
                internationalizationOptions,
                country.countryCode
              )}
              onEdit={() => handleEdit(country)}
              onDelete={() => handleDelete(country)}
            />
          ))}

          {countries.length === 0 && (
            <div className="xl:col-span-2 surface-premium rounded-2xl p-8 text-center text-muted">
              {t("countries.noFiscalRules")}
            </div>
          )}
        </section>
      )}

      <CreateCountryModal
        open={createOpen}
        internationalizationOptions={internationalizationOptions}
        onClose={() => setCreateOpen(false)}
        onCreated={() => {
          refetch().catch(() => {
            alert(t("countries.createdRefreshError"))
          })
        }}
      />

      <EditCountryModal
        open={editOpen}
        country={selectedCountry}
        onClose={() => {
          setEditOpen(false)
          setSelectedCountry(null)
        }}
        onUpdated={() => {
          refetch().catch(() => {
            alert(t("countries.updatedRefreshError"))
          })
        }}
      />

      <DeleteCountryModal
        open={deleteOpen}
        country={selectedCountry}
        onClose={() => {
          setDeleteOpen(false)
          setSelectedCountry(null)
        }}
        onDeleted={() => {
          refetch().catch(() => {
            alert(t("countries.deletedRefreshError"))
          })
        }}
      />
    </div>
  )
}

function CountryCard({
  country,
  internationalization,
  onEdit,
  onDelete,
}: {
  country: CountryFiscalRule
  internationalization?: Internationalization
  onEdit: () => void
  onDelete: () => void
}) {
  const { t } = useTranslation()

  return (
    <article className="surface-premium rounded-2xl p-4 hover:border-primary/50 transition">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="icon-tile">
            {internationalization?.flagEmoji || <Flag size={19} />}
          </div>

          <div className="min-w-0">
            <h3 className="text-lg font-semibold truncate">
              {country.countryName}
            </h3>

            <p className="text-sm text-muted truncate">
              {country.taxName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onEdit}
            className="w-8 h-8 rounded-full bg-cardSoft border border-border flex items-center justify-center hover:border-primary hover:text-primary transition"
            title={t("common.edit")}
          >
            <Edit size={14} />
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="w-8 h-8 rounded-full bg-cardSoft border border-border flex items-center justify-center hover:border-danger hover:text-danger transition"
            title={t("common.delete")}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <p className="text-xs text-muted leading-relaxed mb-4">
        {country.description}
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Field
          label={t("common.currency")}
          value={
            internationalization
              ? `${internationalization.currencySymbol} ${internationalization.currencyCode}`
              : "-"
          }
        />

        <Field
          label={t("common.language")}
          value={internationalization?.languageCode || "-"}
        />

        <Field
          label={t("countries.timezoneShort")}
          value={internationalization?.timezone || "-"}
        />

        <Field label={t("common.code")} value={country.countryCode} />
      </div>

      <div className="flex flex-wrap gap-2">
        {country.fields.map((field) => (
          <span
            key={field}
            className="rounded-full bg-cardSoft border border-border px-3 py-1.5 text-xs text-muted"
          >
            {field}
          </span>
        ))}
      </div>
    </article>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-cardSoft border border-border rounded-2xl p-3">
      <p className="text-[11px] uppercase tracking-wide text-muted">
        {label}
      </p>

      <strong className="text-primary text-sm block mt-1 truncate">
        {value}
      </strong>
    </div>
  )
}