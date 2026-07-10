import { useEffect, useMemo, useState } from "react"
import type { FormEvent } from "react"
import { ArrowRight, Eye, EyeOff, LockKeyhole, UserCircle } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { isLanguageCode } from "../../i18n"
import { useTranslation } from "../../hooks/useTranslation"
import { AuthService } from "../../services/auth.service"
import { BrandingService } from "../../services/branding.service"
import { useAuthStore } from "../../store/auth.store"
import { useLanguageStore } from "../../store/language.store"
import { useThemeStore } from "../../store/theme.store"
import type { BrandingAssetKey } from "../../types/branding.types"

type LoginAssetMap = Partial<Record<BrandingAssetKey, string | null>>
type ThemeMode = "dark" | "light"

const loginAssetKeys: BrandingAssetKey[] = [
  "darkLoginLogoUrl",
  "lightLoginLogoUrl",
  "darkFaviconUrl",
  "lightFaviconUrl",
  "faviconUrl",
  "darkLogoUrl",
  "lightLogoUrl",
  "darkSidebarLogoUrl",
  "lightSidebarLogoUrl",
  "sidebarLogoUrl",
]

const emptyAssets: LoginAssetMap = {}
const loggedBeforeKey = "showbarmanager.loggedBefore"

function getCurrentThemeMode(): ThemeMode {
  if (typeof document === "undefined") return "dark"
  return document.documentElement.dataset.theme === "light" ? "light" : "dark"
}

function updateFavicon(url: string) {
  let favicon =
    document.querySelector<HTMLLinkElement>("link[rel='icon']") ||
    document.querySelector<HTMLLinkElement>("link[rel='shortcut icon']")

  if (!favicon) {
    favicon = document.createElement("link")
    favicon.rel = "icon"
    document.head.appendChild(favicon)
  }

  favicon.href = url
}

function hasLoggedBefore() {
  if (typeof window === "undefined") return false
  return window.localStorage.getItem(loggedBeforeKey) === "true"
}

