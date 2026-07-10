import { useEffect, useMemo, useState } from "react"
import type { ChangeEvent, ComponentType } from "react"
import {
  CheckCircle2,
  FileImage,
  Globe2,
  Image,
  MonitorSmartphone,
  Palette,
  Power,
  PowerOff,
  RotateCcw,
  Save,
  Star,
  Trash2,
  Upload,
} from "lucide-react"
import { BrandingService } from "../../services/branding.service"
import { useTranslation } from "../../hooks/useTranslation"
import type {
  BrandingAsset,
  BrandingAssetKey,
  BrandingSettings,
} from "../../types/branding.types"

type PaletteMode = "default" | "custom"
type PaletteTab = "dark" | "light"
type LogoTab = "dark" | "light"

type ExtendedBrandingAssetKey =
  | BrandingAssetKey
  | "darkSidebarLogoUrl"
  | "darkSidebarCollapsedLogoUrl"
  | "darkReportLogoUrl"
  | "darkMobileLogoUrl"
  | "darkFaviconUrl"
  | "darkLoginLogoUrl"
  | "lightSidebarLogoUrl"
  | "lightSidebarCollapsedLogoUrl"
  | "lightReportLogoUrl"
  | "lightMobileLogoUrl"
  | "lightFaviconUrl"
  | "lightLoginLogoUrl"

type BrandingAssetView = Omit<BrandingAsset, "key"> & {
  key: ExtendedBrandingAssetKey
}

const defaultPalette = BrandingService.getDefaultSettings()

const darkLogoKeys: ExtendedBrandingAssetKey[] = [
  "darkSidebarLogoUrl",
  "darkSidebarCollapsedLogoUrl",
  "darkLogoUrl",
  "darkReportLogoUrl",
  "darkMobileLogoUrl",
  "darkFaviconUrl",
  "darkLoginLogoUrl",
]

const lightLogoKeys: ExtendedBrandingAssetKey[] = [
  "lightSidebarLogoUrl",
  "lightSidebarCollapsedLogoUrl",
  "lightLogoUrl",
  "lightReportLogoUrl",
  "lightMobileLogoUrl",
  "lightFaviconUrl",
  "lightLoginLogoUrl",
]

async function getAssetPreviewUrl(
  assetKey: ExtendedBrandingAssetKey
): Promise<string | null> {
  try {
    return await BrandingService.getAssetObjectUrl(assetKey as BrandingAssetKey)
  } catch {
    return null
  }
}

function getUploadErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as {
      response?: {
        status?: number
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
      "Erro desconhecido no upload."
    )
  }

  if (error instanceof Error) {
    return error.message
  }

  return "Erro desconhecido no upload."
}

