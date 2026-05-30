import {
  Edit,
  FileText,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
} from "lucide-react"

const policies = [
  "LGPD",
  "RGPD",
  "Retenção documental",
  "Retenção de logs",
  "Políticas de acesso",
  "Políticas de exportação",
  "Políticas financeiras",
  "Políticas fiscais",
  "Políticas de rede",
  "Políticas de backup",
]

export function SettingsPoliciesPage() {
  return (
    <div className="space-y-5">
      <section className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-sm text-neon font-semibold">
            <FileText size={16} />
            Configurações
          </span>

          <h2 className="text-3xl xl:text-4xl font-bold mt-1">
            Políticas
          </h2>

          <p className="text-muted mt-2">
            LGPD, RGPD, retenção, auditoria, backup, exportação e governança.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button className="bg-background border border-border px-5 py-3 rounded-full flex items-center justify-center gap-2 hover:border-neon hover:text-neon transition text-sm">
            <Plus size={16} />
            Nova política
          </button>

          <button className="bg-neon text-black font-semibold px-5 py-3 rounded-full flex items-center justify-center gap-2 hover:shadow-neon transition text-sm">
            <Save size={16} />
            Salvar políticas
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {policies.map((policy) => (
          <div
            key={policy}
            className="bg-card border border-border rounded-2xl p-5 hover:border-neon/70 transition"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-neon/10 border border-neon/20 flex items-center justify-center">
                  <ShieldCheck className="text-neon" size={22} />
                </div>

                <div>
                  <h3 className="font-semibold">{policy}</h3>
                  <p className="text-sm text-muted mt-1">Política enterprise configurável.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center hover:border-neon hover:text-neon transition">
                  <Edit size={15} />
                </button>

                <button className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center hover:border-red-400 hover:text-red-300 transition">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}