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
import { useTranslation } from "../../hooks/useTranslation"

interface SettingsSection {
  title: string
  description: string
  icon: LucideIcon
  path: string
  status: string
}

export function SettingsPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const settingsSections: SettingsSection[] = [
    {
      title: t("settings.usersTitle"),
      description: t("settings.usersDescription"),
      icon: Users,
      path: "/settings/users",
      status: t("common.active"),
    },
    {
      title: t("settings.tenantsTitle"),
      description: t("settings.tenantsDescription"),
      icon: Building2,
      path: "/settings/tenants",
      status: t("common.active"),
    },
    {
      title: t("settings.profilesGroupsTitle"),
      description: t("settings.profilesGroupsDescription"),
      icon: UserCog,
      path: "/settings/profiles",
      status: t("common.active"),
    },
    {
      title: t("settings.permissionsTitle"),
      description: t("settings.permissionsDescription"),
      icon: KeyRound,
      path: "/settings/permissions",
      status: t("common.active"),
    },
    {
      title: t("settings.internationalizationTitle"),
      description: t("settings.internationalizationDescription"),
      icon: Languages,
      path: "/settings/internationalization",
      status: t("common.active"),
    },
    {
      title: t("settings.securityTitle"),
      description: t("settings.securityDescription"),
      icon: ShieldCheck,
      path: "/settings/security",
      status: t("settings.statusPlanned"),
    },
    {
      title: t("settings.sessionsTitle"),
      description: t("settings.sessionsDescription"),
      icon: Activity,
      path: "/settings/sessions",
      status: t("settings.statusPlanned"),
    },
    {
      title: t("settings.brandingTitle"),
      description: t("settings.brandingDescription"),
      icon: Palette,
      path: "/settings/branding",
      status: t("settings.statusPlanned"),
    },
    {
      title: t("settings.countriesTitle"),
      description: t("settings.countriesDescription"),
      icon: Globe2,
      path: "/settings/countries",
      status: t("settings.statusPlanned"),
    },
    {
      title: t("settings.integrationsTitle"),
      description: t("settings.integrationsDescription"),
      icon: PlugZap,
      path: "/settings/integrations",
      status: t("settings.statusPlanned"),
    },
    {
      title: t("settings.networkTitle"),
      description: t("settings.networkDescription"),
      icon: Network,
      path: "/settings/network",
      status: t("settings.statusPlanned"),
    },
    {
      title: t("settings.hardwareTitle"),
      description: t("settings.hardwareDescription"),
      icon: HardDrive,
      path: "/settings/hardware",
      status: t("settings.statusPlanned"),
    },
    {
      title: t("settings.auditLogsTitle"),
      description: t("settings.auditLogsDescription"),
      icon: Activity,
      path: "/settings/audit",
      status: t("settings.statusPartial"),
    },
    {
      title: t("settings.policiesTitle"),
      description: t("settings.policiesDescription"),
      icon: FileText,
      path: "/settings/policies",
      status: t("settings.statusPlanned"),
    },
  ]

  return (
    <div className="space-y-4">
      <section className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-sm text-primary font-semibold">
            <Settings size={16} />
            {t("settings.governanceCore")}
          </span>

          <h2 className="text-2xl xl:text-3xl font-bold mt-1">
            {t("settings.title")}
          </h2>

          <p className="text-muted mt-2 text-sm max-w-4xl">
            {t("settings.fullDescription")}
          </p>
        </div>

        <button
          onClick={() => navigate("/settings/audit")}
          className="bg-card border border-border px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition text-sm"
        >
          <Activity size={15} />
          {t("settings.viewAudit")}
        </button>
      </section>

      <section className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <SummaryCard
          title={t("settings.governance")}
          value="14 módulos"
          icon={SlidersHorizontal}
        />

        <SummaryCard
          title={t("settings.security")}
          value="JWT + RBAC"
          icon={ShieldCheck}
        />

        <SummaryCard
          title={t("settings.compliance")}
          value="LGPD/RGPD"
          icon={FileText}
        />

        <SummaryCard
          title={t("settings.operation")}
          value="Enterprise"
          icon={CheckCircle2}
        />
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