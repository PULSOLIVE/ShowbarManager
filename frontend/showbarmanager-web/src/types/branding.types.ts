export interface BrandingAsset {
  key: string
  title: string
  description: string
  recommendedSize: string
  acceptedFormats: string
  maxSize: string
  previewUrl: string | null
  fileName: string | null
}

export interface BrandingSettings {
  publicName: string
  primaryColor: string
  secondaryColor: string
  faviconUrl: string | null
  sidebarLogoUrl: string | null
  sidebarCollapsedLogoUrl: string | null
  reportLogoUrl: string | null
  mobileLogoUrl: string | null
  darkLogoUrl: string | null
  lightLogoUrl: string | null
}