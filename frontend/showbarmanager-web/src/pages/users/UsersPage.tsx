import { useMemo, useState } from "react"
import type { ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  CheckCircle2,
  Crown,
  Edit,
  RefreshCcw,
  Search,
  ShieldCheck,
  Trash2,
  UserCircle,
  Users,
  XCircle,
} from "lucide-react"
import { CreateUserModal } from "../../components/users/CreateUserModal"
import { EditUserModal } from "../../components/users/EditUserModal"
import { UserService } from "../../services/user.service"
import { useAuthStore } from "../../store/auth.store"
import type { User } from "../../types/user.types"

export function UsersPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null)

  const currentUser = useAuthStore((state) => state.user)
  const canManageUsers = useAuthStore((state) => state.canManageUsers)

  const currentUserId = currentUser?.userId || ""

  const {
    data = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["users"],
    queryFn: UserService.list,
  })

  const activeUsersCount = useMemo(() => {
    return data.filter((user) => user.active).length
  }, [data])

  const masterUsersCount = useMemo(() => {
    return data.filter((user) => user.masterUser).length
  }, [data])

  const filteredUsers = useMemo(() => {
    const searchTerm = search.trim().toLowerCase()

    return data.filter((user) => {
      const roles = (user.roles ?? []).join(" ").toLowerCase()

      const matchesSearch =
        !searchTerm ||
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        roles.includes(searchTerm)

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.active) ||
        (statusFilter === "inactive" && !user.active) ||
        (statusFilter === "master" && user.masterUser)

      return matchesSearch && matchesStatus
    })
  }, [data, search, statusFilter])

  function handleRefresh() {
    refetch().catch(() => {
      alert("Não foi possível atualizar os usuários.")
    })
  }

  function handleEdit(user: User) {
    setSelectedUser(user)
    setEditModalOpen(true)
  }

  async function handleDelete(user: User) {
    if (user.id === currentUserId) {
      alert("Você não pode excluir o próprio usuário logado.")
      return
    }

    const confirmed = window.confirm(
      `Deseja realmente excluir o usuário ${user.name}?`
    )

    if (!confirmed) {
      return
    }

    try {
      setDeleteLoadingId(user.id)
      await UserService.delete(user.id)
      await refetch()
    } catch {
      alert("Não foi possível excluir este usuário.")
    } finally {
      setDeleteLoadingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <section className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-sm text-neon font-semibold">
            <ShieldCheck size={16} />
            Controle de Acesso
          </span>

          <h2 className="text-2xl xl:text-3xl font-bold mt-1">
            Usuários
          </h2>

          <p className="text-muted mt-2 text-sm max-w-4xl">
            Gestão de usuários, permissões, perfis e acessos da plataforma.
          </p>
        </div>

        {canManageUsers() && (
          <button
            onClick={() => setModalOpen(true)}
            className="bg-neon text-black font-semibold px-4 py-2.5 rounded-full hover:shadow-neon transition w-full sm:w-auto text-sm"
          >
            Novo usuário
          </button>
        )}
      </section>

      <section className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <SummaryCard
          title="Total"
          value={String(data.length)}
          icon={<Users size={18} />}
        />

        <SummaryCard
          title="Ativos"
          value={String(activeUsersCount)}
          icon={<CheckCircle2 size={18} />}
        />

        <SummaryCard
          title="Master"
          value={String(masterUsersCount)}
          icon={<Crown size={18} />}
        />

        <SummaryCard
          title="Filtrados"
          value={String(filteredUsers.length)}
          icon={<Search size={18} />}
        />
      </section>

      <section className="bg-card border border-border rounded-2xl p-3 flex flex-col xl:flex-row gap-3 xl:items-center xl:justify-between">
        <div className="flex items-center gap-2 bg-background border border-border rounded-full px-4 py-2.5 w-full xl:max-w-md">
          <Search size={15} className="text-muted shrink-0" />

          <input
            className="bg-transparent outline-none text-sm w-full placeholder:text-muted"
            placeholder="Buscar por nome, e-mail ou perfil..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <select
            className="bg-background border border-border rounded-full px-4 py-2.5 outline-none text-sm"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
            <option value="master">Master</option>
          </select>

          <button
            onClick={handleRefresh}
            className="bg-background border border-border px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:border-neon transition text-sm"
          >
            <RefreshCcw size={15} className={isFetching ? "animate-spin" : ""} />
            Atualizar
          </button>
        </div>
      </section>

      {isLoading && (
        <div className="bg-card border border-border rounded-2xl p-4 text-muted text-sm">
          Carregando usuários...
        </div>
      )}

      {isError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl p-4 text-sm">
          Não foi possível carregar os usuários. Verifique se a API está online e se a sessão está ativa.
        </div>
      )}

      {!isLoading && !isError && (
        <section className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-3">
          {filteredUsers.map((user) => (
            <article
              key={user.id}
              className="bg-card border border-border rounded-2xl p-4 hover:border-neon/60 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-background border border-border flex items-center justify-center shrink-0">
                    {user.masterUser ? (
                      <Crown className="text-neon" size={19} />
                    ) : (
                      <UserCircle className="text-neon" size={20} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <h3 className="text-base font-semibold truncate">
                        {user.name}
                      </h3>

                      {user.id === currentUserId && (
                        <span className="text-[11px] bg-neon/10 text-neon border border-neon/20 rounded-full px-2 py-0.5 shrink-0">
                          Você
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-muted mt-1 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                {user.active ? (
                  <span className="inline-flex items-center gap-1 text-neon text-xs shrink-0">
                    <CheckCircle2 size={14} />
                    Ativo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-red-300 text-xs shrink-0">
                    <XCircle size={14} />
                    Inativo
                  </span>
                )}
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <InfoBox
                  label="Tipo"
                  value={user.masterUser ? "Usuário Master" : "Usuário comum"}
                  icon={user.masterUser ? <Crown size={14} className="text-neon" /> : undefined}
                />

                <InfoBox
                  label="ID"
                  value={user.id.slice(0, 8)}
                />
              </div>

              <div className="mt-3 bg-background border border-border rounded-2xl p-3 min-h-[76px]">
                <p className="text-[11px] uppercase tracking-wide text-muted mb-2">
                  Perfis
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {(user.roles ?? []).length > 0 ? (
                    (user.roles ?? []).map((role) => (
                      <span
                        key={role}
                        className="inline-flex items-center gap-1 bg-neon/10 text-neon border border-neon/30 px-2.5 py-1 rounded-full text-xs font-medium"
                      >
                        <ShieldCheck size={12} />
                        {role}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted">
                      Nenhum perfil vinculado
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-3">
                <span className="text-xs text-muted truncate">
                  {user.email}
                </span>

                {canManageUsers() && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleEdit(user)}
                      className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:border-neon hover:text-neon transition"
                      title="Alterar"
                    >
                      <Edit size={14} />
                    </button>

                    <button
                      onClick={() => {
                        handleDelete(user).catch(() => {
                          alert("Erro inesperado ao excluir usuário.")
                        })
                      }}
                      disabled={deleteLoadingId === user.id || user.id === currentUserId}
                      className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:border-red-400 hover:text-red-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Excluir"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}

          {filteredUsers.length === 0 && (
            <div className="xl:col-span-2 2xl:col-span-3 bg-card border border-border rounded-2xl p-8 text-center text-muted">
              Nenhum usuário encontrado com os filtros atuais.
            </div>
          )}
        </section>
      )}

      <CreateUserModal
        open={modalOpen}
        tenantId={currentUser?.tenantId || ""}
        onClose={() => setModalOpen(false)}
        onCreated={() => {
          refetch().catch(() => {
            alert("Usuário criado, mas não foi possível atualizar a lista.")
          })
        }}
      />

      <EditUserModal
        open={editModalOpen}
        user={selectedUser}
        onClose={() => {
          setEditModalOpen(false)
          setSelectedUser(null)
        }}
        onUpdated={() => {
          refetch().catch(() => {
            alert("Usuário atualizado, mas não foi possível atualizar a lista.")
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