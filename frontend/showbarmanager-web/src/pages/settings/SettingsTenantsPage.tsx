import type { LucideIcon } from "lucide-react"
import {
  Building2,
  CheckCircle2,
  Edit,
  Eye,
  Globe2,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
} from "lucide-react"

const tenantSettings = [
  {
    title: "Isolamento por ambiente",
    description: "Separação lógica de dados por empresa, cliente e ambiente.",
    status: "Ativo",
    icon: ShieldCheck,
  },
  {
    title: "Acesso entre ambientes",
    description: "Acesso global controlado somente para usuários autorizados.",
    status: "Restrito",
    icon: Globe2,
  },
  {
    title: "Modo suporte",
    description: "Visualização técnica temporária para suporte e auditoria.",
    status: "Planejado",
    icon: Eye,
  },
]

const tenantRules = [
  "Ambiente ativo obrigatório",
  "Empresa vinculada obrigatória",
  "Fuso horário por ambiente",
]

export function SettingsTenantsPage() {
  return (
    <div className="space-y-4">
      <section className="surface-premium rounded-2xl p-4 lg:p-5">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-sm text-primary font-semibold">
              <Building2 size={16} />
              Configurações
            </span>

            <h2 className="text-2xl xl:text-3xl font-bold mt-1">
              Multi Ambientes
            </h2>

            <p className="text-muted mt-2 text-sm max-w-4xl">
              Governança de ambientes, multiempresa, isolamento de dados,
              acesso global e regras operacionais por ambiente.
            </p>
          </div>

          <button className="bg-primary text-white font-semibold px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:shadow-neon transition text-sm">
            <Save size={15} />
            Salvar regras
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        {tenantSettings.map((item) => (
          <TenantCard key={item.title} {...item} />
        ))}
      </section>

      <section className="surface-premium rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-semibold">
              Regras de ambiente
            </h3>

            <p className="text-sm text-muted mt-1">
              Parâmetros globais para ambientes e empresas vinculadas.
            </p>
          </div>

          <button className="bg-cardSoft border border-border px-4 py-2 rounded-full flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition text-sm">
            <Plus size={15} />
            Nova regra
          </button>
        </div>

        <div className="space-y-2.5">
          {tenantRules.map((rule) => (
            <RuleRow key={rule} title={rule} />
          ))}
        </div>
      </section>
    </div>
  )
}

function TenantCard({
  title,
  description,
  status,
  icon: Icon,
}: {
  title: string
  description: string
  status: string
  icon: LucideIcon
}) {
  return (
    <div className="surface-premium rounded-2xl p-4 hover:border-primary/50 transition">
      <div className="flex items-start justify-between gap-3">
        <div className="icon-tile">
          <Icon size={19} />
        </div>

        <span className="inline-flex items-center gap-1 text-xs font-semibold text-success bg-success/10 rounded-full px-2.5 py-1">
          <CheckCircle2 size={12} />
          {status}
        </span>
      </div>

      <h3 className="font-semibold mt-4">
        {title}
      </h3>

      <p className="text-sm text-muted mt-2 line-clamp-2">
        {description}
      </p>
    </div>
  )
}

function RuleRow({ title }: { title: string }) {
  return (
    <div className="bg-cardSoft border border-border rounded-2xl p-3 flex items-center justify-between gap-4 shadow-card">
      <div className="min-w-0">
        <strong className="text-sm block truncate">
          {title}
        </strong>

        <p className="text-xs text-muted mt-1">
          Regra operacional enterprise.
        </p>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:border-primary hover:text-primary transition"
          title="Editar"
        >
          <Edit size={14} />
        </button>

        <button
          className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:border-danger hover:text-danger transition"
          title="Excluir"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}