import { useMemo, useState } from "react"
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

  const filteredUsers = useMemo(() => {
    return data.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.active) ||
        (statusFilter === "inactive" && !user.active)

      return matchesSearch && matchesStatus
    })
  }, [data, search, statusFilter])

  function handleEdit(user: User) {
    setSelectedUser(user)
    setEditModalOpen(true)
  }

  async function handleDelete(user: User) {
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
    } finally {
      setDeleteLoadingId(null)
    }
  }

  return (
    <div className="space-y-5">
      <section className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-sm text-neon font-semibold">
            <ShieldCheck size={16} />
            Controle de Acesso
          </span>

          <h2 className="text-3xl xl:text-4xl font-bold mt-1">
            Usuários
          </h2>

          <p className="text-muted mt-2 text-sm xl:text-base">
            Gestão de usuários, permissões, perfis e acessos da plataforma.
          </p>
        </div>

        {canManageUsers() && (
          <button
            onClick={() => setModalOpen(true)}
            className="bg-neon text-black font-semibold px-5 py-3 rounded-full hover:shadow-neon transition w-full sm:w-auto"
          >
            Novo usuário
          </button>
        )}
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs uppercase tracking-wide text-muted">
            Total
          </p>
          <strong className="text-3xl text-neon">{data.length}</strong>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs uppercase tracking-wide text-muted">
            Ativos
          </p>
          <strong className="text-3xl text-neon">
            {data.filter((user) => user.active).length}
          </strong>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs uppercase tracking-wide text-muted">
            Filtrados
          </p>
          <strong className="text-3xl text-neon">
            {filteredUsers.length}
          </strong>
        </div>
      </section>

      <section className="bg-card border border-border rounded-2xl p-4 flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between">
        <div className="flex items-center gap-2 bg-background border border-border rounded-full px-4 py-3 w-full xl:max-w-md">
          <Search size={16} className="text-muted" />
          <input
            className="bg-transparent outline-none text-sm w-full placeholder:text-muted"
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            className="bg-background border border-border rounded-full px-4 py-3 outline-none text-sm"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>

          <button
            onClick={() => refetch()}
            className="bg-background border border-border px-4 py-3 rounded-full flex items-center justify-center gap-2 hover:border-neon transition text-sm"
          >
            <RefreshCcw size={16} className={isFetching ? "animate-spin" : ""} />
            Atualizar
          </button>
        </div>
      </section>

      {isLoading && (
        <div className="bg-card border border-border rounded-2xl p-5 text-muted">
          Carregando usuários...
        </div>
      )}

      {isError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl p-5">
          Não foi possível carregar os usuários. Verifique se a API está online e se a sessão está ativa.
        </div>
      )}

      {!isLoading && !isError && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div
            className={[
              "hidden xl:grid gap-4 px-5 py-3 border-b border-border text-xs uppercase tracking-wide text-muted",
              canManageUsers()
                ? "grid-cols-[1.4fr_1.4fr_1fr_0.8fr_0.8fr]"
                : "grid-cols-[1.4fr_1.4fr_1fr_0.8fr]",
            ].join(" ")}
          >
            <div>Usuário</div>
            <div>E-mail</div>
            <div>Perfil</div>
            <div>Status</div>
            {canManageUsers() && <div>Ações</div>}
          </div>

          <div className="divide-y divide-border">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className={[
                  "grid grid-cols-1 gap-4 px-5 py-4 xl:items-center hover:bg-white/[0.03] transition",
                  canManageUsers()
                    ? "xl:grid-cols-[1.4fr_1.4fr_1fr_0.8fr_0.8fr]"
                    : "xl:grid-cols-[1.4fr_1.4fr_1fr_0.8fr]",
                ].join(" ")}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 border border-border flex items-center justify-center shrink-0">
                    {user.masterUser ? (
                      <Crown className="text-neon" size={19} />
                    ) : (
                      <UserCircle className="text-neon" size={20} />
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      {user.name}
                    </h3>

                    <p className="text-xs text-muted">
                      ID: {user.id.slice(0, 8)}
                    </p>
                  </div>
                </div>

                <div className="text-sm text-muted">
                  {user.email}
                </div>

                <div className="flex flex-wrap gap-2">
                  {(user.roles ?? []).map((role) => (
                    <span
                      key={role}
                      className="inline-flex items-center gap-1 bg-neon/10 text-neon border border-neon/30 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      <ShieldCheck size={13} />
                      {role}
                    </span>
                  ))}
                </div>

                <div>
                  {user.active ? (
                    <span className="inline-flex items-center gap-2 text-neon text-sm">
                      <CheckCircle2 size={16} />
                      Ativo
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-red-300 text-sm">
                      <Users size={16} />
                      Inativo
                    </span>
                  )}
                </div>

                {canManageUsers() && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center hover:border-neon hover:text-neon transition"
                      title="Alterar"
                    >
                      <Edit size={15} />
                    </button>

                    <button
                      onClick={() => handleDelete(user)}
                      disabled={deleteLoadingId === user.id}
                      className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center hover:border-red-400 hover:text-red-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Excluir"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="p-8 text-center text-muted">
                Nenhum usuário encontrado com os filtros atuais.
              </div>
            )}
          </div>
        </div>
      )}

      <CreateUserModal
        open={modalOpen}
        tenantId={currentUser?.tenantId || ""}
        onClose={() => setModalOpen(false)}
        onCreated={() => refetch()}
      />

      <EditUserModal
        open={editModalOpen}
        user={selectedUser}
        onClose={() => {
          setEditModalOpen(false)
          setSelectedUser(null)
        }}
        onUpdated={() => refetch()}
      />
    </div>
  )
}