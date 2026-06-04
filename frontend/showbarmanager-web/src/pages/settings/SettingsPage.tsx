import type { LucideIcon } from "lucide-react"
import {
  Activity,
  Building2,
  CheckCircle2,
  FileText,
  Globe2,
  HardDrive,
  KeyRound,
  Languages,
  Network,
  Palette,
  PlugZap,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  UserCog,
  Users,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

interface SettingsSection {
  title: string
  description: string
  icon: LucideIcon
  path: string
  status: string
}

const settingsSections: SettingsSection[] = [
  {
    title: "Usuários",
    description: "Acessos, status e vínculos.",
    icon: Users,
    path: "/settings/users",
    status: "Ativo",
  },
  {
    title: "Perfis e Grupos",
    description: "Perfis, grupos e hierarquias.",
    icon: UserCog,
    path: "/settings/profiles",
    status: "Ativo",
  },
  {
    title: "Permissões",
    description: "ACL por módulo, ação e contexto.",
    icon: KeyRound,
    path: "/settings/permissions",
    status: "Ativo",
  },
  {
    title: "Internacionalização",
    description: "Países, moedas, idiomas e fusos.",
    icon: Languages,
    path: "/settings/internationalization",
    status: "Ativo",
  },
  {
    title: "Segurança",
    description: "MFA, senha, sessões e dispositivos.",
    icon: ShieldCheck,
    path: "/settings/security",
    status: "Planejado",
  },
  {
    title: "Sessões",
    description: "Sessões ativas e rastreabilidade.",
    icon: Activity,
    path: "/settings/sessions",
    status: "Planejado",
  },
  {
    title: "Multi-tenant",
    description: "Tenants, isolamento e governança.",
    icon: Building2,
    path: "/settings/tenants",
    status: "Ativo",
  },
  {
    title: "Branding",
    description: "Logo, cores, domínio e white label.",
    icon: Palette,
    path: "/settings/branding",
    status: "Planejado",
  },
  {
    title: "Países e Fiscal",
    description: "Regras fiscais e campos obrigatórios.",
    icon: Globe2,
    path: "/settings/countries",
    status: "Planejado",
  },
  {
    title: "Integrações",
    description: "APIs, pagamentos, POS e mensageria.",
    icon: PlugZap,
    path: "/settings/integrations",
    status: "Planejado",
  },
  {
    title: "Rede Local",
    description: "Links, roteadores e agente local.",
    icon: Network,
    path: "/settings/network",
    status: "Planejado",
  },
  {
    title: "Hardware",
    description: "POS, catracas, impressoras e IoT.",
    icon: HardDrive,
    path: "/settings/hardware",
    status: "Planejado",
  },
  {
    title: "Auditoria e Logs",
    description: "Logs, ações críticas e observabilidade.",
    icon: Activity,
    path: "/settings/audit",
    status: "Parcial",
  },
  {
    title: "Políticas",
    description: "LGPD, RGPD, backup e retenção.",
    icon: FileText,
    path: "/settings/policies",
    status: "Planejado",
  },
]

export function SettingsPage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-4">
      <section className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-sm text-primary font-semibold">
            <Settings size={16} />
            Núcleo de Governança
          </span>

          <h2 className="text-2xl xl:text-3xl font-bold mt-1">
            Configurações
          </h2>

          <p className="text-muted mt-2 text-sm max-w-4xl">
            Central executiva para usuários, perfis, permissões, tenants,
            internacionalização, segurança, branding, integrações e compliance.
          </p>
        </div>

        <button
          onClick={() => navigate("/settings/audit")}
          className="bg-card border border-border px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition text-sm"
        >
          <Activity size={15} />
          Ver auditoria
        </button>
      </section>

      <section className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <SummaryCard title="Governança" value="14 módulos" icon={SlidersHorizontal} />
        <SummaryCard title="Segurança" value="JWT + ACL" icon={ShieldCheck} />
        <SummaryCard title="Compliance" value="LGPD/RGPD" icon={FileText} />
        <SummaryCard title="Operação" value="Enterprise" icon={CheckCircle2} />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-3">
        {settingsSections.map((section) => {
          const Icon = section.icon

          return (
            <button
              key={section.path}
              onClick={() => navigate(section.path)}
              className="group text-left surface-premium rounded-2xl p-4 hover:border-primary/50 hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="icon-tile">
                  <Icon size={19} strokeWidth={2} />
                </div>

                <span className="text-[11px] bg-cardSoft rounded-full px-2.5 py-1 text-muted shadow-card">
                  {section.status}
                </span>
              </div>

              <h3 className="font-semibold mt-4">
                {section.title}
              </h3>

              <p className="text-sm text-muted mt-2 line-clamp-2 min-h-[40px]">
                {section.description}
              </p>
            </button>
          )
        })}
      </section>
    </div>
  )
}

function SummaryCard({
  title,
  value,
  icon: Icon,
}: {
  title: string
  value: string
  icon: LucideIcon
}) {
  return (
    <div className="surface-premium rounded-2xl p-3 hover:border-primary/50 transition">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-muted">
            {title}
          </p>

          <strong className="text-lg text-primary block mt-1 truncate">
            {value}
          </strong>
        </div>

        <div className="icon-tile">
          <Icon size={18} strokeWidth={2} />
        </div>
      </div>
    </div>
  )
}