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
import { useTranslation } from "../../hooks/useTranslation"
import { PermissionService } from "../../services/permission.service"
import type { Permission } from "../../types/permission.types"

const matrix = [
  {
    profile: "Administrador Master",
    settings: true,
    users: true,
    environments: true,
    audit: true,
    delete: true,
  },
  {
    profile: "Desenvolvedor Master",
    settings: true,
    users: true,
    environments: true,
    audit: true,
    delete: true,
  },
  {
    profile: "Administrador do Ambiente",
    settings: false,
    users: true,
    environments: true,
    audit: false,
    delete: false,
  },
  {
    profile: "Suporte Nível 1",
    settings: false,
    users: false,
    environments: false,
    audit: false,
    delete: false,
  },
  {
    profile: "Suporte Nível 2",
    settings: false,
    users: false,
    environments: false,
    audit: true,
    delete: false,
  },
  {
    profile: "Suporte Nível 3",
    settings: false,
    users: true,
    environments: false,
    audit: true,
    delete: false,
  },
]

function getModuleLabel(value: string, t: (path: string, fallback?: string) => string) {
  const labels: Record<string, string> = {
    AUDIT: t("menu.audit"),
    BRANDING: t("menu.branding"),
    HARDWARE: t("menu.hardware"),
    INTEGRATIONS: t("menu.integrations"),
    INTERNATIONALIZATION: t("menu.internationalization"),
    NETWORK: t("menu.network"),
    PERMISSIONS: t("menu.permissions"),
    POLICIES: t("menu.policies"),
    PROFILES: t("menu.profiles"),
    SECURITY: t("menu.security"),
    SESSIONS: t("menu.sessions"),
    SETTINGS: t("menu.settings"),
    TENANTS: t("menu.tenants"),
    USERS: t("menu.users"),
  }

  return labels[value] || value
}

function getActionLabel(value: string, t: (path: string, fallback?: string) => string) {
  const labels: Record<string, string> = {
    CREATE: t("common.create"),
    DELETE: t("common.delete"),
    MANAGE: t("permissions.manage"),
    UPDATE: t("common.update"),
    VIEW: t("permissions.view"),
  }

  return labels[value] || value
}

