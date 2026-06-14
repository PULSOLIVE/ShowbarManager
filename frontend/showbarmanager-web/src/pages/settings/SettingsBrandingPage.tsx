import { useEffect, useMemo, useState } from "react"
import type { ChangeEvent, ComponentType } from "react"
import {
  CheckCircle2,
  FileImage,
  Globe2,
  Image,
  MonitorSmartphone,
  Palette,
  RotateCcw,
  Save,
  Upload,
} from "lucide-react"
import { BrandingService } from "../../services/branding.service"
import { useTranslation } from "../../hooks/useTranslation"
import type {
  BrandingAsset,
  BrandingSettings,
} from "../../types/branding.types"

function buildAssetTemplates(t: (path: string, fallback?: string) => string): BrandingAsset[] {
  return [
    {
      key: "sidebarLogoUrl",
      title: t("branding.sidebarLogo"),
      description: t("branding.sidebarLogoDescription"),
      recommendedSize: "320 x 80 px",
      acceptedFormats: "PNG, SVG ou WEBP",
      maxSize: t("branding.maxSize500"),
      previewUrl: null,
      fileName: null,
    },
    {
      key: "sidebarCollapsedLogoUrl",
      title: t("branding.sidebarCollapsedLogo"),
      description: t("branding.sidebarCollapsedLogoDescription"),
      recommendedSize: "96 x 96 px",
      acceptedFormats: "PNG, SVG ou WEBP",
      maxSize: t("branding.maxSize250"),
      previewUrl: null,
      fileName: null,
    },
    {
      key: "darkLogoUrl",
      title: t("branding.darkLogo"),
      description: t("branding.darkLogoDescription"),
      recommendedSize: "320 x 100 px",
      acceptedFormats: "PNG, SVG ou WEBP",
      maxSize: t("branding.maxSize500"),
      previewUrl: null,
      fileName: null,
    },
    {
      key: "lightLogoUrl",
      title: t("branding.lightLogo"),
      description: t("branding.lightLogoDescription"),
      recommendedSize: "320 x 100 px",
      acceptedFormats: "PNG, SVG ou WEBP",
      maxSize: t("branding.maxSize500"),
      previewUrl: null,
      fileName: null,
    },
    {
      key: "reportLogoUrl",
      title: t("branding.reportLogo"),
      description: t("branding.reportLogoDescription"),
      recommendedSize: "600 x 180 px",
      acceptedFormats: "PNG ou SVG",
      maxSize: t("branding.maxSize800"),
      previewUrl: null,
      fileName: null,
    },
    {
      key: "mobileLogoUrl",
      title: t("branding.mobileLogo"),
      description: t("branding.mobileLogoDescription"),
      recommendedSize: "512 x 512 px",
      acceptedFormats: "PNG ou WEBP",
      maxSize: t("branding.maxSize500"),
      previewUrl: null,
      fileName: null,
    },
    {
      key: "faviconUrl",
      title: "Favicon",
      description: t("branding.faviconDescription"),
      recommendedSize: "32 x 32 px ou 64 x 64 px",
      acceptedFormats: "ICO, PNG ou SVG",
      maxSize: t("branding.maxSize100"),
      previewUrl: null,
      fileName: null,
    },
  ]
}

