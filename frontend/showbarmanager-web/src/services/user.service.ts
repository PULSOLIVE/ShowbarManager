import { apiClient } from "../api/apiClient"
import type { ApiResponse } from "../types/auth.types"
import type {
  CreateUserRequest,
  UpdateUserRequest,
  User,
} from "../types/user.types"

export const UserService = {
  async list(): Promise<User[]> {
    const response = await apiClient.get<ApiResponse<User[]>>("/users")
    return response.data.data
  },

  async create(payload: CreateUserRequest): Promise<User> {
    const response = await apiClient.post<ApiResponse<User>>("/users", payload)
    return response.data.data
  },

  async update(id: string, payload: UpdateUserRequest): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>(
      `/users/${id}`,
      payload
    )

    return response.data.data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/users/${id}`)
  },
}