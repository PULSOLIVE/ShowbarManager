import { useMemo, useState } from "react"
import type { ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  CheckCircle2,
  Crown,
  Edit,
  KeyRound,
  Plus,
  RefreshCcw,
  Search,
  ShieldCheck,
  Trash2,
  UserCog,
  XCircle,
} from "lucide-react"
import { CreateProfileModal } from "../../components/settings/CreateProfileModal"
import { EditProfileModal } from "../../components/settings/EditProfileModal"
import { ProfileService } from "../../services/profile.service"
import type { Profile } from "../../types/profile.types"

export function SettingsProfilesPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null)

  const {
    data: profiles = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["settings-profiles"],
    queryFn: ProfileService.findAll,
  })

  const activeProfilesCount = useMemo(() => {
    return profiles.filter((profile) => profile.active).length
  }, [profiles])

  const systemProfilesCount = useMemo(() => {
    return profiles.filter((profile) => profile.systemProfile).length
  }, [profiles])

  const filteredProfiles = useMemo(() => {
    const term = search.trim().toLowerCase()

    return profiles.filter((profile) => {
      const permissions = (profile.permissionIds ?? []).join(" ").toLowerCase()

      const matchesSearch =
        !term ||
        profile.name.toLowerCase().includes(term) ||
        profile.code.toLowerCase().includes(term) ||
        (profile.description || "").toLowerCase().includes(term) ||
        permissions.includes(term)

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && profile.active) ||
        (statusFilter === "inactive" && !profile.active) ||
        (statusFilter === "system" && profile.systemProfile) ||
        (statusFilter === "custom" && !profile.systemProfile)

      return matchesSearch && matchesStatus
    })
  }, [profiles, search, statusFilter])

  function handleRefresh() {
    refetch().catch(() => {
      alert("Não foi possível atualizar os perfis.")
    })
  }

  function handleEdit(profile: Profile) {
    setSelectedProfile(profile)
    setEditModalOpen(true)
  }

  async function handleDelete(profile: Profile) {
    if (profile.systemProfile) {
      alert("Perfis de sistema não podem ser excluídos.")
      return
    }

    const confirmed = window.confirm(
      `Deseja realmente excluir o perfil ${profile.name}?`
    )

    if (!confirmed) {
      return
    }

    try {
      setDeleteLoadingId(profile.id)
      await ProfileService.delete(profile.id)
      await refetch()
    } catch {
      alert("Não foi possível excluir este perfil.")
    } finally {
      setDeleteLoadingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <section className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-sm text-primary font-semibold">
            <UserCog size={16} />
            Configurações
          </span>

          <h2 className="text-2xl xl:text-3xl font-bold mt-1">
            Perfis e grupos
          </h2>

          <p className="text-muted mt-2 text-sm max-w-4xl">
            Gestão completa de perfis, grupos, hierarquias, permissões e níveis de acesso.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="bg-primary text-white px-4 py-2.5 rounded-full font-semibold flex items-center justify-center gap-2 hover:shadow-neon transition text-sm"
        >
          <Plus size={16} />
          Novo perfil
        </button>
      </section>

      <section className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <SummaryCard title="Total" value={String(profiles.length)} icon={<UserCog size={18} />} />
        <SummaryCard title="Ativos" value={String(activeProfilesCount)} icon={<CheckCircle2 size={18} />} />
        <SummaryCard title="Sistema" value={String(systemProfilesCount)} icon={<Crown size={18} />} />
        <SummaryCard title="Filtrados" value={String(filteredProfiles.length)} icon={<Search size={18} />} />
      </section>

      <section className="surface-premium rounded-2xl p-3 flex flex-col xl:flex-row gap-3 xl:items-center xl:justify-between">
        <div className="flex items-center gap-2 bg-background border border-border rounded-full px-4 py-2.5 w-full xl:max-w-md">
          <Search size={15} className="text-muted shrink-0" />

          <input
            placeholder="Pesquisar por nome, código, descrição ou permissões..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="bg-transparent outline-none w-full text-sm placeholder:text-muted"
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
            <option value="system">Sistema</option>
            <option value="custom">Personalizados</option>
          </select>

          <button
            onClick={handleRefresh}
            className="bg-background border border-border px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition text-sm"
          >
            <RefreshCcw size={15} className={isFetching ? "animate-spin" : ""} />
            Atualizar
          </button>
        </div>
      </section>

      {isLoading && (
        <div className="surface-premium rounded-2xl p-4 text-muted text-sm">
          Carregando perfis...
        </div>
      )}

      {isError && (
        <div className="bg-danger/10 border border-danger/30 text-danger rounded-2xl p-4 text-sm">
          Não foi possível carregar os perfis.
        </div>
      )}

      {!isLoading && !isError && (
        <section className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-3">
          {filteredProfiles.map((profile) => (
            <article
              key={profile.id}
              className="surface-premium rounded-2xl p-4 hover:border-primary/50 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="icon-tile">
                    {profile.code.includes("MASTER") ? (
                      <Crown size={19} />
                    ) : (
                      <UserCog size={20} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-base font-semibold truncate">
                      {profile.name}
                    </h3>

                    <p className="text-xs text-primary mt-1 truncate">
                      {profile.code}
                    </p>
                  </div>
                </div>

                {profile.active ? (
                  <span className="inline-flex items-center gap-1 text-success text-xs shrink-0">
                    <CheckCircle2 size={14} />
                    Ativo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-danger text-xs shrink-0">
                    <XCircle size={14} />
                    Inativo
                  </span>
                )}
              </div>

              <p className="text-sm text-muted mt-3 line-clamp-2 min-h-[40px]">
                {profile.description || "Perfil do ecossistema"}
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <InfoBox label="Prioridade" value={String(profile.priority)} />

                <InfoBox
                  label="Tipo"
                  value={profile.systemProfile ? "Sistema" : "Personalizado"}
                  icon={profile.systemProfile ? <ShieldCheck size={14} className="text-primary" /> : undefined}
                />

                <InfoBox
                  label="Permissões"
                  value={String(profile.permissionIds?.length || 0)}
                  icon={<KeyRound size={14} className="text-primary" />}
                />
              </div>

              <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-3">
                <span className="text-xs text-muted">
                  ID: {profile.id.slice(0, 8)}
                </span>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleEdit(profile)}
                    className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:border-primary hover:text-primary transition"
                    title="Editar"
                  >
                    <Edit size={14} />
                  </button>

                  <button
                    onClick={() => {
                      handleDelete(profile).catch(() => {
                        alert("Erro inesperado ao excluir perfil.")
                      })
                    }}
                    disabled={deleteLoadingId === profile.id || profile.systemProfile}
                    className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:border-danger hover:text-danger transition disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Excluir"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </article>
          ))}

          {filteredProfiles.length === 0 && (
            <div className="xl:col-span-2 2xl:col-span-3 surface-premium rounded-2xl p-8 text-center text-muted">
              Nenhum perfil encontrado.
            </div>
          )}
        </section>
      )}

      <CreateProfileModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={() => {
          refetch().catch(() => {
            alert("Perfil criado, mas não foi possível atualizar a lista.")
          })
        }}
      />

      <EditProfileModal
        open={editModalOpen}
        profile={selectedProfile}
        onClose={() => {
          setEditModalOpen(false)
          setSelectedProfile(null)
        }}
        onUpdated={() => {
          refetch().catch(() => {
            alert("Perfil atualizado, mas não foi possível atualizar a lista.")
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
    <div className="surface-premium rounded-2xl p-3 hover:border-primary/50 transition">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-muted">
            {title}
          </p>

          <strong className="text-xl text-primary block mt-1 truncate">
            {value}
          </strong>
        </div>

        <div className="icon-tile">
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
    <div className="surface-muted rounded-2xl p-3 min-w-0">
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