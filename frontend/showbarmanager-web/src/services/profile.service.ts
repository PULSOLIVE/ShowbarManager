import { api } from "./api"
import type {
  CreateProfileRequest,
  Profile,
  UpdateProfileRequest,
} from "../types/profile.types"

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export const ProfileService = {
  async findAll(): Promise<Profile[]> {
    const response = await api.get<ApiResponse<Profile[]>>(
      "/settings/profiles"
    )

    return response.data.data
  },

  async findById(id: string): Promise<Profile> {
    const response = await api.get<ApiResponse<Profile>>(
      `/settings/profiles/${id}`
    )

    return response.data.data
  },

  async create(payload: CreateProfileRequest): Promise<Profile> {
    const response = await api.post<ApiResponse<Profile>>(
      "/settings/profiles",
      payload
    )

    return response.data.data
  },

  async update(
    id: string,
    payload: UpdateProfileRequest
  ): Promise<Profile> {
    const response = await api.put<ApiResponse<Profile>>(
      `/settings/profiles/${id}`,
      payload
    )

    return response.data.data
  },

  async delete(id: string): Promise<void> {
    await api.delete<ApiResponse<null>>(`/settings/profiles/${id}`)
  },
}