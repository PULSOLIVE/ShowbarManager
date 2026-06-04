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
  {
    name: "WhatsApp",
    status: "Planejado",
    description: "Mensageria, notificações e comunicação operacional.",
    icon: PlugZap,
  },
  {
    name: "Meta",
    status: "Planejado",
    description: "Campanhas, pixel, eventos e integrações sociais.",
    icon: PlugZap,
  },
  {
    name: "Google",
    status: "Planejado",
    description: "Login, mapas, agenda, analytics e serviços externos.",
    icon: PlugZap,
  },
  {
    name: "Stripe",
    status: "Planejado",
    description: "Pagamentos internacionais e checkout online.",
    icon: PlugZap,
  },
  {
    name: "MBWay",
    status: "Planejado",
    description: "Pagamentos em Portugal via carteira digital.",
    icon: PlugZap,
  },
  {
    name: "Multibanco",
    status: "Planejado",
    description: "Referências e pagamentos locais em Portugal.",
    icon: PlugZap,
  },
  {
    name: "POS",
    status: "Preparado",
    description: "Integração com terminais físicos de venda.",
    icon: PlugZap,
  },
  {
    name: "API Externa",
    status: "Preparado",
    description: "Conectores externos, webhooks e integrações REST.",
    icon: Link2,
  },
]

export function SettingsIntegrationsPage() {
  return (
    <div className="space-y-4">
      <section className="surface-premium rounded-2xl p-4 lg:p-5">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-sm text-primary font-semibold">
              <PlugZap size={16} />
              Configurações
            </span>

            <h2 className="text-2xl xl:text-3xl font-bold mt-1">
              Integrações
            </h2>

            <p className="text-muted mt-2 text-sm max-w-4xl">
              APIs, pagamentos, canais externos, hardware e observabilidade.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button className="bg-cardSoft border border-border px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition text-sm">
              <RefreshCcw size={15} />
              Testar conexões
            </button>

            <button className="bg-primary text-white font-semibold px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:shadow-neon transition text-sm">
              <Save size={15} />
              Salvar integrações
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {integrations.map((integration) => (
          <IntegrationCard key={integration.name} {...integration} />
        ))}
      </section>
    </div>
  )
}

function IntegrationCard({
  name,
  status,
  description,
  icon: Icon,
}: {
  name: string
  status: string
  description: string
  icon: LucideIcon
}) {
  return (
    <article className="surface-premium rounded-2xl p-4 min-h-[150px] hover:border-primary/50 transition">
      <div className="flex items-start justify-between gap-3">
        <div className="w-9 h-9 rounded-2xl bg-primarySoft flex items-center justify-center shrink-0">
          <Icon className="text-primary" size={18} />
        </div>

        <div className="flex items-center gap-1">
          <button
            className="w-8 h-8 rounded-full bg-cardSoft border border-border flex items-center justify-center hover:border-primary hover:text-primary transition"
            title="Editar"
          >
            <Edit size={14} />
          </button>

          <button
            className="w-8 h-8 rounded-full bg-cardSoft border border-border flex items-center justify-center hover:border-danger hover:text-danger transition"
            title="Excluir"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <h3 className="font-semibold mt-4">
        {name}
      </h3>

      <p className="text-primary text-sm font-semibold mt-1">
        {status}
      </p>

      <p className="text-xs text-muted mt-2 leading-relaxed line-clamp-2">
        {description}
      </p>
    </article>
  )
}