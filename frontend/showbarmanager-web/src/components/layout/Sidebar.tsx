import { useEffect, useMemo, useState } from "react"
import type { ComponentType, ReactNode } from "react"
import packageJson from "../../../package.json"
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
import { useTranslation } from "../../hooks/useTranslation"
import { BrandingService } from "../../services/branding.service"
import { useAuthStore } from "../../store/auth.store"
import type { BrandingAssetKey } from "../../types/branding.types"

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

interface SidebarItem {
  labelKey: string
  path: string
  icon: ComponentType<{ size?: number }>
  roles?: string[]
  permissions?: string[]
}

type BrandingLogoMap = Record<BrandingAssetKey, string | null>

const appVersion =
  import.meta.env.VITE_APP_VERSION || packageJson.version || "0.0.0"

const brandingLogoKeys: BrandingAssetKey[] = [
  "sidebarLogoUrl",
  "sidebarCollapsedLogoUrl",
  "darkLogoUrl",
  "lightLogoUrl",
  "reportLogoUrl",
  "mobileLogoUrl",
  "faviconUrl",
  "darkSidebarLogoUrl",
  "darkSidebarCollapsedLogoUrl",
  "darkReportLogoUrl",
  "darkMobileLogoUrl",
  "darkFaviconUrl",
  "darkLoginLogoUrl",
  "lightSidebarLogoUrl",
  "lightSidebarCollapsedLogoUrl",
  "lightReportLogoUrl",
  "lightMobileLogoUrl",
  "lightFaviconUrl",
  "lightLoginLogoUrl",
]

const emptyBrandingLogos: BrandingLogoMap = {
  sidebarLogoUrl: null,
  sidebarCollapsedLogoUrl: null,
  darkLogoUrl: null,
  lightLogoUrl: null,
  reportLogoUrl: null,
  mobileLogoUrl: null,
  faviconUrl: null,
  darkSidebarLogoUrl: null,
  darkSidebarCollapsedLogoUrl: null,
  darkReportLogoUrl: null,
  darkMobileLogoUrl: null,
  darkFaviconUrl: null,
  darkLoginLogoUrl: null,
  lightSidebarLogoUrl: null,
  lightSidebarCollapsedLogoUrl: null,
  lightReportLogoUrl: null,
  lightMobileLogoUrl: null,
  lightFaviconUrl: null,
  lightLoginLogoUrl: null,
}

const mainMenu: SidebarItem[] = [
  {
    labelKey: "menu.dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: [],
  },
  {
    labelKey: "menu.tenants",
    path: "/tenants",
    icon: Building2,
    roles: ["ADMIN_MASTER", "DEVELOPER_MASTER", "TENANT_ADMIN"],
    permissions: ["TENANTS_VIEW"],
  },
]

