import { useEffect, useMemo, useState } from "react"
import type { ChangeEvent } from "react"
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
import type {
  BrandingAsset,
  BrandingSettings,
} from "../../types/branding.types"

const assetTemplates: BrandingAsset[] = [
  {
    key: "sidebarLogoUrl",
    title: "Logo sidebar aberta",
    description: "Logo horizontal exibida no menu lateral aberto.",
    recommendedSize: "320 x 80 px",
    acceptedFormats: "PNG, SVG ou WEBP",
    maxSize: "Até 500 KB",
    previewUrl: null,
    fileName: null,
  },
  {
    key: "sidebarCollapsedLogoUrl",
    title: "Ícone sidebar recolhida",
    description: "Símbolo compacto exibido quando o menu está recolhido.",
    recommendedSize: "96 x 96 px",
    acceptedFormats: "PNG, SVG ou WEBP",
    maxSize: "Até 250 KB",
    previewUrl: null,
    fileName: null,
  },
  {
    key: "darkLogoUrl",
    title: "Logo modo escuro",
    description: "Versão da marca para fundos escuros.",
    recommendedSize: "320 x 100 px",
    acceptedFormats: "PNG, SVG ou WEBP",
    maxSize: "Até 500 KB",
    previewUrl: null,
    fileName: null,
  },
  {
    key: "lightLogoUrl",
    title: "Logo modo claro",
    description: "Versão da marca para fundos claros.",
    recommendedSize: "320 x 100 px",
    acceptedFormats: "PNG, SVG ou WEBP",
    maxSize: "Até 500 KB",
    previewUrl: null,
    fileName: null,
  },
  {
    key: "reportLogoUrl",
    title: "Logo relatórios",
    description: "Logo usada em PDF, contratos, relatórios e documentos.",
    recommendedSize: "600 x 180 px",
    acceptedFormats: "PNG ou SVG",
    maxSize: "Até 800 KB",
    previewUrl: null,
    fileName: null,
  },
  {
    key: "mobileLogoUrl",
    title: "Logo mobile/app",
    description: "Marca usada em PWA, aplicativos e telas mobile.",
    recommendedSize: "512 x 512 px",
    acceptedFormats: "PNG ou WEBP",
    maxSize: "Até 500 KB",
    previewUrl: null,
    fileName: null,
  },
  {
    key: "faviconUrl",
    title: "Favicon",
    description: "Ícone exibido ao lado do título do site no navegador.",
    recommendedSize: "32 x 32 px ou 64 x 64 px",
    acceptedFormats: "ICO, PNG ou SVG",
    maxSize: "Até 100 KB",
    previewUrl: null,
    fileName: null,
  },
]

