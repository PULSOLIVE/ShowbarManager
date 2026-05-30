import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  Crown,
  Edit,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  UserCog,
} from "lucide-react"
import { CreateProfileModal } from "../../components/settings/CreateProfileModal"
import { EditProfileModal } from "../../components/settings/EditProfileModal"
import { ProfileService } from "../../services/profile.service"
import type { Profile } from "../../types/profile.types"

export function SettingsProfilesPage() {
  const [search, setSearch] = useState("")
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

  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      const term = search.toLowerCase()

      return (
        profile.name.toLowerCase().includes(term) ||
        profile.code.toLowerCase().includes(term) ||
        (profile.description || "").toLowerCase().includes(term)
      )
    })
  }, [profiles, search])

  function handleRefresh() {
    refetch().catch(() => {
      alert("Não foi possível atualizar os perfis.")
    })
  }

  function handleEdit(profile: Profile) {
    setSelectedProfile(profile)
    setEditModalOpen(true)
  }

  function handleDelete(profile: Profile) {
    const confirmed = window.confirm(
      `Deseja realmente excluir o perfil ${profile.name}?`
    )

    if (!confirmed) {
      return
    }

    setDeleteLoadingId(profile.id)

    ProfileService.delete(profile.id)
      .then(() => {
        refetch().catch(() => {
          alert("Perfil excluído, mas não foi possível atualizar a lista.")
        })
      })
      .catch(() => {
        alert("Não foi possível excluir este perfil. Perfis de sistema podem estar protegidos.")
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
            <UserCog size={16} />
            Configurações
          </span>

          <h2 className="text-3xl xl:text-4xl font-bold mt-1">
            Perfis e Grupos
          </h2>

          <p className="text-muted mt-2">
            Gestão completa de perfis, grupos, hierarquias e níveis de acesso.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="bg-neon text-black px-5 py-3 rounded-full font-semibold flex items-center justify-center gap-2 hover:shadow-neon transition"
        >
          <Plus size={16} />
          Novo perfil
        </button>
      </section>

      <div className="bg-card border border-border rounded-2xl p-4 flex flex-col xl:flex-row gap-3 xl:items-center xl:justify-between">
        <div className="flex items-center gap-2 bg-background border border-border rounded-full px-4 py-3 w-full xl:max-w-md">
          <Search size={16} className="text-muted" />

          <input
            placeholder="Pesquisar perfil..."
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
      </div>

      {isLoading && (
        <div className="bg-card border border-border rounded-2xl p-6 text-muted">
          Carregando perfis...
        </div>
      )}

      {isError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl p-6">
          Não foi possível carregar os perfis.
        </div>
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filteredProfiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-card border border-border rounded-2xl p-5 hover:border-neon/70 transition"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-neon/10 border border-neon/20 flex items-center justify-center">
                    {profile.code.includes("MASTER") ? (
                      <Crown className="text-neon" size={22} />
                    ) : (
                      <UserCog className="text-neon" size={22} />
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      {profile.name}
                    </h3>

                    <p className="text-xs text-neon mt-1">
                      {profile.code}
                    </p>

                    <p className="text-sm text-muted mt-1">
                      {profile.description || "Perfil do ecossistema"}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-xs bg-background border border-border rounded-full px-3 py-1 text-muted">
                        Prioridade {profile.priority}
                      </span>

                      <span className="text-xs bg-background border border-border rounded-full px-3 py-1 text-muted">
                        {profile.active ? "Ativo" : "Inativo"}
                      </span>

                      <span className="text-xs bg-background border border-border rounded-full px-3 py-1 text-muted">
                        {profile.systemProfile ? "Sistema" : "Customizado"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(profile)}
                    className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center hover:border-neon hover:text-neon transition"
                    title="Editar"
                  >
                    <Edit size={15} />
                  </button>

                  <button
                    onClick={() => handleDelete(profile)}
                    disabled={deleteLoadingId === profile.id}
                    className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center hover:border-red-400 hover:text-red-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Excluir"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredProfiles.length === 0 && (
            <div className="xl:col-span-2 bg-card border border-border rounded-2xl p-8 text-center text-muted">
              Nenhum perfil encontrado.
            </div>
          )}
        </div>
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