export function SettingsPermissionsPage() {
  const { t } = useTranslation()

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
      const moduleLabel = getModuleLabel(permission.module, t).toLowerCase()
      const actionLabel = getActionLabel(permission.action, t).toLowerCase()

      const matchesSearch =
        !term ||
        permission.name.toLowerCase().includes(term) ||
        permission.code.toLowerCase().includes(term) ||
        permission.module.toLowerCase().includes(term) ||
        permission.action.toLowerCase().includes(term) ||
        moduleLabel.includes(term) ||
        actionLabel.includes(term) ||
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
  }, [permissions, search, statusFilter, moduleFilter, t])

  function handleRefresh() {
    refetch()
      .then(() => {
        alert(t("permissions.listUpdated"))
      })
      .catch(() => {
        alert(t("permissions.refreshError"))
      })
  }

  function handleEdit(permission: Permission) {
    setSelectedPermission(permission)
    setEditModalOpen(true)
  }

  async function handleDelete(permission: Permission) {
    if (permission.systemPermission) {
      alert(t("permissions.systemDeleteBlocked"))
      return
    }

    const confirmed = window.confirm(
      `${t("permissions.deleteConfirm")} ${permission.name}?`
    )

    if (!confirmed) {
      return
    }

    try {
      setDeleteLoadingId(permission.id)
      await PermissionService.delete(permission.id)
      await refetch()
    } catch {
      alert(t("permissions.deleteError"))
    } finally {
      setDeleteLoadingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <section className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-sm text-primary font-semibold">
            <KeyRound size={16} />
            {t("settings.title")}
          </span>

          <h2 className="text-2xl xl:text-3xl font-bold mt-1">
            {t("permissions.title")}
          </h2>

          <p className="text-muted mt-2 text-sm max-w-4xl">
            {t("permissions.subtitle")}
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="bg-primary text-white px-4 py-2.5 rounded-full font-semibold flex items-center justify-center gap-2 hover:shadow-neon transition text-sm"
        >
          <Plus size={16} />
          {t("permissions.new")}
        </button>
      </section>

      <section className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <SummaryCard title={t("common.total")} value={String(permissions.length)} icon={<KeyRound size={18} />} />
        <SummaryCard title={t("common.active")} value={String(activePermissionsCount)} icon={<CheckCircle2 size={18} />} />
        <SummaryCard title={t("profiles.system")} value={String(systemPermissionsCount)} icon={<ShieldCheck size={18} />} />
        <SummaryCard title={t("common.filtered")} value={String(filteredPermissions.length)} icon={<Search size={18} />} />
      </section>

      <section className="surface-premium rounded-2xl p-3 flex flex-col xl:flex-row gap-3 xl:items-center xl:justify-between">
        <div className="flex items-center gap-2 bg-background border border-border rounded-full px-4 py-2.5 w-full xl:max-w-md">
          <Search size={15} className="text-muted shrink-0" />

          <input
            placeholder={t("permissions.searchPlaceholder")}
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
            <option value="all">{t("permissions.allModules")}</option>
            {moduleOptions.map((module) => (
              <option key={module} value={module}>
                {getModuleLabel(module, t)}
              </option>
            ))}
          </select>

          <select
            className="bg-background border border-border rounded-full px-4 py-2.5 outline-none text-sm"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">{t("common.all")}</option>
            <option value="active">{t("common.active")}</option>
            <option value="inactive">{t("common.inactive")}</option>
            <option value="system">{t("profiles.system")}</option>
            <option value="custom">{t("profiles.custom")}</option>
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
          {t("permissions.loading")}
        </div>
      )}

      {isError && (
        <div className="bg-danger/10 border border-danger/30 text-danger rounded-2xl p-4 text-sm">
          {t("permissions.error")}
        </div>
      )}

      {!isLoading && !isError && (
        <section className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-3">
          {filteredPermissions.map((permission) => (
            <article
              key={permission.id}
              className="surface-premium rounded-2xl p-4 hover:border-primary/50 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="icon-tile">
                    <KeyRound size={20} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-base font-semibold truncate">
                      {permission.name}
                    </h3>

                    <p className="text-xs text-primary mt-1 truncate">
                      {permission.code}
                    </p>
                  </div>
                </div>

                {permission.active ? (
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

              <p className="text-sm text-muted mt-3 line-clamp-2 min-h-[40px]">
                {permission.description || t("permissions.defaultDescription")}
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <InfoBox label={t("permissions.module")} value={getModuleLabel(permission.module, t)} />
                <InfoBox label={t("permissions.action")} value={getActionLabel(permission.action, t)} />
                <InfoBox label={t("common.priority")} value={String(permission.priority)} />
                <InfoBox
                  label={t("users.type")}
                  value={permission.systemPermission ? t("profiles.system") : t("profiles.custom")}
                  icon={permission.systemPermission ? <ShieldCheck size={14} className="text-primary" /> : undefined}
                />
              </div>

              <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-3">
                <span className="text-xs text-muted">
                  ID: {permission.id.slice(0, 8)}
                </span>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleEdit(permission)}
                    className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:border-primary hover:text-primary transition"
                    title={t("common.edit")}
                  >
                    <Edit size={14} />
                  </button>

                  <button
                    onClick={() => {
                      handleDelete(permission).catch(() => {
                        alert(t("messages.unexpectedError"))
                      })
                    }}
                    disabled={deleteLoadingId === permission.id || permission.systemPermission}
                    className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:border-danger hover:text-danger transition disabled:opacity-50 disabled:cursor-not-allowed"
                    title={t("common.delete")}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </article>
          ))}

          {filteredPermissions.length === 0 && (
            <div className="xl:col-span-2 2xl:col-span-3 surface-premium rounded-2xl p-8 text-center text-muted">
              {t("permissions.noResults")}
            </div>
          )}
        </section>
      )}

      <section className="surface-premium rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <ShieldCheck size={17} className="text-primary" />

          <div>
            <h3 className="text-base font-semibold">
              {t("permissions.initialMatrix")}
            </h3>

            <p className="text-xs text-muted">
              {t("permissions.initialMatrixDescription")}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr_1fr] gap-3 px-4 py-3 border-b border-border text-xs uppercase tracking-wide text-muted">
              <div>{t("profiles.title")}</div>
              <div>{t("permissions.settingsShort")}</div>
              <div>{t("menu.users")}</div>
              <div>{t("menu.tenants")}</div>
              <div>{t("menu.audit")}</div>
              <div>{t("common.delete")}</div>
            </div>

            {matrix.map((row) => (
              <div
                key={row.profile}
                className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr_1fr] gap-3 px-4 py-3 border-b border-border last:border-b-0 hover:bg-primarySoft transition text-sm"
              >
                <strong>{row.profile}</strong>
                <PermissionStatus allowed={row.settings} t={t} />
                <PermissionStatus allowed={row.users} t={t} />
                <PermissionStatus allowed={row.environments} t={t} />
                <PermissionStatus allowed={row.audit} t={t} />
                <PermissionStatus allowed={row.delete} t={t} />
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
            alert(t("permissions.createdRefreshError"))
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
            alert(t("permissions.updatedRefreshError"))
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

function PermissionStatus({
  allowed,
  t,
}: {
  allowed: boolean
  t: (path: string, fallback?: string) => string
}) {
  return allowed ? (
    <span className="inline-flex items-center gap-1 text-success text-sm">
      <CheckCircle2 size={14} />
      {t("common.yes")}
    </span>
  ) : (
    <span className="text-muted text-sm">
      {t("common.no")}
    </span>
  )
}