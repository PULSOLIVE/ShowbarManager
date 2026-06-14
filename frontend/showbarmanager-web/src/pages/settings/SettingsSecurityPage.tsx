import type { LucideIcon } from "lucide-react"
import {
  Edit,
  Fingerprint,
  LockKeyhole,
  Save,
  ShieldCheck,
  Smartphone,
} from "lucide-react"
import { useTranslation } from "../../hooks/useTranslation"

interface SecurityItem {
  title: string
  value: string
  description: string
  icon: LucideIcon
}

export function SettingsSecurityPage() {
  const { t } = useTranslation()

  const securityItems: SecurityItem[] = [
    {
      title: "MFA",
      value: t("status.planned"),
      description: t("security.mfaDescription"),
      icon: ShieldCheck,
    },
    {
      title: t("security.passwordPolicy"),
      value: t("common.active"),
      description: t("security.passwordPolicyDescription"),
      icon: LockKeyhole,
    },
    {
      title: "Fingerprint",
      value: t("status.future"),
      description: t("security.fingerprintDescription"),
      icon: Fingerprint,
    },
    {
      title: t("security.devices"),
      value: t("status.monitored"),
      description: t("security.devicesDescription"),
      icon: Smartphone,
    },
  ]

  return (
    <div className="space-y-4">
      <section className="surface-premium rounded-2xl p-4 lg:p-5">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-sm text-primary font-semibold">
              <ShieldCheck size={16} />
              {t("settings.title")}
            </span>

            <h2 className="text-2xl xl:text-3xl font-bold mt-1">
              {t("security.title")}
            </h2>

            <p className="text-muted mt-2 text-sm max-w-4xl">
              {t("security.subtitle")}
            </p>
          </div>

          <button className="bg-primary text-white font-semibold px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:shadow-neon transition text-sm">
            <Save size={15} />
            {t("security.saveSecurity")}
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {securityItems.map((item) => (
          <SecurityCard key={item.title} {...item} />
        ))}
      </section>
    </div>
  )
}

function SecurityCard({
  title,
  value,
  description,
  icon: Icon,
}: SecurityItem) {
  const { t } = useTranslation()

  return (
    <div className="surface-premium rounded-2xl p-4 min-h-[150px] hover:border-primary/50 transition">
      <div className="flex items-start justify-between gap-3">
        <div className="w-9 h-9 rounded-2xl bg-primarySoft flex items-center justify-center shrink-0">
          <Icon className="text-primary" size={18} />
        </div>

        <button
          className="w-8 h-8 rounded-full bg-cardSoft border border-border flex items-center justify-center hover:border-primary hover:text-primary transition"
          title={t("common.edit")}
        >
          <Edit size={14} />
        </button>
      </div>

      <h3 className="font-semibold mt-4">{title}</h3>

      <p className="text-primary text-sm font-semibold mt-1">{value}</p>

      <p className="text-xs text-muted mt-2 leading-relaxed line-clamp-2">
        {description}
      </p>
    </div>
  )
}