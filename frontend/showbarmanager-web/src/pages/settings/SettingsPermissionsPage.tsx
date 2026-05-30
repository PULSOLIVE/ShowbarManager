import {
  CheckCircle2,
  Edit,
  KeyRound,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
} from "lucide-react"

const permissions = [
  {
    title: "Permissão por módulo",
    description: "Define quais módulos cada perfil pode acessar.",
  },
  {
    title: "Permissão por ação",
    description: "Controla criar, editar, excluir, visualizar e exportar.",
  },
  {
    title: "Permissão por campo",
    description: "Permite ocultar ou bloquear campos sensíveis.",
  },
  {
    title: "Permissão por tenant",
    description: "Controla acesso por ambiente, cliente ou empresa.",
  },
  {
    title: "Permissão por evento",
    description: "Limita acessos por evento específico.",
  },
  {
    title: "Permissão por horário",
    description: "Permite acesso condicionado por janela de horário.",
  },
  {
    title: "Permissão por dispositivo",
    description: "Restringe acesso por equipamento autorizado.",
  },
  {
    title: "Permissão geográfica",
    description: "Controla acesso por localização, país, região ou IP.",
  },
  {
    title: "Workflow de aprovação",
    description: "Exige aprovação para ações críticas do sistema.",
  },
]

const matrix = [
  {
    profile: "ADMIN_MASTER",
    settings: true,
    users: true,
    tenants: true,
    audit: true,
    delete: true,
  },
  {
    profile: "DEVELOPER_MASTER",
    settings: true,
    users: true,
    tenants: true,
    audit: true,
    delete: true,
  },
  {
    profile: "TENANT_ADMIN",
    settings: false,
    users: true,
    tenants: true,
    audit: false,
    delete: false,
  },
  {
    profile: "SUPPORT_N1",
    settings: false,
    users: false,
    tenants: false,
    audit: false,
    delete: false,
  },
  {
    profile: "SUPPORT_N2",
    settings: false,
    users: false,
    tenants: false,
    audit: true,
    delete: false,
  },
  {
    profile: "SUPPORT_N3",
    settings: false,
    users: true,
    tenants: false,
    audit: true,
    delete: false,
  },
]

export function SettingsPermissionsPage() {
  return (
    <div className="space-y-5">
      <section className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-sm text-neon font-semibold">
            <KeyRound size={16} />
            Configurações
          </span>

          <h2 className="text-3xl xl:text-4xl font-bold mt-1">
            Permissões
          </h2>

          <p className="text-muted mt-2">
            Controle avançado de permissões e ACL por módulo, ação, campo e contexto.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button className="bg-background border border-border px-5 py-3 rounded-full flex items-center justify-center gap-2 hover:border-neon hover:text-neon transition text-sm">
            <Plus size={16} />
            Nova permissão
          </button>

          <button className="bg-neon text-black font-semibold px-5 py-3 rounded-full flex items-center justify-center gap-2 hover:shadow-neon transition text-sm">
            <Save size={16} />
            Salvar matriz
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {permissions.map((permission) => (
          <div
            key={permission.title}
            className="bg-card border border-border rounded-2xl p-5 hover:border-neon/70 transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-neon/10 border border-neon/20 flex items-center justify-center">
                  <KeyRound className="text-neon" size={20} />
                </div>

                <div>
                  <strong>{permission.title}</strong>

                  <p className="text-xs text-muted mt-1">
                    {permission.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center hover:border-neon hover:text-neon transition"
                  title="Editar"
                >
                  <Edit size={15} />
                </button>

                <button
                  className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center hover:border-red-400 hover:text-red-300 transition"
                  title="Excluir"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <ShieldCheck size={18} className="text-neon" />

          <div>
            <h3 className="font-semibold">
              Matriz inicial de permissões
            </h3>

            <p className="text-sm text-muted">
              Base visual para o RBAC do ShowbarManager.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[820px]">
            <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-3 border-b border-border text-xs uppercase tracking-wide text-muted">
              <div>Perfil</div>
              <div>Config.</div>
              <div>Usuários</div>
              <div>Tenants</div>
              <div>Auditoria</div>
              <div>Excluir</div>
            </div>

            {matrix.map((row) => (
              <div
                key={row.profile}
                className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-4 border-b border-border last:border-b-0 hover:bg-white/[0.03] transition"
              >
                <strong>{row.profile}</strong>
                <PermissionStatus allowed={row.settings} />
                <PermissionStatus allowed={row.users} />
                <PermissionStatus allowed={row.tenants} />
                <PermissionStatus allowed={row.audit} />
                <PermissionStatus allowed={row.delete} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function PermissionStatus({ allowed }: { allowed: boolean }) {
  return allowed ? (
    <span className="inline-flex items-center gap-2 text-neon text-sm">
      <CheckCircle2 size={16} />
      Sim
    </span>
  ) : (
    <span className="text-muted text-sm">
      Não
    </span>
  )
}