import {
  Bell,
  ChevronDown,
  Languages,
  LogOut,
  Moon,
  Settings,
  Sun,
  UserCircle,
} from "lucide-react"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { availableLanguages } from "../../i18n"
import { useAuthStore } from "../../store/auth.store"
import { useLanguageStore } from "../../store/language.store"
import { useThemeStore } from "../../store/theme.store"
import type { LanguageCode } from "../../i18n"

const pageTitles: Record<string, string> = {
  "/dashboard": "Painel",
  "/tenants": "Ambientes",
  "/users": "Usuários",
  "/settings": "Configurações",
  "/settings/profiles": "Perfis",
  "/settings/permissions": "Permissões",
  "/settings/internationalization": "Internacionalização",
  "/settings/security": "Segurança",
  "/settings/sessions": "Sessões",
  "/settings/audit": "Auditoria",
  "/settings/tenants": "Ambientes",
  "/settings/branding": "Identidade visual",
  "/settings/countries": "Países e fiscal",
  "/settings/integrations": "Integrações",
  "/settings/network": "Rede local",
  "/settings/hardware": "Equipamentos",
  "/settings/policies": "Políticas",
}

export function Topbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const canViewSettings = useAuthStore((state) => state.canViewSettings)
  const language = useLanguageStore((state) => state.language)
  const setLanguage = useLanguageStore((state) => state.setLanguage)
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const [languageOpen, setLanguageOpen] = useState(false)

  const pageTitle = pageTitles[location.pathname] || "ShowbarManager"

  function handleLogout() {
    logout()
    navigate("/login")
  }

  function getLanguageShortLabel(value: string) {
    if (value === "pt-PT") return "PT"
    if (value === "pt-BR") return "BR"
    if (value === "en-US") return "EN"
    if (value === "es-ES") return "ES"

    return value.slice(0, 2).toUpperCase()
  }

  return (
    <header className="h-16 shrink-0 border-b border-border bg-background/90 backdrop-blur-xl flex items-center justify-between px-3 sm:px-4 lg:px-5">
      <div className="min-w-0">
        <h1 className="text-base lg:text-lg font-semibold truncate">
          {pageTitle}
        </h1>

        <p className="hidden sm:block text-xs text-muted truncate">
          ShowbarManager Empresarial
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setLanguageOpen((value) => !value)}
            className="h-9 rounded-full bg-card border border-border flex items-center gap-2 px-3 hover:border-primary hover:text-primary transition shadow-card"
            title="Idioma"
          >
            <Languages size={16} />

            <span className="text-xs font-semibold">
              {getLanguageShortLabel(language)}
            </span>

            <ChevronDown size={14} />
          </button>

          {languageOpen && (
            <div className="absolute right-0 top-11 w-56 bg-card border border-border rounded-2xl shadow-soft p-2 z-50">
              {availableLanguages.map((item) => (
                <button
                  type="button"
                  key={item.value}
                  onClick={() => {
                    setLanguage(item.value as LanguageCode)
                    setLanguageOpen(false)
                  }}
                  className={[
                    "w-full text-left rounded-xl px-3 py-2 text-sm transition",
                    item.value === language
                      ? "bg-primary text-white font-semibold"
                      : "text-muted hover:text-text hover:bg-background",
                  ].join(" ")}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary hover:text-primary transition shadow-card"
          title={theme === "dark" ? "Modo claro" : "Modo escuro"}
        >
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <button
          type="button"
          className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary hover:text-primary transition shadow-card"
          title="Notificações"
        >
          <Bell size={17} />
        </button>

        {canViewSettings() && (
          <button
            type="button"
            onClick={() => navigate("/settings")}
            className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary hover:text-primary transition shadow-card"
            title="Configurações"
          >
            <Settings size={17} />
          </button>
        )}

        <div className="hidden lg:flex items-center gap-2 bg-card border border-border rounded-full px-3 py-2 max-w-[260px] shadow-card">
          <UserCircle size={20} className="text-primary shrink-0" />

          <div className="leading-tight min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.name || "Usuário"}
            </p>

            <p className="text-[11px] text-muted truncate">
              {user?.email || "sessão ativa"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center hover:border-danger hover:text-danger transition shadow-card"
          title="Sair"
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  )
}