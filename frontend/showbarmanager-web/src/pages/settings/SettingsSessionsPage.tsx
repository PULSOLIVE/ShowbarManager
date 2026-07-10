import type { LucideIcon } from "lucide-react"
import {
  Clock3,
  Monitor,
  RefreshCcw,
  ShieldCheck,
  UserCircle,
} from "lucide-react"
import { useTranslation } from "../../hooks/useTranslation"

interface SessionMetric {
  title: string
  value: string
  description: string
  icon: LucideIcon
}

export function SettingsSessionsPage() {
  const { t } = useTranslation()

  const sessionMetrics: SessionMetric[] = [
    {
      title: t("sessions.activeSessions"),
      value: "0",
      description: t("sessions.activeSessionsDescription"),
      icon: Monitor,
    },
    {
      title: t("sessions.masterSessions"),
      value: "0",
      description: t("sessions.masterSessionsDescription"),
      icon: ShieldCheck,
    },
    {
      title: t("sessions.averageTime"),
      value: "0 min",
      description: t("sessions.averageTimeDescription"),
      icon: Clock3,
    },
    {
      title: t("sessions.onlineUsers"),
      value: "0",
      description: t("sessions.onlineUsersDescription"),
      icon: UserCircle,
    },
  ]

  return (
    <div className="space-y-4">
      <section className="surface-premium rounded-2xl p-4 lg:p-5">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-sm text-primary font-semibold">
              <Monitor size={16} />
              {t("settings.title")}
            </span>

            <h2 className="text-2xl xl:text-3xl font-bold mt-1">
              {t("sessions.title")}
            </h2>

            <p className="text-muted mt-2 text-sm max-w-4xl">
              {t("sessions.subtitle")}
            </p>
          </div>

          <button className="bg-cardSoft border border-border px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition text-sm">
            <RefreshCcw size={15} />
            {t("sessions.refreshSessions")}
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {sessionMetrics.map((item) => (
          <SessionCard key={item.title} {...item} />
        ))}
      </section>
    </div>
  )
}

function SessionCard({
  title,
  value,
  description,
  icon: Icon,
}: SessionMetric) {
  return (
    <div className="surface-premium rounded-2xl p-4 min-h-[126px] hover:border-primary/50 transition">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted">
            {title}
          </p>

          <strong className="text-2xl text-primary block mt-1">
            {value}
          </strong>
        </div>

        <div className="w-9 h-9 rounded-2xl bg-primarySoft flex items-center justify-center shrink-0">
          <Icon className="text-primary" size={18} />
        </div>
      </div>

      <p className="text-xs text-muted leading-relaxed line-clamp-2">
        {description}
      </p>
    </div>
  )
}