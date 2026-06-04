import type { LucideIcon } from "lucide-react"
import {
  Edit,
  Fingerprint,
  LockKeyhole,
  Save,
  ShieldCheck,
  Smartphone,
} from "lucide-react"

const securityItems = [
  {
    title: "MFA",
    value: "Planejado",
    description: "Autenticação multifator para acessos sensíveis.",
    icon: ShieldCheck,
  },
  {
    title: "Política de Senhas",
    value: "Ativa",
    description: "Regras mínimas de senha e segurança de login.",
    icon: LockKeyhole,
  },
  {
    title: "Fingerprint",
    value: "Futuro",
    description: "Identificação de dispositivo e contexto de acesso.",
    icon: Fingerprint,
  },
  {
    title: "Dispositivos",
    value: "Monitorado",
    description: "Controle de sessões por dispositivo autorizado.",
    icon: Smartphone,
  },
]

export function SettingsSecurityPage() {
  return (
    <div className="space-y-4">
      <section className="surface-premium rounded-2xl p-4 lg:p-5">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-sm text-primary font-semibold">
              <ShieldCheck size={16} />
              Configurações
            </span>

            <h2 className="text-2xl xl:text-3xl font-bold mt-1">
              Segurança
            </h2>

            <p className="text-muted mt-2 text-sm max-w-4xl">
              Segurança avançada da plataforma, sessões, dispositivos e autenticação.
            </p>
          </div>

          <button className="bg-primary text-white font-semibold px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:shadow-neon transition text-sm">
            <Save size={15} />
            Salvar segurança
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
}: {
  title: string
  value: string
  description: string
  icon: LucideIcon
}) {
  return (
    <div className="surface-premium rounded-2xl p-4 min-h-[150px] hover:border-primary/50 transition">
      <div className="flex items-start justify-between gap-3">
        <div className="w-9 h-9 rounded-2xl bg-primarySoft flex items-center justify-center shrink-0">
          <Icon className="text-primary" size={18} />
        </div>

        <button
          className="w-8 h-8 rounded-full bg-cardSoft border border-border flex items-center justify-center hover:border-primary hover:text-primary transition"
          title="Editar"
        >
          <Edit size={14} />
        </button>
      </div>

      <h3 className="font-semibold mt-4">
        {title}
      </h3>

      <p className="text-primary text-sm font-semibold mt-1">
        {value}
      </p>

      <p className="text-xs text-muted mt-2 leading-relaxed line-clamp-2">
        {description}
      </p>
    </div>
  )
}