export function LoginPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const setAuth = useAuthStore((state) => state.setAuth)
  const setLanguage = useLanguageStore((state) => state.setLanguage)
  const theme = useThemeStore((state) => state.theme)

  const [themeMode, setThemeMode] = useState<ThemeMode>(getCurrentThemeMode)
  const [alreadyLoggedBefore, setAlreadyLoggedBefore] = useState(hasLoggedBefore)
  const [email, setEmail] = useState("admin@demo.pt")
  const [password, setPassword] = useState("123456")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [assets, setAssets] = useState<LoginAssetMap>(emptyAssets)

  useEffect(() => {
    const root = document.documentElement

    function syncThemeMode() {
      setThemeMode(root.dataset.theme === "light" ? "light" : "dark")
    }

    syncThemeMode()

    const observer = new MutationObserver(syncThemeMode)
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] })

    return () => observer.disconnect()
  }, [theme])

  useEffect(() => {
    let mounted = true
    const objectUrls: string[] = []

    async function loadLoginAssets() {
      try {
        const brandingAssets = await BrandingService.listPublicAssets()

        const activeKeys = brandingAssets
          .filter((asset) => asset.active)
          .map((asset) => asset.assetKey)

        async function loadAsset(key: BrandingAssetKey) {
          if (!activeKeys.includes(key)) return null

          try {
            const url = await BrandingService.getPublicAssetObjectUrl(key)
            objectUrls.push(url)
            return url
          } catch {
            return null
          }
        }

        const entries = await Promise.all(
          loginAssetKeys.map(async (key) => [key, await loadAsset(key)] as const)
        )

        if (mounted) {
          setAssets(Object.fromEntries(entries) as LoginAssetMap)
        }
      } catch {
        if (mounted) setAssets(emptyAssets)
      }
    }

    loadLoginAssets()

    return () => {
      mounted = false
      objectUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  const loginLogoUrl = useMemo(() => {
    if (themeMode === "light") {
      return (
        assets.lightLoginLogoUrl ||
        assets.lightLogoUrl ||
        assets.lightSidebarLogoUrl ||
        assets.sidebarLogoUrl ||
        assets.darkLoginLogoUrl ||
        assets.darkLogoUrl ||
        assets.darkSidebarLogoUrl ||
        null
      )
    }

    return (
      assets.darkLoginLogoUrl ||
      assets.darkLogoUrl ||
      assets.darkSidebarLogoUrl ||
      assets.sidebarLogoUrl ||
      assets.lightLoginLogoUrl ||
      assets.lightLogoUrl ||
      assets.lightSidebarLogoUrl ||
      null
    )
  }, [assets, themeMode])

  const faviconUrl = useMemo(() => {
    if (themeMode === "light") {
      return assets.lightFaviconUrl || assets.faviconUrl || assets.darkFaviconUrl || null
    }

    return assets.darkFaviconUrl || assets.faviconUrl || assets.lightFaviconUrl || null
  }, [assets, themeMode])

  useEffect(() => {
    if (faviconUrl) updateFavicon(faviconUrl)
  }, [faviconUrl])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

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

      window.localStorage.setItem(loggedBeforeKey, "true")
      setAlreadyLoggedBefore(true)

      setSuccess(t("auth.loginSuccess", "Acesso validado com sucesso."))
      navigate("/dashboard")
    } catch {
      setError(t("auth.invalidCredentials"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={[
        "h-dvh overflow-hidden text-text relative flex flex-col px-4 py-3",
        themeMode === "light" ? "bg-[#F4EFE5]" : "bg-[#020B1C]",
      ].join(" ")}
    >
      <div
        className={[
          "absolute inset-0 pointer-events-none",
          themeMode === "light"
            ? "bg-[radial-gradient(circle_at_50%_18%,rgba(59,130,246,0.13),transparent_34%),linear-gradient(145deg,#FFF8EA,#EEF4FF_58%,#F8FAFC)]"
            : "bg-[radial-gradient(circle_at_50%_12%,rgba(59,130,246,0.28),transparent_32%),radial-gradient(circle_at_10%_80%,rgba(37,99,235,0.18),transparent_28%),linear-gradient(145deg,#020817,#07111F_55%,#020817)]",
        ].join(" ")}
      />

      <main className="relative z-10 w-full flex-1 min-h-0 flex items-center justify-center">
        <section
          className={[
            "w-full max-w-[430px] rounded-[32px] px-7 py-5 sm:px-8 backdrop-blur-2xl flex",
            themeMode === "light"
              ? "bg-white/82 shadow-[0_28px_90px_rgba(15,23,42,0.18)]"
              : "bg-[#07111F]/78 shadow-[0_30px_100px_rgba(0,0,0,0.58)]",
          ].join(" ")}
        >
          <form onSubmit={handleSubmit} className="w-full flex flex-col">
            <div className="text-center h-[130px] flex items-center justify-center">
              {loginLogoUrl ? (
                <img
                  src={loginLogoUrl}
                  alt={t("app.name")}
                  className="mx-auto max-h-[120px] max-w-[300px] object-contain"
                />
              ) : (
                <div className="mx-auto w-20 h-20 rounded-3xl bg-primary text-white flex items-center justify-center font-black text-xl shadow-neon">
                  SM
                </div>
              )}
            </div>

            <div className="text-center mt-1">
              <h1 className="text-2xl font-bold">
                {alreadyLoggedBefore
                  ? t("auth.welcomeBack", "Bem-vindo de volta!")
                  : t("auth.welcome", "Seja bem-vindo!")}
              </h1>

              <p className="text-sm text-muted mt-1.5">
                {t("auth.loginSubtitle", "Entre com as suas credenciais para continuar.")}
              </p>
            </div>

            <div className="space-y-3 mt-5">
              <label className="block">
                <span className="block text-xs font-semibold mb-1.5">
                  {t("auth.email")}
                </span>

                <div className="flex items-center field-input px-0 py-0 focus-within:border-primary">
                  <div className="w-11 flex items-center justify-center text-muted">
                    <UserCircle size={18} />
                  </div>

                  <input
                    className="w-full bg-transparent py-3 pr-4 outline-none text-sm"
                    placeholder={t("auth.emailPlaceholder", "seu.email@empresa.com")}
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="block text-xs font-semibold mb-1.5">
                  {t("auth.password")}
                </span>

                <div className="flex items-center field-input px-0 py-0 focus-within:border-primary">
                  <div className="w-11 flex items-center justify-center text-muted">
                    <LockKeyhole size={18} />
                  </div>

                  <input
                    className="w-full bg-transparent py-3 pr-2 outline-none text-sm"
                    placeholder={t("auth.passwordPlaceholder", "Digite sua senha")}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="w-11 h-11 flex items-center justify-center text-muted hover:text-primary transition"
                    title={
                      showPassword
                        ? t("common.hidePassword")
                        : t("common.showPassword")
                    }
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>

                <div className="text-right mt-2">
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    {t("auth.forgotPassword", "Esqueceu a senha?")}
                  </Link>
                </div>
              </label>
            </div>

            {error && (
              <div className="bg-danger/10 border border-danger/30 text-danger rounded-2xl px-4 py-3 text-sm mt-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-success/10 border border-success/30 text-success rounded-2xl px-4 py-3 text-sm mt-4">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-semibold min-h-[52px] rounded-2xl hover:shadow-neon transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-5"
            >
              {loading ? t("auth.loggingIn") : t("auth.loginButton")}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        </section>
      </main>

      <footer
        className={[
          "relative z-10 text-center text-xs sm:text-sm pt-2 pb-1 shrink-0",
          themeMode === "light" ? "text-slate-700" : "text-white/82",
        ].join(" ")}
      >
        <p>
          © 2026 ShowbarManager.{" "}
          {t("auth.allRightsReserved", "Todos os direitos reservados.")}{" "}
          {t("auth.developmentBy", "Desenvolvimento")}{" "}
          <a
            href="https://wa.me/351927703306"
            target="_blank"
            rel="noopener noreferrer"
            className={[
              "font-bold hover:text-primary transition",
              themeMode === "light" ? "text-slate-900" : "text-white",
            ].join(" ")}
          >
            Italo Gonçalves
          </a>
        </p>
      </footer>
    </div>
  )
}