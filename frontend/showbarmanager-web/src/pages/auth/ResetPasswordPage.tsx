import { useEffect, useMemo, useRef, useState } from "react"
import type { ChangeEvent, ClipboardEvent, FormEvent, KeyboardEvent, ReactNode } from "react"
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
type ResetStep = "code" | "password" | "success"

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
const passwordResetSessionKey = "showbarmanager.passwordReset"
const otpLength = 6
const otpExpirationMinutes = 10
const resendCooldownSeconds = 60


function getStoredPasswordResetState(): ResetPasswordLocationState {
  if (typeof window === "undefined") return {}

  const rawState = window.sessionStorage.getItem(passwordResetSessionKey)

  if (!rawState) return {}

  try {
    return JSON.parse(rawState) as ResetPasswordLocationState
  } catch {
    window.sessionStorage.removeItem(passwordResetSessionKey)
    return {}
  }
}

function clearPasswordResetSession() {
  if (typeof window === "undefined") return

  window.sessionStorage.removeItem(passwordResetSessionKey)
}
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
      "Nao foi possivel redefinir a senha."
    )
  }

  if (error instanceof Error) return error.message

  return "Nao foi possivel redefinir a senha."
}

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const theme = useThemeStore((state) => state.theme)

  const navigationState = (location.state || {}) as ResetPasswordLocationState
  const storedState = getStoredPasswordResetState()
  const resetState = {
    identifier: navigationState.identifier || storedState.identifier || "",
    channel: navigationState.channel || storedState.channel || "email",
    resetToken: navigationState.resetToken ?? storedState.resetToken ?? null,
    maskedDestination:
      navigationState.maskedDestination ?? storedState.maskedDestination ?? null,
  }
  const identifier = resetState.identifier
  const channel = resetState.channel
  const resetToken = resetState.resetToken

  const [themeMode, setThemeMode] = useState<ThemeMode>(getCurrentThemeMode)
  const [step, setStep] = useState<ResetStep>("code")
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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

  function handleCodeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!identifier.trim() || !resetToken) {
      setError("Solicite um novo codigo para continuar.")
      return
    }

    if (code.trim().length !== 6) {
      setError("Informe o codigo OTP com 6 digitos.")
      return
    }

    setStep("password")
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (newPassword.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas nao coincidem.")
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
        clearPasswordResetSession()
        setStep("success")
        return
      }

      setError(response.message || "Nao foi possivel redefinir a senha.")
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell themeMode={themeMode}>
      <main className="relative z-10 w-full flex-1 min-h-0 flex items-center justify-center overflow-y-auto px-0 py-2 app-scrollbar">
        <section
          className={[
            "w-full max-w-[410px] rounded-[28px] px-6 py-4 sm:px-7 sm:py-5 backdrop-blur-2xl",
            themeMode === "light"
              ? "bg-white/82 shadow-[0_28px_90px_rgba(15,23,42,0.18)]"
              : "bg-[#07111F]/78 shadow-[0_30px_100px_rgba(0,0,0,0.58)]",
            step === "success" ? "text-center" : "",
          ].join(" ")}
        >
          {step !== "success" && (
            <div className="text-center h-[68px] flex items-center justify-center">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Showbar Manager"
                  className="mx-auto max-h-[62px] max-w-[210px] object-contain"
                />
              ) : (
                <div className="mx-auto w-14 h-14 rounded-3xl bg-primary text-white flex items-center justify-center font-black text-base shadow-neon">
                  SM
                </div>
              )}
            </div>
          )}

          {step === "code" && (
            <StepForm onSubmit={handleCodeSubmit} error={error}>
              <Header
                icon={<KeyRound size={20} className="text-primary" />}
                title={t("auth.resetPasswordTitle", "Validar codigo")}
                description={
                  resetState.maskedDestination
                    ? `Enviamos um codigo para ${resetState.maskedDestination}.`
                    : "Informe o codigo OTP recebido."
                }
              />

              <div className="mt-5">
                <span className="block text-xs font-semibold mb-2 text-center">
                  Codigo OTP
                </span>

                <OtpCodeInput value={code} onChange={setCode} />

                <div className="mt-3 text-center text-xs text-muted space-y-1">
                  <p>O codigo expira em {otpExpirationMinutes} minutos.</p>
                  <p>Reenvio ficara disponivel apos {resendCooldownSeconds} segundos em uma proxima etapa.</p>
                </div>
              </div>

              <PrimaryButton label="Continuar" />

              <BackLink to="/forgot-password" label="Voltar" />
            </StepForm>
          )}

          {step === "password" && (
            <StepForm onSubmit={handlePasswordSubmit} error={error}>
              <Header
                icon={<LockKeyhole size={20} className="text-primary" />}
                title="Criar nova senha"
                description="Digite e confirme a nova senha para concluir a redefinicao."
              />

              <div className="space-y-3 mt-5">
                <PasswordField
                  label="Nova senha"
                  placeholder="Digite a nova senha"
                  value={newPassword}
                  visible={showPassword}
                  onChange={setNewPassword}
                  onToggle={() => setShowPassword((value) => !value)}
                />

                <PasswordField
                  label="Confirmar senha"
                  placeholder="Confirme a nova senha"
                  value={confirmPassword}
                  visible={showConfirmPassword}
                  onChange={setConfirmPassword}
                  onToggle={() => setShowConfirmPassword((value) => !value)}
                />
              </div>

              <PrimaryButton label={loading ? "Redefinindo..." : "Redefinir senha"} disabled={loading} />

              <button
                type="button"
                onClick={() => {
                  setError(null)
                  setStep("code")
                }}
                className="mt-3 w-full min-h-[42px] text-xs font-semibold text-primary hover:underline inline-flex items-center justify-center gap-1 rounded-2xl"
              >
                <ArrowLeft size={14} />
                Voltar para o codigo
              </button>
            </StepForm>
          )}

          {step === "success" && (
            <div>
              <div className="mx-auto w-16 h-16 rounded-3xl bg-success/10 border border-success/30 flex items-center justify-center">
                <CheckCircle2 size={30} className="text-success" />
              </div>

              <h1 className="text-2xl font-bold mt-4">
                Senha redefinida com sucesso.
              </h1>

              <p className="text-sm text-muted mt-2">
                Sua senha foi alterada. Agora voce ja pode entrar novamente no Showbar Manager.
              </p>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full bg-primary text-white font-semibold h-[50px] rounded-2xl hover:shadow-neon transition flex items-center justify-center gap-2 mt-7"
              >
                Voltar para login
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer themeMode={themeMode} />
    </AuthShell>
  )
}

