import type { LucideIcon } from "lucide-react"
import {
  Activity,
  AlertTriangle,
  Download,
  FileSearch,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react"

const auditItems = [
  {
    title: "Logs",
    value: "0",
    description: "Registros estruturados de ações do sistema.",
    icon: Activity,
  },
  {
    title: "Ações Críticas",
    value: "0",
    description: "Operações sensíveis que exigem rastreabilidade.",
    icon: AlertTriangle,
  },
  {
    title: "Auditorias",
    value: "0",
    description: "Consultas, revisões e verificações internas.",
    icon: FileSearch,
  },
  {
    title: "Compliance",
    value: "100%",
    description: "Base preparada para LGPD, RGPD e governança.",
    icon: ShieldCheck,
  },
]

export function SettingsAuditPage() {
  return (
    <div className="space-y-4">
      <section className="surface-premium rounded-2xl p-4 lg:p-5">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-sm text-primary font-semibold">
              <FileSearch size={16} />
              Configurações
            </span>

            <h2 className="text-2xl xl:text-3xl font-bold mt-1">
              Auditoria
            </h2>

            <p className="text-muted mt-2 text-sm max-w-4xl">
              Logs, rastreamento, ações críticas, compliance e observabilidade.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button className="bg-cardSoft border border-border px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition text-sm">
              <RefreshCcw size={15} />
              Atualizar
            </button>

            <button className="bg-primary text-white font-semibold px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:shadow-neon transition text-sm">
              <Download size={15} />
              Exportar logs
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
}: {
  title: string
  value: string
  description: string
  icon: LucideIcon
}) {
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