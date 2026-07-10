import { apiClient } from "../api/apiClient"
import type { ApiResponse } from "../types/auth.types"
import type { Tenant } from "../types/tenant.types"
import type { User } from "../types/user.types"

export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalTenants: number
  activeTenants: number
}

export const DashboardService = {
  async getStats(): Promise<DashboardStats> {
    const [usersResponse, tenantsResponse] = await Promise.all([
      apiClient.get<ApiResponse<User[]>>("/users"),
      apiClient.get<ApiResponse<Tenant[]>>("/tenants"),
    ])

    const users = usersResponse.data.data
    const tenants = tenantsResponse.data.data

    return {
      totalUsers: users.length,
      activeUsers: users.filter((user) => user.active).length,
      totalTenants: tenants.length,
      activeTenants: tenants.filter((tenant) => tenant.active).length,
    }
  },
}