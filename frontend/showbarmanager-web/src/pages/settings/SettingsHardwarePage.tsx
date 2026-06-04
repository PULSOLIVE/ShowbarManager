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
  {
    title: "POS",
    status: "Preparado",
    description: "Terminais de venda para operação presencial.",
    icon: Smartphone,
  },
  {
    title: "Catracas",
    status: "Planejado",
    description: "Controle de acesso físico por evento ou setor.",
    icon: Barcode,
  },
  {
    title: "Impressoras térmicas",
    status: "Planejado",
    description: "Impressão de comprovantes, pedidos e etiquetas.",
    icon: Printer,
  },
  {
    title: "Leitores QR Code",
    status: "Planejado",
    description: "Validação de ingressos, vouchers e comandas.",
    icon: Barcode,
  },
  {
    title: "RFID",
    status: "Futuro",
    description: "Pulseiras, cartões e identificação por proximidade.",
    icon: HardDrive,
  },
  {
    title: "NFC",
    status: "Futuro",
    description: "Pagamentos e identificação por aproximação.",
    icon: Smartphone,
  },
  {
    title: "Totens",
    status: "Futuro",
    description: "Autoatendimento, check-in e venda assistida.",
    icon: HardDrive,
  },
  {
    title: "IoT",
    status: "Futuro",
    description: "Dispositivos inteligentes integrados à operação.",
    icon: HardDrive,
  },
]

export function SettingsHardwarePage() {
  return (
    <div className="space-y-4">
      <section className="surface-premium rounded-2xl p-4 lg:p-5">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-sm text-primary font-semibold">
              <HardDrive size={16} />
              Configurações
            </span>

            <h2 className="text-2xl xl:text-3xl font-bold mt-1">
              Hardware
            </h2>

            <p className="text-muted mt-2 text-sm max-w-4xl">
              POS, catracas, impressoras, QR Code, RFID, NFC, totens, tablets e IoT.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button className="bg-cardSoft border border-border px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition text-sm">
              <Plus size={15} />
              Novo hardware
            </button>

            <button className="bg-primary text-white font-semibold px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:shadow-neon transition text-sm">
              <Save size={15} />
              Salvar hardware
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
}: {
  title: string
  status: string
  description: string
  icon: LucideIcon
}) {
  return (
    <article className="surface-premium rounded-2xl p-4 min-h-[150px] hover:border-primary/50 transition">
      <div className="flex items-start justify-between gap-3">
        <div className="w-9 h-9 rounded-2xl bg-primarySoft flex items-center justify-center shrink-0">
          <Icon className="text-primary" size={18} />
        </div>

        <div className="flex items-center gap-1">
          <button
            className="w-8 h-8 rounded-full bg-cardSoft border border-border flex items-center justify-center hover:border-primary hover:text-primary transition"
            title="Editar"
          >
            <Edit size={14} />
          </button>

          <button
            className="w-8 h-8 rounded-full bg-cardSoft border border-border flex items-center justify-center hover:border-danger hover:text-danger transition"
            title="Excluir"
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