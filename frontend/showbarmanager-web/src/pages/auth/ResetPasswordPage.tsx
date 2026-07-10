import { useEffect, useMemo, useState } from "react"
import type { FormEvent } from "react"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
} from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { AuthService } from "../../services/auth.service"
import { BrandingService } from "../../services/branding.service"
import { useThemeStore } from "../../store/theme.store"
import { useTranslation } from "../../hooks/useTranslation"
import type { BrandingAssetKey } from "../../types/branding.types"
import type { PasswordResetChannel } from "../../types/auth.types"

type LoginAssetMap = Partial<Record<BrandingAssetKey, string | null>>
type ThemeMode = "dark" | "light"

interface ResetPasswordLocationState {
  identifier?: string
  channel?: PasswordResetChannel
  resetToken?: string | null
  maskedDestination?: string | null
}

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

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as {
      response?: {
        data?: {
          message?: string
          error?: string
          detail?: string
        }
      }
      message?: string
    }

    return (
      axiosError.response?.data?.message ||
      axiosError.response?.data?.error ||
      axiosError.response?.data?.detail ||
      axiosError.message ||
      "Não foi possível redefinir a senha."
    )
  }

  if (error instanceof Error) return error.message

  return "Não foi possível redefinir a senha."
}

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const theme = useThemeStore((state) => state.theme)

  const state = (location.state || {}) as ResetPasswordLocationState

  const [themeMode, setThemeMode] = useState<ThemeMode>(getCurrentThemeMode)
  const [identifier, setIdentifier] = useState(state.identifier || "")
  const [channel, setChannel] = useState<PasswordResetChannel>(
    state.channel || "email"
  )
  const [resetToken, setResetToken] = useState<string | null>(
    state.resetToken || null
  )
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
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

    async function loadAssets() {
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

    loadAssets()

    return () => {
      mounted = false
      objectUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  const logoUrl = useMemo(() => {
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

    if (!identifier.trim()) {
      setError("Informe o e-mail ou telemóvel usado na solicitação.")
      return
    }

    if (code.trim().length !== 6) {
      setError("Informe o código OTP com 6 dígitos.")
      return
    }

    if (newPassword.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await AuthService.resetPassword({
        identifier: identifier.trim(),
        channel,
        code: code.trim(),
        newPassword,
        confirmPassword,
        resetToken,
      })

      if (response.success) {
        setSuccess(true)
        return
      }

      setError(response.message || "Não foi possível redefinir a senha.")
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setLoading(false)
    }
  }

  if (success) {
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
              "w-full max-w-[430px] rounded-[32px] px-7 py-8 sm:px-8 backdrop-blur-2xl text-center",
              themeMode === "light"
                ? "bg-white/82 shadow-[0_28px_90px_rgba(15,23,42,0.18)]"
                : "bg-[#07111F]/78 shadow-[0_30px_100px_rgba(0,0,0,0.58)]",
            ].join(" ")}
          >
            <div className="mx-auto w-16 h-16 rounded-3xl bg-success/10 border border-success/30 flex items-center justify-center">
              <CheckCircle2 size={30} className="text-success" />
            </div>

            <h1 className="text-2xl font-bold mt-5">
              Senha redefinida com sucesso!
            </h1>

            <p className="text-sm text-muted mt-2">
              A sua senha foi alterada. Agora já pode entrar novamente no Showbar Manager.
            </p>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full bg-primary text-white font-semibold h-[52px] rounded-2xl hover:shadow-neon transition flex items-center justify-center gap-2 mt-7"
            >
              Voltar para o login
              <ArrowRight size={18} />
            </button>
          </section>
        </main>
      </div>
    )
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
            "w-full max-w-[430px] rounded-[32px] px-7 py-6 sm:px-8 backdrop-blur-2xl",
            themeMode === "light"
              ? "bg-white/82 shadow-[0_28px_90px_rgba(15,23,42,0.18)]"
              : "bg-[#07111F]/78 shadow-[0_30px_100px_rgba(0,0,0,0.58)]",
          ].join(" ")}
        >
          <form onSubmit={handleSubmit} className="w-full flex flex-col">
            <div className="text-center h-[100px] flex items-center justify-center">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Showbar Manager"
                  className="mx-auto max-h-[92px] max-w-[240px] object-contain"
                />
              ) : (
                <div className="mx-auto w-16 h-16 rounded-3xl bg-primary text-white flex items-center justify-center font-black text-lg shadow-neon">
                  SM
                </div>
              )}
            </div>

            <div className="text-center">
              <div className="mx-auto w-11 h-11 rounded-2xl bg-primarySoft flex items-center justify-center mb-3">
                <KeyRound size={21} className="text-primary" />
              </div>

              <h1 className="text-2xl font-bold">
                {t("auth.resetPasswordTitle", "Criar nova senha")}
              </h1>

              <p className="text-sm text-muted mt-2">
                {state.maskedDestination
                  ? `Enviamos um código para ${state.maskedDestination}.`
                  : "Informe o código OTP recebido e crie uma nova senha."}
              </p>
            </div>

            <div className="space-y-3.5 mt-5">
              <label className="block">
                <span className="block text-xs font-semibold mb-1.5">
                  Código OTP
                </span>

                <input
                  className="field-input text-center tracking-[0.45em] font-bold"
                  placeholder="000000"
                  maxLength={6}
                  inputMode="numeric"
                  value={code}
                  onChange={(event) =>
                    setCode(event.target.value.replace(/\D/g, ""))
                  }
                  required
                />
              </label>

              <label className="block">
                <span className="block text-xs font-semibold mb-1.5">
                  Nova senha
                </span>

                <div className="flex items-center field-input px-0 py-0 focus-within:border-primary">
                  <div className="w-11 flex items-center justify-center text-muted">
                    <LockKeyhole size={18} />
                  </div>

                  <input
                    className="w-full bg-transparent py-3 pr-2 outline-none text-sm"
                    placeholder="Digite a nova senha"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="w-11 h-11 flex items-center justify-center text-muted hover:text-primary transition"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </label>

              <label className="block">
                <span className="block text-xs font-semibold mb-1.5">
                  Confirmar senha
                </span>

                <div className="flex items-center field-input px-0 py-0 focus-within:border-primary">
                  <div className="w-11 flex items-center justify-center text-muted">
                    <LockKeyhole size={18} />
                  </div>

                  <input
                    className="w-full bg-transparent py-3 pr-2 outline-none text-sm"
                    placeholder="Confirme a nova senha"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    className="w-11 h-11 flex items-center justify-center text-muted hover:text-primary transition"
                  >
                    {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </label>
            </div>

            {error && (
              <div className="bg-danger/10 border border-danger/30 text-danger rounded-2xl px-4 py-3 text-sm mt-4">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-semibold h-[52px] rounded-2xl hover:shadow-neon transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-5"
            >
              {loading ? "A redefinir..." : "Redefinir senha"}
              {!loading && <ArrowRight size={18} />}
            </button>

            <Link
              to="/forgot-password"
              className="mt-4 text-xs font-semibold text-primary hover:underline inline-flex items-center justify-center gap-1"
            >
              <ArrowLeft size={14} />
              Voltar
            </Link>
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
          © 2026 Showbar Manager.{" "}
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