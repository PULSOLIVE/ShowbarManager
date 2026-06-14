import type { LucideIcon } from "lucide-react"
import {
  Barcode,
  Edit,
  HardDrive,
  Plus,
  Printer,
  Save,
  Smartphone,
  Trash2,
} from "lucide-react"
import { useTranslation } from "../../hooks/useTranslation"

interface HardwareItem {
  title: string
  status: string
  description: string
  icon: LucideIcon
}

export function SettingsHardwarePage() {
  const { t } = useTranslation()

  const hardwareItems: HardwareItem[] = [
    {
      title: "POS",
      status: t("status.prepared"),
      description: t("hardware.posDescription"),
      icon: Smartphone,
    },
    {
      title: t("hardware.turnstiles"),
      status: t("status.planned"),
      description: t("hardware.turnstilesDescription"),
      icon: Barcode,
    },
    {
      title: t("hardware.thermalPrinters"),
      status: t("status.planned"),
      description: t("hardware.thermalPrintersDescription"),
      icon: Printer,
    },
    {
      title: t("hardware.qrReaders"),
      status: t("status.planned"),
      description: t("hardware.qrReadersDescription"),
      icon: Barcode,
    },
    {
      title: "RFID",
      status: t("status.future"),
      description: t("hardware.rfidDescription"),
      icon: HardDrive,
    },
    {
      title: "NFC",
      status: t("status.future"),
      description: t("hardware.nfcDescription"),
      icon: Smartphone,
    },
    {
      title: t("hardware.kiosks"),
      status: t("status.future"),
      description: t("hardware.kiosksDescription"),
      icon: HardDrive,
    },
    {
      title: "IoT",
      status: t("status.future"),
      description: t("hardware.iotDescription"),
      icon: HardDrive,
    },
  ]

  return (
    <div className="space-y-4">
      <section className="surface-premium rounded-2xl p-4 lg:p-5">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-sm text-primary font-semibold">
              <HardDrive size={16} />
              {t("settings.title")}
            </span>

            <h2 className="text-2xl xl:text-3xl font-bold mt-1">
              {t("hardware.title")}
            </h2>

            <p className="text-muted mt-2 text-sm max-w-4xl">
              {t("hardware.subtitle")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button className="bg-cardSoft border border-border px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition text-sm">
              <Plus size={15} />
              {t("hardware.newHardware")}
            </button>

            <button className="bg-primary text-white font-semibold px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:shadow-neon transition text-sm">
              <Save size={15} />
              {t("hardware.saveHardware")}
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {hardwareItems.map((item) => (
          <HardwareCard key={item.title} {...item} />
        ))}
      </section>
    </div>
  )
}

function HardwareCard({
  title,
  status,
  description,
  icon: Icon,
}: HardwareItem) {
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

      <h3 className="font-semibold mt-4">
        {title}
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