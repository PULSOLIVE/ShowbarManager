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
import { useTranslation } from "../../hooks/useTranslation"

interface NetworkItem {
  title: string
  value: string
  description: string
  icon: LucideIcon
}

export function SettingsNetworkPage() {
  const { t } = useTranslation()

  const networkItems: NetworkItem[] = [
    {
      title: t("network.mainLink"),
      value: t("status.prepared"),
      description: t("network.mainLinkDescription"),
      icon: Wifi,
    },
    {
      title: t("network.backupLink"),
      value: t("status.prepared"),
      description: t("network.backupLinkDescription"),
      icon: Wifi,
    },
    {
      title: t("network.router"),
      value: t("status.planned"),
      description: t("network.routerDescription"),
      icon: Router,
    },
    {
      title: t("network.localServer"),
      value: t("status.planned"),
      description: t("network.localServerDescription"),
      icon: Server,
    },
    {
      title: t("network.localAgent"),
      value: t("status.planned"),
      description: t("network.localAgentDescription"),
      icon: Network,
    },
    {
      title: t("network.failover"),
      value: t("status.future"),
      description: t("network.failoverDescription"),
      icon: Network,
    },
  ]

  return (
    <div className="space-y-4">
      <section className="surface-premium rounded-2xl p-4 lg:p-5">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-sm text-primary font-semibold">
              <Network size={16} />
              {t("settings.title")}
            </span>

            <h2 className="text-2xl xl:text-3xl font-bold mt-1">
              {t("network.title")}
            </h2>

            <p className="text-muted mt-2 text-sm max-w-4xl">
              {t("network.subtitle")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button className="bg-cardSoft border border-border px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition text-sm">
              <Plus size={15} />
              {t("network.newDevice")}
            </button>

            <button className="bg-primary text-white font-semibold px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:shadow-neon transition text-sm">
              <Save size={15} />
              {t("network.saveNetwork")}
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {networkItems.map((item) => (
          <NetworkCard key={item.title} {...item} />
        ))}
      </section>
    </div>
  )
}

function NetworkCard({
  title,
  value,
  description,
  icon: Icon,
}: NetworkItem) {
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

      <h3 className="font-semibold mt-4">{title}</h3>

      <p className="text-primary text-sm font-semibold mt-1">{value}</p>

      <p className="text-xs text-muted mt-2 leading-relaxed line-clamp-2">
        {description}
      </p>
    </article>
  )
}