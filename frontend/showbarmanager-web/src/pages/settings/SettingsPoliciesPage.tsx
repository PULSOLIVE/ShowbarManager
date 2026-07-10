import {
  Edit,
  FileText,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
} from "lucide-react"
import { useTranslation } from "../../hooks/useTranslation"

export function SettingsPoliciesPage() {
  const { t } = useTranslation()

  const policies = [
    "LGPD",
    "RGPD",
    t("policies.documentRetention"),
    t("policies.logRetention"),
    t("policies.accessPolicies"),
    t("policies.exportPolicies"),
    t("policies.financialPolicies"),
    t("policies.fiscalPolicies"),
    t("policies.networkPolicies"),
    t("policies.backupPolicies"),
  ]

  return (
    <div className="space-y-4">
      <section className="surface-premium rounded-2xl p-4 lg:p-5">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-sm text-primary font-semibold">
              <FileText size={16} />
              {t("settings.title")}
            </span>

            <h2 className="text-2xl xl:text-3xl font-bold mt-1">
              {t("policies.title")}
            </h2>

            <p className="text-muted mt-2 text-sm max-w-4xl">
              {t("policies.subtitle")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button className="bg-cardSoft border border-border px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition text-sm">
              <Plus size={15} />
              {t("policies.newPolicy")}
            </button>

            <button className="bg-primary text-white font-semibold px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:shadow-neon transition text-sm">
              <Save size={15} />
              {t("policies.savePolicies")}
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        {policies.map((policy) => (
          <PolicyCard key={policy} policy={policy} />
        ))}
      </section>
    </div>
  )
}

function PolicyCard({ policy }: { policy: string }) {
  const { t } = useTranslation()

  return (
    <article className="surface-premium rounded-2xl p-4 hover:border-primary/50 transition">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-primarySoft flex items-center justify-center shrink-0">
            <ShieldCheck className="text-primary" size={19} />
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold truncate">{policy}</h3>

            <p className="text-sm text-muted mt-1">
              {t("policies.configurablePolicy")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            className="w-8 h-8 rounded-full bg-cardSoft border border-border flex items-center justify-center hover:border-primary hover:text-primary transition"
            title={t("common.edit")}
          >
            <Edit size={14} />
          </button>

          <button
            className="w-8 h-8 rounded-full bg-cardSoft border border-border flex items-center justify-center hover:border-danger hover:text-danger transition"
            title={t("common.delete")}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </article>
  )
}