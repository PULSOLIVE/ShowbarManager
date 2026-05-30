import type { LucideIcon } from "lucide-react"
import {
  Edit,
  Link2,
  PlugZap,
  RefreshCcw,
  Save,
  Trash2,
} from "lucide-react"

const integrations = [
  { name: "WhatsApp", status: "Planejado", icon: PlugZap },
  { name: "Meta", status: "Planejado", icon: PlugZap },
  { name: "Google", status: "Planejado", icon: PlugZap },
  { name: "Stripe", status: "Planejado", icon: PlugZap },
  { name: "MBWay", status: "Planejado", icon: PlugZap },
  { name: "Multibanco", status: "Planejado", icon: PlugZap },
  { name: "POS", status: "Preparado", icon: PlugZap },
  { name: "API Externa", status: "Preparado", icon: Link2 },
]

export function SettingsIntegrationsPage() {
  return (
    <div className="space-y-5">
      <section className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-sm text-neon font-semibold">
            <PlugZap size={16} />
            Configurações
          </span>

          <h2 className="text-3xl xl:text-4xl font-bold mt-1">
            Integrações
          </h2>

          <p className="text-muted mt-2">
            APIs, pagamentos, canais externos, hardware e observabilidade.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button className="bg-background border border-border px-5 py-3 rounded-full flex items-center justify-center gap-2 hover:border-neon hover:text-neon transition text-sm">
            <RefreshCcw size={16} />
            Testar conexões
          </button>

          <button className="bg-neon text-black font-semibold px-5 py-3 rounded-full flex items-center justify-center gap-2 hover:shadow-neon transition text-sm">
            <Save size={16} />
            Salvar integrações
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {integrations.map((integration) => (
          <IntegrationCard key={integration.name} {...integration} />
        ))}
      </div>
    </div>
  )
}

function IntegrationCard({
  name,
  status,
  icon: Icon,
}: {
  name: string
  status: string
  icon: LucideIcon
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover:border-neon/70 transition">
      <div className="flex items-start justify-between gap-4">
        <Icon className="text-neon" size={24} />

        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:border-neon hover:text-neon transition">
            <Edit size={14} />
          </button>

          <button className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:border-red-400 hover:text-red-300 transition">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <h3 className="font-semibold mt-4">{name}</h3>
      <p className="text-neon font-semibold mt-2">{status}</p>
    </div>
  )
}