export function SettingsBrandingPage() {
  const [settings, setSettings] = useState<BrandingSettings>(
    BrandingService.getDefaultSettings()
  )
  const [assets, setAssets] = useState<BrandingAsset[]>(assetTemplates)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

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

    updateSetting(
      asset.key as keyof BrandingSettings,
      previewUrl as BrandingSettings[keyof BrandingSettings]
    )
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

    updateSetting(
      asset.key as keyof BrandingSettings,
      null as BrandingSettings[keyof BrandingSettings]
    )
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
      alert("Não foi possível salvar o branding.")
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
      <section className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 text-sm text-neon font-semibold">
            <Palette size={16} />
            Configurações
          </span>

          <h2 className="text-2xl xl:text-3xl font-bold mt-1">
            Branding e Identidade Visual
          </h2>

          <p className="text-muted mt-2 text-sm max-w-4xl">
            Configure marca, logos, favicon, variações por tema, relatórios,
            mobile e identidade white label por ambiente.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleReset}
            className="bg-card border border-border px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:border-neon hover:text-neon transition text-sm"
          >
            <RotateCcw size={15} />
            Restaurar
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-neon text-black font-semibold px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:shadow-neon transition text-sm disabled:opacity-60"
          >
            <Save size={15} />
            {loading ? "Salvando..." : "Salvar branding"}
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <SummaryCard
          title="Marca pública"
          value={settings.publicName}
          icon={Image}
        />

        <SummaryCard
          title="Assets"
          value={`${uploadedAssetsCount}/${assets.length}`}
          icon={FileImage}
        />

        <SummaryCard
          title="Cor primária"
          value={settings.primaryColor}
          icon={Palette}
        />

        <SummaryCard
          title="White label"
          value="Preparado"
          icon={MonitorSmartphone}
        />
      </section>

      {saved && (
        <div className="bg-neon/10 border border-neon/20 text-neon rounded-2xl px-4 py-3 text-sm flex items-center gap-2">
          <CheckCircle2 size={16} />
          Branding salvo com sucesso.
        </div>
      )}

      <section className="grid grid-cols-1 2xl:grid-cols-[380px_1fr] gap-4">
        <div className="bg-card border border-border rounded-2xl p-4 h-fit">
          <div className="flex items-center gap-2 mb-4">
            <Globe2 size={17} className="text-neon" />

            <h3 className="font-semibold">
              Dados da marca
            </h3>
          </div>

          <div className="space-y-3">
            <Field
              label="Nome público"
              value={settings.publicName}
              onChange={(value) => updateSetting("publicName", value)}
              placeholder="ShowbarManager"
            />

            <ColorField
              label="Cor primária"
              value={settings.primaryColor}
              onChange={(value) => updateSetting("primaryColor", value)}
            />

            <ColorField
              label="Cor secundária"
              value={settings.secondaryColor}
              onChange={(value) => updateSetting("secondaryColor", value)}
            />

            <div className="bg-background border border-border rounded-2xl p-4">
              <p className="text-xs uppercase tracking-wide text-muted">
                Prévia rápida
              </p>

              <div className="mt-4 rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-black"
                    style={{ backgroundColor: settings.primaryColor }}
                  >
                    SB
                  </div>

                  <div>
                    <strong>{settings.publicName}</strong>
                    <p className="text-xs text-muted">
                      ERP Complete Ecosystem
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="font-semibold">
                Logos e arquivos visuais
              </h3>

              <p className="text-sm text-muted mt-1">
                Upload local com preview. A próxima etapa será persistir estes
                arquivos no backend/banco/storage por tenant.
              </p>
            </div>

            <Upload className="text-neon shrink-0" size={22} />
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
  icon: React.ComponentType<{ size?: number; className?: string }>
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-3 hover:border-neon/70 transition">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-muted">
            {title}
          </p>

          <strong className="text-lg text-neon block mt-1 truncate">
            {value}
          </strong>
        </div>

        <div className="w-9 h-9 rounded-2xl bg-neon/10 border border-neon/20 flex items-center justify-center shrink-0">
          <Icon size={18} className="text-neon" />
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
        className="w-full bg-background border border-border rounded-2xl px-4 py-2.5 outline-none focus:border-neon text-sm"
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
          className="w-12 h-10 bg-background border border-border rounded-xl p-1"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />

        <input
          className="flex-1 bg-background border border-border rounded-2xl px-4 py-2.5 outline-none focus:border-neon text-sm"
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
  return (
    <div className="bg-background border border-border rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold">
            {asset.title}
          </h4>

          <p className="text-sm text-muted mt-1">
            {asset.description}
          </p>
        </div>

        <FileImage size={20} className="text-neon shrink-0" />
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-card min-h-[104px] flex items-center justify-center overflow-hidden">
        {asset.previewUrl ? (
          <img
            src={asset.previewUrl}
            alt={asset.title}
            className="max-h-[92px] max-w-full object-contain p-3"
          />
        ) : (
          <div className="text-center text-muted text-xs p-4">
            Nenhum arquivo enviado
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
        <Info label="Tamanho" value={asset.recommendedSize} />
        <Info label="Formato" value={asset.acceptedFormats} />
        <Info label="Limite" value={asset.maxSize} />
      </div>

      {asset.fileName && (
        <p className="text-xs text-muted mt-3 truncate">
          Arquivo: {asset.fileName}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <label className="flex-1 bg-neon text-black font-semibold px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:shadow-neon transition text-sm">
          <Upload size={15} />
          Enviar arquivo

          <input
            type="file"
            accept=".png,.svg,.webp,.ico,image/png,image/svg+xml,image/webp,image/x-icon"
            className="hidden"
            onChange={(event) => onChange(event, asset)}
          />
        </label>

        <button
          onClick={() => onRemove(asset)}
          disabled={!asset.previewUrl}
          className="bg-card border border-border px-4 py-2.5 rounded-full hover:border-red-400 hover:text-red-300 transition text-sm disabled:opacity-50"
        >
          Remover
        </button>
      </div>
    </div>
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