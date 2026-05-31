import { api } from "./api"
import type {
  CreatePermissionRequest,
  Permission,
  UpdatePermissionRequest,
} from "../types/permission.types"

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export const PermissionService = {
  async findAll(): Promise<Permission[]> {
    const response = await api.get<ApiResponse<Permission[]>>(
      "/settings/permissions"
    )

    return response.data.data
  },

  async findById(id: string): Promise<Permission> {
    const response = await api.get<ApiResponse<Permission>>(
      `/settings/permissions/${id}`
    )

    return response.data.data
  },

  async create(payload: CreatePermissionRequest): Promise<Permission> {
    const response = await api.post<ApiResponse<Permission>>(
      "/settings/permissions",
      payload
    )

    return response.data.data
  },

  async update(
    id: string,
    payload: UpdatePermissionRequest
  ): Promise<Permission> {
    const response = await api.put<ApiResponse<Permission>>(
      `/settings/permissions/${id}`,
      payload
    )

    return response.data.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/settings/permissions/${id}`)
  },
}