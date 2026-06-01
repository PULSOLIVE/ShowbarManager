import { useState } from "react"
import { useNavigate } from "react-router-dom"
import type { LucideIcon } from "lucide-react"
import {
  Activity,
  Building2,
  CheckCircle2,
  FileText,
  Flag,
  Globe2,
  HardDrive,
  KeyRound,
  Languages,
  Network,
  Palette,
  PlugZap,
  Save,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  UserCog,
  Users,
} from "lucide-react"

interface SettingsSection {
  key: string
  title: string
  description: string
  icon: LucideIcon
  path?: string
}

interface CountryRule {
  country: string
  icon: LucideIcon
  items: string[]
}

interface ActionItem {
  label: string
  path?: string
  section?: string
}

const settingsSections: SettingsSection[] = [
  {
    key: "overview",
    title: "Visão Geral",
    description: "Painel executivo do núcleo de configurações.",
    icon: SlidersHorizontal,
  },
  {
    key: "users",
    title: "Usuários",
    description: "Gestão de usuários, acessos, status e vínculos.",
    icon: Users,
    path: "/settings/users",
  },
  {
    key: "profiles",
    title: "Perfis e Grupos",
    description: "Perfis, grupos, hierarquias e níveis de acesso.",
    icon: UserCog,
    path: "/settings/profiles",
  },
  {
    key: "permissions",
    title: "Permissões",
    description: "Permissões por módulo, ação, campo, evento, país e ambiente.",
    icon: KeyRound,
    path: "/settings/permissions",
  },
  {
    key: "internationalization",
    title: "Internacionalização",
    description: "Países, idiomas, moedas, fusos horários, formatos regionais e bandeiras.",
    icon: Languages,
    path: "/settings/internationalization",
  },
  {
    key: "security",
    title: "Segurança",
    description: "MFA, 2FA, políticas de senha, sessões e dispositivos.",
    icon: ShieldCheck,
    path: "/settings/security",
  },
  {
    key: "sessions",
    title: "Sessões",
    description: "Sessões ativas, privilegiadas, auditoria e rastreabilidade.",
    icon: Activity,
    path: "/settings/sessions",
  },
  {
    key: "tenant",
    title: "Multi-tenant",
    description: "Multiempresa, tenants, isolamento e governança.",
    icon: Building2,
    path: "/settings/tenants",
  },
  {
    key: "branding",
    title: "Branding",
    description: "Logo, cores, white label, domínio, tema e portal.",
    icon: Palette,
    path: "/settings/branding",
  },
  {
    key: "international",
    title: "Países e Fiscal",
    description: "Campos obrigatórios, impostos, moedas e regras por país.",
    icon: Globe2,
    path: "/settings/countries",
  },
  {
    key: "integrations",
    title: "Integrações",
    description: "WhatsApp, Meta, Google, Stripe, MBWay, POS e APIs.",
    icon: PlugZap,
    path: "/settings/integrations",
  },
  {
    key: "network",
    title: "Rede Local",
    description: "Links, roteadores, servidores locais, agente local e failover.",
    icon: Network,
    path: "/settings/network",
  },
  {
    key: "hardware",
    title: "Hardware",
    description: "POS, catracas, impressoras, QR Code, RFID, NFC e IoT.",
    icon: HardDrive,
    path: "/settings/hardware",
  },
  {
    key: "audit",
    title: "Auditoria e Logs",
    description: "Logs, sessões privilegiadas, ações críticas e observabilidade.",
    icon: Activity,
    path: "/settings/audit",
  },
  {
    key: "policies",
    title: "Políticas",
    description: "LGPD, RGPD, retenção, backup, exportação e compliance.",
    icon: FileText,
    path: "/settings/policies",
  },
]

const countryRules: CountryRule[] = [
  {
    country: "Portugal",
    icon: Flag,
    items: [
      "NIF/NIPC",
      "Morada",
      "Código postal",
      "IBAN/NIB",
      "Regime de IVA",
      "ATCUD",
      "QR Code fiscal",
      "SAF-T PT",
    ],
  },
  {
    country: "Brasil",
    icon: Flag,
    items: [
      "CPF/CNPJ",
      "Inscrição estadual",
      "Inscrição municipal",
      "CEP",
      "PIX",
      "Boleto",
      "NFS-e",
      "RPS",
    ],
  },
]

