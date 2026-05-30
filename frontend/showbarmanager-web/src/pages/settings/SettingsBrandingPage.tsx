import type { LucideIcon } from "lucide-react"
import {
  Edit,
  Globe2,
  Image,
  MonitorSmartphone,
  Palette,
  Save,
} from "lucide-react"

const brandingItems = [
  {
    title: "Logo",
    description: "Marca principal, variações e favicon.",
    value: "White label",
    icon: Image,
  },
  {
    title: "Cores",
    description: "Paleta visual do tenant ou ambiente global.",
    value: "Tema neon ativo",
    icon: Palette,
  },
  {
    title: "Domínio",
    description: "Domínio próprio ou subdomínio personalizado.",
    value: "Preparado",
    icon: Globe2,
  },
  {
    title: "Portal",
    description: "Login, dashboard e portal personalizado.",
    value: "Planejado",
    icon: MonitorSmartphone,
  },
]

export function SettingsBrandingPage() {
  return (
    <div className="space-y-5">
      <section className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-sm text-neon font-semibold">
            <Palette size={16} />
            Configurações
          </span>

          <h2 className="text-3xl xl:text-4xl font-bold mt-1">
            Branding
          </h2>

          <p className="text-muted mt-2">
            Personalização visual, white label, domínio, login e identidade da plataforma.
          </p>
        </div>

        <button className="bg-neon text-black font-semibold px-5 py-3 rounded-full flex items-center justify-center gap-2 hover:shadow-neon transition text-sm">
          <Save size={16} />
          Salvar branding
        </button>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {brandingItems.map((item) => (
          <BrandingCard key={item.title} {...item} />
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="text-xl font-semibold">Identidade visual</h3>
        <p className="text-sm text-muted mt-1">
          Campos preparados para futura integração com upload de logo e temas por tenant.
        </p>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-5">
          <Field label="Nome público" value="ShowbarManager" />
          <Field label="Cor principal" value="#39FF14" />
          <Field label="Subdomínio" value="app.showbarmanager.com" />
          <Field label="Tema" value="Dark Neon Premium" />
        </div>
      </div>
    </div>
  )
}

function BrandingCard({
  title,
  description,
  value,
  icon: Icon,
}: {
  title: string
  description: string
  value: string
  icon: LucideIcon
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover:border-neon/70 transition">
      <div className="flex items-start justify-between gap-4">
        <Icon className="text-neon" size={24} />

        <button className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:border-neon hover:text-neon transition">
          <Edit size={14} />
        </button>
      </div>

      <h3 className="font-semibold mt-4">{title}</h3>
      <p className="text-sm text-muted mt-2">{description}</p>
      <p className="text-neon font-semibold mt-4">{value}</p>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-background border border-border rounded-2xl p-4">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <strong className="text-neon">{value}</strong>
    </div>
  )
}