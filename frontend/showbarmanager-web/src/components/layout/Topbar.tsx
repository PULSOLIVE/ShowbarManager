import {
  Bell,
  ChevronDown,
  Languages,
  LogOut,
  Moon,
  Settings,
  ShieldCheck,
  Sun,
  UserCircle,
} from "lucide-react"
import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useLocation, useNavigate } from "react-router-dom"
import { availableLanguages, isLanguageCode } from "../../i18n"
import { useTranslation } from "../../hooks/useTranslation"
import { InternationalizationService } from "../../services/internationalization.service"
import { useAuthStore } from "../../store/auth.store"
import { useLanguageStore } from "../../store/language.store"
import { useThemeStore } from "../../store/theme.store"
import type { Internationalization } from "../../types/internationalization.types"
import type { LanguageCode } from "../../i18n"

const pageTitleKeys: Record<string, string> = {
  "/dashboard": "menu.dashboard",
  "/tenants": "menu.tenants",
  "/users": "menu.users",
  "/settings": "menu.settings",
  "/settings/users": "menu.users",
  "/settings/profiles": "menu.profiles",
  "/settings/permissions": "menu.permissions",
  "/settings/internationalization": "menu.internationalization",
  "/settings/security": "menu.security",
  "/settings/sessions": "menu.sessions",
  "/settings/audit": "menu.audit",
  "/settings/tenants": "menu.tenants",
  "/settings/branding": "menu.branding",
  "/settings/countries": "menu.countries",
  "/settings/integrations": "menu.integrations",
  "/settings/network": "menu.network",
  "/settings/hardware": "menu.hardware",
  "/settings/policies": "menu.policies",
}

interface LanguageOption {
  label: string
  value: LanguageCode
  flag: string
  priority: number
}

function normalizeLanguageCode(value: string | null | undefined) {
  return value?.replace("_", "-")
}

function buildLanguageOptions(items: Internationalization[]): LanguageOption[] {
  const activeItems = items.filter((item) => item.active)
  const activeMap = new Map<string, Internationalization>()

  activeItems.forEach((item) => {
    const normalizedCode = normalizeLanguageCode(item.languageCode)

    if (normalizedCode && !activeMap.has(normalizedCode)) {
      activeMap.set(normalizedCode, item)
    }
  })

  return availableLanguages
    .map((language, index) => {
      const item = activeMap.get(language.value)

      return {
        label: item?.languageName || language.label,
        value: language.value,
        flag: item?.flagEmoji || language.flag,
        priority: item?.priority ?? index + 1,
      }
    })
    .sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority
      return a.label.localeCompare(b.label)
    })
}

function getLanguageShortLabel(value: string) {
  if (value === "pt-PT") return "PT"
  if (value === "pt-BR") return "BR"
  if (value.startsWith("en")) return "EN"
  if (value.startsWith("es")) return "ES"
  if (value.startsWith("fr")) return "FR"
  if (value.startsWith("de")) return "DE"
  if (value.startsWith("it")) return "IT"
  if (value.startsWith("zh")) return "ZH"
  if (value.startsWith("ja")) return "JA"
  if (value.startsWith("ar")) return "AR"
  if (value.startsWith("ru")) return "RU"
  if (value.startsWith("uk")) return "UK"
  if (value.startsWith("id")) return "ID"
  if (value.startsWith("ko")) return "KO"
  if (value.startsWith("bn")) return "BN"
  if (value.startsWith("hi")) return "HI"
  if (value.startsWith("el")) return "EL"
  if (value.startsWith("nl")) return "NL"
  if (value.startsWith("da")) return "DA"
  if (value.startsWith("bg")) return "BG"

  return value.slice(0, 2).toUpperCase()
}

