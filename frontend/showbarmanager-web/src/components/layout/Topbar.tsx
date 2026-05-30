import {
  Bell,
  FileSearch,
  LogOut,
  Search,
  Settings,
  ShieldCheck,
  UserCircle,
  Users,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../store/auth.store"

export function Topbar() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const canViewSettings = useAuthStore((state) => state.canViewSettings)

  function handleLogout() {
    logout()
    navigate("/login")
  }

  return (
    <header className="h-20 border-b border-border bg-background/80 backdrop-blur-xl flex items-center justify-between px-6">
      <div>
        <h1 className="text-xl font-semibold">
          Painel Administrativo
        </h1>

        <p className="text-sm text-muted">
          Ambiente enterprise do ShowbarManager
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 w-72">
          <Search size={16} className="text-muted" />

          <input
            className="bg-transparent outline-none text-sm w-full placeholder:text-muted"
            placeholder="Buscar no sistema..."
          />
        </div>

        <button
          className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:border-neon hover:text-neon transition"
          title="Notificações"
        >
          <Bell size={18} />
        </button>

        {canViewSettings() && (
          <>
            <button
              onClick={() => navigate("/settings")}
              className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:border-neon hover:text-neon transition"
              title="Configurações"
            >
              <Settings size={18} />
            </button>

            <button
              onClick={() => navigate("/settings/profiles")}
              className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:border-neon hover:text-neon transition"
              title="Perfis e Grupos"
            >
              <Users size={18} />
            </button>

            <button
              onClick={() => navigate("/settings/permissions")}
              className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:border-neon hover:text-neon transition"
              title="Permissões"
            >
              <ShieldCheck size={18} />
            </button>

            <button
              onClick={() => navigate("/settings/audit")}
              className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:border-neon hover:text-neon transition"
              title="Auditoria"
            >
              <FileSearch size={18} />
            </button>
          </>
        )}

        <div className="hidden lg:flex items-center gap-3 bg-card border border-border rounded-full px-4 py-2">
          <UserCircle size={22} className="text-neon" />

          <div className="leading-tight">
            <p className="text-sm font-medium">
              {user?.name || "Usuário"}
            </p>

            <p className="text-xs text-muted">
              {user?.email || "sessão ativa"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:border-red-400 hover:text-red-300 transition"
          title="Sair"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}