import type { BrandingSettings } from "../types/branding.types"

const STORAGE_KEY = "showbar_branding_settings"

const defaultBranding: BrandingSettings = {
  publicName: "ShowbarManager",
  primaryColor: "#39FF14",
  secondaryColor: "#00C853",
  faviconUrl: null,
  sidebarLogoUrl: null,
  sidebarCollapsedLogoUrl: null,
  reportLogoUrl: null,
  mobileLogoUrl: null,
  darkLogoUrl: null,
  lightLogoUrl: null,
}

export const BrandingService = {
  async getSettings(): Promise<BrandingSettings> {
    const stored = localStorage.getItem(STORAGE_KEY)

    if (!stored) {
      return defaultBranding
    }

    try {
      return {
        ...defaultBranding,
        ...(JSON.parse(stored) as BrandingSettings),
      }
    } catch {
      return defaultBranding
    }
  },

  async saveSettings(payload: BrandingSettings): Promise<BrandingSettings> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    return payload
  },

  getDefaultSettings(): BrandingSettings {
    return defaultBranding
  },
}