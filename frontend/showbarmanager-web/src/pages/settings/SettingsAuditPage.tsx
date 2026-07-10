import type { LucideIcon } from "lucide-react"
import {
  Activity,
  AlertTriangle,
  Download,
  FileSearch,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react"
import { useTranslation } from "../../hooks/useTranslation"

interface AuditItem {
  title: string
  value: string
  description: string
  icon: LucideIcon
}

export function SettingsAuditPage() {
  const { t } = useTranslation()

  const auditItems: AuditItem[] = [
    {
      title: t("audit.logs"),
      value: "0",
      description: t("audit.logsDescription"),
      icon: Activity,
    },
    {
      title: t("audit.criticalActions"),
      value: "0",
      description: t("audit.criticalActionsDescription"),
      icon: AlertTriangle,
    },
    {
      title: t("audit.audits"),
      value: "0",
      description: t("audit.auditsDescription"),
      icon: FileSearch,
    },
    {
      title: "Compliance",
      value: "100%",
      description: t("audit.complianceDescription"),
      icon: ShieldCheck,
    },
  ]

  return (
    <div className="space-y-4">
      <section className="surface-premium rounded-2xl p-4 lg:p-5">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-sm text-primary font-semibold">
              <FileSearch size={16} />
              {t("settings.title")}
            </span>

            <h2 className="text-2xl xl:text-3xl font-bold mt-1">
              {t("audit.title")}
            </h2>

            <p className="text-muted mt-2 text-sm max-w-4xl">
              {t("audit.subtitle")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button className="bg-cardSoft border border-border px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition text-sm">
              <RefreshCcw size={15} />
              {t("common.refresh")}
            </button>

            <button className="bg-primary text-white font-semibold px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:shadow-neon transition text-sm">
              <Download size={15} />
              {t("audit.exportLogs")}
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {auditItems.map((item) => (
          <AuditCard key={item.title} {...item} />
        ))}
      </section>
    </div>
  )
}

function AuditCard({
  title,
  value,
  description,
  icon: Icon,
}: AuditItem) {
  return (
    <article className="surface-premium rounded-2xl p-4 min-h-[146px] hover:border-primary/50 transition">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-muted">
            {title}
          </p>

          <strong className="text-2xl text-primary block mt-1 truncate">
            {value}
          </strong>
        </div>

        <div className="w-9 h-9 rounded-2xl bg-primarySoft flex items-center justify-center shrink-0">
          <Icon className="text-primary" size={18} />
        </div>
      </div>

      <p className="text-xs text-muted leading-relaxed line-clamp-2">
        {description}
      </p>
    </article>
  )
}