function buildAssetTemplates(
  t: (path: string, fallback?: string) => string
): BrandingAssetView[] {
  return [
    {
      key: "darkSidebarLogoUrl",
      title: t("branding.sidebarLogo", "Logótipo da barra lateral aberta"),
      description: t(
        "branding.sidebarLogoDescription",
        "Logótipo horizontal exibido no menu lateral aberto."
      ),
      recommendedSize: "240 x 64 px",
      acceptedFormats: "PNG, SVG ou WEBP",
      maxSize: t("branding.maxSize2mb", "Até 2 MB"),
      previewUrl: null,
      fileName: null,
      active: false,
    },
    {
      key: "darkSidebarCollapsedLogoUrl",
      title: t("branding.sidebarCollapsedLogo", "Ícone da barra lateral recolhida"),
      description: t(
        "branding.sidebarCollapsedLogoDescription",
        "Símbolo compacto exibido quando o menu está recolhido."
      ),
      recommendedSize: "64 x 64 px",
      acceptedFormats: "PNG, SVG ou WEBP",
      maxSize: t("branding.maxSize2mb", "Até 2 MB"),
      previewUrl: null,
      fileName: null,
      active: false,
    },
    {
      key: "darkLogoUrl",
      title: t("branding.darkLogo", "Logótipo do modo escuro"),
      description: t(
        "branding.darkLogoDescription",
        "Versão da marca para fundos escuros."
      ),
      recommendedSize: "320 x 100 px",
      acceptedFormats: "PNG, SVG ou WEBP",
      maxSize: t("branding.maxSize2mb", "Até 2 MB"),
      previewUrl: null,
      fileName: null,
      active: false,
    },
    {
      key: "darkReportLogoUrl",
      title: t("branding.reportLogo", "Logótipo de relatórios"),
      description: t(
        "branding.reportLogoDescription",
        "Logótipo usado em PDF, contratos, relatórios e documentos."
      ),
      recommendedSize: "600 x 180 px",
      acceptedFormats: "PNG ou SVG",
      maxSize: t("branding.maxSize2mb", "Até 2 MB"),
      previewUrl: null,
      fileName: null,
      active: false,
    },
    {
      key: "darkMobileLogoUrl",
      title: t("branding.mobileLogo", "Logótipo mobile/app"),
      description: t(
        "branding.mobileLogoDescription",
        "Marca usada em PWA, aplicações e ecrãs mobile."
      ),
      recommendedSize: "512 x 512 px",
      acceptedFormats: "PNG ou WEBP",
      maxSize: t("branding.maxSize2mb", "Até 2 MB"),
      previewUrl: null,
      fileName: null,
      active: false,
    },
    {
      key: "darkFaviconUrl",
      title: "Favicon",
      description: t(
        "branding.faviconDescription",
        "Ícone exibido ao lado do título do site no navegador."
      ),
      recommendedSize: "64 x 64 px",
      acceptedFormats: "ICO, PNG ou SVG",
      maxSize: t("branding.maxSize2mb", "Até 2 MB"),
      previewUrl: null,
      fileName: null,
      active: false,
    },
    {
      key: "darkLoginLogoUrl",
      title: t("branding.loginLogo", "Página de login"),
      description: t(
        "branding.loginLogoDescription",
        "Logótipo exibido no ecrã de autenticação."
      ),
      recommendedSize: "420 x 160 px",
      acceptedFormats: "PNG, SVG ou WEBP",
      maxSize: t("branding.maxSize2mb", "Até 2 MB"),
      previewUrl: null,
      fileName: null,
      active: false,
    },
    {
      key: "lightSidebarLogoUrl",
      title: t("branding.sidebarLogo", "Logótipo da barra lateral aberta"),
      description: t(
        "branding.sidebarLogoDescription",
        "Logótipo horizontal exibido no menu lateral aberto."
      ),
      recommendedSize: "240 x 64 px",
      acceptedFormats: "PNG, SVG ou WEBP",
      maxSize: t("branding.maxSize2mb", "Até 2 MB"),
      previewUrl: null,
      fileName: null,
      active: false,
    },
    {
      key: "lightSidebarCollapsedLogoUrl",
      title: t("branding.sidebarCollapsedLogo", "Ícone da barra lateral recolhida"),
      description: t(
        "branding.sidebarCollapsedLogoDescription",
        "Símbolo compacto exibido quando o menu está recolhido."
      ),
      recommendedSize: "64 x 64 px",
      acceptedFormats: "PNG, SVG ou WEBP",
      maxSize: t("branding.maxSize2mb", "Até 2 MB"),
      previewUrl: null,
      fileName: null,
      active: false,
    },
    {
      key: "lightLogoUrl",
      title: t("branding.lightLogo", "Logótipo do modo claro"),
      description: t(
        "branding.lightLogoDescription",
        "Versão da marca para fundos claros."
      ),
      recommendedSize: "320 x 100 px",
      acceptedFormats: "PNG, SVG ou WEBP",
      maxSize: t("branding.maxSize2mb", "Até 2 MB"),
      previewUrl: null,
      fileName: null,
      active: false,
    },
    {
      key: "lightReportLogoUrl",
      title: t("branding.reportLogo", "Logótipo de relatórios"),
      description: t(
        "branding.reportLogoDescription",
        "Logótipo usado em PDF, contratos, relatórios e documentos."
      ),
      recommendedSize: "600 x 180 px",
      acceptedFormats: "PNG ou SVG",
      maxSize: t("branding.maxSize2mb", "Até 2 MB"),
      previewUrl: null,
      fileName: null,
      active: false,
    },
    {
      key: "lightMobileLogoUrl",
      title: t("branding.mobileLogo", "Logótipo mobile/app"),
      description: t(
        "branding.mobileLogoDescription",
        "Marca usada em PWA, aplicações e ecrãs mobile."
      ),
      recommendedSize: "512 x 512 px",
      acceptedFormats: "PNG ou WEBP",
      maxSize: t("branding.maxSize2mb", "Até 2 MB"),
      previewUrl: null,
      fileName: null,
      active: false,
    },
    {
      key: "lightFaviconUrl",
      title: "Favicon",
      description: t(
        "branding.faviconDescription",
        "Ícone exibido ao lado do título do site no navegador."
      ),
      recommendedSize: "64 x 64 px",
      acceptedFormats: "ICO, PNG ou SVG",
      maxSize: t("branding.maxSize2mb", "Até 2 MB"),
      previewUrl: null,
      fileName: null,
      active: false,
    },
    {
      key: "lightLoginLogoUrl",
      title: t("branding.loginLogo", "Página de login"),
      description: t(
        "branding.loginLogoDescription",
        "Logótipo exibido no ecrã de autenticação."
      ),
      recommendedSize: "420 x 160 px",
      acceptedFormats: "PNG, SVG ou WEBP",
      maxSize: t("branding.maxSize2mb", "Até 2 MB"),
      previewUrl: null,
      fileName: null,
      active: false,
    },
  ]
}

const darkPaletteFields: Array<{
  key: keyof BrandingSettings
  labelKey: string
  fallback: string
}> = [
  { key: "darkBackgroundColor", labelKey: "branding.darkBackgroundColor", fallback: "Fundo" },
  { key: "darkCardColor", labelKey: "branding.darkCardColor", fallback: "Cartão" },
  { key: "darkCardSoftColor", labelKey: "branding.darkCardSoftColor", fallback: "Cartão suave" },
  { key: "darkSurfaceColor", labelKey: "branding.darkSurfaceColor", fallback: "Superfície" },
  { key: "darkTextColor", labelKey: "branding.darkTextColor", fallback: "Texto" },
  { key: "darkMutedColor", labelKey: "branding.darkMutedColor", fallback: "Texto secundário" },
  { key: "darkBorderColor", labelKey: "branding.darkBorderColor", fallback: "Borda" },
  { key: "darkPrimaryColor", labelKey: "branding.darkPrimaryColor", fallback: "Cor primária" },
  { key: "darkSecondaryColor", labelKey: "branding.darkSecondaryColor", fallback: "Cor secundária" },
  { key: "darkAccentColor", labelKey: "branding.darkAccentColor", fallback: "Destaque" },
  { key: "darkSuccessColor", labelKey: "branding.darkSuccessColor", fallback: "Sucesso" },
  { key: "darkWarningColor", labelKey: "branding.darkWarningColor", fallback: "Aviso" },
  { key: "darkDangerColor", labelKey: "branding.darkDangerColor", fallback: "Perigo" },
]