export function SettingsPage() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState("overview")

  const currentSection =
    settingsSections.find((section) => section.key === activeSection) ||
    settingsSections[0]

  const CurrentIcon = currentSection.icon

  function handleSectionClick(section: SettingsSection) {
    if (section.path) {
      navigate(section.path)
      return
    }

    setActiveSection(section.key)
  }

  return (
    <div className="space-y-5">
      <section className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-sm text-neon font-semibold">
            <Settings size={16} />
            Núcleo de Governança
          </span>

          <h2 className="text-3xl xl:text-4xl font-bold mt-1">
            Configurações
          </h2>

          <p className="text-muted mt-2 text-sm xl:text-base max-w-4xl">
            Painel central de parametrização, segurança, permissões, usuários,
            tenants, idiomas, branding, compliance, integrações, infraestrutura
            local, auditoria e políticas enterprise.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/settings/audit")}
            className="bg-background border border-border px-5 py-3 rounded-full flex items-center justify-center gap-2 hover:border-neon hover:text-neon transition text-sm"
          >
            <Activity size={16} />
            Ver logs
          </button>

          <button className="bg-neon text-black font-semibold px-5 py-3 rounded-full flex items-center justify-center gap-2 hover:shadow-neon transition text-sm">
            <Save size={16} />
            Salvar ajustes
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <SummaryCard title="Governança" value="15 seções" icon={Settings} />
        <SummaryCard title="Segurança" value="JWT + ACL" icon={ShieldCheck} />
        <SummaryCard title="Compliance" value="LGPD/RGPD" icon={FileText} />
        <SummaryCard title="Ambiente" value="Enterprise SaaS" icon={CheckCircle2} />
      </section>

      <section className="grid grid-cols-1 2xl:grid-cols-[300px_1fr] gap-5">
        <aside className="bg-card border border-border rounded-2xl p-4 h-fit">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-wide text-muted">
              Central de configuração
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-1 gap-2">
            {settingsSections.map((section) => {
              const Icon = section.icon
              const active = activeSection === section.key

              return (
                <button
                  key={section.key}
                  onClick={() => handleSectionClick(section)}
                  className={[
                    "w-full text-left rounded-2xl px-3 py-3 transition-all flex items-center gap-3",
                    active
                      ? "bg-neon text-black shadow-neon"
                      : "bg-background border border-border text-muted hover:text-text hover:border-neon/60",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                      active ? "bg-black/10" : "bg-white/5 border border-border",
                    ].join(" ")}
                  >
                    <Icon size={16} />
                  </div>

                  <div className="min-w-0">
                    <strong className="block text-sm truncate">
                      {section.title}
                    </strong>

                    <span
                      className={[
                        "block text-xs mt-1 leading-relaxed truncate",
                        active ? "text-black/70" : "text-muted",
                      ].join(" ")}
                    >
                      {section.description}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </aside>

        <main className="space-y-5">
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <span className="inline-flex items-center gap-2 text-sm text-neon font-semibold">
                  <CurrentIcon size={16} />
                  {currentSection.title}
                </span>

                <h3 className="text-2xl font-bold mt-1">
                  {currentSection.title}
                </h3>

                <p className="text-muted mt-2 text-sm">
                  {currentSection.description}
                </p>
              </div>

              <div className="w-11 h-11 rounded-2xl bg-neon/10 border border-neon/20 flex items-center justify-center">
                <CurrentIcon className="text-neon" size={22} />
              </div>
            </div>

            {activeSection === "overview" && (
              <SettingsOverviewSection
                navigate={navigate}
                setActiveSection={setActiveSection}
              />
            )}

            {activeSection === "users" && <SettingsUsersSection />}
            {activeSection === "profiles" && <SettingsProfilesSection />}
            {activeSection === "permissions" && <SettingsPermissionsSection />}
            {activeSection === "security" && <SettingsSecuritySection />}
            {activeSection === "tenant" && <SettingsTenantSection />}
            {activeSection === "branding" && <SettingsBrandingSection />}
            {activeSection === "international" && <SettingsInternationalSection />}
            {activeSection === "integrations" && <SettingsIntegrationsSection />}
            {activeSection === "network" && <SettingsNetworkSection />}
            {activeSection === "hardware" && <SettingsHardwareSection />}
            {activeSection === "audit" && <SettingsAuditSection />}
            {activeSection === "policies" && <SettingsPoliciesSection />}
          </div>
        </main>
      </section>
    </div>
  )
}

function SettingsOverviewSection({
  navigate,
  setActiveSection,
}: {
  navigate: (path: string) => void
  setActiveSection: (section: string) => void
}) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <ActionPanel
        title="Governança e Acesso"
        description="Controle de usuários, grupos, perfis, hierarquias e permissões."
        actions={[
          { label: "Gerenciar usuários", path: "/settings/users" },
          { label: "Gerenciar perfis", path: "/settings/profiles" },
          { label: "Mapear permissões", path: "/settings/permissions" },
          { label: "Internacionalização", path: "/settings/internationalization" },
        ]}
        navigate={navigate}
        setActiveSection={setActiveSection}
      />

      <ActionPanel
        title="Segurança Operacional"
        description="Políticas de senha, MFA, sessões, IPs, dispositivos e ações críticas."
        actions={[
          { label: "Configurar MFA", path: "/settings/security" },
          { label: "Auditar sessões", path: "/settings/sessions" },
          { label: "Políticas de senha", section: "security" },
        ]}
        navigate={navigate}
        setActiveSection={setActiveSection}
      />

      <ActionPanel
        title="Infraestrutura Local"
        description="Agente local, servidores, rede, links, POS, catracas e redundância."
        actions={[
          { label: "Cadastrar agente", path: "/settings/network" },
          { label: "Monitorar rede", path: "/settings/network" },
          { label: "Mapear hardware", path: "/settings/hardware" },
        ]}
        navigate={navigate}
        setActiveSection={setActiveSection}
      />

      <ActionPanel
        title="Compliance e Países"
        description="LGPD, RGPD, campos obrigatórios por país, moedas, fusos e regras fiscais."
        actions={[
          { label: "Internacionalização", path: "/settings/internationalization" },
          { label: "Portugal", path: "/settings/countries" },
          { label: "Brasil", path: "/settings/countries" },
          { label: "Políticas globais", path: "/settings/policies" },
        ]}
        navigate={navigate}
        setActiveSection={setActiveSection}
      />
    </div>
  )
}

function SettingsUsersSection() {
  const users = [
    "Usuário comum",
    "Usuário operacional",
    "Usuário financeiro",
    "Usuário técnico",
    "Usuário administrativo",
    "Usuário auditoria",
    "Usuário expositor",
    "Usuário fornecedor",
    "Usuário imprensa",
    "Usuário parceiro",
    "Usuário segurança",
    "Usuário saúde",
    "Usuário bilheteria",
    "Usuário logística",
    "Usuário desenvolvedor",
    "Usuário master",
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {users.map((user) => (
        <SettingPill key={user} label={user} />
      ))}
    </div>
  )
}

function SettingsProfilesSection() {
  const profiles = [
    "Administrador Global",
    "Super Usuário Master",
    "Usuário Desenvolvedor Master",
    "Auditoria Interna",
    "Compliance Officer",
    "Suporte Nível 1",
    "Suporte Nível 2",
    "Suporte Nível 3",
    "Customer Success",
    "Financeiro Global",
    "DevOps",
    "SRE",
    "Administrador do Tenant",
    "Administrador do Evento",
    "Gestor de Bilheteria",
    "Gestor de Segurança",
    "Gestor de Saúde",
    "Gestor de Logística",
    "Gestor de Bar",
    "Gestor Técnico",
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {profiles.map((profile) => (
        <SettingPill key={profile} label={profile} />
      ))}
    </div>
  )
}

function SettingsPermissionsSection() {
  const permissions = [
    "Permissão por módulo",
    "Permissão por ação",
    "Permissão por campo",
    "Permissão por empresa",
    "Permissão por tenant",
    "Permissão por evento",
    "Permissão por setor",
    "Permissão por operação",
    "Permissão por ambiente",
    "Permissão por país",
    "Permissão por tipo de produtor",
    "Permissão temporária",
    "Permissão por horário",
    "Permissão por dispositivo",
    "Permissão geográfica",
    "Permissão por IP",
    "Permissão contextual",
    "Aprovação de ações críticas",
    "Workflow de aprovação",
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {permissions.map((item) => (
        <SettingPill key={item} label={item} />
      ))}
    </div>
  )
}

function SettingsSecuritySection() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <SettingCard title="2FA/MFA" value="Planejado" />
      <SettingCard title="Política de senha" value="Enterprise" />
      <SettingCard title="Controle de IP" value="Preparado" />
      <SettingCard title="Sessões privilegiadas" value="Monitoradas" />
      <SettingCard title="Device fingerprint" value="Futuro" />
      <SettingCard title="Antifraude" value="Operacional futuro" />
    </div>
  )
}