const settingsMenu: SidebarItem[] = [
  { labelKey: "menu.users", path: "/settings/users", icon: Users, permissions: ["USERS_VIEW"] },
  { labelKey: "menu.tenants", path: "/settings/tenants", icon: Building2, permissions: ["TENANTS_VIEW"] },
  { labelKey: "menu.profiles", path: "/settings/profiles", icon: Users, permissions: ["PROFILES_VIEW"] },
  { labelKey: "menu.permissions", path: "/settings/permissions", icon: KeyRound, permissions: ["PERMISSIONS_VIEW"] },
  { labelKey: "menu.internationalization", path: "/settings/internationalization", icon: Globe2, permissions: ["INTERNATIONALIZATION_VIEW"] },
  { labelKey: "menu.security", path: "/settings/security", icon: ShieldCheck, permissions: ["SECURITY_VIEW"] },
  { labelKey: "menu.sessions", path: "/settings/sessions", icon: Activity, permissions: ["SESSIONS_VIEW"] },
  { labelKey: "menu.audit", path: "/settings/audit", icon: FileText, permissions: ["AUDIT_VIEW"] },
  { labelKey: "menu.branding", path: "/settings/branding", icon: Palette, permissions: ["BRANDING_VIEW"] },
  { labelKey: "menu.countries", path: "/settings/countries", icon: Globe2, permissions: ["SETTINGS_VIEW"] },
  { labelKey: "menu.integrations", path: "/settings/integrations", icon: PlugZap, permissions: ["INTEGRATIONS_VIEW"] },
  { labelKey: "menu.network", path: "/settings/network", icon: Network, permissions: ["NETWORK_VIEW"] },
  { labelKey: "menu.hardware", path: "/settings/hardware", icon: HardDrive, permissions: ["HARDWARE_VIEW"] },
  { labelKey: "menu.policies", path: "/settings/policies", icon: FileText, permissions: ["POLICIES_VIEW"] },
]

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const hasAnyRole = useAuthStore((state) => state.hasAnyRole)
  const hasAnyPermission = useAuthStore((state) => state.hasAnyPermission)
  const canViewSettings = useAuthStore((state) => state.canViewSettings)

  const [settingsOpen, setSettingsOpen] = useState(
    location.pathname.startsWith("/settings")
  )

  const [themeMode, setThemeMode] = useState<"dark" | "light">(() => {
    if (typeof document === "undefined") return "dark"
    return document.documentElement.dataset.theme === "light" ? "light" : "dark"
  })

  const [brandingLogos, setBrandingLogos] =
    useState<BrandingLogoMap>(emptyBrandingLogos)

  useEffect(() => {
    const root = document.documentElement

    function syncThemeMode() {
      setThemeMode(root.dataset.theme === "light" ? "light" : "dark")
    }

    syncThemeMode()

    const observer = new MutationObserver(syncThemeMode)

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    let mounted = true
    const objectUrls: string[] = []

    async function loadSidebarBranding() {
      try {
        const assets = await BrandingService.listAssets()

        const activeKeys = assets
          .filter((asset) => asset.active)
          .map((asset) => asset.assetKey)

        async function loadLogo(key: BrandingAssetKey) {
          if (!activeKeys.includes(key)) return null

          try {
            const url = await BrandingService.getAssetObjectUrl(key)
            objectUrls.push(url)
            return url
          } catch {
            return null
          }
        }

        const logoEntries = await Promise.all(
          brandingLogoKeys.map(async (key) => {
            const url = await loadLogo(key)
            return [key, url] as const
          })
        )

        if (!mounted) return

        setBrandingLogos({
          ...emptyBrandingLogos,
          ...Object.fromEntries(logoEntries),
        } as BrandingLogoMap)
      } catch {
        if (!mounted) return
      }
    }

    loadSidebarBranding()

    return () => {
      mounted = false
      objectUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  const openedLogoUrl = useMemo(() => {
    if (themeMode === "light") {
      return (
        brandingLogos.lightSidebarLogoUrl ||
        brandingLogos.lightLogoUrl ||
        brandingLogos.sidebarLogoUrl ||
        brandingLogos.darkSidebarLogoUrl ||
        brandingLogos.darkLogoUrl ||
        null
      )
    }

    return (
      brandingLogos.darkSidebarLogoUrl ||
      brandingLogos.darkLogoUrl ||
      brandingLogos.sidebarLogoUrl ||
      brandingLogos.lightSidebarLogoUrl ||
      brandingLogos.lightLogoUrl ||
      null
    )
  }, [brandingLogos, themeMode])

  const collapsedLogoUrl = useMemo(() => {
    if (themeMode === "light") {
      return (
        brandingLogos.lightSidebarCollapsedLogoUrl ||
        brandingLogos.lightFaviconUrl ||
        brandingLogos.lightLogoUrl ||
        brandingLogos.sidebarCollapsedLogoUrl ||
        brandingLogos.faviconUrl ||
        brandingLogos.darkSidebarCollapsedLogoUrl ||
        brandingLogos.darkFaviconUrl ||
        brandingLogos.darkLogoUrl ||
        null
      )
    }

    return (
      brandingLogos.darkSidebarCollapsedLogoUrl ||
      brandingLogos.darkFaviconUrl ||
      brandingLogos.darkLogoUrl ||
      brandingLogos.sidebarCollapsedLogoUrl ||
      brandingLogos.faviconUrl ||
      brandingLogos.lightSidebarCollapsedLogoUrl ||
      brandingLogos.lightFaviconUrl ||
      brandingLogos.lightLogoUrl ||
      null
    )
  }, [brandingLogos, themeMode])

  const visibleMainMenu = mainMenu.filter((item) => {
    const allowedByRole =
      !item.roles || item.roles.length === 0 || hasAnyRole(item.roles)

    const allowedByPermission =
      !item.permissions ||
      item.permissions.length === 0 ||
      hasAnyPermission(item.permissions)

    return allowedByRole || allowedByPermission
  })

  const visibleSettingsMenu = settingsMenu.filter((item) => {
    if (!item.roles && !item.permissions) return true

    const allowedByRole = item.roles ? hasAnyRole(item.roles) : false
    const allowedByPermission = item.permissions
      ? hasAnyPermission(item.permissions)
      : false

    return allowedByRole || allowedByPermission
  })

  const settingsActive = location.pathname.startsWith("/settings")
  const settingsExactActive = location.pathname === "/settings"
  const showSettingsMenu = canViewSettings() || visibleSettingsMenu.length > 0

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
        <div className={collapsed ? "px-3 pt-4 pb-4" : "px-4 pt-4 pb-5"}>
          {!collapsed ? (
            <div className="relative">
              <div className="absolute right-0 top-0 z-10">
                <ToggleButton collapsed={collapsed} onToggle={onToggle} />
              </div>

              <div className="w-full flex flex-col items-center text-center">
                {openedLogoUrl ? (
                  <div className="w-full h-[188px] flex items-center justify-center overflow-hidden px-1 pt-1">
                    <img
                      src={openedLogoUrl}
                      alt={t("app.name")}
                      className="w-auto max-w-[230px] h-auto max-h-[170px] object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-full h-[150px] flex items-center justify-center px-8">
                    <div className="text-lg font-black text-primary leading-tight truncate">
                      {t("app.name")}
                    </div>
                  </div>
                )}

                <div className="-mt-1 w-full px-1">
                  <p className="text-[12px] text-muted leading-relaxed line-clamp-3">
                    {t("app.description")}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              {collapsedLogoUrl ? (
                <div className="w-[58px] h-[58px] rounded-2xl bg-background border border-border flex items-center justify-center shadow-neon shrink-0 overflow-hidden">
                  <img
                    src={collapsedLogoUrl}
                    alt={t("app.name")}
                    className="max-w-[48px] max-h-[48px] object-contain"
                  />
                </div>
              ) : (
                <div className="w-[58px] h-[58px] rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xs shadow-neon shrink-0">
                  SM
                </div>
              )}

              <ToggleButton collapsed={collapsed} onToggle={onToggle} />
            </div>
          )}
        </div>

        <div className="px-3 pb-3 flex-1 min-h-0 overflow-y-auto sidebar-scrollbar">
          <nav className="space-y-5">
            <MenuGroup title={t("menu.main")} collapsed={collapsed}>
              {visibleMainMenu.map((item) => (
                <SidebarLink key={item.path} item={item} collapsed={collapsed} />
              ))}
            </MenuGroup>

            {showSettingsMenu && (
              <MenuGroup title={t("menu.administration")} collapsed={collapsed}>
                <button
                  type="button"
                  onClick={handleSettingsClick}
                  className={[
                    "w-full flex items-center rounded-2xl transition-all duration-200",
                    collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5",
                    "text-sm font-semibold",
                    settingsExactActive
                      ? "bg-primary text-white shadow-neon"
                      : settingsActive
                        ? "bg-primarySoft text-primary"
                        : "text-muted hover:text-text hover:bg-background",
                  ].join(" ")}
                  title={collapsed ? t("menu.settings") : undefined}
                >
                  <Settings size={17} />

                  {!collapsed && (
                    <>
                      <span className="truncate flex-1 text-left">
                        {t("menu.settings")}
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
                    {visibleSettingsMenu.map((item) => (
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
                {t("app.name")} ERP
              </p>

              <strong className="text-sm text-primary block mt-1">
                v{appVersion} {t("app.enterprise")}
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
                v{appVersion}
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
      className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center hover:border-primary hover:text-primary transition shrink-0"
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
  const { t } = useTranslation()
  const label = t(item.labelKey)

  return (
    <NavLink
      to={item.path}
      title={collapsed ? label : undefined}
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

      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  )
}