import { useEffect, useState } from "react"
import type { ComponentType, ReactNode } from "react"
import {
  Activity,
  Building2,
  ChevronDown,
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
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { useAuthStore } from "../../store/auth.store"

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

interface SidebarItem {
  label: string
  path: string
  icon: ComponentType<{ size?: number }>
  roles?: string[]
}

const mainMenu: SidebarItem[] = [
  {
    label: "Painel",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: [],
  },
  {
    label: "Ambientes",
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
]

const settingsMenu: SidebarItem[] = [
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
    label: "Internacionalização",
    path: "/settings/internationalization",
    icon: Globe2,
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
  const navigate = useNavigate()
  const hasAnyRole = useAuthStore((state) => state.hasAnyRole)
  const [settingsOpen, setSettingsOpen] = useState(
    location.pathname.startsWith("/settings")
  )

  const canViewSettings = hasAnyRole([
    "ADMIN_MASTER",
    "DEVELOPER_MASTER",
    "TENANT_ADMIN",
  ])

  const visibleMainMenu = mainMenu.filter((item) => {
    if (!item.roles || item.roles.length === 0) return true
    return hasAnyRole(item.roles)
  })

  const settingsActive = location.pathname.startsWith("/settings")

  useEffect(() => {
    if (settingsActive && !collapsed) {
      setSettingsOpen(true)
    }
  }, [settingsActive, collapsed])

  function handleSettingsClick() {
    if (collapsed) {
      navigate("/settings")
      return
    }

    if (!settingsActive) {
      navigate("/settings")
      setSettingsOpen(true)
      return
    }

    setSettingsOpen((value) => !value)
  }

  return (
    <aside
      className={[
        "h-screen shrink-0 border-r border-border bg-card/95 backdrop-blur-xl transition-all duration-300 overflow-hidden",
        collapsed ? "w-[82px]" : "w-[264px]",
      ].join(" ")}
    >
      <div className="h-full flex flex-col">
        <div className={collapsed ? "px-3 pt-4 pb-3" : "px-4 pt-4 pb-3"}>
          {!collapsed ? (
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-lg font-black text-primary leading-tight truncate">
                  ShowbarManager
                </div>

                <div className="text-[11px] text-muted mt-1 truncate">
                  ERP Complete Ecosystem
                </div>
              </div>

              <ToggleButton collapsed={collapsed} onToggle={onToggle} />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xs shadow-neon shrink-0">
                SM
              </div>

              <ToggleButton collapsed={collapsed} onToggle={onToggle} />
            </div>
          )}
        </div>

        <div className="px-3 pb-3 flex-1 min-h-0 overflow-y-auto sidebar-scrollbar">
          <nav className="space-y-5">
            <MenuGroup title="Principal" collapsed={collapsed}>
              {visibleMainMenu.map((item) => (
                <SidebarLink
                  key={item.path}
                  item={item}
                  collapsed={collapsed}
                />
              ))}
            </MenuGroup>

            {canViewSettings && (
              <MenuGroup title="Administração" collapsed={collapsed}>
                <button
                  type="button"
                  onClick={handleSettingsClick}
                  className={[
                    "w-full flex items-center rounded-2xl transition-all duration-200",
                    collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5",
                    "text-sm font-semibold",
                    settingsActive
                      ? "bg-primary text-white shadow-neon"
                      : "text-muted hover:text-text hover:bg-background",
                  ].join(" ")}
                  title={collapsed ? "Configurações" : undefined}
                >
                  <Settings size={17} />

                  {!collapsed && (
                    <>
                      <span className="truncate flex-1 text-left">
                        Configurações
                      </span>

                      <ChevronDown
                        size={14}
                        className={[
                          "transition-transform",
                          settingsOpen ? "rotate-180" : "",
                        ].join(" ")}
                      />
                    </>
                  )}
                </button>

                {settingsOpen && !collapsed && (
                  <div className="space-y-1.5 pl-2 pt-1">
                    {settingsMenu.map((item) => (
                      <SidebarLink
                        key={item.path}
                        item={item}
                        collapsed={collapsed}
                        compact
                      />
                    ))}
                  </div>
                )}
              </MenuGroup>
            )}
          </nav>
        </div>

        <div className="px-4 pb-4">
          {!collapsed ? (
            <div className="rounded-2xl border border-border bg-background/70 px-3 py-3 shadow-card">
              <p className="text-[10px] uppercase tracking-wide text-muted">
                ShowbarManager ERP
              </p>

              <strong className="text-sm text-primary block mt-1">
                v0.4.4 Enterprise
              </strong>

              <p className="text-[10px] text-muted mt-2 leading-relaxed">
                © 2026 Pulso Live Technology.
                <br />
                Todos os direitos reservados.
              </p>
            </div>
          ) : (
            <div className="h-11 rounded-2xl border border-border bg-background/70 flex items-center justify-center shadow-card">
              <span className="text-[10px] text-primary font-bold">
                v0.4
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

function ToggleButton({
  collapsed,
  onToggle,
}: {
  collapsed: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:border-primary hover:text-primary transition shrink-0"
      title={collapsed ? "Expandir menu" : "Recolher menu"}
    >
      {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
    </button>
  )
}

function MenuGroup({
  title,
  collapsed,
  children,
}: {
  title: string
  collapsed: boolean
  children: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      {!collapsed && (
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted px-3 pb-1">
          {title}
        </p>
      )}

      {children}
    </div>
  )
}

function SidebarLink({
  item,
  collapsed,
  compact,
}: {
  item: SidebarItem
  collapsed: boolean
  compact?: boolean
}) {
  const Icon = item.icon

  return (
    <NavLink
      to={item.path}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        [
          "flex items-center rounded-2xl transition-all duration-200",
          collapsed
            ? "justify-center px-0 py-2.5"
            : compact
              ? "gap-2.5 px-3 py-2"
              : "gap-3 px-3 py-2.5",
          compact ? "text-xs font-semibold" : "text-sm font-semibold",
          isActive
            ? "bg-primary text-white shadow-neon"
            : "text-muted hover:text-text hover:bg-background",
        ].join(" ")
      }
    >
      <Icon size={compact ? 15 : 17} />

      {!collapsed && <span className="truncate">{item.label}</span>}
    </NavLink>
  )
}