const lightPaletteFields: Array<{
  key: keyof BrandingSettings
  labelKey: string
  fallback: string
}> = [
  { key: "lightBackgroundColor", labelKey: "branding.lightBackgroundColor", fallback: "Fundo" },
  { key: "lightCardColor", labelKey: "branding.lightCardColor", fallback: "Cartão" },
  { key: "lightCardSoftColor", labelKey: "branding.lightCardSoftColor", fallback: "Cartão suave" },
  { key: "lightSurfaceColor", labelKey: "branding.lightSurfaceColor", fallback: "Superfície" },
  { key: "lightTextColor", labelKey: "branding.lightTextColor", fallback: "Texto" },
  { key: "lightMutedColor", labelKey: "branding.lightMutedColor", fallback: "Texto secundário" },
  { key: "lightBorderColor", labelKey: "branding.lightBorderColor", fallback: "Borda" },
  { key: "lightPrimaryColor", labelKey: "branding.lightPrimaryColor", fallback: "Cor primária" },
  { key: "lightSecondaryColor", labelKey: "branding.lightSecondaryColor", fallback: "Cor secundária" },
  { key: "lightAccentColor", labelKey: "branding.lightAccentColor", fallback: "Destaque" },
  { key: "lightSuccessColor", labelKey: "branding.lightSuccessColor", fallback: "Sucesso" },
  { key: "lightWarningColor", labelKey: "branding.lightWarningColor", fallback: "Aviso" },
  { key: "lightDangerColor", labelKey: "branding.lightDangerColor", fallback: "Perigo" },
]

