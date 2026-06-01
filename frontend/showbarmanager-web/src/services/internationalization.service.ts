import { apiClient } from "../api/apiClient"
import type { ApiResponse } from "../types/auth.types"
import type { Internationalization } from "../types/internationalization.types"

export const InternationalizationService = {
  async list(): Promise<Internationalization[]> {
    const response = await apiClient.get<ApiResponse<Internationalization[]>>(
      "/settings/internationalization"
    )

    return response.data.data
  },

  async listActive(): Promise<Internationalization[]> {
    const response = await apiClient.get<ApiResponse<Internationalization[]>>(
      "/settings/internationalization/active"
    )

    return response.data.data
  },
}