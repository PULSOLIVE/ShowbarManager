import type { LucideIcon } from "lucide-react"
import {
  Edit,
  Network,
  Plus,
  Router,
  Save,
  Server,
  Trash2,
  Wifi,
} from "lucide-react"

const networkItems = [
  { title: "Link principal", value: "Preparado", icon: Wifi },
  { title: "Link backup", value: "Preparado", icon: Wifi },
  { title: "Roteador", value: "Planejado", icon: Router },
  { title: "Servidor local", value: "Planejado", icon: Server },
  { title: "Agente local", value: "Planejado", icon: Network },
  { title: "Failover", value: "Futuro", icon: Network },
]

export function SettingsNetworkPage() {
  return (
    <div className="space-y-5">
      <section className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-sm text-neon font-semibold">
            <Network size={16} />
            Configurações
          </span>

          <h2 className="text-3xl xl:text-4xl font-bold mt-1">
            Rede Local
          </h2>

          <p className="text-muted mt-2">
            Links, roteadores, servidores locais, agente local, contingência e failover.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button className="bg-background border border-border px-5 py-3 rounded-full flex items-center justify-center gap-2 hover:border-neon hover:text-neon transition text-sm">
            <Plus size={16} />
            Novo dispositivo
          </button>

          <button className="bg-neon text-black font-semibold px-5 py-3 rounded-full flex items-center justify-center gap-2 hover:shadow-neon transition text-sm">
            <Save size={16} />
            Salvar rede
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {networkItems.map((item) => (
          <NetworkCard key={item.title} {...item} />
        ))}
      </div>
    </div>
  )
}

function NetworkCard({
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

      <h3 className="font-semibold mt-4">{title}</h3>
      <p className="text-neon font-semibold mt-2">{value}</p>
    </div>
  )
}