import { useMemo, useState } from "react"
import type { ReactNode } from "react"
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
  XCircle,
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
  const [statusFilter, setStatusFilter] = useState("all")
  const [moduleFilter, setModuleFilter] = useState("all")
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

  const activePermissionsCount = useMemo(() => {
    return permissions.filter((permission) => permission.active).length
  }, [permissions])

  const systemPermissionsCount = useMemo(() => {
    return permissions.filter((permission) => permission.systemPermission).length
  }, [permissions])

  const moduleOptions = useMemo(() => {
    return Array.from(
      new Set(
        permissions
          .map((permission) => permission.module)
          .filter(Boolean)
          .sort()
      )
    )
  }, [permissions])

  const filteredPermissions = useMemo(() => {
    const term = search.trim().toLowerCase()

    return permissions.filter((permission) => {
      const matchesSearch =
        !term ||
        permission.name.toLowerCase().includes(term) ||
        permission.code.toLowerCase().includes(term) ||
        permission.module.toLowerCase().includes(term) ||
        permission.action.toLowerCase().includes(term) ||
        (permission.description || "").toLowerCase().includes(term)

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && permission.active) ||
        (statusFilter === "inactive" && !permission.active) ||
        (statusFilter === "system" && permission.systemPermission) ||
        (statusFilter === "custom" && !permission.systemPermission)

      const matchesModule =
        moduleFilter === "all" || permission.module === moduleFilter

      return matchesSearch && matchesStatus && matchesModule
    })
  }, [permissions, search, statusFilter, moduleFilter])

  function handleRefresh() {
    refetch().catch(() => {
      alert("Não foi possível atualizar as permissões.")
    })
  }

  function handleEdit(permission: Permission) {
    setSelectedPermission(permission)
    setEditModalOpen(true)
  }

  async function handleDelete(permission: Permission) {
    if (permission.systemPermission) {
      alert("Permissões de sistema não podem ser excluídas.")
      return
    }

    const confirmed = window.confirm(
      `Deseja realmente excluir a permissão ${permission.name}?`
    )

    if (!confirmed) {
      return
    }

    try {
      setDeleteLoadingId(permission.id)
      await PermissionService.delete(permission.id)
      await refetch()
    } catch {
      alert("Não foi possível excluir esta permissão.")
    } finally {
      setDeleteLoadingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <section className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-sm text-neon font-semibold">
            <KeyRound size={16} />
            Configurações
          </span>

          <h2 className="text-2xl xl:text-3xl font-bold mt-1">
            Permissões
          </h2>

          <p className="text-muted mt-2 text-sm max-w-4xl">
            Controle avançado de permissões e ACL por módulo, ação, campo e contexto.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="bg-neon text-black px-4 py-2.5 rounded-full font-semibold flex items-center justify-center gap-2 hover:shadow-neon transition text-sm"
        >
          <Plus size={16} />
          Nova permissão
        </button>
      </section>

      <section className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <SummaryCard title="Total" value={String(permissions.length)} icon={<KeyRound size={18} />} />
        <SummaryCard title="Ativas" value={String(activePermissionsCount)} icon={<CheckCircle2 size={18} />} />
        <SummaryCard title="Sistema" value={String(systemPermissionsCount)} icon={<ShieldCheck size={18} />} />
        <SummaryCard title="Filtradas" value={String(filteredPermissions.length)} icon={<Search size={18} />} />
      </section>

      <section className="bg-card border border-border rounded-2xl p-3 flex flex-col xl:flex-row gap-3 xl:items-center xl:justify-between">
        <div className="flex items-center gap-2 bg-background border border-border rounded-full px-4 py-2.5 w-full xl:max-w-md">
          <Search size={15} className="text-muted shrink-0" />

          <input
            placeholder="Pesquisar por código, nome, módulo ou ação..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="bg-transparent outline-none w-full text-sm placeholder:text-muted"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <select
            className="bg-background border border-border rounded-full px-4 py-2.5 outline-none text-sm"
            value={moduleFilter}
            onChange={(event) => setModuleFilter(event.target.value)}
          >
            <option value="all">Todos os módulos</option>
            {moduleOptions.map((module) => (
              <option key={module} value={module}>
                {module}
              </option>
            ))}
          </select>

          <select
            className="bg-background border border-border rounded-full px-4 py-2.5 outline-none text-sm"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">Todas</option>
            <option value="active">Ativas</option>
            <option value="inactive">Inativas</option>
            <option value="system">Sistema</option>
            <option value="custom">Customizadas</option>
          </select>

          <button
            onClick={handleRefresh}
            className="bg-background border border-border px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:border-neon hover:text-neon transition text-sm"
          >
            <RefreshCcw size={15} className={isFetching ? "animate-spin" : ""} />
            Atualizar
          </button>
        </div>
      </section>

      {isLoading && (
        <div className="bg-card border border-border rounded-2xl p-4 text-muted text-sm">
          Carregando permissões...
        </div>
      )}

      {isError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl p-4 text-sm">
          Não foi possível carregar as permissões.
        </div>
      )}

      {!isLoading && !isError && (
        <section className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-3">
          {filteredPermissions.map((permission) => (
            <article
              key={permission.id}
              className="bg-card border border-border rounded-2xl p-4 hover:border-neon/60 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-background border border-border flex items-center justify-center shrink-0">
                    <KeyRound className="text-neon" size={20} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-base font-semibold truncate">
                      {permission.name}
                    </h3>

                    <p className="text-xs text-neon mt-1 truncate">
                      {permission.code}
                    </p>
                  </div>
                </div>

                {permission.active ? (
                  <span className="inline-flex items-center gap-1 text-neon text-xs shrink-0">
                    <CheckCircle2 size={14} />
                    Ativa
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-red-300 text-xs shrink-0">
                    <XCircle size={14} />
                    Inativa
                  </span>
                )}
              </div>

              <p className="text-sm text-muted mt-3 line-clamp-2 min-h-[40px]">
                {permission.description || "Permissão do ecossistema"}
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <InfoBox label="Módulo" value={permission.module} />
                <InfoBox label="Ação" value={permission.action} />
                <InfoBox label="Prioridade" value={String(permission.priority)} />
                <InfoBox
                  label="Tipo"
                  value={permission.systemPermission ? "Sistema" : "Customizada"}
                  icon={permission.systemPermission ? <ShieldCheck size={14} className="text-neon" /> : undefined}
                />
              </div>

              <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-3">
                <span className="text-xs text-muted">
                  ID: {permission.id.slice(0, 8)}
                </span>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleEdit(permission)}
                    className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:border-neon hover:text-neon transition"
                    title="Editar"
                  >
                    <Edit size={14} />
                  </button>

                  <button
                    onClick={() => {
                      handleDelete(permission).catch(() => {
                        alert("Erro inesperado ao excluir permissão.")
                      })
                    }}
                    disabled={deleteLoadingId === permission.id || permission.systemPermission}
                    className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:border-red-400 hover:text-red-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Excluir"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </article>
          ))}

          {filteredPermissions.length === 0 && (
            <div className="xl:col-span-2 2xl:col-span-3 bg-card border border-border rounded-2xl p-8 text-center text-muted">
              Nenhuma permissão encontrada.
            </div>
          )}
        </section>
      )}

      <section className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <ShieldCheck size={17} className="text-neon" />

          <div>
            <h3 className="text-base font-semibold">
              Matriz inicial de permissões
            </h3>

            <p className="text-xs text-muted">
              Base visual para o RBAC do ShowbarManager.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr_1fr] gap-3 px-4 py-3 border-b border-border text-xs uppercase tracking-wide text-muted">
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
                className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr_1fr] gap-3 px-4 py-3 border-b border-border last:border-b-0 hover:bg-white/[0.03] transition text-sm"
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
  icon,
}: {
  title: string
  value: string
  icon: ReactNode
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-3 hover:border-neon/70 transition">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-muted">
            {title}
          </p>

          <strong className="text-xl text-neon block mt-1 truncate">
            {value}
          </strong>
        </div>

        <div className="w-9 h-9 rounded-2xl bg-neon/10 border border-neon/20 flex items-center justify-center text-neon shrink-0">
          {icon}
        </div>
      </div>
    </div>
  )
}

function InfoBox({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon?: ReactNode
}) {
  return (
    <div className="bg-background border border-border rounded-2xl p-3 min-w-0">
      <p className="text-[11px] uppercase tracking-wide text-muted">
        {label}
      </p>

      <div className="flex items-center gap-2 mt-1 min-w-0">
        {icon}

        <strong className="text-sm block truncate">
          {value}
        </strong>
      </div>
    </div>
  )
}

function PermissionStatus({ allowed }: { allowed: boolean }) {
  return allowed ? (
    <span className="inline-flex items-center gap-1 text-neon text-sm">
      <CheckCircle2 size={14} />
      Sim
    </span>
  ) : (
    <span className="text-muted text-sm">
      Não
    </span>
  )
}