export function SettingsBrandingPage() {
  const { t } = useTranslation()
  const assetTemplates = useMemo(() => buildAssetTemplates(t), [t])
  const [settings, setSettings] = useState<BrandingSettings>(
    BrandingService.getDefaultSettings()
  )
  const [assets, setAssets] = useState<BrandingAsset[]>(assetTemplates)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setAssets(assetTemplates)
  }, [assetTemplates])

  useEffect(() => {
    BrandingService.getSettings()
      .then((data) => {
        setSettings(data)

        setAssets((current) =>
          current.map((asset) => ({
            ...asset,
            previewUrl: data[asset.key as keyof BrandingSettings] as string | null,
          }))
        )
      })
      .catch(() => {
        setSettings(BrandingService.getDefaultSettings())
      })
  }, [])

  const uploadedAssetsCount = useMemo(() => {
    return assets.filter((asset) => asset.previewUrl).length
  }, [assets])

  function updateSetting<K extends keyof BrandingSettings>(
    key: K,
    value: BrandingSettings[K]
  ) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }))

    setSaved(false)
  }

  function updateAssetSetting(key: BrandingAsset["key"], value: string | null) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }))

    setSaved(false)
  }

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
    asset: BrandingAsset
  ) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const previewUrl = URL.createObjectURL(file)

    setAssets((current) =>
      current.map((item) =>
        item.key === asset.key
          ? {
              ...item,
              previewUrl,
              fileName: file.name,
            }
          : item
      )
    )

    updateAssetSetting(asset.key, previewUrl)
  }

  function handleRemoveAsset(asset: BrandingAsset) {
    setAssets((current) =>
      current.map((item) =>
        item.key === asset.key
          ? {
              ...item,
              previewUrl: null,
              fileName: null,
            }
          : item
      )
    )

    updateAssetSetting(asset.key, null)
  }

  async function handleSave() {
    try {
      setLoading(true)
      setSaved(false)

      await BrandingService.saveSettings(settings)

      if (settings.faviconUrl) {
        updateFavicon(settings.faviconUrl)
      }

      setSaved(true)
    } catch {
      alert(t("branding.saveError"))
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    const defaultSettings = BrandingService.getDefaultSettings()

    setSettings(defaultSettings)
    setAssets(assetTemplates)
    setSaved(false)
  }

  return (
    <div className="space-y-4">
      <section className="surface-premium rounded-2xl p-4 lg:p-5">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-sm text-primary font-semibold">
              <Palette size={16} />
              {t("settings.title")}
            </span>

            <h2 className="text-2xl xl:text-3xl font-bold mt-1">
              {t("branding.title")}
            </h2>

            <p className="text-muted mt-2 text-sm max-w-4xl">
              {t("branding.subtitle")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleReset}
              className="bg-cardSoft border border-border px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition text-sm"
            >
              <RotateCcw size={15} />
              {t("branding.restore")}
            </button>

            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-primary text-white font-semibold px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:shadow-neon transition text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Save size={15} />
              {loading ? t("branding.saving") : t("branding.saveBranding")}
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <SummaryCard title={t("branding.publicBrand")} value={settings.publicName} icon={Image} />
        <SummaryCard title="Assets" value={`${uploadedAssetsCount}/${assets.length}`} icon={FileImage} />
        <SummaryCard title={t("branding.primaryColor")} value={settings.primaryColor} icon={Palette} />
        <SummaryCard title="White label" value={t("status.prepared")} icon={MonitorSmartphone} />
      </section>

      {saved && (
        <div className="bg-success/10 border border-success/25 text-success rounded-2xl px-4 py-3 text-sm flex items-center gap-2">
          <CheckCircle2 size={16} />
          {t("branding.savedSuccess")}
        </div>
      )}

      <section className="grid grid-cols-1 2xl:grid-cols-[360px_1fr] gap-4">
        <div className="surface-premium rounded-2xl p-4 h-fit">
          <div className="flex items-center gap-2 mb-4">
            <Globe2 size={17} className="text-primary" />

            <h3 className="font-semibold">
              {t("branding.brandData")}
            </h3>
          </div>

          <div className="space-y-3">
            <Field
              label={t("branding.publicName")}
              value={settings.publicName}
              onChange={(value) => updateSetting("publicName", value)}
              placeholder="ShowbarManager"
            />

            <ColorField
              label={t("branding.primaryColor")}
              value={settings.primaryColor}
              onChange={(value) => updateSetting("primaryColor", value)}
            />

            <ColorField
              label={t("branding.secondaryColor")}
              value={settings.secondaryColor}
              onChange={(value) => updateSetting("secondaryColor", value)}
            />

            <div className="bg-cardSoft border border-border rounded-2xl p-4">
              <p className="text-xs uppercase tracking-wide text-muted">
                {t("branding.quickPreview")}
              </p>

              <div className="mt-4 rounded-2xl bg-card border border-border p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white"
                    style={{ backgroundColor: settings.primaryColor }}
                  >
                    SB
                  </div>

                  <div className="min-w-0">
                    <strong className="block truncate">
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

        <div className="surface-premium rounded-2xl p-4">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="font-semibold">
                {t("branding.visualFiles")}
              </h3>

              <p className="text-sm text-muted mt-1">
                {t("branding.visualFilesDescription")}
              </p>
            </div>

            <div className="w-9 h-9 rounded-2xl bg-primarySoft flex items-center justify-center shrink-0">
              <Upload className="text-primary" size={18} />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {assets.map((asset) => (
              <AssetUploadCard
                key={asset.key}
                asset={asset}
                onChange={handleFileChange}
                onRemove={handleRemoveAsset}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function SummaryCard({
  title,
  value,
  icon: Icon,
}: {
  title: string
  value: string
  icon: ComponentType<{ size?: number; className?: string }>
}) {
  return (
    <div className="surface-premium rounded-2xl p-3 hover:border-primary/50 transition">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-muted">
            {title}
          </p>

          <strong className="text-lg text-primary block mt-1 truncate">
            {value}
          </strong>
        </div>

        <div className="w-9 h-9 rounded-2xl bg-primarySoft flex items-center justify-center shrink-0">
          <Icon size={18} className="text-primary" />
        </div>
      </div>
    </div>
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

      <div className="flex items-center gap-2">
        <input
          type="color"
          className="w-11 h-10 bg-cardSoft border border-border rounded-xl p-1"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />

        <input
          className="field-input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </label>
  )
}

function AssetUploadCard({
  asset,
  onChange,
  onRemove,
}: {
  asset: BrandingAsset
  onChange: (
    event: ChangeEvent<HTMLInputElement>,
    asset: BrandingAsset
  ) => void
  onRemove: (asset: BrandingAsset) => void
}) {
  const { t } = useTranslation()

  return (
    <article className="bg-cardSoft border border-border rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold">
            {asset.title}
          </h4>

          <p className="text-sm text-muted mt-1">
            {asset.description}
          </p>
        </div>

        <div className="w-9 h-9 rounded-2xl bg-primarySoft flex items-center justify-center shrink-0">
          <FileImage size={18} className="text-primary" />
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-card border border-border min-h-[104px] flex items-center justify-center overflow-hidden">
        {asset.previewUrl ? (
          <img
            src={asset.previewUrl}
            alt={asset.title}
            className="max-h-[92px] max-w-full object-contain p-3"
          />
        ) : (
          <div className="text-center text-muted text-xs p-4">
            {t("branding.noFileUploaded")}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
        <Info label={t("branding.size")} value={asset.recommendedSize} />
        <Info label={t("branding.format")} value={asset.acceptedFormats} />
        <Info label={t("branding.limit")} value={asset.maxSize} />
      </div>

      {asset.fileName && (
        <p className="text-xs text-muted mt-3 truncate">
          {t("branding.file")}: {asset.fileName}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <label className="flex-1 bg-primary text-white font-semibold px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:shadow-neon transition text-sm cursor-pointer">
          <Upload size={15} />
          {t("branding.uploadFile")}

          <input
            type="file"
            accept=".png,.svg,.webp,.ico,image/png,image/svg+xml,image/webp,image/x-icon"
            className="hidden"
            onChange={(event) => onChange(event, asset)}
          />
        </label>

        <button
          type="button"
          onClick={() => onRemove(asset)}
          disabled={!asset.previewUrl}
          className="bg-card border border-border px-4 py-2.5 rounded-full hover:border-danger hover:text-danger transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t("branding.remove")}
        </button>
      </div>
    </article>
  )
}

function Info({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 min-w-0">
      <p className="text-[10px] uppercase tracking-wide text-muted">
        {label}
      </p>

      <strong className="text-xs block mt-1 truncate">
        {value}
      </strong>
    </div>
  )
}

function updateFavicon(url: string) {
  let favicon = document.querySelector<HTMLLinkElement>("link[rel='icon']")

  if (!favicon) {
    favicon = document.createElement("link")
    favicon.rel = "icon"
    document.head.appendChild(favicon)
  }

  favicon.href = url
}