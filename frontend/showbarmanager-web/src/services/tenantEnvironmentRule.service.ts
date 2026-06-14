import { apiClient } from "../api/apiClient"
import type { ApiResponse } from "../types/auth.types"
import type {
  CreateTenantEnvironmentRuleRequest,
  TenantEnvironmentRule,
  UpdateTenantEnvironmentRuleRequest,
} from "../types/tenantEnvironmentRule.types"

export const TenantEnvironmentRuleService = {
  async list(): Promise<TenantEnvironmentRule[]> {
    const response = await apiClient.get<ApiResponse<TenantEnvironmentRule[]>>(
      "/settings/tenant-rules"
    )

    return response.data.data
  },

  async listEnabled(): Promise<TenantEnvironmentRule[]> {
    const response = await apiClient.get<ApiResponse<TenantEnvironmentRule[]>>(
      "/settings/tenant-rules/enabled"
    )

    return response.data.data
  },

  async create(
    payload: CreateTenantEnvironmentRuleRequest
  ): Promise<TenantEnvironmentRule> {
    const response = await apiClient.post<ApiResponse<TenantEnvironmentRule>>(
      "/settings/tenant-rules",
      payload
    )

    return response.data.data
  },

  async update(
    id: string,
    payload: UpdateTenantEnvironmentRuleRequest
  ): Promise<TenantEnvironmentRule> {
    const response = await apiClient.put<ApiResponse<TenantEnvironmentRule>>(
      `/settings/tenant-rules/${id}`,
      payload
    )

    return response.data.data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/settings/tenant-rules/${id}`)
  },
}