export function Topbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const canViewSettings = useAuthStore((state) => state.canViewSettings)
  const language = useLanguageStore((state) => state.language)
  const setLanguage = useLanguageStore((state) => state.setLanguage)
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const { data: activeInternationalizations = [] } = useQuery({
    queryKey: ["topbar-active-languages"],
    queryFn: InternationalizationService.listActive,
  })

  const languageOptions = useMemo(() => {
    return buildLanguageOptions(activeInternationalizations)
  }, [activeInternationalizations])

  const currentLanguage =
    languageOptions.find((item) => item.value === language) ||
    languageOptions.find((item) => item.value === "pt-PT")

  const pageTitle = t(
    pageTitleKeys[location.pathname] || "app.name",
    "ShowbarManager"
  )

  function handleLogout() {
    const confirmed = window.confirm(t("topbar.logoutConfirm"))

    if (!confirmed) {
      return
    }

    logout()
    navigate("/login")
  }

  function handleLanguageChange(languageCode: string) {
    const normalizedCode = normalizeLanguageCode(languageCode)

    if (isLanguageCode(normalizedCode)) {
      setLanguage(normalizedCode)
      setLanguageOpen(false)
      return
    }

    alert("Idioma ainda não possui dicionário local no frontend.")
  }

  function handleNavigate(path: string) {
    setUserMenuOpen(false)
    setLanguageOpen(false)
    navigate(path)
  }

  return (
    <header className="h-16 shrink-0 border-b border-border bg-background/90 backdrop-blur-xl flex items-center justify-between px-3 sm:px-4 lg:px-5">
      <div className="min-w-0">
        <h1 className="text-base lg:text-lg font-semibold truncate">
          {pageTitle}
        </h1>

        <p className="hidden sm:block text-xs text-muted truncate">
          {t("topbar.system")}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setLanguageOpen((value) => !value)
              setUserMenuOpen(false)
            }}
            className="h-9 rounded-full bg-card border border-border flex items-center gap-2 px-3 hover:border-primary hover:text-primary transition shadow-card"
            title={t("topbar.language")}
          >
            <Languages size={16} />

            <span className="text-sm leading-none">
              {currentLanguage?.flag || "🌐"}
            </span>

            <span className="text-xs font-semibold">
              {getLanguageShortLabel(language)}
            </span>

            <ChevronDown size={14} />
          </button>

          {languageOpen && (
            <div className="absolute right-0 top-12 w-72 bg-card border border-border rounded-2xl shadow-soft p-2 z-50">
              <div className="px-3 py-2 border-b border-border mb-2">
                <p className="text-xs font-semibold text-text">
                  {t("topbar.systemLanguage")}
                </p>

                <p className="text-[11px] text-muted mt-0.5">
                  {t("topbar.selectActiveLanguage")}
                </p>
              </div>

              <div className="max-h-72 overflow-y-auto app-scrollbar pr-1">
                {languageOptions.length > 0 ? (
                  languageOptions.map((item) => (
                    <button
                      type="button"
                      key={item.value}
                      onClick={() => handleLanguageChange(item.value)}
                      className={[
                        "w-full text-left rounded-xl px-3 py-2 text-sm transition flex items-center justify-between gap-3",
                        item.value === language
                          ? "bg-primary text-white font-semibold"
                          : "text-muted hover:text-text hover:bg-background",
                      ].join(" ")}
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <span>{item.flag || "🌐"}</span>

                        <span className="truncate">{item.label}</span>
                      </span>

                      <span
                        className={[
                          "text-[11px] font-semibold shrink-0",
                          item.value === language
                            ? "text-white/80"
                            : "text-primary",
                        ].join(" ")}
                      >
                        {getLanguageShortLabel(item.value)}
                      </span>
                    </button>
                  ))
                ) : (
                  <span className="block px-3 py-2 text-sm text-muted">
                    {t("topbar.noActiveLanguage")}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary hover:text-primary transition shadow-card"
          title={theme === "dark" ? t("topbar.themeLight") : t("topbar.themeDark")}
        >
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <button
          type="button"
          className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary hover:text-primary transition shadow-card"
          title={t("topbar.notifications")}
        >
          <Bell size={17} />
        </button>

        {canViewSettings() && (
          <button
            type="button"
            onClick={() => handleNavigate("/settings")}
            className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary hover:text-primary transition shadow-card"
            title={t("topbar.settings")}
          >
            <Settings size={17} />
          </button>
        )}

        <div className="relative hidden lg:block">
          <button
            type="button"
            onClick={() => {
              setUserMenuOpen((value) => !value)
              setLanguageOpen(false)
            }}
            className="flex items-center gap-2 bg-card border border-border rounded-full px-3 py-2 max-w-[270px] shadow-card hover:border-primary hover:text-primary transition"
            title={t("topbar.userMenu")}
          >
            <UserCircle size={20} className="text-primary shrink-0" />

            <div className="leading-tight min-w-0 text-left">
              <p className="text-sm font-medium truncate">
                {user?.name || t("users.commonUser")}
              </p>

              <p className="text-[11px] text-muted truncate">
                {user?.email || t("topbar.activeSession")}
              </p>
            </div>

            <ChevronDown
              size={14}
              className={[
                "shrink-0 transition-transform",
                userMenuOpen ? "rotate-180" : "",
              ].join(" ")}
            />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-14 w-52 bg-card border border-border rounded-2xl shadow-soft p-2 z-50">
              <button
                type="button"
                onClick={() => handleNavigate("/settings/users")}
                className="w-full text-left rounded-xl px-3 py-2.5 transition flex items-start gap-2 bg-background/60 hover:bg-background"
              >
                <UserCircle size={20} className="text-primary shrink-0 mt-0.5" />

                <span className="min-w-0">
                  <span className="block text-sm font-semibold truncate">
                    {user?.name || t("users.commonUser")}
                  </span>

                  <span className="block text-xs text-muted truncate mt-0.5">
                    {user?.email || t("topbar.activeSession")}
                  </span>
                </span>
              </button>

              <div className="py-2">
                <button
                  type="button"
                  onClick={() => handleNavigate("/settings/users")}
                  className="w-full text-left rounded-xl px-3 py-2 text-sm transition flex items-center gap-2 text-muted hover:text-text hover:bg-background"
                >
                  <UserCircle size={16} />
                  {t("topbar.myProfile")}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate("/settings/security")}
                  className="w-full text-left rounded-xl px-3 py-2 text-sm transition flex items-center gap-2 text-muted hover:text-text hover:bg-background"
                >
                  <ShieldCheck size={16} />
                  {t("topbar.accountSecurity")}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate("/settings/sessions")}
                  className="w-full text-left rounded-xl px-3 py-2 text-sm transition flex items-center gap-2 text-muted hover:text-text hover:bg-background"
                >
                  <Settings size={16} />
                  {t("topbar.activeSessions")}
                </button>
              </div>

              <div className="border-t border-border pt-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left rounded-xl px-3 py-2 text-sm transition flex items-center gap-2 text-danger hover:bg-danger/10"
                >
                  <LogOut size={16} />
                  {t("topbar.logout")}
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center hover:border-danger hover:text-danger transition shadow-card"
          title={t("topbar.logout")}
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  )
}