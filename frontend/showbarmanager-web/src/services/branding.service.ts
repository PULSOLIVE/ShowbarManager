import { apiClient } from "../api/apiClient"
import type {
  ApiResponse,
  BrandingAssetKey,
  BrandingAssetResponse,
  BrandingSettings,
} from "../types/branding.types"

const MAX_BRANDING_FILE_SIZE = 2 * 1024 * 1024

const defaultBranding: BrandingSettings = {
  publicName: "ShowbarManager",
  primaryColor: "#3B82F6",
  secondaryColor: "#38BDF8",

  faviconUrl: null,
  sidebarLogoUrl: null,
  sidebarCollapsedLogoUrl: null,
  reportLogoUrl: null,
  mobileLogoUrl: null,
  darkLogoUrl: null,
  lightLogoUrl: null,

  darkSidebarLogoUrl: null,
  darkSidebarCollapsedLogoUrl: null,
  darkReportLogoUrl: null,
  darkMobileLogoUrl: null,
  darkFaviconUrl: null,
  darkLoginLogoUrl: null,

  lightSidebarLogoUrl: null,
  lightSidebarCollapsedLogoUrl: null,
  lightReportLogoUrl: null,
  lightMobileLogoUrl: null,
  lightFaviconUrl: null,
  lightLoginLogoUrl: null,

  active: true,

  darkBackgroundColor: "#07111F",
  darkCardColor: "#0D1728",
  darkCardSoftColor: "#111D31",
  darkSurfaceColor: "#14223A",
  darkTextColor: "#E5EDF7",
  darkMutedColor: "#8EA0B8",
  darkBorderColor: "#203047",
  darkPrimaryColor: "#3B82F6",
  darkSecondaryColor: "#38BDF8",
  darkAccentColor: "#38BDF8",
  darkSuccessColor: "#22C55E",
  darkWarningColor: "#F59E0B",
  darkDangerColor: "#EF4444",

  lightBackgroundColor: "#EDF5FF",
  lightCardColor: "#FFFFFF",
  lightCardSoftColor: "#F7FBFF",
  lightSurfaceColor: "#E6F0FF",
  lightTextColor: "#081526",
  lightMutedColor: "#5D7189",
  lightBorderColor: "#C4D7ED",
  lightPrimaryColor: "#2563EB",
  lightSecondaryColor: "#0284C7",
  lightAccentColor: "#0284C7",
  lightSuccessColor: "#16A34A",
  lightWarningColor: "#D97706",
  lightDangerColor: "#DC2626",
}

function normalizeSettings(data: Partial<BrandingSettings>): BrandingSettings {
  return {
    ...defaultBranding,
    ...data,
    primaryColor:
      data.primaryColor ?? data.darkPrimaryColor ?? defaultBranding.primaryColor,
    secondaryColor:
      data.secondaryColor ??
      data.darkSecondaryColor ??
      defaultBranding.secondaryColor,
  }
}

export const BrandingService = {
  maxFileSize: MAX_BRANDING_FILE_SIZE,

  getDefaultSettings(): BrandingSettings {
    return { ...defaultBranding }
  },

  async getSettings(): Promise<BrandingSettings> {
    const response = await apiClient.get<ApiResponse<BrandingSettings>>(
      "/settings/branding"
    )

    return normalizeSettings(response.data.data)
  },

  async saveSettings(payload: BrandingSettings): Promise<BrandingSettings> {
    const response = await apiClient.put<ApiResponse<BrandingSettings>>(
      "/settings/branding",
      payload
    )

    return normalizeSettings(response.data.data)
  },

  async listAssets(): Promise<BrandingAssetResponse[]> {
    const response = await apiClient.get<ApiResponse<BrandingAssetResponse[]>>(
      "/settings/branding/assets"
    )

    return response.data.data
  },

  async listPublicAssets(): Promise<BrandingAssetResponse[]> {
    const response = await apiClient.get<ApiResponse<BrandingAssetResponse[]>>(
      "/public/branding/assets"
    )

    return response.data.data
  },

  async getAssetObjectUrl(assetKey: BrandingAssetKey): Promise<string> {
    const response = await apiClient.get<Blob>(
      `/settings/branding/assets/${encodeURIComponent(assetKey)}/file?v=${Date.now()}`,
      {
        responseType: "blob",
      }
    )

    return URL.createObjectURL(response.data)
  },

  async getPublicAssetObjectUrl(assetKey: BrandingAssetKey): Promise<string> {
    const response = await apiClient.get<Blob>(
      `/public/branding/assets/${encodeURIComponent(assetKey)}/file?v=${Date.now()}`,
      {
        responseType: "blob",
      }
    )

    return URL.createObjectURL(response.data)
  },

  async uploadAsset(
    assetKey: BrandingAssetKey,
    file: File
  ): Promise<BrandingAssetResponse> {
    if (file.size > MAX_BRANDING_FILE_SIZE) {
      throw new Error("FILE_TOO_LARGE")
    }

    const formData = new FormData()
    formData.append("file", file)

    const response = await apiClient.post<ApiResponse<BrandingAssetResponse>>(
      `/settings/branding/assets/${encodeURIComponent(assetKey)}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )

    return response.data.data
  },

  async activateAsset(
    assetKey: BrandingAssetKey
  ): Promise<BrandingAssetResponse> {
    const response = await apiClient.patch<ApiResponse<BrandingAssetResponse>>(
      `/settings/branding/assets/${encodeURIComponent(assetKey)}/activate`
    )

    return response.data.data
  },

  async deactivateAsset(
    assetKey: BrandingAssetKey
  ): Promise<BrandingAssetResponse> {
    const response = await apiClient.patch<ApiResponse<BrandingAssetResponse>>(
      `/settings/branding/assets/${encodeURIComponent(assetKey)}/deactivate`
    )

    return response.data.data
  },

  async deleteAsset(assetKey: BrandingAssetKey): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(
      `/settings/branding/assets/${encodeURIComponent(assetKey)}`
    )
  },
}