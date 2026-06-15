import { useState } from "react"
import type { FormEvent } from "react"
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  UserCircle,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { isLanguageCode } from "../../i18n"
import { useTranslation } from "../../hooks/useTranslation"
import { AuthService } from "../../services/auth.service"
import { useAuthStore } from "../../store/auth.store"
import { useLanguageStore } from "../../store/language.store"

export function LoginPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const setAuth = useAuthStore((state) => state.setAuth)
  const setLanguage = useLanguageStore((state) => state.setLanguage)

  const [email, setEmail] = useState("admin@demo.pt")
  const [password, setPassword] = useState("123456")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = await AuthService.login({
        email: email.trim().toLowerCase(),
        password,
      })

      setAuth(data)

      const loginLanguage =
        data.resolvedLanguageCode ||
        data.languageCode ||
        data.tenantLanguageCode

      if (isLanguageCode(loginLanguage)) {
        setLanguage(loginLanguage)
      }

      navigate("/dashboard")
    } catch {
      setError(t("auth.invalidCredentials"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen overflow-hidden bg-background text-text flex items-center justify-center px-4 py-4">
      <div className="w-full max-w-[1180px] max-h-[92vh] grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-4 items-stretch">
        <section className="hidden lg:flex surface-premium rounded-3xl p-6 xl:p-7 flex-col justify-between overflow-hidden relative h-full">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_10%,color-mix(in_srgb,var(--color-primary)_18%,transparent),transparent_34%)]" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-primarySoft px-3 py-1.5 text-primary text-xs font-semibold">
              <Sparkles size={14} />
              {t("app.description")}
            </div>

            <h1 className="text-3xl xl:text-4xl font-black mt-5 leading-tight max-w-xl">
              {t("topbar.system")}
            </h1>

            <p className="text-muted mt-3 text-sm leading-relaxed max-w-2xl">
              {t("app.description")}
            </p>
          </div>

          <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            <FeatureCard
              title={t("dashboard.multiEnvironment")}
              description={t("settings.tenantsDescription")}
            />

            <FeatureCard
              title={t("dashboard.security")}
              description="JWT + RBAC"
            />

            <FeatureCard
              title={t("settings.governance")}
              description={t("settings.profilesDescription")}
            />
          </div>

          <div className="relative mt-6 text-xs text-muted">
            © 2026 Pulso Live Technology. Todos os direitos reservados.
          </div>
        </section>

        <section className="surface-premium rounded-3xl p-4 sm:p-5 lg:p-6 shadow-soft h-full flex flex-col">
          <form onSubmit={handleSubmit} className="space-y-4 flex flex-col h-full">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xl sm:text-2xl font-black text-primary">
                  {t("app.name")}
                </div>

                <p className="text-xs text-muted mt-1">
                  {t("app.description")}
                </p>
              </div>

              <div className="icon-tile">
                <ShieldCheck size={20} />
              </div>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold">
                {t("auth.loginTitle")}
              </h2>

              <p className="text-muted text-sm mt-1.5">
                {t("auth.loginSubtitle")}
              </p>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="block text-xs text-muted mb-1.5">
                  {t("auth.email")}
                </span>

                <div className="flex items-center field-input px-0 py-0 focus-within:border-primary">
                  <div className="w-10 flex items-center justify-center text-muted">
                    <UserCircle size={17} />
                  </div>

                  <input
                    className="w-full bg-transparent py-2.5 pr-4 outline-none text-sm"
                    placeholder="usuario@empresa.com"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="block text-xs text-muted mb-1.5">
                  {t("auth.password")}
                </span>

                <div className="flex items-center field-input px-0 py-0 focus-within:border-primary">
                  <div className="w-10 flex items-center justify-center text-muted">
                    <LockKeyhole size={17} />
                  </div>

                  <input
                    className="w-full bg-transparent py-2.5 pr-2 outline-none text-sm"
                    placeholder={t("auth.password")}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="w-10 h-10 flex items-center justify-center text-muted hover:text-primary transition"
                    title={
                      showPassword
                        ? t("common.hidePassword")
                        : t("common.showPassword")
                    }
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>
            </div>

            {error && (
              <div className="bg-danger/10 border border-danger/30 text-danger rounded-2xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-semibold py-2.5 rounded-full hover:shadow-neon transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? t("auth.loggingIn") : t("auth.loginButton")}
              {!loading && <ArrowRight size={16} />}
            </button>

            <div className="surface-muted rounded-2xl px-4 py-3">
              <p className="text-[11px] uppercase tracking-wide text-muted">
                {t("dashboard.environment")}
              </p>

              <p className="text-sm font-semibold mt-1 text-primary">
                {t("dashboard.localEnterpriseProduction")}
              </p>
            </div>

            <p className="text-xs text-muted text-center mt-auto pt-4">
              © 2026 Pulso Live Technology. Todos os direitos reservados.
            </p>
          </form>
        </section>
      </div>
    </div>
  )
}

function FeatureCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="surface-muted rounded-2xl p-3.5">
      <p className="text-sm font-semibold">{title}</p>

      <p className="text-xs text-muted mt-1">{description}</p>
    </div>
  )
}