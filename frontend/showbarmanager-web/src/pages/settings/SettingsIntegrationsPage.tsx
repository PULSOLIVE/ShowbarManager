import type { LucideIcon } from "lucide-react"
import {
  Edit,
  Link2,
  PlugZap,
  RefreshCcw,
  Save,
  Trash2,
} from "lucide-react"
import { useTranslation } from "../../hooks/useTranslation"

interface IntegrationItem {
  name: string
  status: string
  description: string
  icon: LucideIcon
}

export function SettingsIntegrationsPage() {
  const { t } = useTranslation()

  const integrations: IntegrationItem[] = [
    {
      name: "WhatsApp",
      status: t("status.planned"),
      description: t("integrations.whatsappDescription"),
      icon: PlugZap,
    },
    {
      name: "Meta",
      status: t("status.planned"),
      description: t("integrations.metaDescription"),
      icon: PlugZap,
    },
    {
      name: "Google",
      status: t("status.planned"),
      description: t("integrations.googleDescription"),
      icon: PlugZap,
    },
    {
      name: "Stripe",
      status: t("status.planned"),
      description: t("integrations.stripeDescription"),
      icon: PlugZap,
    },
    {
      name: "MBWay",
      status: t("status.planned"),
      description: t("integrations.mbwayDescription"),
      icon: PlugZap,
    },
    {
      name: "Multibanco",
      status: t("status.planned"),
      description: t("integrations.multibancoDescription"),
      icon: PlugZap,
    },
    {
      name: "POS",
      status: t("status.prepared"),
      description: t("integrations.posDescription"),
      icon: PlugZap,
    },
    {
      name: t("integrations.externalApi"),
      status: t("status.prepared"),
      description: t("integrations.externalApiDescription"),
      icon: Link2,
    },
  ]

  return (
    <div className="space-y-4">
      <section className="surface-premium rounded-2xl p-4 lg:p-5">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-sm text-primary font-semibold">
              <PlugZap size={16} />
              {t("settings.title")}
            </span>

            <h2 className="text-2xl xl:text-3xl font-bold mt-1">
              {t("integrations.title")}
            </h2>

            <p className="text-muted mt-2 text-sm max-w-4xl">
              {t("integrations.subtitle")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button className="bg-cardSoft border border-border px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition text-sm">
              <RefreshCcw size={15} />
              {t("integrations.testConnections")}
            </button>

            <button className="bg-primary text-white font-semibold px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:shadow-neon transition text-sm">
              <Save size={15} />
              {t("integrations.saveIntegrations")}
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
}: IntegrationItem) {
  const { t } = useTranslation()

  return (
    <article className="surface-premium rounded-2xl p-4 min-h-[150px] hover:border-primary/50 transition">
      <div className="flex items-start justify-between gap-3">
        <div className="w-9 h-9 rounded-2xl bg-primarySoft flex items-center justify-center shrink-0">
          <Icon className="text-primary" size={18} />
        </div>

        <div className="flex items-center gap-1">
          <button
            className="w-8 h-8 rounded-full bg-cardSoft border border-border flex items-center justify-center hover:border-primary hover:text-primary transition"
            title={t("common.edit")}
          >
            <Edit size={14} />
          </button>

          <button
            className="w-8 h-8 rounded-full bg-cardSoft border border-border flex items-center justify-center hover:border-danger hover:text-danger transition"
            title={t("common.delete")}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <h3 className="font-semibold mt-4">{name}</h3>

      <p className="text-primary text-sm font-semibold mt-1">{status}</p>

      <p className="text-xs text-muted mt-2 leading-relaxed line-clamp-2">
        {description}
      </p>
    </article>
  )
}