function AuthShell({
  themeMode,
  children,
}: {
  themeMode: ThemeMode
  children: ReactNode
}) {
  return (
    <div
      className={[
        "h-dvh overflow-hidden text-text relative flex flex-col px-4 py-2 sm:py-3",
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

      {children}
    </div>
  )
}

function Header({
  icon,
  title,
  description,
}: {
  icon: ReactNode
  title: string
  description: string
}) {
  return (
    <div className="text-center">
      <div className="mx-auto w-10 h-10 rounded-2xl bg-primarySoft flex items-center justify-center mb-3">
        {icon}
      </div>

      <h1 className="text-2xl font-bold">
        {title}
      </h1>

      <p className="text-sm text-muted mt-2">
        {description}
      </p>
    </div>
  )
}

function StepForm({
  children,
  error,
  onSubmit,
}: {
  children: ReactNode
  error: string | null
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <form onSubmit={onSubmit} className="w-full flex flex-col">
      {children}

      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger rounded-2xl px-4 py-3 text-sm mt-4">
          {error}
        </div>
      )}
    </form>
  )
}


function OtpCodeInput({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const digits = Array.from({ length: otpLength }, (_, index) => value[index] || "")

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  function updateDigit(index: number, nextValue: string) {
    const numericValue = nextValue.replace(/\D/g, "")

    if (!numericValue) {
      const nextDigits = [...digits]
      nextDigits[index] = ""
      onChange(nextDigits.join(""))
      return
    }

    if (numericValue.length > 1) {
      fillFrom(index, numericValue)
      return
    }

    const nextDigits = [...digits]
    nextDigits[index] = numericValue
    onChange(nextDigits.join(""))

    if (index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus()
      inputRefs.current[index + 1]?.select()
    }
  }

  function fillFrom(startIndex: number, pastedValue: string) {
    const numericValue = pastedValue.replace(/\D/g, "").slice(0, otpLength)

    if (!numericValue) return

    const nextDigits = [...digits]
    numericValue.split("").forEach((digit, offset) => {
      const targetIndex = startIndex + offset

      if (targetIndex < otpLength) {
        nextDigits[targetIndex] = digit
      }
    })

    onChange(nextDigits.join(""))

    const nextFocusIndex = Math.min(startIndex + numericValue.length, otpLength - 1)
    inputRefs.current[nextFocusIndex]?.focus()
    inputRefs.current[nextFocusIndex]?.select()
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      event.preventDefault()
      inputRefs.current[index - 1]?.focus()
      inputRefs.current[index - 1]?.select()
      return
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault()
      inputRefs.current[index - 1]?.focus()
      return
    }

    if (event.key === "ArrowRight" && index < otpLength - 1) {
      event.preventDefault()
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handlePaste(index: number, event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault()
    fillFrom(index, event.clipboardData.getData("text"))
  }

  return (
    <div className="grid grid-cols-6 gap-2" aria-label="Codigo OTP de 6 digitos">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element
          }}
          className="field-input h-12 px-0 text-center text-lg font-bold"
          value={digit}
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          aria-label={`Digito ${index + 1} do codigo OTP`}
          onChange={(event: ChangeEvent<HTMLInputElement>) => updateDigit(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={(event) => handlePaste(index, event)}
        />
      ))}
    </div>
  )
}
function PasswordField({
  label,
  placeholder,
  value,
  visible,
  onChange,
  onToggle,
}: {
  label: string
  placeholder: string
  value: string
  visible: boolean
  onChange: (value: string) => void
  onToggle: () => void
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold mb-1.5">
        {label}
      </span>

      <div className="flex items-center field-input px-0 py-0 focus-within:border-primary">
        <div className="w-11 flex items-center justify-center text-muted">
          <LockKeyhole size={18} />
        </div>

        <input
          className="w-full bg-transparent py-3 pr-2 outline-none text-sm"
          placeholder={placeholder}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required
        />

        <button
          type="button"
          onClick={onToggle}
          className="w-11 h-11 flex items-center justify-center text-muted hover:text-primary transition"
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </label>
  )
}

