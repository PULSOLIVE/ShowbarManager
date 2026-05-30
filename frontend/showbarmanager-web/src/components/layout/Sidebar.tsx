import {
  Activity,
  Building2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Globe2,
  HardDrive,
  KeyRound,
  LayoutDashboard,
  Network,
  Palette,
  PlugZap,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { useAuthStore } from "../../store/auth.store"

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const menuItems = [
  {
    label: "Painel",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: [],
  },
  {
    label: "Inquilinos",
    path: "/tenants",
    icon: Building2,
    roles: ["ADMIN_MASTER", "DEVELOPER_MASTER", "TENANT_ADMIN"],
  },
  {
    label: "Usuários",
    path: "/users",
    icon: Users,
    roles: ["ADMIN_MASTER", "DEVELOPER_MASTER", "TENANT_ADMIN"],
  },
  {
    label: "Configurações",
    path: "/settings",
    icon: Settings,
    roles: ["ADMIN_MASTER", "DEVELOPER_MASTER"],
  },
]

const settingsSubmenu = [
  {
    label: "Perfis",
    path: "/settings/profiles",
    icon: Users,
  },
  {
    label: "Permissões",
    path: "/settings/permissions",
    icon: KeyRound,
  },
  {
    label: "Segurança",
    path: "/settings/security",
    icon: ShieldCheck,
  },
  {
    label: "Sessões",
    path: "/settings/sessions",
    icon: Activity,
  },
  {
    label: "Auditoria",
    path: "/settings/audit",
    icon: FileText,
  },
  {
    label: "Branding",
    path: "/settings/branding",
    icon: Palette,
  },
  {
    label: "Países/Fiscal",
    path: "/settings/countries",
    icon: Globe2,
  },
  {
    label: "Integrações",
    path: "/settings/integrations",
    icon: PlugZap,
  },
  {
    label: "Rede Local",
    path: "/settings/network",
    icon: Network,
  },
  {
    label: "Hardware",
    path: "/settings/hardware",
    icon: HardDrive,
  },
  {
    label: "Políticas",
    path: "/settings/policies",
    icon: FileText,
  },
]

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation()
  const hasAnyRole = useAuthStore((state) => state.hasAnyRole)

  const canViewSettings = hasAnyRole(["ADMIN_MASTER", "DEVELOPER_MASTER"])
  const isSettingsArea = location.pathname.startsWith("/settings")

  const visibleItems = menuItems.filter((item) => {
    if (item.roles.length === 0) {
      return true
    }

    return hasAnyRole(item.roles)
  })

  return (
    <aside
      className={[
        "min-h-screen border-r border-border bg-card/80 backdrop-blur-xl transition-all duration-300 shrink-0",
        collapsed ? "w-24 p-4" : "w-72 p-5",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3 mb-8">
        {!collapsed && (
          <div>
            <div className="text-2xl font-bold text-neon leading-tight">
              ShowbarManager
            </div>

            <div className="text-sm text-muted mt-2">
              ERP Complete Ecosystem
            </div>
          </div>
        )}

        {collapsed && (
          <div className="w-12 h-12 rounded-2xl bg-neon/10 border border-neon/30 flex items-center justify-center text-neon font-black">
            SB
          </div>
        )}

        <button
          onClick={onToggle}
          className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center hover:border-neon hover:text-neon transition"
          title={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
        </button>
      </div>

      <nav className="space-y-2">
        {visibleItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                [
                  "flex items-center rounded-2xl transition-all duration-200",
                  collapsed ? "justify-center px-0 py-3" : "gap-3 px-4 py-3",
                  "text-sm font-semibold",
                  isActive
                    ? "bg-neon text-black shadow-neon"
                    : "text-muted hover:text-text hover:bg-white/5",
                ].join(" ")
              }
            >
              <Icon size={18} />

              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          )
        })}

        {canViewSettings && isSettingsArea && (
          <div className={collapsed ? "pt-2 space-y-2" : "pt-3 pl-3 space-y-2"}>
            {!collapsed && (
              <p className="text-[11px] uppercase tracking-wide text-muted px-3">
                Configurações
              </p>
            )}

            {settingsSubmenu.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    [
                      "flex items-center rounded-2xl transition-all duration-200",
                      collapsed ? "justify-center px-0 py-3" : "gap-3 px-3 py-2.5",
                      "text-xs font-semibold",
                      isActive
                        ? "bg-neon/15 text-neon border border-neon/30"
                        : "text-muted hover:text-text hover:bg-white/5",
                    ].join(" ")
                  }
                >
                  <Icon size={15} />

                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              )
            })}
          </div>
        )}
      </nav>
    </aside>
  )
}