export function SettingsBrandingPage() {
  const { t } = useTranslation()
  const assetTemplates = useMemo(() => buildAssetTemplates(t), [t])

  const [settings, setSettings] = useState<BrandingSettings>(
    BrandingService.getDefaultSettings()
  )
  const [assets, setAssets] = useState<BrandingAssetView[]>(assetTemplates)
  const [loading, setLoading] = useState(false)
  const [loadingAssetKey, setLoadingAssetKey] =
    useState<ExtendedBrandingAssetKey | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [paletteTab, setPaletteTab] = useState<PaletteTab>("dark")
  const [logoTab, setLogoTab] = useState<LogoTab>("dark")

  useEffect(() => {
    loadBranding()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const uploadedAssetsCount = useMemo(() => {
    return assets.filter((asset) => asset.previewUrl).length
  }, [assets])

  const paletteMode: PaletteMode = useMemo(() => {
    return isDefaultPalette(settings) ? "default" : "custom"
  }, [settings])

  const filteredLogoAssets = useMemo(() => {
    const keys = logoTab === "dark" ? darkLogoKeys : lightLogoKeys

    return assets.filter((asset) => keys.includes(asset.key))
  }, [assets, logoTab])

  async function loadBranding() {
    try {
      setLoading(true)
      setError(null)

      const [settingsData, assetsData] = await Promise.all([
        BrandingService.getSettings(),
        BrandingService.listAssets(),
      ])

      const mappedAssets = await Promise.all(
        assetTemplates.map(async (asset) => {
          const uploaded = assetsData.find(
            (item) => item.assetKey === asset.key
          )

          if (!uploaded) return asset

          const previewUrl = await getAssetPreviewUrl(asset.key)

          return {
            ...asset,
            previewUrl,
            fileName: uploaded.fileName,
            contentType: uploaded.contentType,
            fileSize: uploaded.fileSize,
            active: uploaded.active,
            uploadedAt: uploaded.updatedAt ?? uploaded.createdAt ?? null,
          }
        })
      )

      setSettings(settingsData)
      setAssets(mappedAssets)
      applyBranding(settingsData)

      const faviconAsset =
        mappedAssets.find((asset) => asset.key === "darkFaviconUrl") ??
        mappedAssets.find((asset) => asset.key === "lightFaviconUrl") ??
        mappedAssets.find((asset) => asset.key === "faviconUrl")

      if (faviconAsset?.previewUrl && faviconAsset.active) {
        updateFavicon(faviconAsset.previewUrl)
      }
    } catch {
      setSettings(BrandingService.getDefaultSettings())
      setError(
        t("branding.loadError", "Não foi possível carregar a identidade visual.")
      )
    } finally {
      setLoading(false)
    }
  }

  function updateSetting<K extends keyof BrandingSettings>(
    key: K,
    value: BrandingSettings[K]
  ) {
    setSettings((current) => {
      const next = {
        ...current,
        [key]: value,
      }

      if (key === "darkPrimaryColor") next.primaryColor = value as string
      if (key === "darkSecondaryColor") next.secondaryColor = value as string

      applyBranding(next)
      return next
    })

    setMessage(null)
    setError(null)
  }

  async function handleSave() {
    try {
      setLoading(true)
      setMessage(null)
      setError(null)

      const savedSettings = await BrandingService.saveSettings(settings)

      setSettings(savedSettings)
      applyBranding(savedSettings)
      setMessage(
        t("branding.savedSuccess", "Identidade visual guardada com sucesso.")
      )
    } catch {
      setError(
        t("branding.saveError", "Não foi possível guardar a identidade visual.")
      )
    } finally {
      setLoading(false)
    }
  }

  function handleRestorePalette() {
    const confirmed = window.confirm(
      t("branding.restoreConfirm", "Deseja restaurar a paleta padrão do sistema?")
    )

    if (!confirmed) return

    const restored = restorePalette(settings)

    setSettings(restored)
    applyBranding(restored)
    setMessage(t("branding.paletteRestored", "Paleta padrão restaurada."))
    setError(null)
  }

  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
    asset: BrandingAssetView
  ) {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) return

    if (file.size > BrandingService.maxFileSize) {
      setError(t("branding.fileTooLarge", "O ficheiro deve ter no máximo 2 MB."))
      return
    }

    try {
      setLoadingAssetKey(asset.key)
      setMessage(null)
      setError(null)

      const uploaded = await BrandingService.uploadAsset(
        asset.key as BrandingAssetKey,
        file
      )
      const previewUrl = await BrandingService.getAssetObjectUrl(
        asset.key as BrandingAssetKey
      )

      setAssets((current) =>
        current.map((item) =>
          item.key === asset.key
            ? {
                ...item,
                previewUrl,
                fileName: uploaded.fileName,
                contentType: uploaded.contentType,
                fileSize: uploaded.fileSize,
                active: uploaded.active,
                uploadedAt: uploaded.updatedAt ?? uploaded.createdAt ?? null,
              }
            : item
        )
      )

      if (
        (asset.key === "darkFaviconUrl" || asset.key === "lightFaviconUrl") &&
        uploaded.active
      ) {
        updateFavicon(previewUrl)
      }

      setMessage(
        t("branding.assetUploadedSuccess", "Ficheiro enviado com sucesso.")
      )
    } catch (uploadError) {
      console.error("[BRANDING_UPLOAD_ERROR]", {
        assetKey: asset.key,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        error: uploadError,
      })

      const backendMessage = getUploadErrorMessage(uploadError)

      const uploadMessage =
        uploadError instanceof Error && uploadError.message === "FILE_TOO_LARGE"
          ? t("branding.fileTooLarge", "O ficheiro deve ter no máximo 2 MB.")
          : backendMessage ||
            t("branding.assetUploadError", "Não foi possível enviar o ficheiro.")

      setError(uploadMessage)
    } finally {
      setLoadingAssetKey(null)
    }
  }

  async function handleActivateAsset(asset: BrandingAssetView) {
    try {
      setLoadingAssetKey(asset.key)
      setMessage(null)
      setError(null)

      const updated = await BrandingService.activateAsset(
        asset.key as BrandingAssetKey
      )

      setAssets((current) =>
        current.map((item) =>
          item.key === asset.key ? { ...item, active: updated.active } : item
        )
      )

      if (
        (asset.key === "darkFaviconUrl" || asset.key === "lightFaviconUrl") &&
        asset.previewUrl
      ) {
        updateFavicon(asset.previewUrl)
      }

      setMessage(
        t("branding.assetActivatedSuccess", "Ficheiro ativado com sucesso.")
      )
    } catch {
      setError(
        t("branding.assetActivateError", "Não foi possível ativar o ficheiro.")
      )
    } finally {
      setLoadingAssetKey(null)
    }
  }

  async function handleDeactivateAsset(asset: BrandingAssetView) {
    const confirmed = window.confirm(
      t("branding.deactivateConfirm", "Deseja desativar este ficheiro?")
    )

    if (!confirmed) return

    try {
      setLoadingAssetKey(asset.key)
      setMessage(null)
      setError(null)

      const updated = await BrandingService.deactivateAsset(
        asset.key as BrandingAssetKey
      )

      setAssets((current) =>
        current.map((item) =>
          item.key === asset.key ? { ...item, active: updated.active } : item
        )
      )

      setMessage(
        t("branding.assetDeactivatedSuccess", "Ficheiro desativado com sucesso.")
      )
    } catch {
      setError(
        t(
          "branding.assetDeactivateError",
          "Não foi possível desativar o ficheiro."
        )
      )
    } finally {
      setLoadingAssetKey(null)
    }
  }

  async function handleRemoveAsset(asset: BrandingAssetView) {
    const confirmed = window.confirm(
      t(
        "branding.deleteConfirm",
        "Deseja remover este ficheiro de identidade visual?"
      )
    )

    if (!confirmed) return

    try {
      setLoadingAssetKey(asset.key)
      setMessage(null)
      setError(null)

      await BrandingService.deleteAsset(asset.key as BrandingAssetKey)

      setAssets((current) =>
        current.map((item) =>
          item.key === asset.key
            ? {
                ...item,
                previewUrl: null,
                fileName: null,
                contentType: null,
                fileSize: null,
                active: false,
                uploadedAt: null,
              }
            : item
        )
      )

      setMessage(
        t("branding.assetDeletedSuccess", "Ficheiro removido com sucesso.")
      )
    } catch {
      setError(
        t("branding.assetDeleteError", "Não foi possível remover o ficheiro.")
      )
    } finally {
      setLoadingAssetKey(null)
    }
  }

  return (
    <div className="space-y-4">
      <section className="surface-premium rounded-2xl p-4">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] xl:items-center gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-sm text-primary font-semibold">
              <Palette size={16} />
              {t("settings.title", "Configurações")}
            </span>

            <h2 className="text-2xl font-bold mt-1">
              {t("branding.title", "Identidade visual")}
            </h2>

            <p className="text-muted mt-1 text-sm max-w-3xl">
              {t(
                "branding.subtitle",
                "Configure marca, logótipos, favicon, paletas dark/light e identidade white label por ambiente."
              )}
            </p>
          </div>

          <div className="flex flex-row flex-wrap xl:flex-nowrap items-center justify-start xl:justify-end gap-2 shrink-0">
            <ActionButton onClick={loadBranding} disabled={loading} icon={RotateCcw}>
              {t("common.refresh", "Atualizar")}
            </ActionButton>

            <ActionButton
              onClick={handleRestorePalette}
              disabled={loading}
              icon={RotateCcw}
            >
              {t("branding.restore", "Restaurar")}
            </ActionButton>

            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-primary text-white font-semibold px-3.5 py-2 rounded-full flex items-center justify-center gap-2 hover:shadow-neon transition text-xs disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <Save size={13} />
              {loading
                ? t("branding.saving", "A guardar...")
                : t("branding.saveBranding", "Guardar identidade visual")}
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <SummaryCard
          title={t("branding.publicBrand", "Marca pública")}
          value={settings.publicName}
          detail={t("branding.publicBrandDetail", "Nome visível no sistema")}
          icon={Image}
        />

        <SummaryCard
          title={t("branding.assets", "Ficheiros")}
          value={`${uploadedAssetsCount}/${assets.length}`}
          detail={t("branding.assetsDetail", "Ficheiros ativos")}
          icon={FileImage}
        />

        <SummaryCard
          title={t("branding.primaryColor", "Cor principal")}
          value={settings.primaryColor}
          detail={t("branding.primaryColorDetail", "Cor principal da interface")}
          icon={Palette}
        />

        <SummaryCard
          title={t("branding.whiteLabel", "Etiqueta branca")}
          value={t("status.prepared", "Preparado")}
          detail={t("branding.whiteLabelDetail", "Pronto para personalização")}
          icon={MonitorSmartphone}
        />
      </section>

      {message && <FeedbackMessage type="success" message={message} />}
      {error && <FeedbackMessage type="error" message={error} />}

      <section className="grid grid-cols-1 2xl:grid-cols-[340px_1fr] gap-4">
        <aside className="space-y-4">
          <BrandDataCard
            settings={settings}
            assetsCount={`${uploadedAssetsCount}/${assets.length}`}
            paletteMode={paletteMode}
            onChange={updateSetting}
          />
        </aside>

        <div className="space-y-4">
          <PaletteManager
            tab={paletteTab}
            setTab={setPaletteTab}
            mode={paletteMode}
            settings={settings}
            onChange={updateSetting}
            onSave={handleSave}
            onRestore={handleRestorePalette}
            loading={loading}
          />

          <LogoManager
            tab={logoTab}
            setTab={setLogoTab}
            assets={filteredLogoAssets}
            loadingAssetKey={loadingAssetKey}
            onChange={handleFileChange}
            onActivate={handleActivateAsset}
            onDeactivate={handleDeactivateAsset}
            onRemove={handleRemoveAsset}
          />
        </div>
      </section>
    </div>
  )
}

