import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  CheckCircle2,
  Edit,
  KeyRound,
  Plus,
  RefreshCcw,
  Search,
  ShieldCheck,
  Trash2,
} from "lucide-react"
import { CreatePermissionModal } from "../../components/settings/CreatePermissionModal"
import { EditPermissionModal } from "../../components/settings/EditPermissionModal"
import { PermissionService } from "../../services/permission.service"
import type { Permission } from "../../types/permission.types"

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
  const [search, setSearch] = useState("")
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedPermission, setSelectedPermission] =
    useState<Permission | null>(null)
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null)

  const {
    data: permissions = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["settings-permissions"],
    queryFn: PermissionService.findAll,
  })

  const filteredPermissions = useMemo(() => {
    return permissions.filter((permission) => {
      const term = search.toLowerCase()

      return (
        permission.name.toLowerCase().includes(term) ||
        permission.code.toLowerCase().includes(term) ||
        permission.module.toLowerCase().includes(term) ||
        permission.action.toLowerCase().includes(term) ||
        (permission.description || "").toLowerCase().includes(term)
      )
    })
  }, [permissions, search])

  function handleRefresh() {
    refetch().catch(() => {
      alert("Não foi possível atualizar as permissões.")
    })
  }

  function handleEdit(permission: Permission) {
    setSelectedPermission(permission)
    setEditModalOpen(true)
  }

  function handleDelete(permission: Permission) {
    const confirmed = window.confirm(
      `Deseja realmente excluir a permissão ${permission.name}?`
    )

    if (!confirmed) {
      return
    }

    setDeleteLoadingId(permission.id)

    PermissionService.delete(permission.id)
      .then(() => {
        refetch().catch(() => {
          alert("Permissão excluída, mas não foi possível atualizar a lista.")
        })
      })
      .catch(() => {
        alert("Não foi possível excluir esta permissão. Permissões de sistema podem estar protegidas.")
      })
      .finally(() => {
        setDeleteLoadingId(null)
      })
  }

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

        <button
          onClick={() => setCreateModalOpen(true)}
          className="bg-neon text-black px-5 py-3 rounded-full font-semibold flex items-center justify-center gap-2 hover:shadow-neon transition"
        >
          <Plus size={16} />
          Nova permissão
        </button>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <SummaryCard
          title="Total"
          value={String(permissions.length)}
        />

        <SummaryCard
          title="Ativas"
          value={String(permissions.filter((permission) => permission.active).length)}
        />

        <SummaryCard
          title="Sistema"
          value={String(
            permissions.filter((permission) => permission.systemPermission).length
          )}
        />

        <SummaryCard
          title="Filtradas"
          value={String(filteredPermissions.length)}
        />
      </section>

      <section className="bg-card border border-border rounded-2xl p-4 flex flex-col xl:flex-row gap-3 xl:items-center xl:justify-between">
        <div className="flex items-center gap-2 bg-background border border-border rounded-full px-4 py-3 w-full xl:max-w-md">
          <Search size={16} className="text-muted" />

          <input
            placeholder="Pesquisar por código, nome, módulo ou ação..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="bg-transparent outline-none w-full text-sm placeholder:text-muted"
          />
        </div>

        <button
          onClick={handleRefresh}
          className="bg-background border border-border px-4 py-3 rounded-full flex items-center justify-center gap-2 hover:border-neon hover:text-neon transition text-sm"
        >
          <RefreshCcw size={16} className={isFetching ? "animate-spin" : ""} />
          Atualizar
        </button>
      </section>

      {isLoading && (
        <div className="bg-card border border-border rounded-2xl p-6 text-muted">
          Carregando permissões...
        </div>
      )}

      {isError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl p-6">
          Não foi possível carregar as permissões.
        </div>
      )}

      {!isLoading && !isError && (
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filteredPermissions.map((permission) => (
            <div
              key={permission.id}
              className="bg-card border border-border rounded-2xl p-5 hover:border-neon/70 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-neon/10 border border-neon/20 flex items-center justify-center shrink-0">
                    <KeyRound className="text-neon" size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      {permission.name}
                    </h3>

                    <p className="text-xs text-neon mt-1">
                      {permission.code}
                    </p>

                    <p className="text-sm text-muted mt-1">
                      {permission.description || "Permissão do ecossistema"}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-xs bg-background border border-border rounded-full px-3 py-1 text-muted">
                        {permission.module}
                      </span>

                      <span className="text-xs bg-background border border-border rounded-full px-3 py-1 text-muted">
                        {permission.action}
                      </span>

                      <span className="text-xs bg-background border border-border rounded-full px-3 py-1 text-muted">
                        Prioridade {permission.priority}
                      </span>

                      <span className="text-xs bg-background border border-border rounded-full px-3 py-1 text-muted">
                        {permission.active ? "Ativa" : "Inativa"}
                      </span>

                      <span className="text-xs bg-background border border-border rounded-full px-3 py-1 text-muted">
                        {permission.systemPermission ? "Sistema" : "Customizada"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(permission)}
                    className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center hover:border-neon hover:text-neon transition"
                    title="Editar"
                  >
                    <Edit size={15} />
                  </button>

                  <button
                    onClick={() => handleDelete(permission)}
                    disabled={deleteLoadingId === permission.id}
                    className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center hover:border-red-400 hover:text-red-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Excluir"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredPermissions.length === 0 && (
            <div className="xl:col-span-2 bg-card border border-border rounded-2xl p-8 text-center text-muted">
              Nenhuma permissão encontrada.
            </div>
          )}
        </section>
      )}

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

      <CreatePermissionModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={() => {
          refetch().catch(() => {
            alert("Permissão criada, mas não foi possível atualizar a lista.")
          })
        }}
      />

      <EditPermissionModal
        open={editModalOpen}
        permission={selectedPermission}
        onClose={() => {
          setEditModalOpen(false)
          setSelectedPermission(null)
        }}
        onUpdated={() => {
          refetch().catch(() => {
            alert("Permissão atualizada, mas não foi possível atualizar a lista.")
          })
        }}
      />
    </div>
  )
}

function SummaryCard({
  title,
  value,
}: {
  title: string
  value: string
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <p className="text-xs uppercase tracking-wide text-muted">
        {title}
      </p>

      <strong className="text-3xl text-neon">
        {value}
      </strong>
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