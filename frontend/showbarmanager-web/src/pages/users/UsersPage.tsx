import { useMemo, useState } from "react"
import type { ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  CheckCircle2,
  Crown,
  Edit,
  Globe2,
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
import { InternationalizationService } from "../../services/internationalization.service"
import { UserService } from "../../services/user.service"
import { useAuthStore } from "../../store/auth.store"
import { useTranslation } from "../../hooks/useTranslation"
import type { Internationalization } from "../../types/internationalization.types"
import type { User } from "../../types/user.types"

function getLanguageLabel(
  options: Internationalization[],
  languageCode: string | null | undefined,
  defaultLabel: string
) {
  if (!languageCode) {
    return defaultLabel
  }

  const found = options.find((item) => item.languageCode === languageCode)

  if (!found) {
    return languageCode
  }

  return `${found.flagEmoji || "🌐"} ${found.languageName}`
}

export function UsersPage() {
  const { t } = useTranslation()

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

  const { data: internationalizationOptions = [] } = useQuery({
    queryKey: ["users-language-options"],
    queryFn: InternationalizationService.listActive,
  })

  const activeUsersCount = useMemo(() => {
    return data.filter((user) => user.active).length
  }, [data])

  const masterUsersCount = useMemo(() => {
    return data.filter((user) => user.masterUser).length
  }, [data])

  const developerUsersCount = useMemo(() => {
    return data.filter((user) => user.developerUser).length
  }, [data])

  const filteredUsers = useMemo(() => {
    const searchTerm = search.trim().toLowerCase()

    return data.filter((user) => {
      const roles = (user.roles ?? []).join(" ").toLowerCase()
      const profiles = (user.profiles ?? []).join(" ").toLowerCase()
      const permissions = (user.permissions ?? []).join(" ").toLowerCase()
      const effectivePermissions = (user.effectivePermissions ?? [])
        .join(" ")
        .toLowerCase()

      const languageLabel = getLanguageLabel(
        internationalizationOptions,
        user.languageCode,
        t("users.useTenantLanguage")
      ).toLowerCase()

      const matchesSearch =
        !searchTerm ||
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        roles.includes(searchTerm) ||
        profiles.includes(searchTerm) ||
        permissions.includes(searchTerm) ||
        effectivePermissions.includes(searchTerm) ||
        languageLabel.includes(searchTerm) ||
        (user.languageCode || "").toLowerCase().includes(searchTerm)

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.active) ||
        (statusFilter === "inactive" && !user.active) ||
        (statusFilter === "master" && user.masterUser) ||
        (statusFilter === "developer" && user.developerUser)

      return matchesSearch && matchesStatus
    })
  }, [data, internationalizationOptions, search, statusFilter, t])

  function handleRefresh() {
    refetch()
      .then(() => {
        alert(t("users.listUpdated"))
      })
      .catch(() => {
        alert(t("users.error"))
      })
  }

  function handleEdit(user: User) {
    setSelectedUser(user)
    setEditModalOpen(true)
  }

  async function handleDelete(user: User) {
    if (user.id === currentUserId) {
      alert(t("users.cannotDeleteSelf"))
      return
    }

    if (user.masterUser) {
      alert(t("users.masterDeleteBlocked"))
      return
    }

    const confirmed = window.confirm(
      `${t("users.deleteConfirm")} ${user.name}?`
    )

    if (!confirmed) {
      return
    }

    try {
      setDeleteLoadingId(user.id)
      await UserService.delete(user.id)
      await refetch()
    } catch {
      alert(t("users.deleteError"))
    } finally {
      setDeleteLoadingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <section className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-sm text-primary font-semibold">
            <ShieldCheck size={16} />
            {t("users.accessControl")}
          </span>

          <h2 className="text-2xl xl:text-3xl font-bold mt-1">
            {t("users.title")}
          </h2>

          <p className="text-muted mt-2 text-sm max-w-4xl">
            {t("users.subtitle")}
          </p>
        </div>

        {canManageUsers() && (
          <button
            onClick={() => setModalOpen(true)}
            className="bg-primary text-white font-semibold px-4 py-2.5 rounded-full hover:shadow-neon transition w-full sm:w-auto text-sm"
          >
            {t("users.new")}
          </button>
        )}
      </section>

      <section className="grid grid-cols-2 xl:grid-cols-5 gap-3">
        <SummaryCard title={t("common.total")} value={String(data.length)} icon={<Users size={18} />} />
        <SummaryCard title={t("common.active")} value={String(activeUsersCount)} icon={<CheckCircle2 size={18} />} />
        <SummaryCard title={t("users.masterShort", "Master")} value={String(masterUsersCount)} icon={<Crown size={18} />} />
        <SummaryCard title={t("users.developerShort", "Dev")} value={String(developerUsersCount)} icon={<ShieldCheck size={18} />} />
        <SummaryCard title={t("common.filtered")} value={String(filteredUsers.length)} icon={<Search size={18} />} />
      </section>

      <section className="surface-premium rounded-2xl p-3 flex flex-col xl:flex-row gap-3 xl:items-center xl:justify-between">
        <div className="flex items-center gap-2 bg-background border border-border rounded-full px-4 py-2.5 w-full xl:max-w-md">
          <Search size={15} className="text-muted shrink-0" />

          <input
            className="bg-transparent outline-none text-sm w-full placeholder:text-muted"
            placeholder={t("users.searchPlaceholder", "Buscar por nome, e-mail, perfil, permissão ou idioma...")}
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
            <option value="all">{t("common.all", "Todos")}</option>
            <option value="active">{t("common.active")}</option>
            <option value="inactive">{t("common.inactive")}</option>
            <option value="master">{t("users.masterShort", "Master")}</option>
            <option value="developer">{t("users.developerUser")}</option>
          </select>

          <button
            onClick={handleRefresh}
            className="bg-background border border-border px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition text-sm"
          >
            <RefreshCcw size={15} className={isFetching ? "animate-spin" : ""} />
            {t("common.refresh")}
          </button>
        </div>
      </section>

      {isLoading && (
        <div className="surface-premium rounded-2xl p-4 text-muted text-sm">
          {t("users.loading")}
        </div>
      )}

      {isError && (
        <div className="bg-danger/10 border border-danger/30 text-danger rounded-2xl p-4 text-sm">
          {t("users.error")}
        </div>
      )}

      {!isLoading && !isError && (
        <section className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-3">
          {filteredUsers.map((user) => (
            <article
              key={user.id}
              className="surface-premium rounded-2xl p-4 hover:border-primary/50 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="icon-tile">
                    {user.masterUser ? (
                      <Crown size={19} />
                    ) : (
                      <UserCircle size={20} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <h3 className="text-base font-semibold truncate">
                        {user.name}
                      </h3>

                      {user.id === currentUserId && (
                        <span className="text-[11px] bg-primarySoft text-primary rounded-full px-2 py-0.5 shrink-0">
                          {t("users.you")}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-muted mt-1 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                {user.active ? (
                  <span className="inline-flex items-center gap-1 text-success text-xs shrink-0">
                    <CheckCircle2 size={14} />
                    {t("common.active")}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-danger text-xs shrink-0">
                    <XCircle size={14} />
                    {t("common.inactive")}
                  </span>
                )}
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <InfoBox
                  label={t("users.type")}
                  value={
                    user.masterUser
                      ? t("users.masterUser")
                      : user.developerUser
                        ? t("users.developerUser")
                        : t("users.commonUser")
                  }
                  icon={
                    user.masterUser || user.developerUser ? (
                      <Crown size={14} className="text-primary" />
                    ) : undefined
                  }
                />

                <InfoBox
                  label={t("common.language")}
                  value={getLanguageLabel(
                    internationalizationOptions,
                    user.languageCode,
                    t("users.useTenantLanguage")
                  )}
                  icon={<Globe2 size={14} className="text-primary" />}
                />

                <InfoBox label="ID" value={user.id.slice(0, 8)} />
              </div>

              <AccessBox
                title={t("users.profiles")}
                emptyLabel={t("users.noProfiles")}
                items={user.profiles ?? user.roles ?? []}
              />

              <AccessBox
                title={t("users.directPermissions")}
                emptyLabel={t("users.noDirectPermissions")}
                items={user.permissions ?? []}
              />

              <AccessBox
                title={t("users.effectivePermissions")}
                emptyLabel={t("users.noEffectivePermissions")}
                items={user.effectivePermissions ?? []}
              />

              <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-3">
                <span className="text-xs text-muted truncate">
                  {user.email}
                </span>

                {canManageUsers() && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleEdit(user)}
                      className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:border-primary hover:text-primary transition"
                      title={t("common.edit")}
                    >
                      <Edit size={14} />
                    </button>

                    <button
                      onClick={() => {
                        handleDelete(user).catch(() => {
                          alert(t("messages.unexpectedError"))
                        })
                      }}
                      disabled={
                        deleteLoadingId === user.id ||
                        user.id === currentUserId ||
                        user.masterUser
                      }
                      className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:border-danger hover:text-danger transition disabled:opacity-50 disabled:cursor-not-allowed"
                      title={t("common.delete")}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}

          {filteredUsers.length === 0 && (
            <div className="xl:col-span-2 2xl:col-span-3 surface-premium rounded-2xl p-8 text-center text-muted">
              {t("users.noResults")}
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
            alert(t("users.createdRefreshError", "Usuário criado, mas não foi possível atualizar a lista."))
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
            alert(t("users.updatedRefreshError", "Usuário atualizado, mas não foi possível atualizar a lista."))
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

function AccessBox({
  title,
  emptyLabel,
  items,
}: {
  title: string
  emptyLabel: string
  items: string[]
}) {
  return (
    <div className="mt-3 surface-muted rounded-2xl p-3 min-h-[76px]">
      <p className="text-[11px] uppercase tracking-wide text-muted mb-2">
        {title}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {items.length > 0 ? (
          items.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 bg-primarySoft text-primary px-2.5 py-1 rounded-full text-xs font-medium"
            >
              <ShieldCheck size={12} />
              {item}
            </span>
          ))
        ) : (
          <span className="text-xs text-muted">
            {emptyLabel}
          </span>
        )}
      </div>
    </div>
  )
}