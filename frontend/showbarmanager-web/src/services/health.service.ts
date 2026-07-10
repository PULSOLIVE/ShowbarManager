import { apiClient } from "../api/apiClient"
import type { ApiResponse } from "../types/auth.types"

export const HealthService = {
  async check(): Promise<string> {
    const response = await apiClient.get<ApiResponse<string>>("/health")
    return response.data.data
  },
}