function SummaryCard({
  title,
  value,
  detail,
  icon: Icon,
}: {
  title: string
  value: string
  detail: string
  icon: ComponentType<{ size?: number; className?: string }>
}) {
  return (
    <div className="surface-premium rounded-2xl p-4 hover:border-primary/60 hover:-translate-y-0.5 transition">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-muted">
            {title}
          </p>

          <strong className="text-lg text-primary block mt-1 truncate">
            {value}
          </strong>

          <p className="text-xs text-muted mt-1 truncate">
            {detail}
          </p>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-primarySoft flex items-center justify-center shrink-0">
          <Icon size={18} className="text-primary" />
        </div>
      </div>
    </div>
  )
}

function BrandDataCard({
  settings,
  assetsCount,
  paletteMode,
  onChange,
}: {
  settings: BrandingSettings
  assetsCount: string
  paletteMode: PaletteMode
  onChange: <K extends keyof BrandingSettings>(
    key: K,
    value: BrandingSettings[K]
  ) => void
}) {
  const { t } = useTranslation()

  return (
    <div className="surface-premium rounded-2xl p-4 h-fit">
      <SectionHeader
        icon={Globe2}
        title={t("branding.brandData", "Dados da marca")}
        description={t(
          "branding.brandDataDescription",
          "Informações principais da identidade visual."
        )}
      />

      <div className="space-y-3 mt-4">
        <Field
          label={t("branding.publicName", "Nome público")}
          value={settings.publicName}
          onChange={(value) => onChange("publicName", value)}
          placeholder="ShowbarManager"
        />

        <div className="grid grid-cols-2 gap-2">
          <ColorField
            label={t("branding.primaryColor", "Cor principal")}
            value={settings.primaryColor}
            onChange={(value) => {
              onChange("primaryColor", value)
              onChange("darkPrimaryColor", value)
            }}
          />

          <ColorField
            label={t("branding.secondaryColor", "Cor secundária")}
            value={settings.secondaryColor}
            onChange={(value) => {
              onChange("secondaryColor", value)
              onChange("darkSecondaryColor", value)
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <MiniInfo
            label={t("branding.assets", "Ficheiros")}
            value={assetsCount}
          />

          <MiniInfo
            label={t("branding.paletteManager", "Paleta")}
            value={
              paletteMode === "default"
                ? t("branding.paletteDefault", "Padrão")
                : t("branding.paletteCustom", "Personalizada")
            }
          />
        </div>

        <div className="bg-cardSoft border border-border rounded-2xl p-3">
          <p className="text-[11px] uppercase tracking-wide text-muted">
            {t("branding.quickPreview", "Pré-visualização")}
          </p>

          <div className="mt-3 rounded-2xl bg-card border border-border p-3">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-2xl flex items-center justify-center font-black text-white text-sm"
                style={{ backgroundColor: settings.primaryColor }}
              >
                SB
              </div>

              <div className="min-w-0">
                <strong className="block truncate text-sm">
                  {settings.publicName}
                </strong>

                <p className="text-xs text-muted">
                  ERP Complete Ecosystem
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PaletteManager({
  tab,
  setTab,
  mode,
  settings,
  onChange,
  onSave,
  onRestore,
  loading,
}: {
  tab: PaletteTab
  setTab: (tab: PaletteTab) => void
  mode: PaletteMode
  settings: BrandingSettings
  onChange: <K extends keyof BrandingSettings>(
    key: K,
    value: BrandingSettings[K]
  ) => void
  onSave: () => void
  onRestore: () => void
  loading: boolean
}) {
  const { t } = useTranslation()
  const fields = tab === "dark" ? darkPaletteFields : lightPaletteFields

  return (
    <section className="surface-premium rounded-2xl p-4">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] xl:items-center gap-4">
        <SectionHeader
          icon={Star}
          title={t("branding.paletteManager", "Gestão de paletas")}
          description={
            mode === "default"
              ? t(
                  "branding.paletteDefaultInfo",
                  "Está a utilizar a paleta padrão do sistema."
                )
              : t(
                  "branding.paletteCustomInfo",
                  "A paleta atual foi personalizada."
                )
          }
        />

        <div className="flex flex-row flex-wrap xl:flex-nowrap items-center justify-start xl:justify-end gap-2 shrink-0">
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold"
            style={{
              background:
                mode === "default"
                  ? "var(--color-success-soft)"
                  : "var(--color-warning-soft)",
              border:
                mode === "default"
                  ? "1px solid var(--color-success-border)"
                  : "1px solid var(--color-warning-border)",
              color:
                mode === "default"
                  ? "var(--color-success)"
                  : "var(--color-warning)",
            }}
          >
            <Star size={13} />
            {mode === "default"
              ? t("branding.paletteDefault", "Padrão")
              : t("branding.paletteCustom", "Personalizada")}
          </span>

          <ActionButton onClick={onRestore} disabled={loading} icon={RotateCcw}>
            {t("branding.restore", "Restaurar")}
          </ActionButton>

          <button
            onClick={onSave}
            disabled={loading}
            className="bg-primary text-white font-semibold px-3.5 py-2 rounded-full flex items-center justify-center gap-2 hover:shadow-neon transition text-xs disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <Save size={13} />
            {t("common.save", "Guardar")}
          </button>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <TabButton active={tab === "dark"} onClick={() => setTab("dark")}>
          {t("branding.darkPalette", "Paleta modo escuro")}
        </TabButton>

        <TabButton active={tab === "light"} onClick={() => setTab("light")}>
          {t("branding.lightPalette", "Paleta modo claro")}
        </TabButton>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mt-4">
        {fields.map((field) => (
          <ColorField
            key={field.key}
            label={t(field.labelKey, field.fallback)}
            value={String(settings[field.key] ?? "#000000")}
            onChange={(value) =>
              onChange(
                field.key,
                value as BrandingSettings[typeof field.key]
              )
            }
          />
        ))}
      </div>
    </section>
  )
}

function LogoManager({
  tab,
  setTab,
  assets,
  loadingAssetKey,
  onChange,
  onActivate,
  onDeactivate,
  onRemove,
}: {
  tab: LogoTab
  setTab: (tab: LogoTab) => void
  assets: BrandingAssetView[]
  loadingAssetKey: ExtendedBrandingAssetKey | null
  onChange: (
    event: ChangeEvent<HTMLInputElement>,
    asset: BrandingAssetView
  ) => void
  onActivate: (asset: BrandingAssetView) => void
  onDeactivate: (asset: BrandingAssetView) => void
  onRemove: (asset: BrandingAssetView) => void
}) {
  const { t } = useTranslation()

  return (
    <section className="surface-premium rounded-2xl p-4">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] xl:items-center gap-4">
        <SectionHeader
          icon={Upload}
          title={t(
            "branding.logoManager",
            "Gestão de logótipos e ficheiros visuais"
          )}
          description={
            tab === "dark"
              ? t(
                  "branding.logoManagerDarkInfo",
                  "Estes ficheiros serão usados preferencialmente no modo escuro."
                )
              : t(
                  "branding.logoManagerLightInfo",
                  "Estes ficheiros serão usados preferencialmente no modo claro."
                )
          }
        />

        <div className="surface-muted rounded-full px-3 py-2 text-xs font-semibold inline-flex items-center justify-center gap-2">
          <FileImage size={13} />
          {assets.length} {t("branding.assets", "Ficheiros")}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <TabButton active={tab === "dark"} onClick={() => setTab("dark")}>
          {t(
            "branding.darkLogoManagement",
            "Gestão de logótipos modo escuro"
          )}
        </TabButton>

        <TabButton active={tab === "light"} onClick={() => setTab("light")}>
          {t(
            "branding.lightLogoManagement",
            "Gestão de logótipos modo claro"
          )}
        </TabButton>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 mt-4">
        {assets.map((asset) => (
          <AssetUploadCard
            key={`${tab}-${asset.key}`}
            asset={asset}
            loading={loadingAssetKey === asset.key}
            onChange={onChange}
            onActivate={onActivate}
            onDeactivate={onDeactivate}
            onRemove={onRemove}
          />
        ))}
      </div>
    </section>
  )
}

function AssetUploadCard({
  asset,
  loading,
  onChange,
  onActivate,
  onDeactivate,
  onRemove,
}: {
  asset: BrandingAssetView
  loading: boolean
  onChange: (
    event: ChangeEvent<HTMLInputElement>,
    asset: BrandingAssetView
  ) => void
  onActivate: (asset: BrandingAssetView) => void
  onDeactivate: (asset: BrandingAssetView) => void
  onRemove: (asset: BrandingAssetView) => void
}) {
  const { t } = useTranslation()

  return (
    <article className="bg-cardSoft border border-border rounded-2xl p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="font-semibold text-sm truncate">
            {asset.title}
          </h4>

          <p className="text-xs text-muted mt-1 line-clamp-2">
            {asset.description}
          </p>
        </div>

        <div className="w-8 h-8 rounded-xl bg-primarySoft flex items-center justify-center shrink-0">
          <FileImage size={16} className="text-primary" />
        </div>
      </div>

      <div className="mt-3 rounded-2xl bg-background border border-border h-[220px] flex items-center justify-center overflow-hidden">
        {asset.previewUrl ? (
          <img
            src={asset.previewUrl}
            alt={asset.title}
            className="max-h-[200px] max-w-[96%] object-contain"
          />
        ) : (
          <div className="text-center text-muted text-xs p-4">
            {t("branding.noFileUploaded", "Nenhum ficheiro enviado")}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3">
        <Info
          label={t("branding.size", "Tamanho")}
          value={asset.recommendedSize}
        />

        <Info
          label={t("branding.format", "Formato")}
          value={asset.acceptedFormats}
        />

        <Info
          label={t("branding.limit", "Limite")}
          value={asset.maxSize}
        />
      </div>

      {asset.fileName && (
        <div className="mt-3 space-y-1">
          <p className="text-xs text-muted truncate">
            {t("branding.file", "Ficheiro")}: {asset.fileName}
          </p>

          <p className="text-xs text-muted">
            {t("common.status", "Estado")}:{" "}
            <strong className={asset.active ? "text-success" : "text-warning"}>
              {asset.active
                ? t("status.active", "Ativo")
                : t("status.inactive", "Inativo")}
            </strong>
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2 mt-3">
        <label className="flex-1 bg-primary text-white font-semibold px-3 py-2 rounded-full flex items-center justify-center gap-2 hover:shadow-neon transition text-xs cursor-pointer">
          <Upload size={14} />
          {loading
            ? t("branding.uploading", "A enviar...")
            : t("branding.uploadFile", "Enviar ficheiro")}

          <input
            type="file"
            accept=".png,.svg,.webp,.ico,image/png,image/svg+xml,image/webp,image/x-icon"
            className="hidden"
            disabled={loading}
            onChange={(event) => onChange(event, asset)}
          />
        </label>

        {asset.previewUrl &&
          (asset.active ? (
            <button
              type="button"
              onClick={() => onDeactivate(asset)}
              disabled={loading}
              className="bg-card border border-border px-3 py-2 rounded-full hover:border-warning hover:text-warning transition text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <PowerOff size={14} />
              {t("actions.deactivate", "Desativar")}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onActivate(asset)}
              disabled={loading}
              className="bg-card border border-border px-3 py-2 rounded-full hover:border-success hover:text-success transition text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Power size={14} />
              {t("actions.activate", "Ativar")}
            </button>
          ))}

        <button
          type="button"
          onClick={() => onRemove(asset)}
          disabled={!asset.previewUrl || loading}
          className="bg-card border border-border px-3 py-2 rounded-full hover:border-danger hover:text-danger transition text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Trash2 size={14} />
          {t("branding.remove", "Remover")}
        </button>
      </div>
    </article>
  )
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: ComponentType<{ size?: number; className?: string }>
  title: string
  description?: string
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={17} className="text-primary mt-0.5" />

      <div>
        <h3 className="font-semibold">
          {title}
        </h3>

        {description && (
          <p className="text-sm text-muted mt-1">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}

function ActionButton({
  children,
  onClick,
  disabled,
  icon: Icon,
}: {
  children: string
  onClick: () => void
  disabled?: boolean
  icon: ComponentType<{ size?: number }>
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-cardSoft border border-border px-3 py-2 rounded-full flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition text-xs font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <Icon size={13} />
      {children}
    </button>
  )
}

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-2 rounded-full text-xs font-semibold border transition"
      style={{
        background: active ? "var(--color-primary-soft)" : "var(--color-card)",
        borderColor: active
          ? "var(--color-primary-border)"
          : "var(--color-border)",
        color: active ? "var(--color-primary)" : "var(--color-muted)",
      }}
    >
      {children}
    </button>
  )
}

function Field({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string
  value: string
  placeholder: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="block text-xs text-muted mb-1.5">
        {label}
      </span>

      <input
        className="field-input"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="block text-xs text-muted mb-1.5">
        {label}
      </span>

      <div className="grid grid-cols-[42px_120px] items-center gap-2">
        <input
          type="color"
          className="w-10 h-9 bg-cardSoft border border-border rounded-xl p-1"
          value={value || "#000000"}
          onChange={(event) => onChange(event.target.value)}
        />

        <input
          className="bg-card border border-border rounded-xl px-3 py-2 text-xs font-semibold uppercase outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          value={value}
          maxLength={7}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </label>
  )
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2">
      <p className="text-[10px] uppercase tracking-wide text-muted">
        {label}
      </p>

      <strong className="text-xs text-primary block mt-1 truncate">
        {value}
      </strong>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-xl px-2 py-2 min-w-0">
      <p className="text-[10px] uppercase tracking-wide text-muted truncate">
        {label}
      </p>

      <strong className="text-[11px] block mt-1 truncate">
        {value}
      </strong>
    </div>
  )
}

function FeedbackMessage({
  type,
  message,
}: {
  type: "success" | "error"
  message: string
}) {
  const success = type === "success"

  return (
    <div
      className="rounded-2xl px-4 py-3 text-sm flex items-center gap-2"
      style={{
        background: success
          ? "var(--color-success-soft)"
          : "var(--color-danger-soft)",
        border: success
          ? "1px solid var(--color-success-border)"
          : "1px solid var(--color-danger-border)",
        color: success ? "var(--color-success)" : "var(--color-danger)",
      }}
    >
      {success && <CheckCircle2 size={16} />}
      {message}
    </div>
  )
}

function restorePalette(settings: BrandingSettings): BrandingSettings {
  return {
    ...settings,
    primaryColor: defaultPalette.primaryColor,
    secondaryColor: defaultPalette.secondaryColor,

    darkBackgroundColor: defaultPalette.darkBackgroundColor,
    darkCardColor: defaultPalette.darkCardColor,
    darkCardSoftColor: defaultPalette.darkCardSoftColor,
    darkSurfaceColor: defaultPalette.darkSurfaceColor,
    darkTextColor: defaultPalette.darkTextColor,
    darkMutedColor: defaultPalette.darkMutedColor,
    darkBorderColor: defaultPalette.darkBorderColor,
    darkPrimaryColor: defaultPalette.darkPrimaryColor,
    darkSecondaryColor: defaultPalette.darkSecondaryColor,
    darkAccentColor: defaultPalette.darkAccentColor,
    darkSuccessColor: defaultPalette.darkSuccessColor,
    darkWarningColor: defaultPalette.darkWarningColor,
    darkDangerColor: defaultPalette.darkDangerColor,

    lightBackgroundColor: defaultPalette.lightBackgroundColor,
    lightCardColor: defaultPalette.lightCardColor,
    lightCardSoftColor: defaultPalette.lightCardSoftColor,
    lightSurfaceColor: defaultPalette.lightSurfaceColor,
    lightTextColor: defaultPalette.lightTextColor,
    lightMutedColor: defaultPalette.lightMutedColor,
    lightBorderColor: defaultPalette.lightBorderColor,
    lightPrimaryColor: defaultPalette.lightPrimaryColor,
    lightSecondaryColor: defaultPalette.lightSecondaryColor,
    lightAccentColor: defaultPalette.lightAccentColor,
    lightSuccessColor: defaultPalette.lightSuccessColor,
    lightWarningColor: defaultPalette.lightWarningColor,
    lightDangerColor: defaultPalette.lightDangerColor,
  }
}

function isDefaultPalette(settings: BrandingSettings) {
  const keys: Array<keyof BrandingSettings> = [
    "darkBackgroundColor",
    "darkCardColor",
    "darkCardSoftColor",
    "darkSurfaceColor",
    "darkTextColor",
    "darkMutedColor",
    "darkBorderColor",
    "darkPrimaryColor",
    "darkSecondaryColor",
    "darkAccentColor",
    "darkSuccessColor",
    "darkWarningColor",
    "darkDangerColor",
    "lightBackgroundColor",
    "lightCardColor",
    "lightCardSoftColor",
    "lightSurfaceColor",
    "lightTextColor",
    "lightMutedColor",
    "lightBorderColor",
    "lightPrimaryColor",
    "lightSecondaryColor",
    "lightAccentColor",
    "lightSuccessColor",
    "lightWarningColor",
    "lightDangerColor",
  ]

  return keys.every((key) => settings[key] === defaultPalette[key])
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

function applyBranding(settings: BrandingSettings) {
  const root = document.documentElement
  const isLight = root.dataset.theme === "light"

  const background = isLight
    ? settings.lightBackgroundColor
    : settings.darkBackgroundColor
  const card = isLight ? settings.lightCardColor : settings.darkCardColor
  const cardSoft = isLight
    ? settings.lightCardSoftColor
    : settings.darkCardSoftColor
  const surface = isLight
    ? settings.lightSurfaceColor
    : settings.darkSurfaceColor
  const text = isLight ? settings.lightTextColor : settings.darkTextColor
  const muted = isLight ? settings.lightMutedColor : settings.darkMutedColor
  const border = isLight ? settings.lightBorderColor : settings.darkBorderColor
  const primary = isLight
    ? settings.lightPrimaryColor
    : settings.darkPrimaryColor
  const accent = isLight ? settings.lightAccentColor : settings.darkAccentColor
  const success = isLight
    ? settings.lightSuccessColor
    : settings.darkSuccessColor
  const warning = isLight
    ? settings.lightWarningColor
    : settings.darkWarningColor
  const danger = isLight ? settings.lightDangerColor : settings.darkDangerColor

  root.style.setProperty("--color-background", background)
  root.style.setProperty("--color-card", card)
  root.style.setProperty("--color-card-soft", cardSoft)
  root.style.setProperty("--color-surface", surface)
  root.style.setProperty("--color-text", text)
  root.style.setProperty("--color-muted", muted)
  root.style.setProperty("--color-border", border)

  root.style.setProperty("--color-primary", primary)
  root.style.setProperty("--color-accent", accent)
  root.style.setProperty("--color-success", success)
  root.style.setProperty("--color-warning", warning)
  root.style.setProperty("--color-danger", danger)
  root.style.setProperty("--color-neon", primary)

  root.style.setProperty(
    "--color-primary-soft",
    `color-mix(in srgb, ${primary} 13%, transparent)`
  )
  root.style.setProperty(
    "--color-primary-border",
    `color-mix(in srgb, ${primary} 24%, transparent)`
  )
  root.style.setProperty(
    "--color-success-soft",
    `color-mix(in srgb, ${success} 12%, transparent)`
  )
  root.style.setProperty(
    "--color-success-border",
    `color-mix(in srgb, ${success} 22%, transparent)`
  )
  root.style.setProperty(
    "--color-warning-soft",
    `color-mix(in srgb, ${warning} 12%, transparent)`
  )
  root.style.setProperty(
    "--color-warning-border",
    `color-mix(in srgb, ${warning} 22%, transparent)`
  )
  root.style.setProperty(
    "--color-danger-soft",
    `color-mix(in srgb, ${danger} 12%, transparent)`
  )
  root.style.setProperty(
    "--color-danger-border",
    `color-mix(in srgb, ${danger} 22%, transparent)`
  )
}