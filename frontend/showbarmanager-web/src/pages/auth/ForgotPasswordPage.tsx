import { useEffect, useMemo, useState } from "react"
import type { FormEvent } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  MessageSquareText,
  ShieldCheck,
  Smartphone,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { AuthService } from "../../services/auth.service"
import { BrandingService } from "../../services/branding.service"
import { useThemeStore } from "../../store/theme.store"
import { useTranslation } from "../../hooks/useTranslation"
import type { BrandingAssetKey } from "../../types/branding.types"
import type { PasswordResetChannel } from "../../types/auth.types"

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
      "Não foi possível enviar o código."
    )
  }

  if (error instanceof Error) return error.message

  return "Não foi possível enviar o código."
}

export function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const theme = useThemeStore((state) => state.theme)

  const [themeMode, setThemeMode] = useState<ThemeMode>(getCurrentThemeMode)
  const [identifier, setIdentifier] = useState("")
  const [channel, setChannel] = useState<PasswordResetChannel>("email")
  const [loading, setLoading] = useState(false)
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
      setError("Informe o seu e-mail ou telemóvel.")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await AuthService.forgotPassword({
        identifier: identifier.trim(),
        channel,
      })

      navigate("/reset-password", {
        state: {
          identifier: identifier.trim(),
          channel,
          resetToken: response.resetToken ?? null,
          maskedDestination: response.maskedDestination ?? null,
        },
      })
    } catch (requestError) {
      setError(getErrorMessage(requestError))
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
            "w-full max-w-[430px] rounded-[32px] px-7 py-6 sm:px-8 backdrop-blur-2xl",
            themeMode === "light"
              ? "bg-white/82 shadow-[0_28px_90px_rgba(15,23,42,0.18)]"
              : "bg-[#07111F]/78 shadow-[0_30px_100px_rgba(0,0,0,0.58)]",
          ].join(" ")}
        >
          <form onSubmit={handleSubmit} className="w-full flex flex-col">
            <div className="text-center h-[120px] flex items-center justify-center">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Showbar Manager"
                  className="mx-auto max-h-[112px] max-w-[260px] object-contain"
                />
              ) : (
                <div className="mx-auto w-20 h-20 rounded-3xl bg-primary text-white flex items-center justify-center font-black text-xl shadow-neon">
                  SM
                </div>
              )}
            </div>

            <div className="text-center mt-1">
              <div className="mx-auto w-11 h-11 rounded-2xl bg-primarySoft flex items-center justify-center mb-3">
                <ShieldCheck size={21} className="text-primary" />
              </div>

              <h1 className="text-2xl font-bold">
                {t("auth.forgotPasswordTitle", "Redefinir senha")}
              </h1>

              <p className="text-sm text-muted mt-2">
                {t(
                  "auth.forgotPasswordSubtitle",
                  "Informe o seu e-mail ou telemóvel e escolha como deseja receber o código de validação."
                )}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-6">
              <button
                type="button"
                onClick={() => setChannel("email")}
                className={[
                  "rounded-2xl border px-3 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition",
                  channel === "email"
                    ? "bg-primary text-white border-primary"
                    : "bg-card border-border text-muted hover:text-primary hover:border-primary",
                ].join(" ")}
              >
                <Mail size={16} />
                E-mail
              </button>

              <button
                type="button"
                onClick={() => setChannel("sms")}
                className={[
                  "rounded-2xl border px-3 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition",
                  channel === "sms"
                    ? "bg-primary text-white border-primary"
                    : "bg-card border-border text-muted hover:text-primary hover:border-primary",
                ].join(" ")}
              >
                <Smartphone size={16} />
                SMS
              </button>
            </div>

            <label className="block mt-5">
              <span className="block text-xs font-semibold mb-1.5">
                {channel === "email" ? "E-mail" : "Telemóvel"}
              </span>

              <div className="flex items-center field-input px-0 py-0 focus-within:border-primary">
                <div className="w-11 flex items-center justify-center text-muted">
                  {channel === "email" ? (
                    <Mail size={18} />
                  ) : (
                    <MessageSquareText size={18} />
                  )}
                </div>

                <input
                  className="w-full bg-transparent py-3 pr-4 outline-none text-sm"
                  placeholder={
                    channel === "email"
                      ? "seu.email@empresa.com"
                      : "+351 900 000 000"
                  }
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  required
                />
              </div>
            </label>

            {error && (
              <div className="bg-danger/10 border border-danger/30 text-danger rounded-2xl px-4 py-3 text-sm mt-4">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-semibold h-[52px] rounded-2xl hover:shadow-neon transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {loading ? "A enviar código..." : "Enviar código"}
              {!loading && <ArrowRight size={18} />}
            </button>

            <Link
              to="/login"
              className="mt-4 text-xs font-semibold text-primary hover:underline inline-flex items-center justify-center gap-1"
            >
              <ArrowLeft size={14} />
              Voltar para o login
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