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

const hardwareItems = [
  { title: "POS", status: "Preparado", icon: Smartphone },
  { title: "Catracas", status: "Planejado", icon: Barcode },
  { title: "Impressoras térmicas", status: "Planejado", icon: Printer },
  { title: "Leitores QR Code", status: "Planejado", icon: Barcode },
  { title: "RFID", status: "Futuro", icon: HardDrive },
  { title: "NFC", status: "Futuro", icon: Smartphone },
  { title: "Totens", status: "Futuro", icon: HardDrive },
  { title: "IoT", status: "Futuro", icon: HardDrive },
]

export function SettingsHardwarePage() {
  return (
    <div className="space-y-5">
      <section className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-sm text-neon font-semibold">
            <HardDrive size={16} />
            Configurações
          </span>

          <h2 className="text-3xl xl:text-4xl font-bold mt-1">
            Hardware
          </h2>

          <p className="text-muted mt-2">
            POS, catracas, impressoras, QR Code, RFID, NFC, totens, tablets e IoT.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button className="bg-background border border-border px-5 py-3 rounded-full flex items-center justify-center gap-2 hover:border-neon hover:text-neon transition text-sm">
            <Plus size={16} />
            Novo hardware
          </button>

          <button className="bg-neon text-black font-semibold px-5 py-3 rounded-full flex items-center justify-center gap-2 hover:shadow-neon transition text-sm">
            <Save size={16} />
            Salvar hardware
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {hardwareItems.map((item) => (
          <HardwareCard key={item.title} {...item} />
        ))}
      </div>
    </div>
  )
}

function HardwareCard({
  title,
  status,
  icon: Icon,
}: {
  title: string
  status: string
  icon: LucideIcon
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover:border-neon/70 transition">
      <div className="flex items-start justify-between gap-4">
        <Icon className="text-neon" size={24} />

        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:border-neon hover:text-neon transition">
            <Edit size={14} />
          </button>

          <button className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:border-red-400 hover:text-red-300 transition">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <h3 className="font-semibold mt-4">{title}</h3>
      <p className="text-neon font-semibold mt-2">{status}</p>
    </div>
  )
}