function PrimaryButton({ label, disabled = false }: { label: string; disabled?: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="w-full bg-primary text-white font-semibold h-[50px] rounded-2xl hover:shadow-neon transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-5"
    >
      {label}
      {!disabled && <ArrowRight size={18} />}
    </button>
  )
}

function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="mt-3 w-full min-h-[42px] text-xs font-semibold text-primary hover:underline inline-flex items-center justify-center gap-1 rounded-2xl"
    >
      <ArrowLeft size={14} />
      {label}
    </Link>
  )
}

function Footer({ themeMode }: { themeMode: ThemeMode }) {
  const { t } = useTranslation()

  return (
    <footer
      className={[
        "relative z-10 text-center text-xs sm:text-sm pt-2 pb-1 shrink-0",
        themeMode === "light" ? "text-slate-700" : "text-white/82",
      ].join(" ")}
    >
      <p>
        © 2026 Showbar Manager. {t("auth.allRightsReserved", "Todos os direitos reservados.")} {t("auth.developmentBy", "Desenvolvimento")}{" "}
        <a
          href="https://wa.me/351927703306"
          target="_blank"
          rel="noopener noreferrer"
          className={[
            "font-bold hover:text-primary transition",
            themeMode === "light" ? "text-slate-900" : "text-white",
          ].join(" ")}
        >
          Italo Goncalves
        </a>
      </p>
    </footer>
  )
}