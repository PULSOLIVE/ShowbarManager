import { apiClient } from "../api/apiClient"
import type { ApiResponse } from "../types/auth.types"
import type {
  CreateTenantRequest,
  Tenant,
  UpdateTenantRequest,
} from "../types/tenant.types"

export const TenantService = {
  async list(): Promise<Tenant[]> {
    const response = await apiClient.get<ApiResponse<Tenant[]>>("/tenants")
    return response.data.data
  },

  async create(payload: CreateTenantRequest): Promise<Tenant> {
    const response = await apiClient.post<ApiResponse<Tenant>>("/tenants", payload)
    return response.data.data
  },

  async update(id: string, payload: UpdateTenantRequest): Promise<Tenant> {
    const response = await apiClient.put<ApiResponse<Tenant>>(
      `/tenants/${id}`,
      payload
    )

    return response.data.data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/tenants/${id}`)
  },
}