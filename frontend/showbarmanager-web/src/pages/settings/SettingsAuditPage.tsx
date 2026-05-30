import type { LucideIcon } from "lucide-react"
import {
  Activity,
  AlertTriangle,
  Download,
  FileSearch,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react"

export function SettingsAuditPage() {
  return (
    <div className="space-y-5">
      <section className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-sm text-neon font-semibold">
            <FileSearch size={16} />
            Configurações
          </span>

          <h2 className="text-3xl xl:text-4xl font-bold mt-1">
            Auditoria
          </h2>

          <p className="text-muted mt-2">
            Logs, rastreamento, ações críticas, compliance e observabilidade.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button className="bg-background border border-border px-5 py-3 rounded-full flex items-center justify-center gap-2 hover:border-neon hover:text-neon transition text-sm">
            <RefreshCcw size={16} />
            Atualizar
          </button>

          <button className="bg-neon text-black font-semibold px-5 py-3 rounded-full flex items-center justify-center gap-2 hover:shadow-neon transition text-sm">
            <Download size={16} />
            Exportar logs
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <AuditCard title="Logs" value="0" icon={Activity} />
        <AuditCard title="Ações Críticas" value="0" icon={AlertTriangle} />
        <AuditCard title="Auditorias" value="0" icon={FileSearch} />
        <AuditCard title="Compliance" value="100%" icon={ShieldCheck} />
      </div>
    </div>
  )
}

function AuditCard({
  title,
  value,
  icon: Icon,
}: {
  title: string
  value: string
  icon: LucideIcon
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover:border-neon/70 transition">
      <Icon className="text-neon mb-4" size={24} />

      <p className="text-muted text-sm">
        {title}
      </p>

      <strong className="text-2xl text-neon">
        {value}
      </strong>
    </div>
  )
}