function SettingsTenantSection() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <SettingCard title="Multiempresa" value="Ativo" />
      <SettingCard title="Multi-tenant" value="Ativo" />
      <SettingCard title="Isolamento" value="Tenant ID" />
      <SettingCard title="Cross-tenant" value="Somente Master" />
      <SettingCard title="Impersonate" value="Planejado" />
      <SettingCard title="Modo suporte" value="Planejado" />
    </div>
  )
}

function SettingsBrandingSection() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <SettingCard title="Logo" value="White label" />
      <SettingCard title="Cores" value="Tema customizável" />
      <SettingCard title="Domínio" value="Preparado" />
      <SettingCard title="Subdomínio" value="Preparado" />
      <SettingCard title="Login personalizado" value="Planejado" />
      <SettingCard title="Portal personalizado" value="Planejado" />
    </div>
  )
}

function SettingsInternationalSection() {
  return (
    <div className="space-y-4">
      {countryRules.map((rule) => {
        const Icon = rule.icon

        return (
          <div
            key={rule.country}
            className="bg-background border border-border rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Icon size={17} className="text-neon" />
              <strong>{rule.country}</strong>
            </div>

            <div className="flex flex-wrap gap-2">
              {rule.items.map((item) => (
                <SettingPill key={item} label={item} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function SettingsIntegrationsSection() {
  const items = [
    "WhatsApp",
    "Meta",
    "Google",
    "Stripe",
    "MBWay",
    "Multibanco",
    "Catracas",
    "POS",
    "RFID",
    "Hardware",
    "API externa",
    "Agente local",
    "Servidor local",
    "Monitoramento técnico",
    "Observabilidade",
    "Prometheus",
    "Grafana",
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {items.map((item) => (
        <SettingPill key={item} label={item} />
      ))}
    </div>
  )
}

function SettingsNetworkSection() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <SettingCard title="Link principal" value="Preparado" />
      <SettingCard title="Link backup" value="Preparado" />
      <SettingCard title="Servidor local" value="Planejado" />
      <SettingCard title="Agente local" value="Planejado" />
      <SettingCard title="Failover" value="Futuro" />
      <SettingCard title="SNMP" value="Futuro" />
    </div>
  )
}

function SettingsHardwareSection() {
  const items = [
    "POS",
    "Catracas",
    "Impressoras térmicas",
    "Leitores QR Code",
    "Leitores RFID",
    "NFC",
    "Balanças",
    "Totens",
    "Tablets",
    "Smartphones",
    "Roteadores",
    "Switches",
    "Servidor local",
    "Agente local",
    "Câmeras futuramente",
    "IoT futuramente",
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {items.map((item) => (
        <SettingPill key={item} label={item} />
      ))}
    </div>
  )
}

function SettingsAuditSection() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <SettingCard title="Logs estruturados" value="Ativo" />
      <SettingCard title="Auditoria" value="Parcial" />
      <SettingCard title="Sessões privilegiadas" value="Planejado" />
      <SettingCard title="Ações críticas" value="Planejado" />
      <SettingCard title="Observabilidade" value="Preparado" />
      <SettingCard title="Tracing" value="Futuro" />
    </div>
  )
}

function SettingsPoliciesSection() {
  const policies = [
    "LGPD",
    "RGPD",
    "Retenção documental",
    "Retenção de logs",
    "Políticas de acesso",
    "Políticas de exportação",
    "Políticas financeiras",
    "Políticas fiscais",
    "Políticas de rede",
    "Políticas de segurança operacional",
    "Políticas de auditoria",
    "Políticas de backup",
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {policies.map((policy) => (
        <SettingPill key={policy} label={policy} />
      ))}
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
    <div className="bg-card border border-border rounded-2xl p-4 hover:border-neon/70 transition">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">
            {title}
          </p>

          <strong className="text-lg text-neon">
            {value}
          </strong>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-neon/10 border border-neon/20 flex items-center justify-center">
          <Icon size={19} className="text-neon" />
        </div>
      </div>
    </div>
  )
}

function ActionPanel({
  title,
  description,
  actions,
  navigate,
  setActiveSection,
}: {
  title: string
  description: string
  actions: ActionItem[]
  navigate: (path: string) => void
  setActiveSection: (section: string) => void
}) {
  function handleAction(action: ActionItem) {
    if (action.path) {
      navigate(action.path)
      return
    }

    if (action.section) {
      setActiveSection(action.section)
    }
  }

  return (
    <div className="bg-background border border-border rounded-2xl p-5">
      <h4 className="text-lg font-semibold">
        {title}
      </h4>

      <p className="text-sm text-muted mt-2 leading-relaxed">
        {description}
      </p>

      <div className="flex flex-wrap gap-2 mt-4">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => handleAction(action)}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted hover:border-neon hover:text-neon transition"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function SettingCard({
  title,
  value,
}: {
  title: string
  value: string
}) {
  return (
    <div className="bg-background border border-border rounded-2xl p-4">
      <p className="text-xs uppercase tracking-wide text-muted">
        {title}
      </p>

      <strong className="text-base text-neon">
        {value}
      </strong>
    </div>
  )
}

function SettingPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-background border border-border px-4 py-2 text-sm text-muted">
      {label}
    </span>
  )
}