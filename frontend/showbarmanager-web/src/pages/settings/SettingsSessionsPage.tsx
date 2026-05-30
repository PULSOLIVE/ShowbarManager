import type { LucideIcon } from "lucide-react"
import {
  Clock3,
  Monitor,
  RefreshCcw,
  ShieldCheck,
  UserCircle,
} from "lucide-react"

export function SettingsSessionsPage() {
  return (
    <div className="space-y-5">
      <section className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-sm text-neon font-semibold">
            <Monitor size={16} />
            Configurações
          </span>

          <h2 className="text-3xl xl:text-4xl font-bold mt-1">
            Sessões
          </h2>

          <p className="text-muted mt-2">
            Monitoramento, rastreabilidade, controle e encerramento de sessões.
          </p>
        </div>

        <button className="bg-background border border-border px-5 py-3 rounded-full flex items-center justify-center gap-2 hover:border-neon hover:text-neon transition text-sm">
          <RefreshCcw size={16} />
          Atualizar sessões
        </button>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <SessionCard title="Sessões Ativas" value="0" icon={Monitor} />
        <SessionCard title="Sessões Master" value="0" icon={ShieldCheck} />
        <SessionCard title="Tempo Médio" value="0 min" icon={Clock3} />
        <SessionCard title="Usuários Online" value="0" icon={UserCircle} />
      </div>
    </div>
  )
}

function SessionCard({
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