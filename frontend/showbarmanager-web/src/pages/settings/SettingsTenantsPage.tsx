import type { LucideIcon } from "lucide-react"
import {
  Building2,
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
    title: "Isolamento por tenant",
    description: "Separação lógica de dados por empresa/cliente.",
    status: "Ativo",
    icon: ShieldCheck,
  },
  {
    title: "Cross-tenant",
    description: "Acesso global permitido apenas para usuários master.",
    status: "Restrito",
    icon: Globe2,
  },
  {
    title: "Modo suporte",
    description: "Visualização técnica controlada para suporte interno.",
    status: "Planejado",
    icon: Eye,
  },
]

export function SettingsTenantsPage() {
  return (
    <div className="space-y-5">
      <section className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-sm text-neon font-semibold">
            <Building2 size={16} />
            Configurações
          </span>

          <h2 className="text-3xl xl:text-4xl font-bold mt-1">
            Multi-tenant
          </h2>

          <p className="text-muted mt-2">
            Governança de tenants, multiempresa, isolamento de dados e acesso global.
          </p>
        </div>

        <button className="bg-neon text-black font-semibold px-5 py-3 rounded-full flex items-center justify-center gap-2 hover:shadow-neon transition text-sm">
          <Save size={16} />
          Salvar regras
        </button>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {tenantSettings.map((item) => (
          <TenantCard key={item.title} {...item} />
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="text-xl font-semibold">Regras de ambiente</h3>
            <p className="text-sm text-muted mt-1">
              Parâmetros globais para tenants e empresas vinculadas.
            </p>
          </div>

          <button className="bg-background border border-border px-4 py-2 rounded-full flex items-center gap-2 hover:border-neon hover:text-neon transition text-sm">
            <Plus size={15} />
            Nova regra
          </button>
        </div>

        <div className="space-y-3">
          {["Tenant ativo obrigatório", "Empresa vinculada obrigatória", "Timezone por tenant"].map((rule) => (
            <div
              key={rule}
              className="bg-background border border-border rounded-2xl p-4 flex items-center justify-between gap-4"
            >
              <div>
                <strong>{rule}</strong>
                <p className="text-sm text-muted mt-1">Regra operacional enterprise.</p>
              </div>

              <div className="flex items-center gap-2">
                <button className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center hover:border-neon hover:text-neon transition">
                  <Edit size={15} />
                </button>

                <button className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center hover:border-red-400 hover:text-red-300 transition">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
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
    <div className="bg-card border border-border rounded-2xl p-5 hover:border-neon/70 transition">
      <Icon className="text-neon mb-4" size={24} />

      <h3 className="font-semibold">{title}</h3>

      <p className="text-sm text-muted mt-2">{description}</p>

      <p className="text-neon font-semibold mt-4">{status}</p>
    </div>
  )
}