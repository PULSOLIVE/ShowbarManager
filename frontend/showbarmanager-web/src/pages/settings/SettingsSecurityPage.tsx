import type { LucideIcon } from "lucide-react"
import {
  Edit,
  Fingerprint,
  LockKeyhole,
  Save,
  ShieldCheck,
  Smartphone,
} from "lucide-react"

export function SettingsSecurityPage() {
  return (
    <div className="space-y-5">
      <section className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-sm text-neon font-semibold">
            <ShieldCheck size={16} />
            Configurações
          </span>

          <h2 className="text-3xl xl:text-4xl font-bold mt-1">
            Segurança
          </h2>

          <p className="text-muted mt-2">
            Segurança avançada da plataforma, sessões, dispositivos e autenticação.
          </p>
        </div>

        <button className="bg-neon text-black font-semibold px-5 py-3 rounded-full flex items-center justify-center gap-2 hover:shadow-neon transition text-sm">
          <Save size={16} />
          Salvar segurança
        </button>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <SecurityCard icon={ShieldCheck} title="MFA" value="Planejado" />
        <SecurityCard icon={LockKeyhole} title="Política de Senhas" value="Ativa" />
        <SecurityCard icon={Fingerprint} title="Fingerprint" value="Futuro" />
        <SecurityCard icon={Smartphone} title="Dispositivos" value="Monitorado" />
      </div>
    </div>
  )
}

function SecurityCard({
  title,
  value,
  icon: Icon,
}: {
  title: string
  value: string
  icon: LucideIcon
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover:border-neon/70 transition">
      <div className="flex items-start justify-between gap-4">
        <Icon className="text-neon" size={24} />

        <button
          className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:border-neon hover:text-neon transition"
          title="Editar"
        >
          <Edit size={14} />
        </button>
      </div>

      <h3 className="font-semibold mt-4">
        {title}
      </h3>

      <p className="text-neon mt-2">
        {value}
      </p>
    </div>
  )
}