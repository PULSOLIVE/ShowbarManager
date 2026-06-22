export type BrandingAssetKey =
  | "sidebarLogoUrl"
  | "sidebarCollapsedLogoUrl"
  | "darkLogoUrl"
  | "lightLogoUrl"
  | "reportLogoUrl"
  | "mobileLogoUrl"
  | "faviconUrl"
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

export interface BrandingAsset {
  key: BrandingAssetKey
  title: string
  description: string
  recommendedSize: string
  acceptedFormats: string
  maxSize: string
  previewUrl: string | null
  fileName: string | null
  contentType?: string | null
  fileSize?: number | null
  active?: boolean
  uploadedAt?: string | null
}

export interface BrandingSettings {
  id?: string
  settingKey?: string
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

  darkSidebarLogoUrl: string | null
  darkSidebarCollapsedLogoUrl: string | null
  darkReportLogoUrl: string | null
  darkMobileLogoUrl: string | null
  darkFaviconUrl: string | null
  darkLoginLogoUrl: string | null

  lightSidebarLogoUrl: string | null
  lightSidebarCollapsedLogoUrl: string | null
  lightReportLogoUrl: string | null
  lightMobileLogoUrl: string | null
  lightFaviconUrl: string | null
  lightLoginLogoUrl: string | null

  active?: boolean

  darkBackgroundColor: string
  darkCardColor: string
  darkCardSoftColor: string
  darkSurfaceColor: string
  darkTextColor: string
  darkMutedColor: string
  darkBorderColor: string
  darkPrimaryColor: string
  darkSecondaryColor: string
  darkAccentColor: string
  darkSuccessColor: string
  darkWarningColor: string
  darkDangerColor: string

  lightBackgroundColor: string
  lightCardColor: string
  lightCardSoftColor: string
  lightSurfaceColor: string
  lightTextColor: string
  lightMutedColor: string
  lightBorderColor: string
  lightPrimaryColor: string
  lightSecondaryColor: string
  lightAccentColor: string
  lightSuccessColor: string
  lightWarningColor: string
  lightDangerColor: string
}

export interface BrandingAssetResponse {
  id: string
  assetKey: BrandingAssetKey
  fileName: string
  contentType: string
  fileUrl?: string
  fileSize: number
  active: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  timestamp?: string
}